import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import '../styles/AnalyticsPage.css';

const AnalyticsPage = () => {
  const [plants, setPlants] = useState([]);
  const [wateringHistory, setWateringHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  // Load plants and watering history from localStorage
  useEffect(() => {
    try {
      setLoading(true);
      
      // Load plants from localStorage
      const savedPlants = localStorage.getItem('plants');
      const plantsList = savedPlants ? JSON.parse(savedPlants) : [];
      setPlants(plantsList);
      
      // Load watering history from localStorage
      const savedHistory = localStorage.getItem('wateringHistory');
      const historyList = savedHistory ? JSON.parse(savedHistory) : [];
      setWateringHistory(historyList);
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  }, []);

  // Calculate overall statistics - DYNAMIC based on moisture level
  const totalPlants = plants.length;
  const healthyPlants = plants.filter(p => p.moistureLevel >= 50).length;
  const needsAttention = plants.filter(p => p.moistureLevel < 50).length;
  const avgMoisture = plants.length > 0 
    ? Math.round(plants.reduce((sum, p) => sum + p.moistureLevel, 0) / plants.length)
    : 0;
  const maxMoisture = plants.length > 0 
    ? Math.max(...plants.map(p => p.moistureLevel))
    : 0;
  const minMoisture = plants.length > 0 
    ? Math.min(...plants.map(p => p.moistureLevel))
    : 0;

  // Calculate water usage trend from real data
  const getTrendData = () => {
    const now = new Date();
    let daysBack = 7; // default: week
    let dataPoints = 7;
    
    if (timeRange === 'month') {
      daysBack = 30;
      dataPoints = 30;
    } else if (timeRange === 'year') {
      daysBack = 365;
      dataPoints = 52;
    }

    const trendArray = new Array(dataPoints).fill(0);
    
    wateringHistory.forEach(event => {
      const eventDate = new Date(event.watering_date);
      const daysAgo = Math.floor((now - eventDate) / (1000 * 60 * 60 * 24));
      
      if (daysAgo < daysBack) {
        const index = Math.floor(daysAgo / (daysBack / dataPoints));
        if (index >= 0 && index < dataPoints) {
          trendArray[dataPoints - 1 - index]++;
        }
      }
    });
    
    return trendArray.map(count => Math.max(count * 10, 0)); // Scale for visual display
  };

  // Calculate plant health distribution
  const healthDistribution = {
    excellent: plants.filter(p => p.moistureLevel >= 70 && p.moistureLevel <= 90).length,
    goodCondition: plants.filter(p => p.moistureLevel >= 50 && p.moistureLevel < 70).length,
    needsWatering: plants.filter(p => p.moistureLevel >= 30 && p.moistureLevel < 50).length,
    critical: plants.filter(p => p.moistureLevel < 30).length
  };

  const plantsByLocation = {};
  plants.forEach(plant => {
    plantsByLocation[plant.location] = (plantsByLocation[plant.location] || 0) + 1;
  });

  // Calculate total watering events
  const totalWateringEvents = wateringHistory.length;

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1>📊 Analytics & Statistics</h1>
        <p>Track plant health trends and water usage patterns</p>
      </header>

      {/* Key Metrics Section */}
      <section className="analytics-section">
        <h2>Overall System Health</h2>
        <div className="analytics-metrics-grid">
          <StatsCard 
            title="Total Plants" 
            value={totalPlants}
            icon="🌱"
          />
          <StatsCard 
            title="Healthy" 
            value={healthyPlants}
            color="healthy"
            icon="✅"
          />
          <StatsCard 
            title="Attention Needed" 
            value={needsAttention}
            color="attention"
            icon="⚠️"
          />
          <StatsCard 
            title="Avg Moisture" 
            value={`${avgMoisture}%`}
            color="moisture"
            icon="💧"
          />
          <StatsCard 
            title="Max Moisture" 
            value={`${maxMoisture}%`}
            color="moisture"
            icon="📈"
          />
          <StatsCard 
            title="Min Moisture" 
            value={`${minMoisture}%`}
            color="moisture"
            icon="📉"
          />
          <StatsCard 
            title="Total Waterings" 
            value={totalWateringEvents}
            color="healthy"
            icon="💦"
          />
        </div>
      </section>

      {/* Water Usage Trend Section */}
      <section className="analytics-section">
        <div className="analytics-section-header">
          <h2>Water Usage Trend</h2>
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
              {getTrendData().map((value, index) => {
                const x = 80 + (index * (700 / (getTrendData().length - 1 || 1)));
                const maxValue = Math.max(...getTrendData());
                const y = 260 - (value / maxValue) * 230;
                
                return (
                  <g key={index}>
                    {/* Grid line */}
                    <line x1="40" y1={y} x2="780" y2={y} stroke="#f0f0f0" strokeWidth="1" />
                    
                    {/* Data point circle */}
                    <circle cx={x} cy={y} r="4" fill="#06b6d4" />
                    
                    {/* Value label */}
                    <text x={x} y={y - 12} textAnchor="middle" fontSize="11" fill="#666">
                      {value}
                    </text>
                  </g>
                );
              })}

              {/* Connecting line */}
              {getTrendData().map((value, index) => {
                if (index === 0) return null;
                const x1 = 80 + ((index - 1) * (700 / (getTrendData().length - 1 || 1)));
                const x2 = 80 + (index * (700 / (getTrendData().length - 1 || 1)));
                const maxValue = Math.max(...getTrendData());
                const y1 = 260 - (getTrendData()[index - 1] / maxValue) * 230;
                const y2 = 260 - (value / maxValue) * 230;
                
                return (
                  <line key={`line-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#06b6d4" strokeWidth="2" />
                );
              })}

              {/* Y-axis labels */}
              <text x="25" y="265" fontSize="11" fill="#666">0</text>
              <text x="15" y="25" fontSize="11" fill="#666">{Math.max(...getTrendData())}</text>
            </svg>
          </div>
          <p className="chart-label">Water Usage (ml) - {timeRange}</p>
        </div>
      </section>

      {/* Health Distribution Section */}
      <section className="analytics-section">
        <h2>Plant Health Distribution</h2>
        <div className="health-distribution">
          <div className="health-item">
            <div className="health-color excellent"></div>
            <div className="health-info">
              <span>Excellent (70-90%)</span>
              <strong>{healthDistribution.excellent} plants</strong>
            </div>
          </div>
          <div className="health-item">
            <div className="health-color good"></div>
            <div className="health-info">
              <span>Good (50-70%)</span>
              <strong>{healthDistribution.goodCondition} plants</strong>
            </div>
          </div>
          <div className="health-item">
            <div className="health-color warning"></div>
            <div className="health-info">
              <span>Needs Watering (30-50%)</span>
              <strong>{healthDistribution.needsWatering} plants</strong>
            </div>
          </div>
          <div className="health-item">
            <div className="health-color critical"></div>
            <div className="health-info">
              <span>Critical (&lt;30%)</span>
              <strong>{healthDistribution.critical} plants</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Plants by Location Section */}
      {Object.keys(plantsByLocation).length > 0 && (
        <section className="analytics-section">
          <h2>Plants by Location</h2>
          <div className="location-breakdown">
            {Object.entries(plantsByLocation).map(([location, count]) => (
              <div key={location} className="location-item">
                <span className="location-name">📍 {location}</span>
                <div className="location-bar">
                  <div 
                    className="location-bar-fill" 
                    style={{ width: `${(count / totalPlants) * 100}%` }}
                  ></div>
                </div>
                <span className="location-count">{count} plants</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Insights Section */}
      <section className="analytics-section insights">
        <h2>🔍 Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Most Watered</h4>
            <p>{getTrendData()[getTrendData().length - 1]} ml this {timeRange}</p>
          </div>
          <div className="insight-card">
            <h4>Health Score</h4>
            <p>{Math.round((healthyPlants / totalPlants) * 100)}% plants are healthy</p>
          </div>
          <div className="insight-card">
            <h4>Recommendation</h4>
            <p>{needsAttention > 0 
              ? `${needsAttention} plant${needsAttention > 1 ? 's' : ''} need attention`
              : 'All plants are doing great!'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;
