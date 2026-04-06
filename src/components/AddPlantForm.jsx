import React, { useState } from 'react';
import { plantsAPI } from '../services/api';
import '../styles/AddPlantForm.css';

const AddPlantForm = ({ onPlantAdded, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    moisture_level: 50,
    status: 'Healthy'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'moisture_level' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate form
    if (!formData.name.trim() || !formData.location.trim()) {
      setError('Plant name and location are required');
      setLoading(false);
      return;
    }

    try {
      // Create plant via API
      const apiPayload = {
        name: formData.name,
        location: formData.location,
        moisture: formData.moisture_level,
        type: formData.status
      };
      
      const newPlant = await plantsAPI.createPlant(apiPayload);
      
      setSuccess(true);
      setFormData({
        name: '',
        location: '',
        moisture_level: 50,
        status: 'Healthy'
      });

      // Notify parent component
      if (onPlantAdded) {
        onPlantAdded(newPlant);
      }

      // Close form after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to add plant');
      console.error('Error adding plant:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-plant-overlay">
      <div className="add-plant-form-container">
        <div className="add-plant-form-header">
          <h2>Add New Plant</h2>
          <button 
            className="add-plant-close-btn" 
            onClick={onClose}
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-plant-form">
          <div className="form-group">
            <label htmlFor="name">Plant Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Monstera, Snake Plant"
              required
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Living Room, Kitchen"
              required
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="moisture_level">
              Moisture Level: {formData.moisture_level}%
            </label>
            <input
              type="range"
              id="moisture_level"
              name="moisture_level"
              min="0"
              max="100"
              value={formData.moisture_level}
              onChange={handleInputChange}
              className="moisture-slider"
            />
            <div className="moisture-display">
              {formData.moisture_level === 100 && '🟢 Green - Saturated'}
              {formData.moisture_level >= 50 && formData.moisture_level < 100 && '🔵 Blue - Good'}
              {formData.moisture_level > 0 && formData.moisture_level < 50 && '🟠 Orange - Dry'}
              {formData.moisture_level === 0 && '🔴 Red - Very Dry'}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Healthy">Healthy</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </div>

          {error && <div className="form-error">⚠️ {error}</div>}
          {success && <div className="form-success">✅ Plant added successfully!</div>}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Adding...' : '➕ Add Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlantForm;
