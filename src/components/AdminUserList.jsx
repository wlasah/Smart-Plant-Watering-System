import React, { useState, useEffect } from 'react';
import '../styles/AdminUserList.css';
import { plantsAPI } from '../services/api';

const AdminUserList = ({ users, currentUser, onEdit, onDelete, onResetPassword, onChangeRole, onAddUser }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userMetrics, setUserMetrics] = useState({});
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    // Fetch metrics for all users
    fetchUserMetrics();
  }, [users]);

  const fetchUserMetrics = async () => {
    try {
      setLoadingMetrics(true);
      // Fetch all plants to calculate per-user statistics
      const allPlants = await plantsAPI.getAllPlants();
      
      const metrics = {};
      users.forEach(user => {
        // Get user's plants
        const userPlants = allPlants.filter(plant => 
          plant.owner_username === user.username || plant.owner_id === user.id
        );
        
        // Calculate metrics
        const plantCount = userPlants.length;
        
        // Activity = number of plants with recent moisture readings
        const recentPlants = userPlants.filter(plant => {
          const lastReading = plant.last_watered || plant.updated_at;
          if (!lastReading) return false;
          const lastDate = new Date(lastReading);
          const daysAgo = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          return daysAgo < 7; // Activity = plants updated in last 7 days
        });
        
        // Engagement score: percentage of plants in healthy condition
        let engagementScore = 0;
        if (plantCount > 0) {
          const healthyPlants = userPlants.filter(plant => {
            const moisture = plant.current_moisture_level || 0;
            return moisture >= 50; // Healthy if >= 50%
          }).length;
          engagementScore = Math.round((healthyPlants / plantCount) * 100);
        }
        
        // Last activity: most recent watering or update
        let lastActivity = 'Never';
        if (userPlants.length > 0) {
          const latestPlant = userPlants.reduce((latest, plant) => {
            const plantDate = new Date(plant.last_watered || plant.updated_at || 0);
            const latestDate = new Date(latest.last_watered || latest.updated_at || 0);
            return plantDate > latestDate ? plant : latest;
          });
          const activityDate = new Date(latestPlant.last_watered || latestPlant.updated_at);
          lastActivity = activityDate;
        }
        
        metrics[user.id || user.username] = {
          plantCount,
          activityCount: recentPlants.length,
          engagementScore,
          lastActivity
        };
      });
      
      setUserMetrics(metrics);
    } catch (err) {
      console.error('Error fetching user metrics:', err);
      // Fallback to default metrics
      const metrics = {};
      users.forEach(user => {
        metrics[user.id || user.username] = {
          plantCount: 0,
          activityCount: 0,
          engagementScore: 0,
          lastActivity: 'Never'
        };
      });
      setUserMetrics(metrics);
    } finally {
      setLoadingMetrics(false);
    }
  };


  // Helper function to check if a user is the current user
  const isCurrentUser = (user) => {
    if (!currentUser) return false;
    const isCurrentByUsername = user.username === currentUser.username;
    const isCurrentByEmail = user.email === currentUser.email;
    const result = isCurrentByUsername || isCurrentByEmail;
    console.log(`[isCurrentUser] ${user.username}: username match=${isCurrentByUsername}, email match=${isCurrentByEmail}, currentUser=${currentUser?.username}, result=${result}`);
    return result;
  };

  // Helper function to check if a user is an admin
  const isAdminUser = (user) => {
    return user.is_staff || user.role === 'admin';
  };

  // Helper function to safely change user role with restrictions
  const handleRoleChange = (user, newRole) => {
    // Prevent demoting other admins
    if (isAdminUser(user) && !isCurrentUser(user)) {
      alert('❌ Cannot change role of another admin account');
      return;
    }

    // Warn if current user is demoting themselves
    if (isCurrentUser(user) && newRole === 'user') {
      const confirmed = window.confirm(
        '⚠️ You are about to demote yourself to regular user.\n\n' +
        'You will lose admin access after this change.\n\n' +
        'Are you sure?'
      );
      if (!confirmed) return;
    }

    onChangeRole(user.id || user.username, newRole);
  };

  // Helper function to safely delete a user with restrictions
  const handleDeleteUser = (user) => {
    // Prevent deleting other admins
    if (isAdminUser(user) && !isCurrentUser(user)) {
      alert('❌ Cannot delete another admin account');
      return;
    }

    // Warn if current user is deleting themselves
    if (isCurrentUser(user)) {
      const confirmed = window.confirm(
        '⚠️ WARNING: You are about to delete your own account!\n\n' +
        'This action cannot be undone.\n\n' +
        'Type your username "' + user.username + '" to confirm:'
      );
      if (!confirmed) return;
      
      // Ask for confirmation with username
      const confirmUsername = window.prompt('Enter your username to confirm deletion:');
      if (confirmUsername !== user.username) {
        alert('❌ Username does not match. Deletion cancelled.');
        return;
      }
    } else {
      const confirmed = window.confirm(
        `⚠️ Are you sure you want to delete user "${user.username}"?\n\n` +
        'This action cannot be undone.'
      );
      if (!confirmed) return;
    }

    onDelete(user.id || user.username);
  };

  // Helper function to safely reset password with restrictions
  const handleResetPassword = (user) => {
    // Prevent resetting password for other admins
    if (isAdminUser(user) && !isCurrentUser(user)) {
      alert('❌ Cannot reset password for another admin account');
      return;
    }

    // Call the prop function which will open the modal
    onResetPassword(user.id || user.username);
  };

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
      alert('❌ Please select an action');
      return;
    }

    // Get data for selected users
    const selectedUsersData = selectedUsers
      .map(uid => users.find(u => u.id === uid || u.username === uid))
      .filter(Boolean);

    // Prevent any operations on other admins (except current user)
    const otherAdminsInSelection = selectedUsersData.filter(u => 
      isAdminUser(u) && !isCurrentUser(u)
    );
    
    if (otherAdminsInSelection.length > 0) {
      alert(`❌ Cannot perform bulk actions on other admin accounts.\n\nAdmins in selection: ${otherAdminsInSelection.map(u => u.username).join(', ')}`);
      return;
    }

    // For make_user action, prevent demoting admins
    if (bulkAction === 'make_user') {
      const adminsInSelection = selectedUsersData.filter(u => isAdminUser(u));
      if (adminsInSelection.length > 0) {
        const usernames = adminsInSelection.map(u => u.username).join(', ');
        alert(`❌ Cannot demote admin account(s): ${usernames}`);
        return;
      }
    }

    switch (bulkAction) {
      case 'make_admin':
        selectedUsers.forEach(userId => {
          const user = users.find(u => u.id === userId || u.username === userId);
          onChangeRole(userId, 'admin');
        });
        alert(`✅ Made ${selectedUsers.length} user(s) admin!`);
        break;
      case 'make_user':
        selectedUsers.forEach(userId => {
          onChangeRole(userId, 'user');
        });
        alert(`✅ Changed ${selectedUsers.length} user(s) to regular user!`);
        break;
      case 'reset_password':
        const confirmed = window.confirm(
          `Reset password for ${selectedUsers.length} user(s)?\n\n` +
          'A temporary password will be generated for each user.\n\n' +
          'Click OK to reset passwords individually.'
        );
        if (confirmed) {
          selectedUsers.forEach(userId => {
            onResetPassword(userId);
          });
        }
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
          <button 
            className="btn-secondary" 
            onClick={fetchUserMetrics}
            disabled={loadingMetrics}
            title="Refresh user metrics"
          >
            {loadingMetrics ? '⟳ Loading...' : '⟳ Refresh'}
          </button>
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
            <option value="make_admin">👑 Make Admin (Cannot apply to other admins)</option>
            <option value="make_user">👤 Make Regular User (Cannot demote other admins)</option>
            <option value="reset_password">🔑 Reset Password (Cannot reset for other admins)</option>
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
              // NORMALIZE: Ensure user has a role property based on is_staff
              const normalizedUser = { ...user, role: user.is_staff ? 'admin' : (user.role || 'user') };
              const userId = normalizedUser.id || normalizedUser.username;
              const metrics = userMetrics[userId] || {};
              const isSelected = selectedUsers.includes(userId);

              return (
                <tr key={userId} className={`user-row ${normalizedUser.role} ${isSelected ? 'selected' : ''}`}>
                  <td className="checkbox-cell">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectUser(userId)}
                    />
                  </td>
                  <td className="username-cell">
                    <div className="username-cell-inner">
                      <span className="username">{normalizedUser.username}</span>
                      {normalizedUser.role === 'admin' ? <span className="user-badge-admin">ADMIN</span> : <span className="user-badge-user">USER</span>}
                    </div>
                  </td>
                  <td className="email-cell">{normalizedUser.email || '-'}</td>
                  <td className="plants-cell">
                    <span className="metric-value plants">
                      🌱 {metrics.plantCount || 0}
                    </span>
                  </td>
                  <td className="activity-cell">
                    <span className="metric-value activity">
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
                    {/* AGGRESSIVE CHECK: Only show dropdown for non-admin users OR current user */}
                    {normalizedUser.role === 'admin' && !isCurrentUser(normalizedUser) ? (
                      <span className="role-badge role-badge-admin">👑 Admin</span>
                    ) : normalizedUser.role === 'admin' && isCurrentUser(normalizedUser) ? (
                      <select
                        value={normalizedUser.role || 'user'}
                        onChange={(e) => handleRoleChange(normalizedUser, e.target.value)}
                        className={`role-select role-${normalizedUser.role}`}
                        title="Change role (⚠️ Demoting yourself will remove admin access)"
                      >
                        <option value="user">👤 User (Demote)</option>
                        <option value="admin">👑 Admin (Keep)</option>
                      </select>
                    ) : normalizedUser.role === 'user' || !normalizedUser.role ? (
                      <select
                        value={normalizedUser.role || 'user'}
                        onChange={(e) => handleRoleChange(normalizedUser, e.target.value)}
                        className={`role-select role-${normalizedUser.role}`}
                        title="Change role"
                      >
                        <option value="user">👤 User</option>
                        <option value="admin">👑 Admin</option>
                      </select>
                    ) : null}
                  </td>
                  <td className="date-cell">
                    <div className="date-cell-inner">
                      {metrics.lastActivity instanceof Date
                        ? metrics.lastActivity.toLocaleDateString() + ' ' + 
                          metrics.lastActivity.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : metrics.lastActivity}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <div className="actions-cell-inner">
                      {/* AGGRESSIVE CHECK: NEVER show buttons for other admins */}
                      {normalizedUser.role === 'admin' && !isCurrentUser(normalizedUser) ? (
                        <span className="action-blocked">🔒 Protected</span>
                      ) : (
                        <>
                          <button
                            className="btn-action btn-edit"
                            onClick={() => onEdit(normalizedUser)}
                            title="Edit user"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-action btn-reset"
                            onClick={() => handleResetPassword(normalizedUser)}
                            title="Reset password"
                          >
                            🔑
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteUser(normalizedUser)}
                            title="Delete user"
                          >
                            🗑️
                          </button>
                        </>
                      )}
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
