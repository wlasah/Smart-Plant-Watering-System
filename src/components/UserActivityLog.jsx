import React from 'react';
import '../styles/UserActivityLog.css';

const UserActivityLog = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-log">
        <div className="log-header">
          <h2>Activity Log</h2>
        </div>
        <div className="empty-log">
          <p>No activity recorded yet</p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create':
        return '➕';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'role_change':
        return '👤';
      case 'login':
        return '🔓';
      case 'logout':
        return '🔒';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'create':
        return 'success';
      case 'delete':
        return 'danger';
      case 'update':
      case 'role_change':
        return 'warning';
      case 'login':
        return 'info';
      case 'logout':
        return 'info';
      default:
        return 'default';
    }
  };

  // Sort by newest first
  const sortedActivities = [...activities].reverse().slice(0, 50);

  return (
    <div className="activity-log">
      <div className="log-header">
        <h2>Activity Log</h2>
        <span className="log-count">Last 50 entries</span>
      </div>

      <div className="log-entries">
        {sortedActivities.map(activity => (
          <div key={activity.id} className={`log-entry ${getActivityColor(activity.type)}`}>
            <div className="entry-icon">{getActivityIcon(activity.type)}</div>
            <div className="entry-details">
              <p className="entry-description">{activity.description}</p>
              <p className="entry-meta">
                By: <strong>{activity.performedBy}</strong> •
                {' '}
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserActivityLog;
