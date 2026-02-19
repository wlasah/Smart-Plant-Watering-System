import React, { useState } from 'react';
import '../styles/PlantCard.css';

const PlantCard = ({ plant, onWaterClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMoistureColor = (level) => {
    if (level === 100) return '#10b981'; // green at 100%
    if (level >= 50 && level < 100) return '#3b82f6'; // blue 50-80%
    if (level > 0 && level < 50) return '#f59e0b'; // orange below 50%
    return '#ef4444'; // red at 0%
  };

  const getStatusColor = (status) => {
    return status === 'Healthy' ? '#10b981' : '#f59e0b';
  };

  return (
    <article className={`plant-card ${isExpanded ? 'plant-card--expanded' : ''}`}>
      <header className="plant-card__header">
        <h3 className="plant-card__title">{plant.name}</h3>
        <span
          className="plant-card__status"
          style={{ backgroundColor: getStatusColor(plant.status) }}
        >
          {plant.status}
        </span>
      </header>

      <div className="plant-card__info">
        <div className="plant-card__info-item">
          <label>Location</label>
          <p>{plant.location}</p>
        </div>

        <div className="plant-card__info-item">
          <label>Last Watered</label>
          <p>{plant.lastWatered}</p>
        </div>
      </div>

      <div className="plant-card__moisture">
        <label>Soil Moisture Level</label>
        <div className="plant-card__moisture-bar-container">
          <div
            className="plant-card__moisture-bar-fill"
            style={{
              width: `${plant.moistureLevel}%`,
              backgroundColor: getMoistureColor(plant.moistureLevel),
            }}
          ></div>
        </div>
        <span className="plant-card__moisture-value">{plant.moistureLevel}%</span>
      </div>

      {isExpanded && (
        <div className="plant-card__details">
          <h4>Additional Details</h4>
          <p><strong>Plant ID:</strong> {plant.id}</p>
          <p><strong>Current Status:</strong> {plant.status}</p>
          <p><strong>Moisture Trend:</strong> Stable</p>
          <p><strong>Next Watering:</strong> In 2 days</p>
        </div>
      )}

      <div className="plant-card__actions">
        <button
          className="plant-card__expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Show less' : 'Show more'}
        >
          {isExpanded ? '▼ Less' : '▶ More'}
        </button>
        <button
          className="plant-card__water-btn"
          onClick={() => onWaterClick(plant.id)}
        >
          💧 Water Now
        </button>
      </div>
    </article>
  );
};

export default PlantCard;
