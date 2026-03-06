import React from 'react';
import '../styles/AdminUserList.css';

const AdminUserList = ({ users, onEdit, onDelete, onChangeRole, onAddUser }) => {
  if (!users || users.length === 0) {
    return (
      <div className="admin-user-list">
        <div className="empty-state">
          <p>No users found. Add your first user to get started!</p>
          <button className="btn-primary" onClick={onAddUser}>Add User</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-user-list">
      <div className="list-header">
        <h2>User Management</h2>
        <button className="btn-primary" onClick={onAddUser}>+ Add New User</button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id || user.username} className={`user-row ${user.role}`}>
                <td className="username-cell">
                  <span className="username">{user.username}</span>
                  {user.role === 'admin' && <span className="admin-badge">ADMIN</span>}
                </td>
                <td className="email-cell">{user.email || '-'}</td>
                <td className="role-cell">
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => onChangeRole(user.id || user.username, e.target.value)}
                    className={`role-select role-${user.role}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="date-cell">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="actions-cell">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => onEdit(user)}
                    title="Edit user"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
                        onDelete(user.id || user.username);
                      }
                    }}
                    title="Delete user"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserList;
