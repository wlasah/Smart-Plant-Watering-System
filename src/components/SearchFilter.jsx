import React, { useState, useEffect } from 'react';
import '../styles/SearchFilter.css';

const SearchFilter = ({ plants, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Extract unique locations from plants
  const uniqueLocations = ['All', ...new Set(plants.map(p => p.location))];

  // Filter plants based on search term and status
  useEffect(() => {
    const filtered = plants.filter(plant => {
      const matchesSearch = 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All' || plant.status === selectedStatus;
      const matchesLocation = selectedLocation === 'All' || plant.location === selectedLocation;
      
      return matchesSearch && matchesStatus && matchesLocation;
    });

    onFilterChange(filtered);
  }, [searchTerm, selectedStatus, selectedLocation, plants]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedLocation('All');
  };

  return (
    <div className="search-filter">
      <div className="search-filter__search-box">
        <input
          type="text"
          className="search-filter__input"
          placeholder="Search plants by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search plants"
        />
        {searchTerm && (
          <button
            className="search-filter__clear-btn"
            onClick={() => setSearchTerm('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="search-filter__filters">
        <select
          className="search-filter__select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filter by health status"
        >
          <option value="All">All Status</option>
          <option value="Healthy">Healthy</option>
          <option value="Needs Attention">Needs Attention</option>
        </select>

        <select
          className="search-filter__select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          aria-label="Filter by location"
        >
          {uniqueLocations.map(location => (
            <option key={location} value={location}>
              {location === 'All' ? 'All Locations' : location}
            </option>
          ))}
        </select>

        {(searchTerm || selectedStatus !== 'All' || selectedLocation !== 'All') && (
          <button
            className="search-filter__reset-btn"
            onClick={handleClearSearch}
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
