import { useState, useEffect } from 'react';

export function useDashboard(propPlants) {
  const [plants, setPlants] = useState(propPlants || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // Only load plants on mount, not on every render
  useEffect(() => {
    setLoading(true);
    try {
      const storedPlants = localStorage.getItem('plants');
      if (storedPlants) {
        const parsedPlants = JSON.parse(storedPlants);
        setPlants(parsedPlants);
        setFilteredPlants(parsedPlants);
      } else if (propPlants && propPlants.length > 0) {
        setPlants(propPlants);
        setFilteredPlants(propPlants);
      } else {
        setPlants([]);
        setFilteredPlants([]);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load plants data');
      console.error('Error loading plants:', err);
    }
    setLoading(false);
  }, [propPlants]); // Run when propPlants changes

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
