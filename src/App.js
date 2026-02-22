import React, { useState, useCallback } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

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
      <Dashboard />
    </div>
  );
}

export default App;
