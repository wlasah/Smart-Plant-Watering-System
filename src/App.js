import React, { useState, useCallback } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import PlantDetailPage from './pages/PlantDetailPage';
import NotificationToast from './components/NotificationToast';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plants, setPlants] = useState([]);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Show notification helper
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({
      isVisible: true,
      message,
      type
    });
  }, []);

  // Close notification helper
  const closeNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  // Handle navigation to plant detail page
  const handleViewPlantDetail = (plant) => {
    setSelectedPlant(plant);
    setCurrentPage('detail');
  };

  // Handle water plant action
  const handleWaterPlant = (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      // Update the plant's moisture level
      const updatedPlants = plants.map(p => 
        p.id === plantId 
          ? { ...p, moistureLevel: Math.min(p.moistureLevel + 30, 100) }
          : p
      );
      setPlants(updatedPlants);
      showNotification(`💧 ${plant.name} watered! Moisture updated.`, 'success');
    }
  };

  // Handle delete plant
  const handleDeletePlant = (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      setPlants(plants.filter(p => p.id !== plantId));
      showNotification(`🗑️ ${plant.name} has been removed`, 'info');
      setCurrentPage('dashboard');
    }
  };

  // Handle new plant added
  const handlePlantAdded = (newPlant) => {
    setPlants(prev => [...prev, newPlant]);
    showNotification(`✅ ${newPlant.name} has been added!`, 'success');
  };

  return (
    <div className="App">
      {currentPage === 'dashboard' && (
        <Dashboard 
          plants={plants}
          onPlantsLoaded={setPlants}
          onViewDetail={handleViewPlantDetail}
          onWater={handleWaterPlant}
          onNavigateTo={setCurrentPage}
          onNotification={showNotification}
          onPlantAdded={handlePlantAdded}
        />
      )}

      {currentPage === 'analytics' && (
        <div className="page-container">
          <button 
            className="nav-back-btn"
            onClick={() => setCurrentPage('dashboard')}
          >
            ← Back to Dashboard
          </button>
          <AnalyticsPage plants={plants} />
        </div>
      )}

      {currentPage === 'detail' && selectedPlant && (
        <PlantDetailPage 
          plant={selectedPlant}
          onBack={() => setCurrentPage('dashboard')}
          onWater={handleWaterPlant}
          onDelete={handleDeletePlant}
        />
      )}

      {/* Top Navigation Bar */}
      {currentPage !== 'detail' && (
        <nav className="app-nav">
          <button
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
            title="View all plants"
          >
            🏠 Dashboard
          </button>
          <button
            className={`nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analytics')}
            title="View analytics and statistics"
          >
            📊 Analytics
          </button>
        </nav>
      )}

      {/* Notification Toast */}
      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
}

export default App;
