import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';

const PlantHealthTrends = ({ plants }) => {
  const [healthTrends, setHealthTrends] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    // Simulate health trend data (in real app, this would come from historical data)
    const trends = plants.map(plant => ({
      id: plant.id,
      name: plant.name,
      currentMoisture: plant.moistureLevel,
      trend: Math.random() > 0.5 ? 'improving' : 'declining', // Mock trend
      history: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)) // Mock 30 days of data
    }));
    setHealthTrends(trends);
  }, [plants]);

  const getHealthTrendData = (plantId) => {
    const plant = healthTrends.find(p => p.id === plantId);
    if (!plant) return [];

    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    return plant.history.slice(-days);
  };

  const getAverageHealthOverTime = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const averages = [];

    for (let i = 0; i < days; i++) {
      const dayValues = healthTrends.map(plant => plant.history[plant.history.length - days + i] || 0);
      const avg = dayValues.length > 0 ? dayValues.reduce((a, b) => a + b, 0) / dayValues.length : 0;
      averages.push(Math.round(avg));
    }

    return averages;
  };

  const healthCategories = {
    critical: plants.filter(p => p.moistureLevel < 30).length,
    warning: plants.filter(p => p.moistureLevel >= 30 && p.moistureLevel < 50).length,
    good: plants.filter(p => p.moistureLevel >= 50 && p.moistureLevel < 70).length,
    excellent: plants.filter(p => p.moistureLevel >= 70).length
  };

  return (
    <div className="plant-health-trends">
      <header className="analytics-header">
        <h2>🌱 Plant Health Trends</h2>
        <p>Monitor moisture levels and health patterns over time</p>
      </header>

      {/* Health Overview */}
      <section className="analytics-section">
        <h3>Current Health Status</h3>
        <div className="health-status-grid">
          <StatsCard 
            title="Excellent (70-100%)" 
            value={healthCategories.excellent}
            color="healthy"
            icon="🌟"
          />
          <StatsCard 
            title="Good (50-70%)" 
            value={healthCategories.good}
            color="moisture"
            icon="✅"
          />
          <StatsCard 
            title="Warning (30-50%)" 
            value={healthCategories.warning}
            color="attention"
            icon="⚠️"
          />
          <StatsCard 
            title="Critical (<30%)" 
            value={healthCategories.critical}
            color="attention"
            icon="🚨"
          />
        </div>
      </section>

      {/* Average Health Trend */}
      <section className="analytics-section">
        <div className="analytics-section-header">
          <h3>Average Plant Health Trend</h3>
          <div className="time-range-selector">
            <button 
              className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>

        <div className="analytics-chart">
          <div className="chart-container">
            <svg className="line-chart" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
              {/* Y-axis line */}
              <line x1="40" y1="20" x2="40" y2="260" stroke="#ccc" strokeWidth="2" />
              
              {/* X-axis line */}
              <line x1="40" y1="260" x2="780" y2="260" stroke="#ccc" strokeWidth="2" />

              {/* Grid lines and data points */}
              {getAverageHealthOverTime().map((value, index) => {
                const x = 80 + (index * (700 / (getAverageHealthOverTime().length - 1 || 1)));
                const y = 260 - (value / 100) * 230;
                
                return (
                  <g key={index}>
                    {/* Grid line */}
                    <line x1="40" y1={y} x2="780" y2={y} stroke="#f0f0f0" strokeWidth="1" />
                    
                    {/* Data point circle */}
                    <circle cx={x} cy={y} r="3" fill="#10b981" />
                  </g>
                );
              })}

              {/* Connecting line */}
              {getAverageHealthOverTime().map((value, index) => {
                if (index === 0) return null;
                const x1 = 80 + ((index - 1) * (700 / (getAverageHealthOverTime().length - 1 || 1)));
                const x2 = 80 + (index * (700 / (getAverageHealthOverTime().length - 1 || 1)));
                const y1 = 260 - (getAverageHealthOverTime()[index - 1] / 100) * 230;
                const y2 = 260 - (value / 100) * 230;
                
                return (
                  <line key={`line-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="2" />
                );
              })}

              {/* Y-axis labels */}
              <text x="25" y="265" fontSize="11" fill="#666">0%</text>
              <text x="15" y="25" fontSize="11" fill="#666">100%</text>
            </svg>
          </div>
          <p className="chart-label">Average Moisture Level - {timeRange}</p>
        </div>
      </section>

      {/* Individual Plant Trends */}
      <section className="analytics-section">
        <h3>Individual Plant Health</h3>
        <div className="plant-selection">
          <select 
            value={selectedPlant || ''} 
            onChange={(e) => setSelectedPlant(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Select a plant to view trend</option>
            {plants.map(plant => (
              <option key={plant.id} value={plant.id}>
                {plant.name} - Current: {plant.moistureLevel}%
              </option>
            ))}
          </select>
        </div>

        {selectedPlant && (
          <div className="analytics-chart">
            <div className="chart-container">
              <svg className="line-chart" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                {/* Y-axis line */}
                <line x1="40" y1="20" x2="40" y2="260" stroke="#ccc" strokeWidth="2" />
                
                {/* X-axis line */}
                <line x1="40" y1="260" x2="780" y2="260" stroke="#ccc" strokeWidth="2" />

                {getHealthTrendData(selectedPlant).map((value, index) => {
                  const x = 80 + (index * (700 / (getHealthTrendData(selectedPlant).length - 1 || 1)));
                  const y = 260 - (value / 100) * 230;
                  
                  return (
                    <g key={index}>
                      {/* Data point circle */}
                      <circle cx={x} cy={y} r="3" fill="#8b5cf6" />
                    </g>
                  );
                })}

                {/* Connecting line */}
                {getHealthTrendData(selectedPlant).map((value, index) => {
                  if (index === 0) return null;
                  const x1 = 80 + ((index - 1) * (700 / (getHealthTrendData(selectedPlant).length - 1 || 1)));
                  const x2 = 80 + (index * (700 / (getHealthTrendData(selectedPlant).length - 1 || 1)));
                  const y1 = 260 - (getHealthTrendData(selectedPlant)[index - 1] / 100) * 230;
                  const y2 = 260 - (value / 100) * 230;
                  
                  return (
                    <line key={`line-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b5cf6" strokeWidth="2" />
                  );
                })}

                {/* Y-axis labels */}
                <text x="25" y="265" fontSize="11" fill="#666">0%</text>
                <text x="15" y="25" fontSize="11" fill="#666">100%</text>
              </svg>
            </div>
            <p className="chart-label">
              {plants.find(p => p.id === selectedPlant)?.name} Health Trend - {timeRange}
            </p>
          </div>
        )}
      </section>

      {/* Health Insights */}
      <section className="analytics-section insights">
        <h3>💡 Health Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Health Stability</h4>
            <p>{Math.round((healthCategories.good + healthCategories.excellent) / plants.length * 100)}% plants are stable</p>
          </div>
          <div className="insight-card">
            <h4>Critical Cases</h4>
            <p>{healthCategories.critical} plants need immediate attention</p>
          </div>
          <div className="insight-card">
            <h4>Trend Direction</h4>
            <p>{healthTrends.filter(t => t.trend === 'improving').length} plants improving</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlantHealthTrends;