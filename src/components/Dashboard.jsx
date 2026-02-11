import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // Mock data for plants
  const plants = [
    {
      id: 1,
      name: 'Monstera',
      moistureLevel: 65,
      status: 'Healthy',
      lastWatered: '2 hours ago',
      location: 'Living Room'
    },
    {
      id: 2,
      name: 'Snake Plant',
      moistureLevel: 40,
      status: 'Healthy',
      lastWatered: '5 days ago',
      location: 'Bedroom'
    },
    {
      id: 3,
      name: 'Pothos',
      moistureLevel: 85,
      status: 'Needs Attention',
      lastWatered: '1 hour ago',
      location: 'Kitchen'
    },
    {
      id: 4,
      name: 'Fiddle Leaf Fig',
      moistureLevel: 55,
      status: 'Healthy',
      lastWatered: '3 days ago',
      location: 'Office'
    }
  ];

  // Calculate average moisture level
  const avgMoisture = Math.round(
    plants.reduce((sum, plant) => sum + plant.moistureLevel, 0) / plants.length
  );

  // Count plants by status
  const healthyCount = plants.filter(p => p.status === 'Healthy').length;
  const needsAttentionCount = plants.filter(p => p.status === 'Needs Attention').length;

  // Get status color
  const getStatusColor = (status) => {
    return status === 'Healthy' ? '#10b981' : '#f59e0b';
  };

  // Get moisture color
  const getMoistureColor = (level) => {
    if (level < 30) return '#ef4444';
    if (level < 50) return '#f59e0b';
    if (level < 70) return '#3b82f6';
    return '#10b981';
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Smart Plant Watering System</h1>
        <p>Monitor and control your plants' watering needs</p>
      </header>

      <section className="system-overview">
        <div className="overview-card">
          <h3>Total Plants</h3>
          <p className="overview-value">{plants.length}</p>
        </div>
        <div className="overview-card">
          <h3>Healthy Plants</h3>
          <p className="overview-value" style={{ color: '#10b981' }}>{healthyCount}</p>
        </div>
        <div className="overview-card">
          <h3>Need Attention</h3>
          <p className="overview-value" style={{ color: '#f59e0b' }}>{needsAttentionCount}</p>
        </div>
        <div className="overview-card">
          <h3>Avg Moisture</h3>
          <p className="overview-value">{avgMoisture}%</p>
        </div>
      </section>

      <section className="plants-section">
        <h2>Plant Status</h2>
        <article className="plants-grid">
          {plants.map((plant) => (
            <div key={plant.id} className="plant-card">
              <header className="plant-header">
                <h3>{plant.name}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(plant.status) }}
                >
                  {plant.status}
                </span>
              </header>

              <div className="plant-info">
                <div className="info-item">
                  <label>Location</label>
                  <p>{plant.location}</p>
                </div>

                <div className="info-item">
                  <label>Last Watered</label>
                  <p>{plant.lastWatered}</p>
                </div>
              </div>

              <div className="moisture-section">
                <label>Soil Moisture Level</label>
                <div className="moisture-bar-container">
                  <div 
                    className="moisture-bar-fill"
                    style={{
                      width: `${plant.moistureLevel}%`,
                      backgroundColor: getMoistureColor(plant.moistureLevel)
                    }}
                  ></div>
                </div>
                <span className="moisture-value">{plant.moistureLevel}%</span>
              </div>

              <button className="water-button">Water Now</button>
            </div>
          ))}
        </article>
      </section>

 
    </main>
  );
};

export default Dashboard;
