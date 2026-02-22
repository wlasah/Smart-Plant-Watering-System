import React, { useState } from 'react';
import '../styles/FormStyles.css';

const defaultSettings = {
  username: '',
  email: '',
  wateringTime: '08:00',
  alertMethod: 'email',
  notifications: true
};

const SettingsForm = ({ userSettings = {}, onSave, isOpen, onClose }) => {
  const [formData, setFormData] = useState({ ...defaultSettings, ...userSettings });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 800));
      setSuccess(true);
      if (onSave) onSave(formData);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Settings</h2>
          <button className="form-close-btn" onClick={onClose} aria-label="Close form" type="button">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-content">
          {error && !success && <div className="form-error" role="alert">{error}</div>}
          {success && <div className="form-success" role="alert">Settings saved! ✓</div>}
          <div className="form-group">
            <label htmlFor="settings-username">Username *</label>
            <input
              type="text"
              id="settings-username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              className={errors.username ? 'form-input error' : 'form-input'}
              maxLength="30"
            />
            {errors.username && <span className="form-error-text">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="settings-email">Email *</label>
            <input
              type="email"
              id="settings-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className={errors.email ? 'form-input error' : 'form-input'}
              maxLength="50"
            />
            {errors.email && <span className="form-error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="wateringTime">Default Watering Time</label>
            <input
              type="time"
              id="wateringTime"
              name="wateringTime"
              value={formData.wateringTime}
              onChange={handleInputChange}
              disabled={loading}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="alertMethod">Alert Method</label>
            <select
              id="alertMethod"
              name="alertMethod"
              value={formData.alertMethod}
              onChange={handleInputChange}
              disabled={loading}
              className="form-select"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
            </select>
          </div>
          <div className="form-group form-checkbox">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                disabled={loading}
              />
              Enable Notifications
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Saving...' : 'Save Settings'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
