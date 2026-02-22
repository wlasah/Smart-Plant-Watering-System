import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';

const SettingsPage = () => {
  const defaultSettings = {
    systemName: 'My Garden',
    moistureThreshold: 40,
    alertNotifications: true,
    autoWatering: false,
    timezone: 'EST',
    theme: 'light',
    language: 'English'
  };

  const [settings, setSettings] = useState(() => {
    // Load from localStorage on component mount
    const saved = localStorage.getItem('plantSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [savedMessage, setSavedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('system');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('plantSettings', JSON.stringify(settings));
    setSavedMessage('✓ Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings(defaultSettings);
      localStorage.setItem('plantSettings', JSON.stringify(defaultSettings));
      setSavedMessage('✓ Settings reset to defaults');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  const tabs = [
    { id: 'system', label: '⚙️ System Settings' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'appearance', label: '🎨 Appearance' }
  ];

  return (
    <div className="page-container settings-page">
      <header className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Configure your Smart Plant Watering System</p>
      </header>

      {savedMessage && <div className="success-message">{savedMessage}</div>}

      <div className="settings-wrapper">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'system' && (
            <div className="settings-section">
              <h2>System Configuration</h2>

              <div className="setting-group">
                <label htmlFor="systemName">System Name</label>
                <input
                  id="systemName"
                  type="text"
                  value={settings.systemName}
                  onChange={(e) => handleSettingChange('systemName', e.target.value)}
                  placeholder="Enter system name"
                  className="setting-input"
                />
                <p className="setting-description">Give your watering system a custom name</p>
              </div>

              <div className="setting-group">
                <label htmlFor="moistureThreshold">Moisture Threshold (%)</label>
                <input
                  id="moistureThreshold"
                  type="range"
                  min="20"
                  max="80"
                  value={settings.moistureThreshold}
                  onChange={(e) => handleSettingChange('moistureThreshold', parseInt(e.target.value))}
                  className="setting-slider"
                />
                <div className="slider-value">
                  <span>Current: {settings.moistureThreshold}%</span>
                </div>
                <p className="setting-description">Plants will be watered when moisture drops below this level</p>
              </div>

              <div className="setting-group">
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="setting-select"
                >
                  <option value="PST">PST (Pacific)</option>
                  <option value="MST">MST (Mountain)</option>
                  <option value="CST">CST (Central)</option>
                  <option value="EST">EST (Eastern)</option>
                </select>
                <p className="setting-description">Set your local timezone for accurate scheduling</p>
              </div>

              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.autoWatering}
                    onChange={(e) => handleSettingChange('autoWatering', e.target.checked)}
                  />
                  <span>Enable Auto-Watering</span>
                </label>
                <p className="setting-description">Automatically water plants when moisture is below threshold</p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Settings</h2>

              <div className="setting-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.alertNotifications}
                    onChange={(e) => handleSettingChange('alertNotifications', e.target.checked)}
                  />
                  <span>Enable Alert Notifications</span>
                </label>
                <p className="setting-description">Receive notifications when plants need watering</p>
              </div>

              <div className="notification-types">
                <div className="notify-item">
                  <input type="checkbox" defaultChecked id="notifyLow" />
                  <label htmlFor="notifyLow">Low Moisture Alert</label>
                </div>
                <div className="notify-item">
                  <input type="checkbox" defaultChecked id="notifyHigh" />
                  <label htmlFor="notifyHigh">High Moisture Alert</label>
                </div>
                <div className="notify-item">
                  <input type="checkbox" defaultChecked id="notifySystem" />
                  <label htmlFor="notifySystem">System Status Updates</label>
                </div>
                <div className="notify-item">
                  <input type="checkbox" id="notifyDaily" />
                  <label htmlFor="notifyDaily">Daily Summary Report</label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>

              <div className="setting-group">
                <label htmlFor="theme">Theme</label>
                <select
                  id="theme"
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="setting-select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
                <p className="setting-description">Choose your preferred color theme</p>
              </div>

              <div className="setting-group">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="setting-select"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                </select>
                <p className="setting-description">Select your preferred language</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-save" onClick={handleSave}>
          💾 Save Changes
        </button>
        <button className="btn-reset" onClick={handleReset}>
          🔄 Reset to Defaults
        </button>
      </div>

      <div className="settings-info">
        <h3>ℹ️ About Your System</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Version:</span>
            <span className="value">1.0.0</span>
          </div>
          <div className="info-item">
            <span className="label">Database:</span>
            <span className="value">Connected</span>
          </div>
          <div className="info-item">
            <span className="label">Last Backup:</span>
            <span className="value">Today at 2:30 PM</span>
          </div>
          <div className="info-item">
            <span className="label">API Status:</span>
            <span className="value">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
