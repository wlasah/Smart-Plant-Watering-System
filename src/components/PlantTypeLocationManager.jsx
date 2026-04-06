import React, { useState, useEffect } from 'react';
import '../styles/PlantTypeLocationManager.css';

const API_BASE_URL = 'http://localhost:8000/api';

const PlantTypeLocationManager = () => {
  const [plantTypes, setPlantTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activeTab, setActiveTab] = useState('plant-types');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editingLocationId, setEditingLocationId] = useState(null);

  const [typeFormData, setTypeFormData] = useState({
    name: '',
    watering_frequency: 'weekly',
    light_requirement: 'moderate',
    temp_range: '18-24',
    humidity: 'moderate',
    soil_type: 'well-draining',
    common_issues: '',
    care_instructions: ''
  });

  const [locationFormData, setLocationFormData] = useState({
    name: '',
    light_level: 'moderate',
    humidity: 'moderate',
    temperature: 20,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      };

      const [typesRes, locationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/plant-types/`, { headers }),
        fetch(`${API_BASE_URL}/locations/`, { headers })
      ]);

      if (!typesRes.ok || !locationsRes.ok) throw new Error('Failed to fetch data');
      
      const typesData = await typesRes.json();
      const locationsData = await locationsRes.json();
      
      setPlantTypes(Array.isArray(typesData) ? typesData : typesData.results || []);
      setLocations(Array.isArray(locationsData) ? locationsData : locationsData.results || []);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddOrUpdateType = async () => {
    if (!typeFormData.name) {
      setError('Please fill in the type name');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const method = editingTypeId ? 'PATCH' : 'POST';
      const url = editingTypeId 
        ? `${API_BASE_URL}/plant-types/${editingTypeId}/`
        : `${API_BASE_URL}/plant-types/`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(typeFormData)
      });

      if (!response.ok) throw new Error('Failed to save plant type');
      
      setMessage(editingTypeId ? 'âœ… Plant type updated!' : 'âœ… Plant type created!');
      setTimeout(() => setMessage(''), 3000);
      
      fetchData();
      resetTypeForm();
    } catch (err) {
      console.error('Error saving plant type:', err);
      setError('Failed to save plant type');
    } finally {
      setSaving(false);
    }
  };

  const resetTypeForm = () => {
    setTypeFormData({
      name: '',
      watering_frequency: 'weekly',
      light_requirement: 'moderate',
      temp_range: '18-24',
      humidity: 'moderate',
      soil_type: 'well-draining',
      common_issues: '',
      care_instructions: ''
    });
    setEditingTypeId(null);
    setShowTypeForm(false);
  };

  const handleEditType = (type) => {
    setTypeFormData(type);
    setEditingTypeId(type.id);
    setShowTypeForm(true);
  };

  const handleDeleteType = async (id) => {
    if (!window.confirm('Delete this plant type? Plants with this type will not be affected.')) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/plant-types/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete plant type');
      
      setMessage('âœ… Plant type deleted!');
      setTimeout(() => setMessage(''), 3000);
      fetchData();
    } catch (err) {
      console.error('Error deleting plant type:', err);
      setError('Failed to delete plant type');
    } finally {
      setSaving(false);
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

  const handleAddOrUpdateLocation = async () => {
    if (!locationFormData.name) {
      setError('Please fill in the location name');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const method = editingLocationId ? 'PATCH' : 'POST';
      const url = editingLocationId 
        ? `${API_BASE_URL}/locations/${editingLocationId}/`
        : `${API_BASE_URL}/locations/`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationFormData)
      });

      if (!response.ok) throw new Error('Failed to save location');
      
      setMessage(editingLocationId ? 'âœ… Location updated!' : 'âœ… Location created!');
      setTimeout(() => setMessage(''), 3000);
      
      fetchData();
      resetLocationForm();
    } catch (err) {
      console.error('Error saving location:', err);
      setError('Failed to save location');
    } finally {
      setSaving(false);
    }
  };

  const resetLocationForm = () => {
    setLocationFormData({
      name: '',
      light_level: 'moderate',
      humidity: 'moderate',
      temperature: 20,
      description: ''
    });
    setEditingLocationId(null);
    setShowLocationForm(false);
  };

  const handleEditLocation = (location) => {
    setLocationFormData(location);
    setEditingLocationId(location.id);
    setShowLocationForm(true);
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm('Delete this location? Plants in this location will not be affected.')) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/locations/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete location');
      
      setMessage('âœ… Location deleted!');
      setTimeout(() => setMessage(''), 3000);
      fetchData();
    } catch (err) {
      console.error('Error deleting location:', err);
      setError('Failed to delete location');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="plant-type-location-manager">
      <header className="manager-header">
        <h2>🌱 Plant Type & Location Manager</h2>
        <p>Define plant care requirements and manage growing locations</p>
      </header>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

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
      </div>

      {/* Plant Types Tab */}
      {activeTab === 'plant-types' && (
        <div className="tab-content">
          {showTypeForm && (
            <div className="form-container">
              <div className="form-card">
                <h3>{editingTypeId ? 'Edit Plant Type' : 'Create New Plant Type'}</h3>
                
                <div className="form-group">
                  <label>Plant Type Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={typeFormData.name}
                    onChange={handleTypeInputChange}
                    placeholder="e.g., Succulents, Ferns, Tropical"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Watering Frequency</label>
                    <select name="watering_frequency" value={typeFormData.watering_frequency} onChange={handleTypeInputChange}>
                      {frequencyOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Light Requirement</label>
                    <select name="light_requirement" value={typeFormData.light_requirement} onChange={handleTypeInputChange}>
                      {lightOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Temperature Range</label>
                    <input
                      type="text"
                      name="temp_range"
                      value={typeFormData.temp_range}
                      onChange={handleTypeInputChange}
                      placeholder="e.g., 18-24°C"
                    />
                  </div>

                  <div className="form-group">
                    <label>Humidity Level</label>
                    <select name="humidity" value={typeFormData.humidity} onChange={handleTypeInputChange}>
                      {humidityOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Soil Type</label>
                    <input
                      type="text"
                      name="soil_type"
                      value={typeFormData.soil_type}
                      onChange={handleTypeInputChange}
                      placeholder="e.g., well-draining, loamy"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Common Issues</label>
                  <textarea
                    name="common_issues"
                    value={typeFormData.common_issues}
                    onChange={handleTypeInputChange}
                    placeholder="Common problems with this plant type"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Care Instructions</label>
                  <textarea
                    name="care_instructions"
                    value={typeFormData.care_instructions}
                    onChange={handleTypeInputChange}
                    placeholder="Detailed care instructions"
                    rows="4"
                  />
                </div>

                <div className="form-buttons">
                  <button className="btn-primary" onClick={handleAddOrUpdateType} disabled={saving}>
                    {saving ? 'Saving...' : (editingTypeId ? '✏️ Update Type' : '➕ Create Type')}
                  </button>
                  <button className="btn-secondary" onClick={resetTypeForm}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="list-container">
            {!showTypeForm && (
              <button className="btn-new" onClick={() => setShowTypeForm(true)}>
                ➕ Create New Plant Type
              </button>
            )}

            <div className="items-list">
              {plantTypes.length === 0 ? (
                <div className="no-items"><p>No plant types yet. Create one to get started!</p></div>
              ) : (
                plantTypes.map(type => (
                  <div key={type.id} className="item-card">
                    <h4>{type.name}</h4>
                    <div className="item-details">
                      <div><strong>🚿 Watering:</strong> {type.watering_frequency}</div>
                      <div><strong>☀️ Light:</strong> {type.light_requirement}</div>
                      <div><strong>🌡️ Temp:</strong> {type.temp_range}</div>
                      <div><strong>💧 Humidity:</strong> {type.humidity}</div>
                      <div><strong>🪴 Soil:</strong> {type.soil_type}</div>
                    </div>
                    {type.care_instructions && (
                      <div className="care-instructions"><strong>📋 Care:</strong> {type.care_instructions}</div>
                    )}
                    <div className="item-actions">
                      <button className="btn-edit" onClick={() => handleEditType(type)}>✏️ Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteType(type.id)} disabled={saving}>🗑️ Delete</button>
                    </div>
                  </div>
                ))
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
                
                <div className="form-group">
                  <label>Location Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={locationFormData.name}
                    onChange={handleLocationInputChange}
                    placeholder="e.g., Living Room, Office, Bedroom"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Light Level</label>
                    <select name="light_level" value={locationFormData.light_level} onChange={handleLocationInputChange}>
                      {lightOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Humidity</label>
                    <select name="humidity" value={locationFormData.humidity} onChange={handleLocationInputChange}>
                      {humidityOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Temperature (°C)</label>
                    <input
                      type="number"
                      name="temperature"
                      value={locationFormData.temperature}
                      onChange={handleLocationInputChange}
                      min="0"
                      max="40"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={locationFormData.description}
                    onChange={handleLocationInputChange}
                    placeholder="Location details and special characteristics"
                    rows="3"
                  />
                </div>

                <div className="form-buttons">
                  <button className="btn-primary" onClick={handleAddOrUpdateLocation} disabled={saving}>
                    {saving ? 'Saving...' : (editingLocationId ? '✏️ Update Location' : '➕ Create Location')}
                  </button>
                  <button className="btn-secondary" onClick={resetLocationForm}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="list-container">
            {!showLocationForm && (
              <button className="btn-new" onClick={() => setShowLocationForm(true)}>
                ➕ Create New Location
              </button>
            )}

            <div className="items-list">
              {locations.length === 0 ? (
                <div className="no-items"><p>No locations yet. Create one to get started!</p></div>
              ) : (
                locations.map(location => (
                  <div key={location.id} className="item-card">
                    <h4>{location.name}</h4>
                    <div className="item-details">
                      <div><strong>☀️ Light:</strong> {location.light_level}</div>
                      <div><strong>💧 Humidity:</strong> {location.humidity}</div>
                      <div><strong>🌡️ Temperature:</strong> {location.temperature}°C</div>
                    </div>
                    {location.description && (
                      <div className="description"><strong>📝:</strong> {location.description}</div>
                    )}
                    <div className="item-actions">
                      <button className="btn-edit" onClick={() => handleEditLocation(location)}>✏️ Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteLocation(location.id)} disabled={saving}>🗑️ Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantTypeLocationManager;
