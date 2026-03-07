import React, { useState } from 'react';
import '../styles/FormStyles.css';

const defaultSchedule = {
  plantName: '',
  frequency: 'daily',
  time: '08:00',
  notes: ''
};

const CareScheduleForm = ({ initialSchedule = {}, onSave, isOpen, onClose }) => {
  const [formData, setFormData] = useState({ ...defaultSchedule, ...initialSchedule });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.plantName.trim()) {
      newErrors.plantName = 'Plant name is required';
    }
    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Simulate saving to browser/localStorage
      await new Promise(res => setTimeout(res, 800));
      setSuccess(true);
      if (onSave) onSave(formData);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError('Failed to save schedule');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Plant Care Schedule</h2>
          <button className="form-close-btn" onClick={onClose} aria-label="Close form" type="button">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-content">
          {error && !success && <div className="form-error" role="alert">{error}</div>}
          {success && <div className="form-success" role="alert">Schedule saved! ✓</div>}
          <div className="form-group">
            <label htmlFor="schedule-plantName">Plant Name *</label>
            <input
              type="text"
              id="schedule-plantName"
              name="plantName"
              value={formData.plantName}
              onChange={handleInputChange}
              disabled={loading}
              className={errors.plantName ? 'form-input error' : 'form-input'}
              maxLength="50"
            />
            {errors.plantName && <span className="form-error-text">{errors.plantName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="frequency">Watering Frequency *</label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              disabled={loading}
              className={errors.frequency ? 'form-select error' : 'form-select'}
            >
              <option value="daily">Daily</option>
              <option value="every2days">Every 2 Days</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
            {errors.frequency && <span className="form-error-text">{errors.frequency}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="time">Reminder Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              disabled={loading}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              disabled={loading}
              className="form-input"
              maxLength="200"
              rows={3}
              placeholder="Optional notes about this schedule..."
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Saving...' : 'Save Schedule'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareScheduleForm;
