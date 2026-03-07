import { useState, useEffect } from 'react';

export function useSystemStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlants: 0,
    healthyPlants: 0,
    needsAttentionPlants: 0,
    averageMoisture: 0,
    loading: true
  });

  useEffect(() => {
    const calculateStats = () => {
      try {
        // Get users data
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Get plants data
        const plants = JSON.parse(localStorage.getItem('plants')) || [];

        const totalUsers = users.length;
        const totalPlants = plants.length;

        // Calculate health statistics
        const healthyPlants = plants.filter(plant => plant.moistureLevel >= 50).length;
        const needsAttentionPlants = plants.filter(plant => plant.moistureLevel < 50).length;

        // Calculate average moisture level
        const averageMoisture = plants.length > 0
          ? Math.round(plants.reduce((sum, plant) => sum + plant.moistureLevel, 0) / plants.length)
          : 0;

        setStats({
          totalUsers,
          totalPlants,
          healthyPlants,
          needsAttentionPlants,
          averageMoisture,
          loading: false
        });
      } catch (error) {
        console.error('Error calculating system stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    calculateStats();

    // Listen for storage changes to update stats in real-time
    const handleStorageChange = (e) => {
      if (e.key === 'users' || e.key === 'plants') {
        calculateStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return stats;
}