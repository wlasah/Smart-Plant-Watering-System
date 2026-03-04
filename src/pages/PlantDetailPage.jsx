import React, { useState } from 'react';
import PlantHistory from '../components/PlantHistory';
import '../styles/PlantDetailPage.css';

const PlantDetailPage = ({ plant, onBack, onWater, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlant, setEditedPlant] = useState(plant);

  if (!plant) {
    return (
      <div className="plant-detail-page">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
        <p className="no-plant-message">Plant not found</p>
      </div>
    );
  }

  const getMoistureColor = (level) => {
    if (level >= 70 && level <= 90) return '#10b981';
    if (level >= 50 && level < 70) return '#3b82f6';
    if (level >= 30 && level < 50) return '#f59e0b';
    return '#ef4444';
  };

  const getMoistureStatus = (level) => {
    if (level >= 70 && level <= 90) return 'Optimal';
    if (level >= 50 && level < 70) return 'Good';
    if (level >= 30 && level < 50) return 'Needs Watering';
    return 'Critical - Water Immediately';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSaveEdit = () => {
    // Save edits locally (no API/database)
    setIsEditing(false);
    // You could call an onUpdate prop here
  };

  // Calculate dynamic status based on moisture level (50% threshold)
  const getDynamicStatus = () => {
    return plant.moistureLevel >= 50 ? 'Healthy' : 'Needs Attention';
  };

  const dynamicStatus = getDynamicStatus();

  // Calculate care recommendations
  const daysUntilWatering = Math.max(0, 3 - Math.floor(plant.moistureLevel / 30));
  const plantAge = '45 days'; // Mock data
  const lastWateredDays = Math.floor(Math.random() * 7) + 1;

  return (
    <div className="plant-detail-page">
      <header className="plant-detail-header">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
        <h1>{plant.name}</h1>
        <p className="plant-location">📍 {plant.location}</p>
      </header>

      {/* Main Info Sections */}
      <div className="plant-detail-container">
        {/* Left Column - Key Info */}
        <div className="plant-detail-main">
          {/* Status Card */}
          <section className="detail-section status-section">
            <div className="status-badge" style={{ backgroundColor: dynamicStatus === 'Healthy' ? '#10b981' : '#f59e0b' }}>
              {dynamicStatus === 'Healthy' ? '✅' : '⚠️'} {dynamicStatus}
            </div>
            <h3>Current Status</h3>
            <p className="status-text">
              {dynamicStatus === 'Healthy' 
                ? 'Your plant is thriving! Continue with regular care.' 
                : 'Your plant needs attention soon. Check watering schedule.'}
            </p>
          </section>

          {/* Moisture Level Card */}
          <section className="detail-section moisture-section">
            <h3>Soil Moisture Level</h3>
            <div className="moisture-display">
              <div className="moisture-circle" style={{ color: getMoistureColor(plant.moistureLevel) }}>
                <span className="moisture-percent">{plant.moistureLevel}%</span>
              </div>
              <div className="moisture-info">
                <p className="moisture-status">{getMoistureStatus(plant.moistureLevel)}</p>
                <div className="moisture-bar">
                  <div
                    className="moisture-bar-fill"
                    style={{ 
                      width: `${plant.moistureLevel}%`,
                      backgroundColor: getMoistureColor(plant.moistureLevel)
                    }}
                  ></div>
                </div>
                <div className="moisture-scale">
                  <span>Dry (0%)</span>
                  <span>Wet (100%)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Plant Information */}
          <section className="detail-section info-section">
            <h3>Plant Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Plant ID</label>
                <p>{plant.id}</p>
              </div>
              <div className="info-item">
                <label>Location</label>
                <p>{plant.location}</p>
              </div>
              <div className="info-item">
                <label>Last Watered</label>
                <p>{formatDate(plant.last_watered)}</p>
              </div>
              <div className="info-item">
                <label>Age in System</label>
                <p>{plantAge}</p>
              </div>
            </div>
          </section>

          {/* Care Recommendations */}
          <section className="detail-section recommendations-section">
            <h3>📋 Care Recommendations</h3>
            <div className="recommendations-list">
              <div className="recommendation-item">
                <span className="icon">💧</span>
                <div className="recommendation-content">
                  <strong>Watering</strong>
                  <p>Water in approximately {daysUntilWatering} day{daysUntilWatering !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="recommendation-item">
                <span className="icon">☀️</span>
                <div className="recommendation-content">
                  <strong>Sunlight</strong>
                  <p>Provide 6-8 hours of indirect sunlight daily</p>
                </div>
              </div>
              <div className="recommendation-item">
                <span className="icon">🌡️</span>
                <div className="recommendation-content">
                  <strong>Temperature</strong>
                  <p>Keep between 65-75°F (18-24°C)</p>
                </div>
              </div>
              <div className="recommendation-item">
                <span className="icon">💨</span>
                <div className="recommendation-content">
                  <strong>Humidity</strong>
                  <p>Maintain 40-60% humidity for optimal growth</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Actions and History */}
        <div className="plant-detail-sidebar">
          {/* Quick Actions */}
          <section className="detail-section actions-section">
            <h3>Quick Actions</h3>
            <div className="actions-buttons">
              <button 
                className="action-btn primary"
                onClick={() => onWater(plant.id)}
                title="Water this plant"
              >
                💧 Water Now
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => setIsEditing(!isEditing)}
                title="Edit plant details"
              >
                ✏️ Edit Info
              </button>
              <button 
                className="action-btn danger"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${plant.name}"?`)) {
                    onDelete(plant.id);
                  }
                }}
                title="Delete this plant"
              >
                🗑️ Delete
              </button>
            </div>
          </section>

          {/* Watering History Widget */}
          <section className="detail-section">
            <PlantHistory plant={plant} />
          </section>

          {/* Quick Stats */}
          <section className="detail-section quick-stats">
            <h3>Quick Stats</h3>
            <div className="stats-list">
              <div className="stat">
                <span>Last Watered</span>
                <strong>{lastWateredDays} day{lastWateredDays !== 1 ? 's' : ''} ago</strong>
              </div>
              <div className="stat">
                <span>Total Waterings</span>
                <strong>24</strong>
              </div>
              <div className="stat">
                <span>Avg Moisture</span>
                <strong>62%</strong>
              </div>
              <div className="stat">
                <span>Health Trend</span>
                <strong>📈 Improving</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailPage;
