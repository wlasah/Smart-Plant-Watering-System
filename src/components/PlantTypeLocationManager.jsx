import React, { useState, useEffect } from 'react';
import '../styles/PlantTypeLocationManager.css';

const PlantTypeLocationManager = () => {
  const [plantTypes, setPlantTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [plants, setPlants] = useState([]);
  const [activeTab, setActiveTab] = useState('plant-types');
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editingLocationId, setEditingLocationId] = useState(null);

  const [typeFormData, setTypeFormData] = useState({
    name: '',
    wateringFrequency: 'weekly',
    lightRequirement: 'moderate',
    tempRange: '18-24',
    humidity: 'moderate',
    soilType: 'well-draining',
    commonIssues: '',
    careInstructions: ''
  });

  const [locationFormData, setLocationFormData] = useState({
    name: '',
    lightLevel: 'moderate',
    humidity: 'moderate',
    temperature: '20',
    description: ''
  });

  useEffect(() => {
    // Load data from localStorage
    const savedTypes = localStorage.getItem('plantTypes');
    if (savedTypes) {
      setPlantTypes(JSON.parse(savedTypes));
    } else {
      // Initialize with default types
      const defaultTypes = [
        {
          id: 1,
          name: 'Succulent',
          wateringFrequency: 'bi-weekly',
          lightRequirement: 'bright',
          tempRange: '15-25',
          humidity: 'low',
          soilType: 'well-draining',
          commonIssues: 'Root rot from overwatering',
          careInstructions: 'Let soil dry between waterings. Bright sunlight. Minimal watering.'
        },
        {
          id: 2,
          name: 'Fern',
          wateringFrequency: 'twice-weekly',
          lightRequirement: 'indirect',
          tempRange: '16-22',
          humidity: 'high',
          soilType: 'moist',
          commonIssues: 'Brown fronds from dry air',
          careInstructions: 'Keep soil consistently moist. High humidity. Indirect light.'
        },
        {
          id: 3,
          name: 'Tropical',
          wateringFrequency: 'weekly',
          lightRequirement: 'bright-indirect',
          tempRange: '20-25',
          humidity: 'high',
          soilType: 'well-draining',
          commonIssues: 'Leaf drop from temperature stress',
          careInstructions: 'Warm temperature. High humidity. Regular watering. No direct sun.'
        }
      ];
      setPlantTypes(defaultTypes);
      localStorage.setItem('plantTypes', JSON.stringify(defaultTypes));
    }

    const savedLocations = localStorage.getItem('locations');
    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    } else {
      // Initialize with default locations
      const defaultLocations = [
        {
          id: 1,
          name: 'Living Room',
          lightLevel: 'bright-indirect',
          humidity: 'moderate',
          temperature: '21',
          description: 'South-facing window with filtered light'
        },
        {
          id: 2,
          name: 'Bathroom',
          lightLevel: 'indirect',
          humidity: 'high',
          temperature: '22',
          description: 'North window, naturally humid from showers'
        },
        {
          id: 3,
          name: 'Office',
          lightLevel: 'moderate',
          humidity: 'low',
          temperature: '20',
          description: 'Artificial lighting, air conditioning'
        }
      ];
      setLocations(defaultLocations);
      localStorage.setItem('locations', JSON.stringify(defaultLocations));
    }

    const plantsData = JSON.parse(localStorage.getItem('plants')) || [];
    setPlants(plantsData);
  }, []);

  const lightOptions = ['low', 'indirect', 'moderate', 'bright-indirect', 'bright', 'direct'];
  const humidityOptions = ['low', 'moderate', 'high', 'very-high'];
  const frequencyOptions = ['daily', 'twice-weekly', 'weekly', 'bi-weekly', 'monthly'];

  // Plant Type Functions
  const handleTypeInputChange = (e) => {
    const { name, value } = e.target;
    setTypeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddOrUpdateType = () => {
    if (!typeFormData.name) {
      alert('Please fill in the type name');
      return;
    }

    if (editingTypeId) {
      setPlantTypes(prev =>
        prev.map(t => t.id === editingTypeId ? { ...typeFormData, id: editingTypeId } : t)
      );
      setEditingTypeId(null);
    } else {
      const newType = {
        ...typeFormData,
        id: Date.now()
      };
      setPlantTypes(prev => [newType, ...prev]);
    }

    localStorage.setItem('plantTypes', JSON.stringify(plantTypes));
    resetTypeForm();
  };

  const resetTypeForm = () => {
    setTypeFormData({
      name: '',
      wateringFrequency: 'weekly',
      lightRequirement: 'moderate',
      tempRange: '18-24',
      humidity: 'moderate',
      soilType: 'well-draining',
      commonIssues: '',
      careInstructions: ''
    });
    setShowTypeForm(false);
  };

  const handleEditType = (type) => {
    setTypeFormData(type);
    setEditingTypeId(type.id);
    setShowTypeForm(true);
  };

  const handleDeleteType = (id) => {
    if (window.confirm('Delete this plant type? Plants with this type will not be affected.')) {
      setPlantTypes(prev => prev.filter(t => t.id !== id));
      localStorage.setItem('plantTypes', JSON.stringify(plantTypes));
    }
  };

  // Location Functions
  const handleLocationInputChange = (e) => {
    const { name, value } = e.target;
    setLocationFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddOrUpdateLocation = () => {
    if (!locationFormData.name) {
      alert('Please fill in the location name');
      return;
    }

    if (editingLocationId) {
      setLocations(prev =>
        prev.map(l => l.id === editingLocationId ? { ...locationFormData, id: editingLocationId } : l)
      );
      setEditingLocationId(null);
    } else {
      const newLocation = {
        ...locationFormData,
        id: Date.now()
      };
      setLocations(prev => [newLocation, ...prev]);
    }

    localStorage.setItem('locations', JSON.stringify(locations));
    resetLocationForm();
  };

  const resetLocationForm = () => {
    setLocationFormData({
      name: '',
      lightLevel: 'moderate',
      humidity: 'moderate',
      temperature: '20',
      description: ''
    });
    setShowLocationForm(false);
  };

  const handleEditLocation = (location) => {
    setLocationFormData(location);
    setEditingLocationId(location.id);
    setShowLocationForm(true);
  };

  const handleDeleteLocation = (id) => {
    if (window.confirm('Delete this location? Plants in this location will not be affected.')) {
      setLocations(prev => prev.filter(l => l.id !== id));
      localStorage.setItem('locations', JSON.stringify(locations));
    }
  };

  // Insights Functions
  const getLocationStats = (location) => {
    const plantsInLocation = plants.filter(p => p.location === location.name);
    const healthyPlants = plantsInLocation.filter(p => p.moistureLevel >= 50).length;
    const criticalPlants = plantsInLocation.filter(p => p.moistureLevel < 30).length;

    return {
      total: plantsInLocation.length,
      healthy: healthyPlants,
      critical: criticalPlants
    };
  };

  const getTypeStats = (type) => {
    const plantsOfType = plants.filter(p => p.type === type.name);
    const healthyPlants = plantsOfType.filter(p => p.moistureLevel >= 50).length;
    const criticalPlants = plantsOfType.filter(p => p.moistureLevel < 30).length;

    return {
      total: plantsOfType.length,
      healthy: healthyPlants,
      critical: criticalPlants
    };
  };

  const getMostNeglectedLocation = () => {
    if (locations.length === 0) return null;

    const stats = locations.map(loc => ({
      ...loc,
      stats: getLocationStats(loc)
    }));

    const neglected = stats.reduce((prev, curr) =>
      (curr.stats.critical > prev.stats.critical) ? curr : prev
    );

    return neglected.stats.critical > 0 ? neglected : null;
  };

  return (
    <div className="plant-type-location-manager">
      <header className="manager-header">
        <h2>🌱 Plant Type & Location Manager</h2>
        <p>Define plant care requirements and manage growing locations</p>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'plant-types' ? 'active' : ''}`}
          onClick={() => setActiveTab('plant-types')}
        >
          🌿 Plant Types
        </button>
        <button
          className={`tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
          onClick={() => setActiveTab('locations')}
        >
          📍 Locations
        </button>
        <button
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          📊 Insights
        </button>
      </div>

      {/* Plant Types Tab */}
      {activeTab === 'plant-types' && (
        <div className="tab-content">
          {showTypeForm && (
            <div className="form-container">
              <div className="form-card">
                <h3>{editingTypeId ? 'Edit Plant Type' : 'Create New Plant Type'}</h3>

                <div className="form-grid-2col">
                  <div className="form-group">
                    <label>Type Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={typeFormData.name}
                      onChange={handleTypeInputChange}
                      placeholder="e.g., Succulent, Fern"
                    />
                  </div>

                  <div className="form-group">
                    <label>Watering Frequency</label>
                    <select
                      name="wateringFrequency"
                      value={typeFormData.wateringFrequency}
                      onChange={handleTypeInputChange}
                    >
                      {frequencyOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Light Requirement</label>
                    <select
                      name="lightRequirement"
                      value={typeFormData.lightRequirement}
                      onChange={handleTypeInputChange}
                    >
                      {lightOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.replace('-', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Temperature Range (°C)</label>
                    <input
                      type="text"
                      name="tempRange"
                      value={typeFormData.tempRange}
                      onChange={handleTypeInputChange}
                      placeholder="e.g., 18-24"
                    />
                  </div>

                  <div className="form-group">
                    <label>Humidity Level</label>
                    <select
                      name="humidity"
                      value={typeFormData.humidity}
                      onChange={handleTypeInputChange}
                    >
                      {humidityOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Soil Type</label>
                    <input
                      type="text"
                      name="soilType"
                      value={typeFormData.soilType}
                      onChange={handleTypeInputChange}
                      placeholder="e.g., Well-draining, Moist"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Care Instructions</label>
                  <textarea
                    name="careInstructions"
                    value={typeFormData.careInstructions}
                    onChange={handleTypeInputChange}
                    placeholder="Detailed care instructions for this plant type"
                    rows="4"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Common Issues</label>
                  <textarea
                    name="commonIssues"
                    value={typeFormData.commonIssues}
                    onChange={handleTypeInputChange}
                    placeholder="Common problems and how to identify them"
                    rows="3"
                  />
                </div>

                <div className="form-buttons">
                  <button className="btn-primary" onClick={handleAddOrUpdateType}>
                    {editingTypeId ? '✏️ Update' : '➕ Create'}
                  </button>
                  <button className="btn-secondary" onClick={resetTypeForm}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="content-section">
            {!showTypeForm && (
              <button className="btn-new-item" onClick={() => setShowTypeForm(true)}>
                ➕ Add Plant Type
              </button>
            )}

            <div className="items-grid">
              {plantTypes.length === 0 ? (
                <div className="no-items">No plant types yet</div>
              ) : (
                plantTypes.map(type => {
                  const stats = getTypeStats(type);
                  return (
                    <div key={type.id} className="item-card">
                      <h4>{type.name}</h4>

                      <div className="stats-row">
                        <span className="stat-badge">🌱 {stats.total} plants</span>
                        <span className={`stat-badge ${stats.critical > 0 ? 'critical' : ''}`}>
                          ⚠️ {stats.critical} critical
                        </span>
                      </div>

                      <div className="care-details">
                        <p><strong>💧 Watering:</strong> {type.wateringFrequency}</p>
                        <p><strong>☀️ Light:</strong> {type.lightRequirement.replace('-', ' ')}</p>
                        <p><strong>🌡️ Temp:</strong> {type.tempRange}°C</p>
                        <p><strong>💨 Humidity:</strong> {type.humidity}</p>
                        <p><strong>🌍 Soil:</strong> {type.soilType}</p>
                      </div>

                      {type.careInstructions && (
                        <div className="care-box">
                          <strong>📝 Care:</strong>
                          <p>{type.careInstructions}</p>
                        </div>
                      )}

                      {type.commonIssues && (
                        <div className="issues-box">
                          <strong>⚠️ Issues:</strong>
                          <p>{type.commonIssues}</p>
                        </div>
                      )}

                      <div className="item-actions">
                        <button className="btn-edit" onClick={() => handleEditType(type)}>
                          ✏️ Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteType(type.id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="tab-content">
          {showLocationForm && (
            <div className="form-container">
              <div className="form-card">
                <h3>{editingLocationId ? 'Edit Location' : 'Create New Location'}</h3>

                <div className="form-grid-2col">
                  <div className="form-group full-width">
                    <label>Location Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={locationFormData.name}
                      onChange={handleLocationInputChange}
                      placeholder="e.g., Living Room, Bedroom"
                    />
                  </div>

                  <div className="form-group">
                    <label>Light Level</label>
                    <select
                      name="lightLevel"
                      value={locationFormData.lightLevel}
                      onChange={handleLocationInputChange}
                    >
                      {lightOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.replace('-', ' ').toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Humidity Level</label>
                    <select
                      name="humidity"
                      value={locationFormData.humidity}
                      onChange={handleLocationInputChange}
                    >
                      {humidityOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Average Temperature (°C)</label>
                    <input
                      type="number"
                      name="temperature"
                      value={locationFormData.temperature}
                      onChange={handleLocationInputChange}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={locationFormData.description}
                    onChange={handleLocationInputChange}
                    placeholder="Describe the location, e.g., 'South-facing window with direct afternoon sun'"
                    rows="3"
                  />
                </div>

                <div className="form-buttons">
                  <button className="btn-primary" onClick={handleAddOrUpdateLocation}>
                    {editingLocationId ? '✏️ Update' : '➕ Create'}
                  </button>
                  <button className="btn-secondary" onClick={resetLocationForm}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="content-section">
            {!showLocationForm && (
              <button className="btn-new-item" onClick={() => setShowLocationForm(true)}>
                ➕ Add Location
              </button>
            )}

            <div className="items-grid">
              {locations.length === 0 ? (
                <div className="no-items">No locations yet</div>
              ) : (
                locations.map(location => {
                  const stats = getLocationStats(location);
                  return (
                    <div key={location.id} className="item-card">
                      <h4>📍 {location.name}</h4>

                      <div className="stats-row">
                        <span className="stat-badge">🌱 {stats.total} plants</span>
                        <span className={`stat-badge ${stats.critical > 0 ? 'critical' : ''}`}>
                          ⚠️ {stats.critical} critical
                        </span>
                      </div>

                      <div className="care-details">
                        <p><strong>☀️ Light:</strong> {location.lightLevel.replace('-', ' ')}</p>
                        <p><strong>💨 Humidity:</strong> {location.humidity}</p>
                        <p><strong>🌡️ Temp:</strong> {location.temperature}°C</p>
                      </div>

                      {location.description && (
                        <div className="description-box">
                          <p>{location.description}</p>
                        </div>
                      )}

                      <div className="item-actions">
                        <button className="btn-edit" onClick={() => handleEditLocation(location)}>
                          ✏️ Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteLocation(location.id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="tab-content insights-content">
          <div className="insights-grid">
            {/* Most Neglected Location */}
            <div className="insight-card warning">
              <h3>⚠️ Most Neglected Location</h3>
              <div className="insight-content">
                {getMostNeglectedLocation() ? (
                  <>
                    <p className="insight-value">{getMostNeglectedLocation().name}</p>
                    <p className="insight-detail">
                      {getMostNeglectedLocation().stats.critical} plants below critical moisture
                    </p>
                    <p className="insight-hint">
                      Light: {getMostNeglectedLocation().lightLevel.replace('-', ' ')} | 
                      Humidity: {getMostNeglectedLocation().humidity}
                    </p>
                  </>
                ) : (
                  <p className="insight-detail">All locations are healthy!</p>
                )}
              </div>
            </div>

            {/* Plant Type with Most Plants */}
            <div className="insight-card info">
              <h3>📊 Most Common Plant Type</h3>
              <div className="insight-content">
                {plantTypes.length > 0 && plants.length > 0 ? (
                  (() => {
                    const typeStats = plantTypes.map(t => ({
                      ...t,
                      count: plants.filter(p => p.type === t.name).length
                    })).filter(t => t.count > 0).sort((a, b) => b.count - a.count)[0];

                    return typeStats ? (
                      <>
                        <p className="insight-value">{typeStats.name}</p>
                        <p className="insight-detail">{typeStats.count} plants of this type</p>
                        <p className="insight-hint">Watering: {typeStats.wateringFrequency}</p>
                      </>
                    ) : (
                      <p className="insight-detail">No plants assigned yet</p>
                    );
                  })()
                ) : (
                  <p className="insight-detail">No data available</p>
                )}
              </div>
            </div>

            {/* Overall Health */}
            <div className="insight-card success">
              <h3>🌿 System Health</h3>
              <div className="insight-content">
                {plants.length > 0 ? (
                  (() => {
                    const critical = plants.filter(p => p.moistureLevel < 30).length;
                    const healthy = plants.filter(p => p.moistureLevel >= 50).length;
                    const healthRate = Math.round((healthy / plants.length) * 100);

                    return (
                      <>
                        <p className="insight-value">{healthRate}% Healthy</p>
                        <p className="insight-detail">{healthy}/{plants.length} plants in good condition</p>
                        <p className="insight-hint">{critical} plants need attention</p>
                      </>
                    );
                  })()
                ) : (
                  <p className="insight-detail">No plants in system</p>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="statistics-section">
            <h3>📈 Detailed Statistics</h3>

            <div className="stats-grid">
              <div className="stats-card">
                <h4>By Location</h4>
                {locations.length === 0 ? (
                  <p>No locations</p>
                ) : (
                  <ul className="stats-list">
                    {locations.map(location => {
                      const stats = getLocationStats(location);
                      return (
                        <li key={location.id}>
                          <span>{location.name}</span>
                          <span className="stats-value">
                            {stats.total} | {stats.healthy}🟢 {stats.critical}🔴
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="stats-card">
                <h4>By Plant Type</h4>
                {plantTypes.length === 0 ? (
                  <p>No plant types</p>
                ) : (
                  <ul className="stats-list">
                    {plantTypes.map(type => {
                      const stats = getTypeStats(type);
                      return (
                        <li key={type.id}>
                          <span>{type.name}</span>
                          <span className="stats-value">
                            {stats.total} | {stats.healthy}🟢 {stats.critical}🔴
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantTypeLocationManager;
