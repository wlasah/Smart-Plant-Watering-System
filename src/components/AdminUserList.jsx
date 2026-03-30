import React, { useState, useEffect } from 'react';
import '../styles/AdminUserList.css';

const AdminUserList = ({ users, currentUser, onEdit, onDelete, onChangeRole, onAddUser }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userMetrics, setUserMetrics] = useState({});
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    // Calculate user metrics (plants count, last activity)
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const activityLog = JSON.parse(localStorage.getItem('userActivityLog')) || [];
    
    const metrics = {};
    users.forEach(user => {
      const userPlants = plants.filter(p => p.owner === user.username || p.user_id === user.id);
      const userActivities = activityLog.filter(a => a.performedBy === user.username);
      const lastActivity = userActivities.length > 0 
        ? new Date(Math.max(...userActivities.map(a => new Date(a.timestamp))))
        : null;

      metrics[user.id || user.username] = {
        plantCount: userPlants.length,
        activityCount: userActivities.length,
        lastActivity: lastActivity,
        engagementScore: Math.min(100, Math.round((userActivities.length / 10) * 100))
      };
    });
    setUserMetrics(metrics);
  }, [users]);

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id || u.username));
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction) {
      alert('Please select an action');
      return;
    }

    // guard bulk admin rules - prevent any ops on admin users
    const selectedUsersData = selectedUsers
      .map(uid => users.find(u => u.id === uid || u.username === uid))
      .filter(Boolean);

    const adminsInSelection = selectedUsersData.filter(u => u.role === 'admin' && !(currentUser && (currentUser.id === u.id || currentUser.username === u.username)));
    const allAdmins = selectedUsersData.filter(u => u.role === 'admin');
    
    if (adminsInSelection.length > 0) {
      alert('❌ Cannot perform actions on other admin accounts');
      return;
    }

    switch (bulkAction) {
      case 'make_admin':
        selectedUsers.forEach(userId => {
          onChangeRole(userId, 'admin');
        });
        alert(`✅ Made ${selectedUsers.length} user(s) admin!`);
        break;
      case 'make_user':
        if (allAdmins.length > 0) {
          alert('❌ Cannot downgrade admin accounts in bulk');
          return;
        }
        selectedUsers.forEach(userId => {
          onChangeRole(userId, 'user');
        });
        alert(`✅ Changed ${selectedUsers.length} user(s) to regular user!`);
        break;
      case 'reset_password':
        const defaultPassword = 'TempPass123!';
        // In a real app, you'd send reset emails. For this demo, we note the change
        alert(`✅ Password reset for ${selectedUsers.length} user(s) to: ${defaultPassword}\n(In production, reset emails would be sent)`);
        break;
      default:
        break;
    }

    setSelectedUsers([]);
    setBulkAction('');
    setShowBulkActions(false);
  };

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
        <div className="header-actions">
          {selectedUsers.length > 0 && (
            <div className="selection-info">
              <span>{selectedUsers.length} selected</span>
              <button 
                className="btn-secondary"
                onClick={() => setShowBulkActions(!showBulkActions)}
              >
                ⚙️ Bulk Actions
              </button>
            </div>
          )}
          <button className="btn-primary" onClick={onAddUser}>+ Add New User</button>
        </div>
      </div>

      {showBulkActions && selectedUsers.length > 0 && (
        <div className="bulk-actions-panel">
          <select 
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bulk-action-select"
          >
            <option value="">Select action...</option>
            <option value="make_admin">👑 Make Admin</option>
            <option value="make_user">👤 Make Regular User</option>
            <option value="reset_password">🔑 Reset Password</option>
          </select>
          <button 
            className="btn-action-primary"
            onClick={handleBulkAction}
            disabled={!bulkAction}
          >
            Execute
          </button>
          <button 
            className="btn-secondary"
            onClick={() => {
              setShowBulkActions(false);
              setSelectedUsers([]);
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input 
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  title="Select all users"
                />
              </th>
              <th>Username</th>
              <th>Email</th>
              <th>Plants</th>
              <th>Activity</th>
              <th>Engagement</th>
              <th>Role</th>
              <th>Last Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const userId = user.id || user.username;
              const metrics = userMetrics[userId] || {};
              const isSelected = selectedUsers.includes(userId);

              return (
                <tr key={userId} className={`user-row ${user.role} ${isSelected ? 'selected' : ''}`}>
                  <td className="checkbox-cell">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectUser(userId)}
                    />
                  </td>
                  <td className="username-cell">
                    <div className="username-cell-inner">
                      <span className="username">{user.username}</span>
                      {user.role === 'admin' ? <span className="user-badge-admin">ADMIN</span> : <span className="user-badge-user">USER</span>}
                    </div>
                  </td>
                  <td className="email-cell">{user.email || '-'}</td>
                  <td className="plants-cell">
                    <span className="metric-value">
                      🌱 {metrics.plantCount || 0}
                    </span>
                  </td>
                  <td className="activity-cell">
                    <span className="metric-value">
                      📊 {metrics.activityCount || 0}
                    </span>
                  </td>
                  <td className="engagement-cell">
                    <div className="engagement-bar">
                      <div 
                        className={`engagement-fill ${
                          metrics.engagementScore >= 75 ? 'excellent' :
                          metrics.engagementScore >= 50 ? 'high' :
                          metrics.engagementScore >= 25 ? 'medium' : 'low'
                        }`}
                        style={{ width: `${metrics.engagementScore || 0}%` }}
                      ></div>
                      <span className="engagement-text">{metrics.engagementScore || 0}%</span>
                    </div>
                  </td>
                  <td className="role-cell">
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => onChangeRole(userId, e.target.value)}
                      className={`role-select role-${user.role}`}
                      disabled={user.role === 'admin' && !(currentUser && (currentUser.id === user.id || currentUser.username === user.username))}
                      title={user.role === 'admin' && !(currentUser && (currentUser.id === user.id || currentUser.username === user.username)) ? 'Cannot change another admin role' : 'Change role'}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className={`date-cell ${metrics.lastActivity ? 'active' : ''}`}>
                    <div className="date-cell-inner">
                      {metrics.lastActivity 
                        ? metrics.lastActivity.toLocaleDateString() + ' ' + metrics.lastActivity.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Never'}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <div className="actions-cell-inner">
                      {user.role !== 'admin' || (currentUser && (String(user.id) === String(currentUser.id) || user.username === currentUser.username)) ? (
                        <button
                          className="btn-action btn-edit"
                          onClick={() => onEdit(user)}
                          title="Edit user"
                        >
                          ✏️
                        </button>
                      ) : null}
                      <button
                        className="btn-action btn-reset"
                        onClick={() => {
                          if (window.confirm(`Reset password for "${user.username}"?`)) {
                            alert('✅ Password reset link would be sent via email (demo)');
                          }
                        }}
                        disabled={user.role === 'admin'}
                        title={user.role === 'admin' ? 'Cannot reset admin password' : 'Reset password'}
                        style={user.role === 'admin' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        🔑
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
                            onDelete(userId);
                          }
                        }}
                        disabled={user.role === 'admin'}
                        title={user.role === 'admin' ? 'Cannot delete admin accounts' : 'Delete user'}
                        style={user.role === 'admin' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserList;
