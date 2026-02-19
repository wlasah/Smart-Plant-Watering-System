import React, { useState, useEffect } from 'react';
import PlantCard from './PlantCard';
import StatsCard from './StatsCard';
import AddPlantForm from './AddPlantForm';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // State for plants data (will be fetched from XAMPP/API)
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for interactive filtering
  const [filterStatus, setFilterStatus] = useState('All');
  const [wateredPlants, setWateredPlants] = useState(new Set());
  
  // State for add plant form
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch plants from XAMPP backend API
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/plants');
        const data = await response.json();
        
        // Transform data from snake_case to camelCase
        const transformedData = data.map(plant => ({
          ...plant,
          moistureLevel: plant.moisture_level,
          lastWatered: plant.last_watered
        }));
        
        setPlants(transformedData);
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

  // Handle new plant added from form
  const handlePlantAdded = (newPlant) => {
    // Transform data if coming from API
    const transformedPlant = {
      ...newPlant,
      moistureLevel: newPlant.moisture_level || newPlant.moistureLevel,
      lastWatered: newPlant.last_watered || new Date().toLocaleString()
    };
    setPlants(prev => [...prev, transformedPlant]);
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Smart Plant Watering System</h1>
          <p>Monitor and control your plants' watering needs</p>
        </div>
        <button 
          className="btn-add-plant"
          onClick={() => setIsFormOpen(true)}
          title="Add a new plant"
        >
          ➕ Add Plant
        </button>
      </header>

      {/* Add Plant Form Modal */}
      <AddPlantForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onPlantAdded={handlePlantAdded}
      />

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
