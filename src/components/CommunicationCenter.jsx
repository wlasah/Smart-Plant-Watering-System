import React, { useState, useEffect } from 'react';

const CommunicationCenter = ({ users }) => {
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all'
  });
  const [sentNotifications, setSentNotifications] = useState([]);

  useEffect(() => {
    // Load sent notifications from localStorage
    const saved = localStorage.getItem('sentNotifications');
    if (saved) {
      setSentNotifications(JSON.parse(saved));
    }
  }, []);

  const handleSendNotification = (e) => {
    e.preventDefault();
    
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    const notification = {
      id: Date.now(),
      ...newNotification,
      timestamp: new Date().toISOString(),
      sentBy: 'admin' // In real app, get from current user
    };

    // Save to localStorage
    const updated = [notification, ...sentNotifications];
    setSentNotifications(updated);
    localStorage.setItem('sentNotifications', JSON.stringify(updated));

    // Reset form
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      recipients: 'all'
    });

    alert('Notification sent successfully!');
  };

  const getNotificationStats = () => {
    return {
      total: sentNotifications.length,
      thisWeek: sentNotifications.filter(n => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(n.timestamp) > weekAgo;
      }).length,
      byType: {
        info: sentNotifications.filter(n => n.type === 'info').length,
        warning: sentNotifications.filter(n => n.type === 'warning').length,
        success: sentNotifications.filter(n => n.type === 'success').length,
        error: sentNotifications.filter(n => n.type === 'error').length
      }
    };
  };

  const stats = getNotificationStats();

  return (
    <div className="communication-center">
      <header className="analytics-header">
        <h2>📢 Communication Center</h2>
        <p>Send notifications and manage user communications</p>
      </header>

      {/* Notification Stats */}
      <section className="analytics-section">
        <h3>Notification Statistics</h3>
        <div className="notification-stats">
          <div className="stat-item">
            <span className="stat-label">Total Sent</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">This Week</span>
            <span className="stat-value">{stats.thisWeek}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Info</span>
            <span className="stat-value">{stats.byType.info}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Warnings</span>
            <span className="stat-value">{stats.byType.warning}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Success</span>
            <span className="stat-value">{stats.byType.success}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Errors</span>
            <span className="stat-value">{stats.byType.error}</span>
          </div>
        </div>
      </section>

      {/* Send New Notification */}
      <section className="analytics-section">
        <h3>Send New Notification</h3>
        <form onSubmit={handleSendNotification} className="notification-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                placeholder="Notification title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                value={newNotification.type}
                onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recipients">Recipients</label>
            <select
              id="recipients"
              value={newNotification.recipients}
              onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
            >
              <option value="all">All Users</option>
              <option value="active">Active Users Only</option>
              <option value="inactive">Inactive Users Only</option>
              {users.map(user => (
                <option key={user.id} value={user.username}>
                  {user.username} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              value={newNotification.message}
              onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
              placeholder="Notification message"
              rows="4"
              required
            />
          </div>

          <button type="submit" className="send-notification-btn">
            📤 Send Notification
          </button>
        </form>
      </section>

      {/* Recent Notifications */}
      <section className="analytics-section">
        <h3>Recent Notifications</h3>
        <div className="notifications-list">
          {sentNotifications.slice(0, 10).map(notification => (
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              <div className="notification-header">
                <h4>{notification.title}</h4>
                <span className={`notification-type ${notification.type}`}>
                  {notification.type}
                </span>
              </div>
              <p className="notification-message">{notification.message}</p>
              <div className="notification-meta">
                <span>To: {notification.recipients}</span>
                <span>{new Date(notification.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {sentNotifications.length === 0 && (
            <p className="no-notifications">No notifications sent yet.</p>
          )}
        </div>
      </section>

      {/* Notification Templates */}
      <section className="analytics-section">
        <h3>Quick Templates</h3>
        <div className="notification-templates">
          <button 
            className="template-btn"
            onClick={() => setNewNotification({
              title: 'System Maintenance',
              message: 'The system will be undergoing maintenance tonight from 2-4 AM. Some features may be unavailable.',
              type: 'warning',
              recipients: 'all'
            })}
          >
            🔧 Maintenance Notice
          </button>
          <button 
            className="template-btn"
            onClick={() => setNewNotification({
              title: 'New Features Available',
              message: 'Check out the latest features added to your plant watering system!',
              type: 'success',
              recipients: 'all'
            })}
          >
            ✨ New Features
          </button>
          <button 
            className="template-btn"
            onClick={() => setNewNotification({
              title: 'Plant Health Alert',
              message: 'Some of your plants need attention. Please check your dashboard for details.',
              type: 'error',
              recipients: 'all'
            })}
          >
            🚨 Health Alert
          </button>
        </div>
      </section>
    </div>
  );
};

export default CommunicationCenter;