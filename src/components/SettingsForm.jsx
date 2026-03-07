import React from 'react';
import '../styles/FormStyles.css';
import { useSettingsForm } from '../hooks/useSettingsForm';

const SettingsForm = ({ userSettings = {}, onSave, isOpen, onClose }) => {
  const {
    formData,
    setFormData,
    errors,
    loading,
    error,
    success,
    handleInputChange,
    handleSubmit
  } = useSettingsForm(userSettings, onSave, onClose);

  if (!isOpen) return null;

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Settings</h2>
          <button className="form-close-btn" onClick={onClose} aria-label="Close form" type="button">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-content">
          {error && !success && <div className="form-error" role="alert">{error}</div>}
          {success && <div className="form-success" role="alert">Settings saved! ✓</div>}
          <div className="form-group">
            <label htmlFor="settings-username">Username *</label>
            <input
              type="text"
              id="settings-username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              className={errors.username ? 'form-input error' : 'form-input'}
              maxLength="30"
            />
            {errors.username && <span className="form-error-text">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="settings-email">Email *</label>
            <input
              type="email"
              id="settings-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className={errors.email ? 'form-input error' : 'form-input'}
              maxLength="50"
            />
            {errors.email && <span className="form-error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="wateringTime">Default Watering Time</label>
            <input
              type="time"
              id="wateringTime"
              name="wateringTime"
              value={formData.wateringTime}
              onChange={handleInputChange}
              disabled={loading}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="alertMethod">Alert Method</label>
            <select
              id="alertMethod"
              name="alertMethod"
              value={formData.alertMethod}
              onChange={handleInputChange}
              disabled={loading}
              className="form-select"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
            </select>
          </div>
          <div className="form-group form-checkbox">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                disabled={loading}
              />
              Enable Notifications
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Saving...' : 'Save Settings'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
