import React, { useState, useEffect } from 'react';
import '../styles/EnhancedSettings.css';

const API_BASE_URL = 'http://localhost:8000/api';

const EnhancedSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [error, setError] = useState(null);

  // Fetch settings from backend
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/settings/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      
      // Handle array response (list endpoint)
      const settingsData = Array.isArray(data) ? data[0] : data;
      setSettings(settingsData || createDefaultSettings());
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. Using defaults.');
      setSettings(createDefaultSettings());
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = () => ({
    critical_threshold: 30,
    warning_threshold: 50,
    healthy_threshold: 70,
    notification_frequency: 'daily',
    enable_email_notifications: true,
    enable_system_alerts: true,
    auto_archive_dead_plants: false,
    dead_plant_threshold: 10,
    data_retention_days: 90
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/settings/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to save settings');
      
      setSavedMessage('✅ Settings saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="settings-error">Unable to load settings</div>;
  }

  return (
    <div className="enhanced-settings">
      <header className="settings-header">
        <h2>⚙️ System Configuration</h2>
        <p>Configure thresholds, notifications, and system behavior</p>
      </header>

      {error && <div className="error-message">{error}</div>}
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
                  value={settings.critical_threshold}
                  onChange={(e) => handleSettingChange('critical_threshold', parseInt(e.target.value))}
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
                  value={settings.warning_threshold}
                  onChange={(e) => handleSettingChange('warning_threshold', parseInt(e.target.value))}
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
                  value={settings.healthy_threshold}
                  onChange={(e) => handleSettingChange('healthy_threshold', parseInt(e.target.value))}
                />
              </label>
              <small>Above this: Plant is in good condition</small>
            </div>
          </div>

          <div className="threshold-visualization">
            <h4>Visual Reference</h4>
            <div className="threshold-bar">
              <div className="threshold-section critical" style={{width: `${settings.critical_threshold}%`}}>
                <span>🔴 Critical</span>
              </div>
              <div className="threshold-section warning" style={{width: `${settings.warning_threshold - settings.critical_threshold}%`}}>
                <span>🟡 Warning</span>
              </div>
              <div className="threshold-section healthy" style={{width: `${100 - settings.healthy_threshold}%`}}>
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
                  checked={settings.enable_system_alerts}
                  onChange={(e) => handleSettingChange('enable_system_alerts', e.target.checked)}
                />
                Enable System Alerts
              </label>
              <small>Critical plant alerts will be displayed</small>
            </div>

            <div className="setting-item checkbox">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.enable_email_notifications}
                  onChange={(e) => handleSettingChange('enable_email_notifications', e.target.checked)}
                />
                Enable Email Notifications
              </label>
              <small>Send email alerts for critical situations</small>
            </div>

            <div className="setting-item">
              <label>
                Notification Frequency
                <select 
                  value={settings.notification_frequency}
                  onChange={(e) => handleSettingChange('notification_frequency', e.target.value)}
                >
                  <option value="immediately">Immediately</option>
                  <option value="daily">Daily Summary</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </label>
              <small>How often to send notification summaries</small>
            </div>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="settings-section">
          <h3>💾 Data Management</h3>
          <p className="section-desc">Configure data retention and archiving</p>

          <div className="settings-grid">
            <div className="setting-item checkbox">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.auto_archive_dead_plants}
                  onChange={(e) => handleSettingChange('auto_archive_dead_plants', e.target.checked)}
                />
                Auto-archive Dead Plants
              </label>
              <small>Automatically archive plants that haven't been watered</small>
            </div>

            <div className="setting-item">
              <label>
                Dead Plant Threshold (days)
                <input 
                  type="number" 
                  min="1" 
                  max="365" 
                  value={settings.dead_plant_threshold}
                  onChange={(e) => handleSettingChange('dead_plant_threshold', parseInt(e.target.value))}
                />
              </label>
              <small>Days without watering before marking as dead</small>
            </div>

            <div className="setting-item">
              <label>
                Data Retention (days)
                <input 
                  type="number" 
                  min="30" 
                  max="730" 
                  value={settings.data_retention_days}
                  onChange={(e) => handleSettingChange('data_retention_days', parseInt(e.target.value))}
                />
              </label>
              <small>How long to keep historical data</small>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="settings-actions">
          <button 
            className="btn btn-save"
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
          <button 
            className="btn btn-reset"
            onClick={fetchSettings}
            disabled={loading}
          >
            ↻ Reset
          </button>
        </section>
      </div>
    </div>
  );
};

export default EnhancedSettings;
