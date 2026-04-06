import React, { useState, useEffect } from 'react';
import '../styles/AdminModals.css';

const EditUserModal = ({ isOpen, user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'user'
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // AGGRESSIVE CHECK: Prevent any edit of admin accounts except self
    const currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
    const isEditingOtherAdmin = user.role === 'admin' && !(currentUser && (String(user.id) === String(currentUser.id) || user.username === currentUser.username));
    
    if (isEditingOtherAdmin) {
      setError('❌ Access denied: Cannot edit admin accounts');
      return;
    }

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    // Password validation only if new password provided
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    onUpdate(user.id || user.username, {
      username: formData.username,
      email: formData.email,
      ...(formData.password && { password: formData.password }),
      role: formData.role
    });
  };

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit User</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {user.role === 'admin' && !(localStorage.getItem('currentUser') && (() => {
          const cu = JSON.parse(localStorage.getItem('currentUser'));
          return String(user.id) === String(cu.id) || user.username === cu.username;
        })()) && (
          <div style={{ backgroundColor: '#fee', color: '#c33', padding: '12px 16px', margin: '0 16px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}>
            ⚠️ This is an admin account. Editing is restricted.
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password (optional)"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={user.role === 'admin' && !(localStorage.getItem('currentUser') && (() => {
                const cu = JSON.parse(localStorage.getItem('currentUser'));
                return String(user.id) === String(cu.id) || user.username === cu.username;
              })())}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Update User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
