import React, { useState, useEffect } from 'react';
import PlantCard from './PlantCard';
import StatsCard from './StatsCard';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // State for plants data (will be fetched from XAMPP/API)
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for interactive filtering
  const [filterStatus, setFilterStatus] = useState('All');
  const [wateredPlants, setWateredPlants] = useState(new Set());

  // Fetch plants from XAMPP backend API
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        // TODO: Replace with your XAMPP API endpoint
        // const response = await fetch('http://localhost:5000/api/plants');
        // const data = await response.json();
        // setPlants(data);
        
        // Temporary: Using mock data for testing UI
        const mockData = [
          {
            id: 1,
            name: 'Monstera',
            moistureLevel: 75,
            status: 'Healthy',
            lastWatered: '2 hours ago',
            location: 'Living Room'
          },
          {
            id: 2,
            name: 'Snake Plant',
            moistureLevel: 40,
            status: 'Needs Attention',
            lastWatered: '5 days ago',
            location: 'Bedroom'
          },
          {
            id: 3,
            name: 'Pothos',
            moistureLevel: 100,
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
        setPlants(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch plants data');
        setLoading(false);
        console.error('Error fetching plants:', err);
      }
    };

    fetchPlants();
  }, []);

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

      {loading && (
        <div className="loading-message">
          <p>Loading plants data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && plants.length > 0 && (
        <>
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
        </>
      )}

      {!loading && plants.length === 0 && (
        <div className="empty-message">
          <p>No plants found. Add your first plant to get started! 🌱</p>
        </div>
      )}

      <footer className="dashboard-footer">
        <p>&copy; 2026 Smart Plant Watering Irrigation System. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default Dashboard;
