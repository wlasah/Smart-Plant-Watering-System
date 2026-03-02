import React, { useState, useEffect } from 'react';
import PlantCard from './PlantCard';
import StatsCard from './StatsCard';
import AddPlantForm from './AddPlantForm';
import EditPlantForm from './EditPlantForm';
import SearchFilter from './SearchFilter';
import '../styles/Dashboard.css';

const Dashboard = ({ 
  plants: propPlants = [], 
  onPlantsLoaded,
  onViewDetail,
  onWater,
  onNavigateTo,
  onNotification,
  onPlantAdded
}) => {
  // State for plants data (will be fetched from XAMPP/API)
  const [plants, setPlants] = useState(propPlants);
  const [loading, setLoading] = useState(!propPlants || propPlants.length === 0);
  const [error, setError] = useState(null);

  // State for search/filter
  const [filteredPlants, setFilteredPlants] = useState(plants);
  
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
        setFilteredPlants(transformedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch plants data');
        setLoading(false);
        console.error('Error fetching plants:', err);
      }
    };

    fetchPlants();
  }, []);

  // Calculate statistics - DYNAMIC based on moisture level
  const avgMoisture = Math.round(
    plants.reduce((sum, plant) => sum + plant.moistureLevel, 0) / plants.length
  ) || 0;
  // Dynamic: Healthy if moisture >= 50%, Needs Attention if < 50%
  const healthyCount = plants.filter(p => p.moistureLevel >= 50).length;
  const needsAttentionCount = plants.filter(p => p.moistureLevel < 50).length;

  // Handle filter change from SearchFilter component
  const handleFilterChange = (filtered) => {
    setFilteredPlants(filtered);
  };

  // Handle water plant interaction
  const handleWaterClick = (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    const newMoisture = Math.min(plant.moistureLevel + 30, 100);
    
    try {
      // Log watering event to backend
      const response = await fetch(`http://localhost:5000/api/plants/${plantId}/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moisture_before: plant.moistureLevel,
          moisture_after: newMoisture
        })
      });

      if (response.ok) {
        // Update local state
        const updatedPlant = { ...plant, moistureLevel: newMoisture };
        const updatedPlants = plants.map(p => p.id === plantId ? updatedPlant : p);
        setPlants(updatedPlants);
        setFilteredPlants(updatedPlants.filter(p => 
          filteredPlants.map(fp => fp.id).includes(p.id)
        ));
        
        if (onNotification) {
          onNotification(`💧 ${plant.name} watered! Moisture: ${newMoisture}%`, 'success');
        }
      }
    } catch (err) {
      console.error('Error watering plant:', err);
      if (onNotification) {
        onNotification('❌ Failed to water plant', 'error');
      }
    }
  };

  // Handle plant card click to view details
  const handlePlantCardClick = (plant) => {
    if (onViewDetail) {
      onViewDetail(plant);
    }
  };
  // Handle new plant added from form
  const handlePlantAdded = (newPlant) => {
    // Transform data if coming from API
    const transformedPlant = {
      ...newPlant,
      moistureLevel: newPlant.moisture_level || newPlant.moistureLevel,
      lastWatered: newPlant.last_watered || new Date().toLocaleString()
    };
    
    const updatedPlants = [...plants, plantToAdd];
    setPlants(updatedPlants);
    setFilteredPlants(updatedPlants);
    
    // Save to localStorage
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    
    if (onPlantAdded) {
      onPlantAdded(plantToAdd);
    }
    
    setIsFormOpen(false);
  };

  // Handle plant edit
  const handleEditPlant = (plant) => {
    setEditingPlant(plant);
    setIsEditFormOpen(true);
  };

  // Handle plant edit submission
  const handlePlantUpdated = (updatedPlant) => {
    const updatedPlants = plants.map(p => 
      p.id === updatedPlant.id ? updatedPlant : p
    );
    setPlants(updatedPlants);
    setFilteredPlants(updatedPlants.filter(p => 
      filteredPlants.map(fp => fp.id).includes(p.id)
    ));
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    if (onNotification) {
      onNotification(`🔄 ${updatedPlant.name} updated successfully`, 'success');
    }
  };

  // Handle plant delete
  const handleDeletePlant = (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    const updatedPlants = plants.filter(p => p.id !== plantId);
    setPlants(updatedPlants);
    setFilteredPlants(updatedPlants);
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    if (onNotification) {
      onNotification(`🗑️ ${plant.name} has been deleted`, 'success');
    }
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🌿 Smart Plant Watering System</h1>
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

      {/* Edit Plant Form Modal */}
      <EditPlantForm
        plant={editingPlant}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onPlantUpdated={handlePlantUpdated}
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

          {/* Search and Filter Section */}
          <section className="search-filter-section">
            <SearchFilter 
              plants={plants}
              onFilterChange={handleFilterChange}
            />
          </section>

          {/* Plants Section - Using PlantCard Component */}
          <section className="plants-section">
            <h2>Plant Status {filteredPlants.length !== plants.length && `(${filteredPlants.length} filtered)`}</h2>
            {filteredPlants.length > 0 ? (
              <article className="plants-grid">
                {filteredPlants.map((plant) => (
                  <div 
                    key={plant.id}
                    style={{ cursor: 'pointer' }}
                  >
                    <PlantCard
                      plant={plant}
                      onWaterClick={handleWaterClick}
                      onEdit={handleEditPlant}
                      onDelete={handleDeletePlant}
                    />
                  </div>
                ))}
              </article>
            ) : (
              <div className="no-results">
                <p>No plants match your filter. Try adjusting your search criteria.</p>
              </div>
            )}
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
