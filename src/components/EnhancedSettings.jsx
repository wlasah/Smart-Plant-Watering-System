import React, { useState, useEffect } from 'react';
import '../styles/EnhancedSettings.css';

const EnhancedSettings = () => {
  const [settings, setSettings] = useState({
    criticalThreshold: 30,
    warningThreshold: 50,
    healthyThreshold: 70,
    notificationFrequency: 'daily',
    enableEmailNotifications: true,
    enableSystemAlerts: true,
    autoArchiveDeadPlants: false,
    deadPlantThreshold: 10,
    dataRetentionDays: 90
  });

  const [roles, setRoles] = useState({
    admin: { viewAllPlants: true, managePlants: true, manageUsers: true, manageSettings: true },
    user: { viewAllPlants: false, managePlants: true, manageUsers: false, manageSettings: false }
  });

  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedRoles = localStorage.getItem('rolePermissions');
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRoleChange = (role, permission, value) => {
    setRoles(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    localStorage.setItem('rolePermissions', JSON.stringify(roles));
    
    // Log activity
    const activityLog = JSON.parse(localStorage.getItem('userActivityLog')) || [];
    activityLog.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action: 'update_settings',
      performedBy: 'admin',
      description: 'System settings updated'
    });
    localStorage.setItem('userActivityLog', JSON.stringify(activityLog));

    setSavedMessage('✅ Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleExportData = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const wateringHistory = JSON.parse(localStorage.getItem('wateringHistory')) || [];

    const csvContent = [
      ['USERS'],
      ['ID', 'Username', 'Email', 'Role', 'Created At'],
      ...users.map(u => [u.id, u.username, u.email || '', u.role, u.createdAt || '']),
      [],
      ['PLANTS'],
      ['ID', 'Name', 'Owner', 'Type', 'Location', 'Moisture Level', 'Status', 'Last Watered'],
      ...plants.map(p => [p.id, p.name, p.owner || '', p.type || '', p.location, p.moistureLevel, p.status, p.lastWatered || '']),
      [],
      ['WATERING HISTORY'],
      ['Plant ID', 'Watering Date', 'Amount'],
      ...wateringHistory.map(w => [w.plant_id, w.watering_date, w.amount || ''])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `plant-system-export-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('✅ Data exported successfully!');
  };

  return (
    <div className="enhanced-settings">
      <header className="settings-header">
        <h2>⚙️ System Configuration</h2>
        <p>Configure thresholds, notifications, and system behavior</p>
      </header>

      {savedMessage && <div className="success-message">{savedMessage}</div>}

      <div className="settings-container">
        {/* Moisture Thresholds Section */}
        <section className="settings-section">
          <h3>🌡️ Moisture Level Thresholds</h3>
          <p className="section-desc">Define what constitutes healthy, warning, and critical moisture levels</p>
          
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                Critical Threshold (%)
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={settings.criticalThreshold}
                  onChange={(e) => handleSettingChange('criticalThreshold', parseInt(e.target.value))}
                />
              </label>
              <small>Below this: Plant needs urgent watering</small>
            </div>

            <div className="setting-item">
              <label>
                Warning Threshold (%)
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={settings.warningThreshold}
                  onChange={(e) => handleSettingChange('warningThreshold', parseInt(e.target.value))}
                />
              </label>
              <small>Between critical and warning: Plant needs attention soon</small>
            </div>

            <div className="setting-item">
              <label>
                Healthy Threshold (%)
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={settings.healthyThreshold}
                  onChange={(e) => handleSettingChange('healthyThreshold', parseInt(e.target.value))}
                />
              </label>
              <small>Above this: Plant is in good condition</small>
            </div>
          </div>

          <div className="threshold-visualization">
            <h4>Visual Reference</h4>
            <div className="threshold-bar">
              <div className="threshold-section critical" style={{width: `${settings.criticalThreshold}%`}}>
                <span>🔴 Critical</span>
              </div>
              <div className="threshold-section warning" style={{width: `${settings.warningThreshold - settings.criticalThreshold}%`}}>
                <span>🟡 Warning</span>
              </div>
              <div className="threshold-section healthy" style={{width: `${100 - settings.healthyThreshold}%`}}>
                <span>🟢 Healthy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Settings Section */}
        <section className="settings-section">
          <h3>📢 Notification Settings</h3>
          <p className="section-desc">Control how and when admins receive alerts</p>

          <div className="settings-grid">
            <div className="setting-item checkbox">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.enableSystemAlerts}
                  onChange={(e) => handleSettingChange('enableSystemAlerts', e.target.checked)}
                />
                Enable System Alerts
              </label>
              <small>Critical plant alerts will be displayed</small>
            </div>

            <div className="setting-item checkbox">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.enableEmailNotifications}
                  onChange={(e) => handleSettingChange('enableEmailNotifications', e.target.checked)}
                />
                Enable Email Notifications
              </label>
              <small>Send email alerts for critical situations</small>
            </div>

            <div className="setting-item">
              <label>
                Notification Frequency
                <select 
                  value={settings.notificationFrequency}
                  onChange={(e) => handleSettingChange('notificationFrequency', e.target.value)}
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly Summary</option>
                  <option value="daily">Daily Summary</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </label>
              <small>How often to send notification summaries</small>
            </div>
          </div>
        </section>

        {/* Plant Management Settings */}
        <section className="settings-section">
          <h3>🌱 Plant Management</h3>
          <p className="section-desc">Automated plant management behaviors</p>

          <div className="settings-grid">
            <div className="setting-item checkbox">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.autoArchiveDeadPlants}
                  onChange={(e) => handleSettingChange('autoArchiveDeadPlants', e.target.checked)}
                />
                Auto-Archive Dead Plants
              </label>
              <small>Automatically archive plants below moisture threshold for extended period</small>
            </div>

            <div className="setting-item">
              <label>
                Dead Plant Threshold (Days)
                <input 
                  type="number" 
                  min="1" 
                  max="365" 
                  value={settings.deadPlantThreshold}
                  onChange={(e) => handleSettingChange('deadPlantThreshold', parseInt(e.target.value))}
                />
              </label>
              <small>Plants below critical for this many days are marked as dead</small>
            </div>

            <div className="setting-item">
              <label>
                Data Retention (Days)
                <input 
                  type="number" 
                  min="30" 
                  max="1095" 
                  value={settings.dataRetentionDays}
                  onChange={(e) => handleSettingChange('dataRetentionDays', parseInt(e.target.value))}
                />
              </label>
              <small>How long to keep historical data before cleanup</small>
            </div>
          </div>
        </section>

        {/* Role & Permission Management */}
        <section className="settings-section">
          <h3>👑 Role & Permission Management</h3>
          <p className="section-desc">Define what each role can do in the system</p>

          <div className="permissions-table">
            {Object.entries(roles).map(([role, permissions]) => (
              <div key={role} className="role-permissions">
                <h4>{role.charAt(0).toUpperCase() + role.slice(1).toUpperCase()}</h4>
                <div className="permissions-grid">
                  {Object.entries(permissions).map(([permission, allowed]) => (
                    <div key={permission} className="permission-item">
                      <label>
                        <input 
                          type="checkbox" 
                          checked={allowed}
                          onChange={(e) => handleRoleChange(role, permission, e.target.checked)}
                        />
                        {permission.split(/(?=[A-Z])/).join(' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Export Section */}
        <section className="settings-section">
          <h3>📊 Data Export & Backup</h3>
          <p className="section-desc">Export system data for analysis or backup</p>

          <div className="export-actions">
            <button 
              className="btn-export"
              onClick={handleExportData}
            >
              📥 Export All Data (CSV)
            </button>
            <small>Download all users, plants, and watering history as CSV file</small>
          </div>
        </section>

        {/* Save Button */}
        <div className="settings-footer">
          <button 
            className="btn-save-settings"
            onClick={handleSaveSettings}
          >
            💾 Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSettings;
