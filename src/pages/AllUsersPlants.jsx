import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AllUsersPlants.css';

const AllUsersPlants = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterHealth, setFilterHealth] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const allPlants = JSON.parse(localStorage.getItem('plants')) || [];
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setPlants(allPlants);
    setCurrentUser(user);
    applyFilters(allPlants);
  }, []);

  useEffect(() => {
    applyFilters(plants);
  }, [searchTerm, sortBy, filterHealth, filterOwner, filterLocation, plants]);

  const applyFilters = (plantsToFilter) => {
    let filtered = [...plantsToFilter];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.owner && p.owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.type && p.type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Health filter
    if (filterHealth !== 'all') {
      if (filterHealth === 'critical') filtered = filtered.filter(p => p.moistureLevel < 30);
      else if (filterHealth === 'warning') filtered = filtered.filter(p => p.moistureLevel >= 30 && p.moistureLevel < 50);
      else if (filterHealth === 'healthy') filtered = filtered.filter(p => p.moistureLevel >= 50);
    }

    // Owner filter
    if (filterOwner !== 'all') {
      filtered = filtered.filter(p => (p.owner || p.user_id) === filterOwner);
    }

    // Location filter
    if (filterLocation !== 'all') {
      filtered = filtered.filter(p => p.location === filterLocation);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'moisture':
          return a.moistureLevel - b.moistureLevel;
        case 'owner':
          return (a.owner || '').localeCompare(b.owner || '');
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        case 'recently-watered':
          return new Date(b.lastWatered || 0) - new Date(a.lastWatered || 0);
        default:
          return 0;
      }
    });

    setFilteredPlants(filtered);
  };

  const getHealthStatus = (moisture) => {
    if (moisture < 30) return { status: 'Critical', color: '#e74c3c', icon: '🔴' };
    if (moisture < 50) return { status: 'Warning', color: '#f39c12', icon: '🟡' };
    return { status: 'Healthy', color: '#27ae60', icon: '🟢' };
  };

  const getUniqueLocations = () => {
    const locations = new Set(plants.filter(p => p.location).map(p => p.location));
    return Array.from(locations).sort();
  };

  const getUniqueOwners = () => {
    const owners = {};
    plants.forEach(p => {
      const owner = p.owner || p.username || 'Unknown';
      owners[owner] = true;
    });
    return Object.keys(owners).sort();
  };

  const handleSelectPlant = (plantId) => {
    setSelectedPlants(prev =>
      prev.includes(plantId)
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPlants.length === filteredPlants.length) {
      setSelectedPlants([]);
    } else {
      setSelectedPlants(filteredPlants.map(p => p.id));
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction) {
      alert('Please select an action');
      return;
    }

    switch (bulkAction) {
      case 'water-all':
        const updatedPlants = plants.map(p =>
          selectedPlants.includes(p.id) ? { ...p, moistureLevel: 85 } : p
        );
        localStorage.setItem('plants', JSON.stringify(updatedPlants));
        setPlants(updatedPlants);
        applyFilters(updatedPlants);
        alert(`✅ Watered ${selectedPlants.length} plant(s)!`);
        break;
      case 'archive-plants':
        const archived = plants.filter(p => !selectedPlants.includes(p.id));
        localStorage.setItem('plants', JSON.stringify(archived));
        setPlants(archived);
        applyFilters(archived);
        alert(`✅ Archived ${selectedPlants.length} plant(s)!`);
        break;
      case 'export-data':
        const csvContent = [
          ['Plant Name', 'Owner', 'Location', 'Type', 'Moisture Level', 'Status', 'Last Watered'],
          ...selectedPlants.map(id => {
            const p = plants.find(x => x.id === id);
            const health = getHealthStatus(p.moistureLevel);
            return [p.name, p.owner || '-', p.location || '-', p.type || '-', p.moistureLevel + '%', health.status, p.lastWatered || '-'];
          })
        ]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
        element.setAttribute('download', `plants-export-${new Date().toISOString().split('T')[0]}.csv`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        alert(`✅ Exported ${selectedPlants.length} plant(s)!`);
        break;
      default:
        break;
    }

    setSelectedPlants([]);
    setBulkAction('');
    setShowBulkActions(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterHealth('all');
    setFilterOwner('all');
    setFilterLocation('all');
    setSortBy('name');
  };

  const getStats = () => {
    const critical = filteredPlants.filter(p => p.moistureLevel < 30).length;
    const warning = filteredPlants.filter(p => p.moistureLevel >= 30 && p.moistureLevel < 50).length;
    const healthy = filteredPlants.filter(p => p.moistureLevel >= 50).length;
    return { critical, warning, healthy };
  };

  const stats = getStats();

  return (
    <div className="admin-page-wrapper">
      <AdminSidebar currentUser={currentUser} onLogout={() => {}} />
      <div className="all-users-plants-page enhanced">
      <header className="all-users-plants-header">
        <h1>🌍 All Users' Plants</h1>
        <p>Comprehensive plant inventory and management dashboard</p>
      </header>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-box critical-stat">
          <span className="stat-number">{stats.critical}</span>
          <span className="stat-label">Critical</span>
        </div>
        <div className="stat-box warning-stat">
          <span className="stat-number">{stats.warning}</span>
          <span className="stat-label">Warning</span>
        </div>
        <div className="stat-box healthy-stat">
          <span className="stat-number">{stats.healthy}</span>
          <span className="stat-label">Healthy</span>
        </div>
        <div className="stat-box total-stat">
          <span className="stat-number">{filteredPlants.length}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search plants, owners, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select value={filterHealth} onChange={(e) => setFilterHealth(e.target.value)} className="filter-select">
            <option value="all">All Health Status</option>
            <option value="healthy">🟢 Healthy</option>
            <option value="warning">🟡 Warning</option>
            <option value="critical">🔴 Critical</option>
          </select>

          <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="filter-select">
            <option value="all">All Owners</option>
            {getUniqueOwners().map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>

          <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="filter-select">
            <option value="all">All Locations</option>
            {getUniqueLocations().map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
            <option value="name">Sort by Name</option>
            <option value="moisture">Sort by Moisture (Low → High)</option>
            <option value="owner">Sort by Owner</option>
            <option value="location">Sort by Location</option>
            <option value="recently-watered">Sort by Recently Watered</option>
          </select>
        </div>

        <div className="action-buttons">
          <button
            className="view-toggle"
            onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            title="Toggle view mode"
          >
            {viewMode === 'table' ? '⊞ Card View' : '≡ Table View'}
          </button>

          {(searchTerm || filterHealth !== 'all' || filterOwner !== 'all' || filterLocation !== 'all' || sortBy !== 'name') && (
            <button className="reset-btn" onClick={clearFilters}>
              🔄 Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPlants.length > 0 && (
        <div className="bulk-actions-panel">
          <span>{selectedPlants.length} selected</span>
          <div className="bulk-controls">
            <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
              <option value="">Select action...</option>
              <option value="water-all">💧 Water Selected</option>
              <option value="archive-plants">📦 Archive Selected</option>
              <option value="export-data">📥 Export as CSV</option>
            </select>
            <button className="btn-execute" onClick={handleBulkAction} disabled={!bulkAction}>
              Execute
            </button>
            <button className="btn-clear" onClick={() => {setSelectedPlants([]); setBulkAction('');}}>
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {filteredPlants.length === 0 ? (
        <div className="no-results">
          <p>📭 No plants found matching your filters</p>
          <button className="reset-btn" onClick={clearFilters}>Reset Filters</button>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <div className="table-view-container">
              <table className="plants-table enhanced-table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" checked={selectedPlants.length === filteredPlants.length} onChange={handleSelectAll} />
                    </th>
                    <th>Plant Name</th>
                    <th>Owner</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Moisture</th>
                    <th>Health</th>
                    <th>Last Watered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlants.map(plant => {
                    const health = getHealthStatus(plant.moistureLevel);
                    return (
                      <tr key={plant.id} className={`plant-row health-${filterHealth === 'all' ? health.status.toLowerCase() : filterHealth}`}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedPlants.includes(plant.id)}
                            onChange={() => handleSelectPlant(plant.id)}
                          />
                        </td>
                        <td className="plant-name">{plant.name}</td>
                        <td className="plant-owner">{plant.owner || 'Unknown'}</td>
                        <td className="plant-location">{plant.location || '-'}</td>
                        <td className="plant-type">{plant.type || '-'}</td>
                        <td className="plant-moisture">
                          <div className="moisture-bar">
                            <div className="moisture-fill" style={{width: `${plant.moistureLevel}%`, background: health.color}} />
                          </div>
                          <span>{plant.moistureLevel}%</span>
                        </td>
                        <td>
                          <span className="health-badge" style={{background: health.color}}>
                            {health.icon} {health.status}
                          </span>
                        </td>
                        <td className="last-watered">
                          {plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card-view-container">
              {filteredPlants.map(plant => {
                const health = getHealthStatus(plant.moistureLevel);
                return (
                  <div key={plant.id} className="plant-card" style={{borderLeft: `4px solid ${health.color}`}}>
                    <div className="card-header">
                      <h3>{plant.name}</h3>
                      <span className="health-badge" style={{background: health.color}}>
                        {health.icon} {health.status}
                      </span>
                    </div>
                    <div className="card-content">
                      <p><strong>Owner:</strong> {plant.owner || 'Unknown'}</p>
                      <p><strong>Location:</strong> {plant.location || '-'}</p>
                      <p><strong>Type:</strong> {plant.type || '-'}</p>
                      <div className="moisture-info">
                        <strong>Moisture Level:</strong>
                        <div className="moisture-bar">
                          <div className="moisture-fill" style={{width: `${plant.moistureLevel}%`, background: health.color}} />
                        </div>
                        <span>{plant.moistureLevel}%</span>
                      </div>
                      <p><strong>Last Watered:</strong> {plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : 'Never'}</p>
                    </div>
                    <input
                      type="checkbox"
                      className="card-checkbox"
                      checked={selectedPlants.includes(plant.id)}
                      onChange={() => handleSelectPlant(plant.id)}
                      title="Select for bulk actions"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default AllUsersPlants;
