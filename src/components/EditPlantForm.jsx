import React, { useState, useEffect } from 'react';
import '../styles/FormStyles.css';

const EditPlantForm = ({ plant, onPlantUpdated, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    moisture_level: 50,
    status: 'Healthy'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize form with plant data when opened
  useEffect(() => {
    if (isOpen && plant) {
      setFormData({
        name: plant.name || '',
        location: plant.location || '',
        moisture_level: plant.moisture_level || 50,
        status: plant.status || 'Healthy'
      });
      setErrors({});
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, plant]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plant name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Plant name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Plant name must not exceed 50 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    } else if (formData.location.trim().length > 50) {
      newErrors.location = 'Location must not exceed 50 characters';
    }

    if (formData.moisture_level < 0 || formData.moisture_level > 100) {
      newErrors.moisture_level = 'Moisture level must be between 0 and 100';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const moistureLevel = name === 'moisture_level' ? parseInt(value) : (formData.moisture_level || 50);
    
    // Determine status based on moisture level
    let status = 'Healthy';
    if (moistureLevel < 30) {
      status = 'Needs Attention';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'moisture_level' ? parseInt(value) : value,
      status: name === 'moisture_level' ? status : prev.status
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
      // TODO: Replace with your XAMPP API endpoint when backend is running
      const response = await fetch(`http://localhost:5000/api/plants/${plant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update plant');
      }

      const updatedPlant = await response.json();
      setSuccess(true);

      // Notify parent component
      if (onPlantUpdated) {
        onPlantUpdated(updatedPlant);
      }

      // Close form after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update plant. Is your backend running?');
      console.error('Error updating plant:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: plant?.name || '',
      location: plant?.location || '',
      moisture_level: plant?.moisture_level || 50,
      status: plant?.status || 'Healthy'
    });
    setErrors({});
    setError(null);
    onClose();
  };

  if (!isOpen || !plant) return null;

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Edit Plant</h2>
          <button 
            className="form-close-btn" 
            onClick={onClose}
            aria-label="Close form"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          {error && !success && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="form-success" role="alert">
              Plant updated successfully! ✓
            </div>
          )}

          <div className="form-group">
            <label htmlFor="edit-name">Plant Name *</label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Monstera, Snake Plant"
              disabled={loading}
              className={errors.name ? 'form-input error' : 'form-input'}
              maxLength="50"
            />
            {errors.name && <span className="form-error-text">{errors.name}</span>}
            <span className="form-char-count">{formData.name.length}/50</span>
          </div>

          <div className="form-group">
            <label htmlFor="edit-location">Location *</label>
            <input
              type="text"
              id="edit-location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Living Room, Kitchen Window"
              disabled={loading}
              className={errors.location ? 'form-input error' : 'form-input'}
              maxLength="50"
            />
            {errors.location && <span className="form-error-text">{errors.location}</span>}
            <span className="form-char-count">{formData.location.length}/50</span>
          </div>

          <div className="form-group">
            <label htmlFor="edit-moisture">Moisture Level ({formData.moisture_level}%)</label>
            <input
              type="range"
              id="edit-moisture"
              name="moisture_level"
              min="0"
              max="100"
              value={formData.moisture_level}
              onChange={handleInputChange}
              disabled={loading}
              className="form-range"
            />
            <div className="moisture-display">
              {formData.moisture_level < 30 && 'Dry 🏜️'}
              {formData.moisture_level >= 30 && formData.moisture_level < 60 && 'Moderate 💧'}
              {formData.moisture_level >= 60 && 'Wet 💦'}
            </div>
            {errors.moisture_level && <span className="form-error-text">{errors.moisture_level}</span>}
          </div>          <div className="form-group">
            <label>Plant Status (Auto-determined)</label>
            <div className="status-display">
              {formData.moisture_level < 30 ? (
                <span className="status-needs-attention">⚠️ Needs Attention</span>
              ) : (
                <span className="status-healthy">✅ Healthy</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlantForm;
