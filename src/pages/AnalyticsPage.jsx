import React, { useState, useEffect } from 'react';
import '../styles/AnalyticsPage.css';

const AnalyticsPage = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/plants');
        const data = await response.json();
        setPlants(data);
        if (data.length > 0) {
          setSelectedPlant(data[0].id || 0);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plants:', err);
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const getStatusStats = () => {
    const healthy = plants.filter(p => p.status === 'Healthy').length;
    const needsAttention = plants.filter(p => p.status === 'Needs Attention').length;
    const total = plants.length;
    return { healthy, needsAttention, total };
  };

  const getAverageMoisture = () => {
    if (plants.length === 0) return 0;
    const sum = plants.reduce((acc, plant) => acc + (plant.moisture_level || 0), 0);
    return Math.round(sum / plants.length);
  };

  const getMoistureDistribution = () => {
    const ranges = {
      '0-25%': 0,
      '26-50%': 0,
      '51-75%': 0,
      '76-100%': 0
    };

    plants.forEach(plant => {
      const moisture = plant.moisture_level || 0;
      if (moisture <= 25) ranges['0-25%']++;
      else if (moisture <= 50) ranges['26-50%']++;
      else if (moisture <= 75) ranges['51-75%']++;
      else ranges['76-100%']++;
    });

    return ranges;
  };

  const stats = getStatusStats();
  const moistureDistribution = getMoistureDistribution();
  const avgMoisture = getAverageMoisture();

  if (loading) {
    return <div className="analytics-loading">Loading analytics data...</div>;
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>📊 Analytics & Statistics</h1>
        <p>Track your plants' health and performance metrics</p>
      </div>

      <div className="analytics-container">
        {/* Overview Cards */}
        <section className="analytics-section">
          <h2>Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🌱</div>
              <div className="stat-content">
                <p className="stat-label">Total Plants</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <p className="stat-label">Healthy</p>
                <p className="stat-value">{stats.healthy}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <p className="stat-label">Needs Attention</p>
                <p className="stat-value">{stats.needsAttention}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💧</div>
              <div className="stat-content">
                <p className="stat-label">Avg Moisture</p>
                <p className="stat-value">{avgMoisture}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Moisture Distribution */}
        <section className="analytics-section">
          <h2>Moisture Level Distribution</h2>
          <div className="distribution-chart">
            {Object.entries(moistureDistribution).map(([range, count]) => (
              <div key={range} className="distribution-bar-wrapper">
                <label>{range}</label>
                <div className="distribution-bar">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`,
                      backgroundColor: getMoistureColor(range)
                    }}
                  >
                    {count > 0 ? count : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Plant Details */}
        <section className="analytics-section">
          <h2>Plant Details</h2>
          {plants.length === 0 ? (
            <p className="no-data">No plants found. Add a plant to see analytics.</p>
          ) : (
            <div className="plants-table">
              <table>
                <thead>
                  <tr>
                    <th>Plant Name</th>
                    <th>Location</th>
                    <th>Moisture Level</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((plant, index) => (
                    <tr key={plant.id || index}>
                      <td>{plant.name}</td>
                      <td>{plant.location}</td>
                      <td>
                        <div className="moisture-indicator">
                          <span className="moisture-value">{plant.moisture_level || 0}%</span>
                          <div className="moisture-bar">
                            <div
                              className="moisture-fill"
                              style={{
                                width: `${plant.moisture_level || 0}%`,
                                backgroundColor: getMoistureColor(`${plant.moisture_level || 0}%`)
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${plant.status?.toLowerCase().replace(' ', '-')}`}>
                          {plant.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recommendations */}
        <section className="analytics-section">
          <h2>💡 Recommendations</h2>
          <div className="recommendations">
            {stats.needsAttention > 0 && (
              <div className="recommendation-card warning">
                <p>🔔 {stats.needsAttention} plant(s) need attention. Check their moisture levels and status.</p>
              </div>
            )}
            {avgMoisture < 30 && (
              <div className="recommendation-card info">
                <p>💧 Average moisture is low. Consider watering your plants more frequently.</p>
              </div>
            )}
            {avgMoisture > 70 && (
              <div className="recommendation-card info">
                <p>⚠️ Average moisture is high. Ensure proper drainage and avoid overwatering.</p>
              </div>
            )}
            {stats.total === 0 && (
              <div className="recommendation-card info">
                <p>🌱 Start by adding your first plant to the system!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper function to determine moisture level color
function getMoistureColor(range) {
  if (range === '0-25%') return '#ff6b6b';
  if (range === '26-50%') return '#ffa500';
  if (range === '51-75%') return '#4ecdc4';
  if (range === '76-100%') return '#06b6d4';
  return '#999';
}

export default AnalyticsPage;
