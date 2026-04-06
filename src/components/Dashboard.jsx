import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './StatsCard';
import AddPlantForm from './AddPlantForm';
import '../styles/Dashboard.css';
import { useDashboard } from '../hooks/useDashboard';
import { plantsAPI } from '../services/api';

const Dashboard = ({ 
  onNotification,
}) => {
  const navigate = useNavigate();
  const {
    plants,
    setPlants,
    loading,
    error,
    isFormOpen,
    setIsFormOpen,
  } = useDashboard();

  // Calculate statistics - DYNAMIC based on moisture level
  const stats = useMemo(() => {
    const avgMoisture = plants.length > 0
      ? Math.round(plants.reduce((sum, plant) => sum + plant.moistureLevel, 0) / plants.length)
      : 0;
    const healthyCount = plants.filter(p => p.moistureLevel >= 50).length;
    const needsAttentionCount = plants.filter(p => p.moistureLevel < 50).length;
    
    return {
      avgMoisture,
      healthyCount,
      needsAttentionCount,
      total: plants.length
    };
  }, [plants]);

  // Get plants needing attention (sorted by lowest moisture first)
  const plantsNeedingAttention = useMemo(() => {
    return plants
      .filter(p => p.moistureLevel < 50)
      .sort((a, b) => a.moistureLevel - b.moistureLevel)
      .slice(0, 5);
  }, [plants]);

  // Get recently added plants
  const recentlyAddedPlants = useMemo(() => {
    return plants
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }, [plants]);

  // Get recently watered plants
  const recentlyWatered = useMemo(() => {
    return plants
      .filter(p => p.lastWatered)
      .sort((a, b) => new Date(b.lastWatered) - new Date(a.lastWatered))
      .slice(0, 5);
  }, [plants]);

  const handlePlantAdded = async (newPlant) => {
    try {
      // Refetch all plants from backend to ensure consistency
      const data = await plantsAPI.getAllPlants();
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
      setIsFormOpen(false);
      
      if (onNotification) {
        onNotification(`🌱 ${newPlant.name} added successfully!`, 'success');
      }
    } catch (err) {
      console.error('Error adding plant:', err);
      if (onNotification) {
        onNotification(`❌ Failed to add plant: ${err.message}`, 'error');
      }
    }
  };

  const handleWaterPlant = async (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    try {
      const result = await plantsAPI.waterPlant(plantId, 'Watered from dashboard');
      
      // Update local state with new data
      const updatedPlant = {
        ...plant,
        moistureLevel: result.plant.moisture,
        lastWatered: result.plant.last_watered,
      };
      
      setPlants(prevPlants =>
        prevPlants.map(p => p.id === plantId ? updatedPlant : p)
      );

      if (onNotification) {
        onNotification(`💧 ${plant.name} watered! Moisture: ${result.plant.moisture}%`, 'success');
      }
    } catch (err) {
      console.error('Error watering plant:', err);
      if (onNotification) {
        onNotification(`❌ Failed to water plant: ${err.message}`, 'error');
      }
    }
  };

  const getMoistureColor = (level) => {
    if (level >= 75) return '#10b981';
    if (level >= 50) return '#3b82f6';
    if (level >= 25) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🌿 Smart Plant Watering System</h1>
          <p>Welcome! Here's your plant system overview</p>
        </div>
        <button 
          className="btn-add-plant"
          onClick={() => setIsFormOpen(true)}
          title="Add a new plant"
        >
          ➕ Add Plant
        </button>
      </header>

      <AddPlantForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onPlantAdded={handlePlantAdded}
      />

      {loading && (
        <div className="loading-message">
          <p>Loading plants data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && (
        <>
          {/* System Overview Statistics */}
          <section className="system-overview">
            <StatsCard 
              title="Total Plants" 
              value={stats.total}
              icon="🌱"
            />
            <StatsCard 
              title="Healthy Plants" 
              value={stats.healthyCount}
              color="healthy"
              icon="✅"
            />
            <StatsCard 
              title="Need Attention" 
              value={stats.needsAttentionCount}
              color="attention"
              icon="⚠️"
            />
            <StatsCard 
              title="Avg Moisture" 
              value={`${stats.avgMoisture}%`}
              color="moisture"
              icon="💧"
            />
          </section>

          {stats.total > 0 ? (
            <>
              {/* Quick Actions */}
              <section className="quick-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => navigate('/plants-inventory')}
                >
                  📋 View All Plants ({stats.total})
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => navigate('/analytics')}
                >
                  📈 View Analytics
                </button>
              </section>

              {/* Plants Needing Attention */}
              {plantsNeedingAttention.length > 0 && (
                <section className="dashboard-section needs-attention">
                  <h2>⚠️ Plants Needing Attention</h2>
                  <div className="quick-list">
                    {plantsNeedingAttention.map(plant => (
                      <div key={plant.id} className="list-item alert-item">
                        <div className="item-info">
                          <h3>{plant.name}</h3>
                          <p className="item-meta">📍 {plant.location}</p>
                        </div>
                        <div className="item-moisture">
                          <div className="moisture-bar-small">
                            <div 
                              className="moisture-fill"
                              style={{
                                width: `${plant.moistureLevel}%`,
                                backgroundColor: getMoistureColor(plant.moistureLevel)
                              }}
                            />
                          </div>
                          <span className="moisture-value">{plant.moistureLevel}%</span>
                        </div>
                        <button 
                          className="list-action-btn"
                          onClick={() => handleWaterPlant(plant.id)}
                        >
                          💧 Water
                        </button>
                      </div>
                    ))}
                  </div>
                  {plantsNeedingAttention.length < stats.needsAttentionCount && (
                    <p className="view-more">
                      <button className="view-more-btn" onClick={() => navigate('/plants-inventory')}>
                        View all {stats.needsAttentionCount} plants needing attention →
                      </button>
                    </p>
                  )}
                </section>
              )}

              {/* Recently Added Plants */}
              {recentlyAddedPlants.length > 0 && (
                <section className="dashboard-section recent-added">
                  <h2>🌱 Recently Added</h2>
                  <div className="quick-list">
                    {recentlyAddedPlants.map(plant => (
                      <div key={plant.id} className="list-item">
                        <div className="item-info">
                          <h3>{plant.name}</h3>
                          <p className="item-meta">📍 {plant.location}</p>
                        </div>
                        <div className="item-status">
                          <span className={`status-badge ${plant.moistureLevel >= 50 ? 'healthy' : 'warning'}`}>
                            {plant.moistureLevel >= 50 ? '✓ Healthy' : '⚠ Needs Water'}
                          </span>
                          <span className="moisture-value">{plant.moistureLevel}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recently Watered */}
              {recentlyWatered.length > 0 && (
                <section className="dashboard-section recent-watered">
                  <h2>💧 Recently Watered</h2>
                  <div className="quick-list">
                    {recentlyWatered.map(plant => (
                      <div key={plant.id} className="list-item">
                        <div className="item-info">
                          <h3>{plant.name}</h3>
                          <p className="item-meta">
                            Last watered: {new Date(plant.lastWatered).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="item-moisture">
                          <div className="moisture-bar-small">
                            <div 
                              className="moisture-fill"
                              style={{
                                width: `${plant.moistureLevel}%`,
                                backgroundColor: getMoistureColor(plant.moistureLevel)
                              }}
                            />
                          </div>
                          <span className="moisture-value">{plant.moistureLevel}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="empty-state">
              <div className="empty-state-content">
                <p className="empty-icon">🌱</p>
                <h2>No plants yet</h2>
                <p>Add your first plant to get started with monitoring!</p>
                <button 
                  className="btn-add-plant"
                  onClick={() => setIsFormOpen(true)}
                >
                  ➕ Add Your First Plant
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default Dashboard;
