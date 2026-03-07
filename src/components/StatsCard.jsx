import React from 'react';
import '../styles/StatsCard.css';

const StatsCard = ({ title, value, color = 'default', icon = null, variant = 'default' }) => {
  return (
    <div className={`stats-card stats-card--${color} stats-card--${variant}`}>
      {icon && <div className="stats-card__icon">{icon}</div>}
      <div className="stats-card__content">
        <h3 className="stats-card__title">{title}</h3>
        <p className="stats-card__value">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
