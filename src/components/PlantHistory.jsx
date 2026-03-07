import React from 'react';
import '../styles/PlantHistory.css';

const PlantHistory = ({ plant, wateringHistory = [] }) => {
  // Generate mock watering history if none provided
  const history = wateringHistory.length > 0 ? wateringHistory : generateMockHistory(plant);

  function generateMockHistory(plant) {
    const now = new Date();
    return [
      {
        id: 1,
        date: new Date(now - 1 * 24 * 60 * 60 * 1000),
        amount: '250ml',
        moistureBefore: plant.moistureLevel - 10,
        moistureAfter: plant.moistureLevel,
        notes: 'Regular watering schedule'
      },
      {
        id: 2,
        date: new Date(now - 3 * 24 * 60 * 60 * 1000),
        amount: '250ml',
        moistureBefore: 45,
        moistureAfter: 55,
        notes: 'Regular watering schedule'
      },
      {
        id: 3,
        date: new Date(now - 5 * 24 * 60 * 60 * 1000),
        amount: '200ml',
        moistureBefore: 35,
        moistureAfter: 45,
        notes: 'Reduced watering due to humidity'
      },
      {
        id: 4,
        date: new Date(now - 7 * 24 * 60 * 60 * 1000),
        amount: '300ml',
        moistureBefore: 25,
        moistureAfter: 50,
        notes: 'Heavy watering after dry period'
      },
      {
        id: 5,
        date: new Date(now - 10 * 24 * 60 * 60 * 1000),
        amount: '250ml',
        moistureBefore: 40,
        moistureAfter: 60,
        notes: 'Regular watering schedule'
      }
    ];
  }

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="plant-history">
      <h3 className="plant-history__title">Watering History</h3>
      <div className="plant-history__list">
        {history.length > 0 ? (
          history.map((entry) => (
            <div key={entry.id} className="plant-history__entry">
              <div className="plant-history__entry-header">
                <span className="plant-history__date">{formatDate(entry.date)}</span>
                <span className="plant-history__amount">💧 {entry.amount}</span>
              </div>
              
              <div className="plant-history__moisture-change">
                <span className="plant-history__moisture-before">
                  Before: {entry.moistureBefore}%
                </span>
                <span className="plant-history__moisture-arrow">→</span>
                <span className="plant-history__moisture-after">
                  After: {entry.moistureAfter}%
                </span>
              </div>

              {entry.notes && (
                <p className="plant-history__notes">{entry.notes}</p>
              )}
            </div>
          ))
        ) : (
          <p className="plant-history__empty">No watering history available for this plant.</p>
        )}
      </div>

      <div className="plant-history__stats">
        <div className="plant-history__stat">
          <span>Total Waters (30 days)</span>
          <strong>{history.length}</strong>
        </div>
        <div className="plant-history__stat">
          <span>Avg Interval</span>
          <strong>{history.length > 1 ? Math.round(30 / history.length) : 0} days</strong>
        </div>
      </div>
    </div>
  );
};

export default PlantHistory;
