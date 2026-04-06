import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import '../styles/CriticalPlantsAlert.css';

const CriticalPlantsAlert = ({ plants = [], users = [], onWaterPlant, onSendReminder }) => {
  const [criticalPlants, setCriticalPlants] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    criticalThreshold: 30,
    warningThreshold: 50
  });

  useEffect(() => {
    // Get plants below critical threshold
    const critical = (plants || [])
      .filter(p => p.moistureLevel < alertSettings.criticalThreshold)
      .sort((a, b) => a.moistureLevel - b.moistureLevel)
      .slice(0, 10);
    setCriticalPlants(critical);
  }, [plants, alertSettings]);

  const getOwnerName = (ownerId) => {
    const user = users.find(u => u.id === ownerId || u.username === ownerId);
    return user?.username || 'Unknown';
  };

  const handleWaterPlant = (plant) => {
    const updatedPlants = plants.map(p => 
      p.id === plant.id 
        ? { ...p, moistureLevel: 85, lastWatered: new Date().toLocaleString() }
        : p
    );
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    
    // Log activity
    const activityLog = JSON.parse(localStorage.getItem('userActivityLog')) || [];
    activityLog.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'water_plant',
      performedBy: 'admin',
      plant_name: plant.name,
      plant_id: plant.id
    });
    localStorage.setItem('userActivityLog', JSON.stringify(activityLog));
    
    if (onWaterPlant) onWaterPlant(plant);
  };

  const handleWaterAllCritical = () => {
    const updatedPlants = plants.map(p => {
      if (p.moistureLevel < alertSettings.criticalThreshold) {
        return { ...p, moistureLevel: 85, lastWatered: new Date().toLocaleString() };
      }
      return p;
    });
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    
    // Log activity
    const activityLog = JSON.parse(localStorage.getItem('userActivityLog')) || [];
    activityLog.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'water_all_critical',
      performedBy: 'admin',
      affectedCount: criticalPlants.length
    });
    localStorage.setItem('userActivityLog', JSON.stringify(activityLog));
    
    alert(`✅ Watered ${criticalPlants.length} critical plants!`);
  };

  const handleSendReminders = () => {
    const ownerIds = new Set(criticalPlants.map(p => p.user_id || p.owner));
    const message = `🚨 ALERT: ${criticalPlants.length} of your plants need immediate watering!`;
    
    // Create notifications
    const notifications = Array.from(ownerIds).map(userId => ({
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      userId,
      type: 'critical_alert',
      message,
      read: false
    }));

    const existingNotifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
    localStorage.setItem('userNotifications', JSON.stringify([...existingNotifications, ...notifications]));

    // Log activity
    const activityLog = JSON.parse(localStorage.getItem('userActivityLog')) || [];
    activityLog.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'send_critical_reminders',
      performedBy: 'admin',
      recipientCount: ownerIds.size
    });
    localStorage.setItem('userActivityLog', JSON.stringify(activityLog));

    if (onSendReminder) onSendReminder();
    alert(`✅ Sent reminders to ${ownerIds.size} users!`);
  };

  const criticalCount = plants.filter(p => p.moistureLevel < alertSettings.criticalThreshold).length;
  const warningCount = plants.filter(p => p.moistureLevel >= alertSettings.criticalThreshold && p.moistureLevel < alertSettings.warningThreshold).length;

  return (
    <div className="critical-plants-alert">
      <header className="alert-header">
        <h2>🚨 Plant Health Alerts</h2>
        <p>Critical plants requiring immediate attention</p>
      </header>

      {/* Alert Summary Stats */}
      <div className="alert-stats">
        <StatsCard 
          title="Critical Plants" 
          value={criticalCount}
          color="attention"
          icon="🚨"
        />
        <StatsCard 
          title="Warning Zone" 
          value={warningCount}
          color="attention"
          icon="⚠️"
        />
        <StatsCard 
          title="Healthy Plants" 
          value={plants.length - criticalCount - warningCount}
          color="healthy"
          icon="✅"
        />
      </div>

      {/* Quick Actions */}
      {criticalCount > 0 && (
        <div className="quick-actions">
          <button 
            className="action-btn action-btn--water"
            onClick={handleWaterAllCritical}
            title={`Water all ${criticalCount} critical plants`}
          >
            💧 Water All Critical ({criticalCount})
          </button>
          <button 
            className="action-btn action-btn--remind"
            onClick={handleSendReminders}
            title="Send urgent reminders to plant owners"
          >
            📢 Send Reminders to Owners
          </button>
        </div>
      )}

      {/* Critical Plants List */}
      {criticalPlants.length > 0 ? (
        <div className="critical-plants-list">
          <h3>Top {criticalPlants.length} Plants Needing Attention</h3>
          <div className="plants-table-wrapper">
            <table className="plants-table">
              <thead>
                <tr>
                  <th>Plant Name</th>
                  <th>Owner</th>
                  <th>Moisture Level</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Last Watered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {criticalPlants.map(plant => (
                  <tr key={plant.id} className={`critical-${plant.moistureLevel < 20 ? 'severe' : 'warning'}`}>
                    <td className="plant-name">{plant.name}</td>
                    <td>{getOwnerName(plant.user_id || plant.owner)}</td>
                    <td>
                      <div className="moisture-bar">
                        <div className="moisture-fill" style={{ width: `${plant.moistureLevel}%` }}></div>
                        <span className="moisture-text">{plant.moistureLevel}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${plant.moistureLevel < 20 ? 'critical' : 'warning'}`}>
                        {plant.moistureLevel < 20 ? '🔴 CRITICAL' : '🟡 WARNING'}
                      </span>
                    </td>
                    <td>{plant.location}</td>
                    <td>{plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}</td>
                    <td>
                      <button 
                        className="action-cell-btn"
                        onClick={() => handleWaterPlant(plant)}
                        title="Water this plant now"
                      >
                        💧 Water
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="no-alerts">
          <p>✅ All plants are in good condition! No critical alerts.</p>
        </div>
      )}

      {/* Settings */}
      <div className="alert-settings">
        <h3>Alert Thresholds</h3>
        <div className="threshold-inputs">
          <div className="threshold-group">
            <label>
              Critical Threshold (moisture %)
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={alertSettings.criticalThreshold}
                onChange={(e) => setAlertSettings({...alertSettings, criticalThreshold: parseInt(e.target.value)})}
              />
            </label>
          </div>
          <div className="threshold-group">
            <label>
              Warning Threshold (moisture %)
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={alertSettings.warningThreshold}
                onChange={(e) => setAlertSettings({...alertSettings, warningThreshold: parseInt(e.target.value)})}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalPlantsAlert;
