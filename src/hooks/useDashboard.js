import { useState, useEffect } from 'react';

export function useDashboard(propPlants) {
  const [plants, setPlants] = useState(propPlants);
  const [loading, setLoading] = useState(!propPlants || propPlants.length === 0);
  const [error, setError] = useState(null);
  const [filteredPlants, setFilteredPlants] = useState(plants);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const storedPlants = localStorage.getItem('plants');
      if (storedPlants) {
        const parsedPlants = JSON.parse(storedPlants);
        setPlants(parsedPlants);
        setFilteredPlants(parsedPlants);
      } else {
        setPlants(propPlants);
        setFilteredPlants(propPlants);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load plants data');
      console.error('Error loading plants:', err);
    }
    setLoading(false);
  }, [propPlants]);

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
