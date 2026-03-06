import React from 'react';
import '../styles/SystemOverview.css';

const SystemOverview = ({ users, activityLog }) => {
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalRegularUsers = users.filter(u => u.role === 'user' || !u.role).length;

  const recentLogins = activityLog
    .filter(a => a.type === 'login')
    .length;

  const totalActions = activityLog.length;

  return (
    <div className="system-overview">
      <div className="overview-header">
        <h2>System Overview</h2>
        <p>Key metrics and statistics</p>
      </div>

      <div className="overview-grid">
        <div className="overview-card total-users">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h3>Total Users</h3>
            <p className="card-value">{totalUsers}</p>
            <span className="card-label">System users</span>
          </div>
        </div>

        <div className="overview-card admin-count">
          <div className="card-icon">👨‍💼</div>
          <div className="card-content">
            <h3>Administrators</h3>
            <p className="card-value">{totalAdmins}</p>
            <span className="card-label">Admin role</span>
          </div>
        </div>

        <div className="overview-card user-count">
          <div className="card-icon">👤</div>
          <div className="card-content">
            <h3>Regular Users</h3>
            <p className="card-value">{totalRegularUsers}</p>
            <span className="card-label">User role</span>
          </div>
        </div>

        <div className="overview-card activity-count">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Total Actions</h3>
            <p className="card-value">{totalActions}</p>
            <span className="card-label">System activity</span>
          </div>
        </div>
      </div>

      <div className="user-distribution">
        <h3>User Role Distribution</h3>
        <div className="distribution-chart">
          <div className="distribution-item">
            <div className="distribution-bar">
              <div className="bar-segment admin" style={{ width: `${totalUsers > 0 ? (totalAdmins / totalUsers) * 100 : 0}%` }}></div>
              <div className="bar-segment user" style={{ width: `${totalUsers > 0 ? (totalRegularUsers / totalUsers) * 100 : 0}%` }}></div>
            </div>
            <div className="distribution-legend">
              <span><span className="legend-box admin"></span>Admins ({totalAdmins})</span>
              <span><span className="legend-box user"></span>Users ({totalRegularUsers})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
