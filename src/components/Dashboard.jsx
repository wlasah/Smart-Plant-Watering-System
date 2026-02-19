import React, { useState } from 'react';
import PlantCard from './PlantCard';
import StatsCard from './StatsCard';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // Mock data for plants
  const [plants] = useState([
    {
      id: 1,
      name: 'Monstera',
      moistureLevel: 65,
      status: 'Healthy',
      lastWatered: '2 hours ago',
      location: 'Living Room',
      wateringSchedule: 'Every 7 days'
    },
    {
      id: 2,
      name: 'Snake Plant',
      moistureLevel: 40,
      status: 'Healthy',
      lastWatered: '5 days ago',
      location: 'Bedroom',
      wateringSchedule: 'Every 14 days'
    },
    {
      id: 3,
      name: 'Pothos',
      moistureLevel: 85,
      status: 'Needs Attention',
      lastWatered: '1 hour ago',
      location: 'Kitchen',
      wateringSchedule: 'Every 5 days'
    },
    {
      id: 4,
      name: 'Fiddle Leaf Fig',
      moistureLevel: 55,
      status: 'Healthy',
      lastWatered: '3 days ago',
      location: 'Office',
      wateringSchedule: 'Every 10 days'
    }
  ]);

  // State for interactive filtering
  const [filterStatus, setFilterStatus] = useState('All');
  const [wateredPlants, setWateredPlants] = useState(new Set());

  // Calculate statistics
  const avgMoisture = Math.round(
    plants.reduce((sum, plant) => sum + plant.moistureLevel, 0) / plants.length
  );
  const healthyCount = plants.filter(p => p.status === 'Healthy').length;
  const needsAttentionCount = plants.filter(p => p.status === 'Needs Attention').length;

  // Filter plants based on selected status
  const filteredPlants = filterStatus === 'All'
    ? plants
    : plants.filter(p => p.status === filterStatus);

  // Handle water plant interaction
  const handleWaterClick = (plantId) => {
    const newWateredPlants = new Set(wateredPlants);
    if (newWateredPlants.has(plantId)) {
      newWateredPlants.delete(plantId);
    } else {
      newWateredPlants.add(plantId);
    }
    setWateredPlants(newWateredPlants);
    alert(`💧 Plant #${plantId} watered! Moisture updated.`);
  };

  // Filter button styles
  const getFilterButtonStyle = (status) => ({
    backgroundColor: filterStatus === status ? '#06b6d4' : '#e0f7ff',
    color: filterStatus === status ? 'white' : '#0c7a8b',
    borderColor: filterStatus === status ? '#06b6d4' : '#a5f3fc'
  });

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Smart Plant Watering System</h1>
        <p>Monitor and control your plants' watering needs</p>
      </header>

      {/* System Overview Section - Using StatsCard Component */}
      <section className="system-overview">
        <StatsCard 
          title="Total Plants" 
          value={plants.length}
          icon="🌱"
        />
        <StatsCard 
          title="Healthy Plants" 
          value={healthyCount}
          color="healthy"
          icon="✅"
        />
        <StatsCard 
          title="Need Attention" 
          value={needsAttentionCount}
          color="attention"
          icon="⚠️"
        />
        <StatsCard 
          title="Avg Moisture" 
          value={`${avgMoisture}%`}
          color="moisture"
          icon="💧"
        />
      </section>

      {/* Interactive Filter Section */}
      <section className="filter-section">
        <h2>Filter Plants</h2>
        <div className="filter-buttons">
          {['All', 'Healthy', 'Needs Attention'].map(status => (
            <button
              key={status}
              className="filter-btn"
              style={getFilterButtonStyle(status)}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <p className="filter-info">
          Showing {filteredPlants.length} of {plants.length} plants
        </p>
      </section>

      {/* Plants Section - Using PlantCard Component */}
      <section className="plants-section">
        <h2>Plant Status</h2>
        <article className="plants-grid">
          {filteredPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onWaterClick={handleWaterClick}
            />
          ))}
        </article>
      </section>

      <footer className="dashboard-footer">
        <p>&copy; 2026 Smart Plant Watering Irrigation System. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default Dashboard;
