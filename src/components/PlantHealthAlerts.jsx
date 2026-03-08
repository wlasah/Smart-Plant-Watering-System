import React, { useState, useEffect } from 'react';
import '../styles/PlantHealthAlerts.css';

const PlantHealthAlerts = ({ plants }) => {
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Generate alerts from current plant data
    const currentAlerts = plants
      .filter(p => p.moistureLevel < 50)
      .map(p => ({
        id: p.id,
        plantName: p.name,
        plantId: p.id,
        severity: p.moistureLevel < 30 ? 'critical' : 'warning',
        message: `${p.name} moisture level is ${p.moistureLevel}%${p.moistureLevel < 30 ? ' - CRITICAL' : ''}`,
        timestamp: new Date().toISOString(),
        resolved: false,
        location: p.location,
        owner: p.owner || 'Unknown'
      }));

    setAlerts(currentAlerts);

    // Load notifications from localStorage
    const savedNotifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
    setNotifications(savedNotifications.slice(0, 20).reverse()); // Latest 20
  }, [plants]);

  const getFilteredAlerts = () => {
    if (filterType === 'all') return alerts;
    return alerts.filter(a => a.severity === filterType);
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, resolved: true } : a
    ));
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);

    const allNotifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
    const updatedAll = allNotifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('userNotifications', JSON.stringify(updatedAll));
  };

  const filteredAlerts = getFilteredAlerts();
  const unreadCount = notifications.filter(n => !n.read).length;
  const unresolvedCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="plant-health-alerts">
      <header className="alerts-header">
        <h2>📋 Health Alerts & Notifications</h2>
        <div className="alerts-summary">
          <span className="summary-item">
            <strong>{unresolvedCount}</strong> Unresolved Alerts
          </span>
          <span className="summary-item">
            <strong>{unreadCount}</strong> Unread Notifications
          </span>
        </div>
      </header>

      <div className="alerts-container">
        {/* Alerts Section */}
        <div className="alerts-section">
          <div className="section-header">
            <h3>🚨 Active Alerts</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All ({alerts.length})
              </button>
              <button 
                className={`filter-btn ${filterType === 'critical' ? 'active' : ''}`}
                onClick={() => setFilterType('critical')}
              >
                Critical ({alerts.filter(a => a.severity === 'critical').length})
              </button>
              <button 
                className={`filter-btn ${filterType === 'warning' ? 'active' : ''}`}
                onClick={() => setFilterType('warning')}
              >
                Warning ({alerts.filter(a => a.severity === 'warning').length})
              </button>
            </div>
          </div>

          {filteredAlerts.length > 0 ? (
            <div className="alerts-list">
              {filteredAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`alert-item alert-${alert.severity} ${alert.resolved ? 'resolved' : ''}`}
                >
                  <div className="alert-content">
                    <div className="alert-icon">
                      {alert.severity === 'critical' ? '🔴' : '🟡'}
                    </div>
                    <div className="alert-info">
                      <h4>{alert.plantName}</h4>
                      <p className="alert-message">{alert.message}</p>
                      <div className="alert-meta">
                        <span className="meta-item">📍 {alert.location}</span>
                        <span className="meta-item">👤 {alert.owner}</span>
                        <span className="meta-item">⏰ {new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <button 
                      className="resolve-btn"
                      onClick={() => handleResolveAlert(alert.id)}
                      title="Mark as resolved"
                    >
                      ✓ Resolve
                    </button>
                  )}
                  {alert.resolved && (
                    <span className="resolved-badge">✓ Resolved</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-content">
              <p>✅ No {filterType !== 'all' ? filterType : ''} alerts at the moment!</p>
            </div>
          )}
        </div>

        {/* Notifications Section */}
        <div className="notifications-section">
          <div className="section-header">
            <h3>📢 Notification History</h3>
            <span className="unread-badge">{unreadCount} new</span>
          </div>

          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => !notification.read && handleMarkNotificationAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {notification.type === 'critical_alert' ? '🚨' : '📢'}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-content">
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantHealthAlerts;
