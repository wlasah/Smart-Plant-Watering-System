import { useState, useEffect } from 'react';
import { plantsAPI } from '../services/api';

export function useDashboard(propPlants) {
  const [plants, setPlants] = useState(propPlants || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // Fetch plants from backend on mount
  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setPlants([]);
          setFilteredPlants([]);
          setError(null);
          setLoading(false);
          return;
        }

        const data = await plantsAPI.getAllPlants();
        
        // Map backend data to app format
        const mappedPlants = data.map(plant => ({
          id: plant.id,
          name: plant.name,
          type: plant.type,
          location: plant.location,
          moistureLevel: plant.moisture,
          lastWatered: plant.last_watered,
          description: plant.description,
          careRequirements: {
            waterFrequency: plant.care_requirements?.water_frequency,
            lightRequirement: plant.care_requirements?.light_requirement,
            temperature: plant.care_requirements?.temperature,
            humidity: plant.care_requirements?.humidity,
          },
          watering_history: plant.watering_history,
          created_at: plant.created_at,
        }));

        setPlants(mappedPlants);
        setFilteredPlants(mappedPlants);
        setError(null);
      } catch (err) {
        console.error('Error fetching plants:', err);
        setError(err.message || 'Failed to load plants');
        setPlants([]);
        setFilteredPlants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchPlants, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    plants,
    setPlants,
    loading,
    setLoading,
    error,
    setError,
    filteredPlants,
    setFilteredPlants,
    isFormOpen,
    setIsFormOpen,
    editingPlant,
    setEditingPlant,
    isEditFormOpen,
    setIsEditFormOpen
  };
}
