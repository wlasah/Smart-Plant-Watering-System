import React, { useState, useEffect, useRef } from 'react';
import '../styles/SearchFilter.css';

const SearchFilter = ({ plants, onFilterChange, showUserFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedUser, setSelectedUser] = useState('All');
  const prevFilteredRef = useRef([]);

  // Extract unique locations from plants
  const uniqueLocations = ['All', ...new Set(plants.map(p => p.location))];

  // Extract unique users from plants
  const uniqueUsers = ['All', ...new Set(plants.map(p => p.owner).filter(Boolean))];

  // Filter plants based on search term, status, location, and user
  useEffect(() => {
    const filtered = plants.filter(plant => {
      const matchesSearch = 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Calculate dynamic status based on moisture level (50% threshold)
      const dynamicStatus = plant.moistureLevel >= 50 ? 'Healthy' : 'Needs Attention';
      const matchesStatus = selectedStatus === 'All' || dynamicStatus === selectedStatus;
      const matchesLocation = selectedLocation === 'All' || plant.location === selectedLocation;
      const matchesUser = !showUserFilter || selectedUser === 'All' || plant.owner === selectedUser;
      
      return matchesSearch && matchesStatus && matchesLocation && matchesUser;
    });

    // Only call onFilterChange if the filtered results actually changed
    const hasChanged = 
      filtered.length !== prevFilteredRef.current.length ||
      filtered.some((plant, idx) => plant.id !== prevFilteredRef.current[idx]?.id);
    
    if (hasChanged) {
      prevFilteredRef.current = filtered;
      onFilterChange(filtered);
    }
  }, [searchTerm, selectedStatus, selectedLocation, selectedUser, plants, onFilterChange, showUserFilter]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedLocation('All');
    setSelectedUser('All');
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

      <div className="search-filter__filters-row">
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

        {showUserFilter && (
          <select
            className="search-filter__dropdown"
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
          >
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        )}

        {(searchTerm || selectedStatus !== 'All' || selectedLocation !== 'All' || selectedUser !== 'All') && (
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
