import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { plantsAPI } from '../services/api';
import '../styles/PlantsInventoryPage.css';

const PlantsInventoryPage = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load plants from Django backend API
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setError(null);
        const allPlants = await plantsAPI.getAllPlants();
        const mappedPlants = allPlants.map(plant => ({
          id: plant.id,
          name: plant.name,
          type: plant.type,
          location: plant.location,
          moistureLevel: plant.moisture,
          lastWatered: plant.last_watered,
          owner: plant.owner_username || 'Unknown'
        }));
        setPlants(mappedPlants);
      } catch (err) {
        console.error('Error loading plants:', err);
        setError('Failed to load plants. Make sure Django backend is running on http://localhost:8000');
        setPlants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // Get unique locations for filter
  const locations = useMemo(() => {
    return ['All', ...new Set(plants.map(p => p.location).filter(Boolean))];
  }, [plants]);

  // Filter and sort plants
  const filteredAndSortedPlants = useMemo(() => {
    let result = plants.filter(plant => {
      const matchesSearch = 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plant.location && plant.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plant.type && plant.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        plant.id.toString().includes(searchTerm);
      
      const dynamicStatus = plant.moistureLevel >= 50 ? 'Healthy' : 'Needs Attention';
      const matchesStatus = filterStatus === 'All' || dynamicStatus === filterStatus;
      const matchesLocation = filterLocation === 'All' || (plant.location && plant.location === filterLocation);
      
      return matchesSearch && matchesStatus && matchesLocation;
    });

    // Sort
    result.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        case 'moisture':
          return b.moistureLevel - a.moistureLevel;
        case 'lastWatered':
          return new Date(b.lastWatered || 0) - new Date(a.lastWatered || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [plants, searchTerm, filterStatus, filterLocation, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPlants.length / itemsPerPage);
  const paginatedPlants = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPlants.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedPlants, currentPage]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setFilterLocation('All');
    setSortBy('name');
    setCurrentPage(1);
  };

  const handleViewPlant = (plantId) => {
    navigate(`/plant/${plantId}`);
  };

  const getStatusColor = (moistureLevel) => {
    return moistureLevel >= 50 ? '#10b981' : '#f59e0b';
  };

  const getMoistureColor = (level) => {
    if (level >= 75) return '#10b981';
    if (level >= 50) return '#3b82f6';
    if (level >= 25) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return <div className="inventory-loading"><p>Loading plants from Django backend...</p></div>;
  }

  if (error) {
    return (
      <div className="inventory-error">
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="plants-inventory">
      <header className="inventory-header">
        <h1>🌿 Plants Inventory</h1>
        <p>Manage and search all your plants</p>
      </header>

      {/* Search and Filters Section */}
      <section className="inventory-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by plant name, location, or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filters-row">
          <select 
            value={filterStatus} 
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Needs Attention">Needs Attention</option>
          </select>

          <select 
            value={filterLocation} 
            onChange={(e) => {
              setFilterLocation(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc === 'All' ? 'All Locations' : loc}
              </option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="location">Sort by Location</option>
            <option value="moisture">Sort by Moisture (High to Low)</option>
            <option value="lastWatered">Sort by Last Watered</option>
          </select>

          <button 
            className="view-toggle"
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            title={`Switch to ${viewMode === 'table' ? 'grid' : 'table'} view`}
          >
            {viewMode === 'table' ? '⊞ Grid' : '≡ Table'}
          </button>

          {(searchTerm || filterStatus !== 'All' || filterLocation !== 'All') && (
            <button 
              className="reset-btn"
              onClick={handleClearFilters}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="inventory-stats">
          <span>Total: <strong>{filteredAndSortedPlants.length}</strong> plants</span>
          {searchTerm || filterStatus !== 'All' || filterLocation !== 'All' ? (
            <span>of <strong>{plants.length}</strong> total</span>
          ) : null}
        </div>
      </section>

      {/* Results */}
      <section className="inventory-results">
        {filteredAndSortedPlants.length === 0 ? (
          <div className="no-results-message">
            <p>🌱 No plants found matching your criteria</p>
            <button 
              className="reset-link"
              onClick={handleClearFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <div className="table-view">
                <table className="plants-table">
                  <thead>
                    <tr>
                      <th>Plant Name</th>
                      <th>Location</th>
                      <th>Moisture Level</th>
                      <th>Status</th>
                      <th>Last Watered</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPlants.map(plant => (
                      <tr key={plant.id} className="plant-row">
                        <td className="plant-name">
                          <span className="plant-icon">🌿</span>
                          {plant.name}
                        </td>
                        <td className="plant-location">{plant.location}</td>
                        <td className="moisture-cell">
                          <div className="moisture-bar">
                            <div 
                              className="moisture-fill"
                              style={{
                                width: `${plant.moistureLevel}%`,
                                backgroundColor: getMoistureColor(plant.moistureLevel)
                              }}
                            />
                          </div>
                          <span className="moisture-text">{plant.moistureLevel}%</span>
                        </td>
                        <td className="status-cell">
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(plant.moistureLevel) }}
                          >
                            {plant.moistureLevel >= 50 ? '✓ Healthy' : '⚠ Needs Attention'}
                          </span>
                        </td>
                        <td className="last-watered">
                          {plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="action-cell">
                          <button 
                            className="view-btn"
                            onClick={() => handleViewPlant(plant.id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid-view">
                {paginatedPlants.map(plant => (
                  <div key={plant.id} className="inventory-card">
                    <div className="card-header">
                      <h3>{plant.name}</h3>
                      <span 
                        className="card-status"
                        style={{ backgroundColor: getStatusColor(plant.moistureLevel) }}
                      >
                        {plant.moistureLevel >= 50 ? '✓' : '⚠'}
                      </span>
                    </div>
                    <div className="card-location">📍 {plant.location}</div>
                    <div className="card-moisture">
                      <label>Moisture Level</label>
                      <div className="moisture-bar">
                        <div 
                          className="moisture-fill"
                          style={{
                            width: `${plant.moistureLevel}%`,
                            backgroundColor: getMoistureColor(plant.moistureLevel)
                          }}
                        />
                      </div>
                      <span>{plant.moistureLevel}%</span>
                    </div>
                    <div className="card-watered">
                      Last watered: {plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}
                    </div>
                    <button 
                      className="card-view-btn"
                      onClick={() => handleViewPlant(plant.id)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                
                <div className="pagination-info">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </div>
                
                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default PlantsInventoryPage;
