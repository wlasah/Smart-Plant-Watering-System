import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';

const WateringAnalytics = ({ wateringHistory, plants }) => {
  const [wateringStats, setWateringStats] = useState({});
  const [frequencyData, setFrequencyData] = useState([]);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    // Calculate watering statistics
    const stats = {
      totalWaterings: wateringHistory.length,
      averageWaterPerSession: wateringHistory.length > 0 
        ? Math.round(wateringHistory.reduce((sum, w) => sum + (w.amount || 10), 0) / wateringHistory.length)
        : 0,
      mostWateredPlant: getMostWateredPlant(),
      leastWateredPlant: getLeastWateredPlant(),
      wateringEfficiency: calculateEfficiency()
    };

    setWateringStats(stats);

    // Generate frequency data
    const freqData = generateFrequencyData();
    setFrequencyData(freqData);
  }, [wateringHistory, plants, timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const getMostWateredPlant = () => {
    const plantCounts = {};
    wateringHistory.forEach(event => {
      plantCounts[event.plant_id] = (plantCounts[event.plant_id] || 0) + 1;
    });
    
    const mostWateredId = Object.keys(plantCounts).reduce((a, b) => 
      plantCounts[a] > plantCounts[b] ? a : b, null
    );
    
    const plant = plants.find(p => p.id === mostWateredId);
    return plant ? plant.name : 'N/A';
  };

  const getLeastWateredPlant = () => {
    const plantCounts = {};
    plants.forEach(plant => {
      plantCounts[plant.id] = 0;
    });
    
    wateringHistory.forEach(event => {
      plantCounts[event.plant_id] = (plantCounts[event.plant_id] || 0) + 1;
    });
    
    const leastWateredId = Object.keys(plantCounts).reduce((a, b) => 
      plantCounts[a] < plantCounts[b] ? a : b, null
    );
    
    const plant = plants.find(p => p.id === leastWateredId);
    return plant ? plant.name : 'N/A';
  };

  const calculateEfficiency = () => {
    // Mock efficiency calculation based on plant health
    const healthyPlants = plants.filter(p => p.moistureLevel >= 50).length;
    return Math.round((healthyPlants / plants.length) * 100);
  };

  const generateFrequencyData = () => {
    const now = new Date();
    let daysBack = 7;
    let dataPoints = 7;
    
    if (timeRange === 'month') {
      daysBack = 30;
      dataPoints = 30;
    } else if (timeRange === 'year') {
      daysBack = 365;
      dataPoints = 52;
    }

    const frequencyArray = new Array(dataPoints).fill(0);
    
    wateringHistory.forEach(event => {
      const eventDate = new Date(event.watering_date);
      const daysAgo = Math.floor((now - eventDate) / (1000 * 60 * 60 * 24));
      
      if (daysAgo < daysBack) {
        const index = Math.floor(daysAgo / (daysBack / dataPoints));
        if (index >= 0 && index < dataPoints) {
          frequencyArray[dataPoints - 1 - index]++;
        }
      }
    });
    
    return frequencyArray;
  };

  const getWateringPatterns = () => {
    const patterns = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };

    wateringHistory.forEach(event => {
      const hour = new Date(event.watering_date).getHours();
      if (hour >= 6 && hour < 12) patterns.morning++;
      else if (hour >= 12 && hour < 17) patterns.afternoon++;
      else if (hour >= 17 && hour < 21) patterns.evening++;
      else patterns.night++;
    });

    return patterns;
  };

  const wateringPatterns = getWateringPatterns();

  return (
    <div className="watering-analytics">
      <header className="analytics-header">
        <h2>💧 Watering Analytics</h2>
        <p>Analyze watering patterns, frequency, and efficiency</p>
      </header>

      {/* Watering Statistics */}
      <section className="analytics-section">
        <h3>Watering Overview</h3>
        <div className="analytics-metrics-grid">
          <StatsCard 
            title="Total Waterings" 
            value={wateringStats.totalWaterings}
            icon="💦"
          />
          <StatsCard 
            title="Avg Water/Session" 
            value={`${wateringStats.averageWaterPerSession}ml`}
            color="moisture"
            icon="📏"
          />
          <StatsCard 
            title="Most Watered" 
            value={wateringStats.mostWateredPlant}
            color="healthy"
            icon="🏆"
          />
          <StatsCard 
            title="Least Watered" 
            value={wateringStats.leastWateredPlant}
            color="attention"
            icon="⚠️"
          />
          <StatsCard 
            title="Efficiency" 
            value={`${wateringStats.wateringEfficiency}%`}
            color="healthy"
            icon="⚡"
          />
          <StatsCard 
            title="Plants Watered" 
            value={new Set(wateringHistory.map(w => w.plant_id)).size}
            color="moisture"
            icon="🌱"
          />
        </div>
      </section>

      {/* Watering Frequency Chart */}
      <section className="analytics-section">
        <div className="analytics-section-header">
          <h3>Watering Frequency</h3>
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
            <svg className="bar-chart" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
              {/* Y-axis line */}
              <line x1="40" y1="20" x2="40" y2="260" stroke="#ccc" strokeWidth="2" />
              
              {/* X-axis line */}
              <line x1="40" y1="260" x2="780" y2="260" stroke="#ccc" strokeWidth="2" />

              {frequencyData.map((count, index) => {
                const x = 80 + (index * (700 / (frequencyData.length - 1 || 1)));
                const maxCount = Math.max(...frequencyData);
                const height = maxCount > 0 ? (count / maxCount) * 220 : 0;
                const y = 260 - height;
                
                return (
                  <g key={index}>
                    {/* Bar */}
                    <rect x={x - 8} y={y} width="16" height={height} fill="#06b6d4" />
                    
                    {/* Value label */}
                    <text x={x} y={y - 5} textAnchor="middle" fontSize="10" fill="#666">
                      {count}
                    </text>
                  </g>
                );
              })}

              {/* Y-axis labels */}
              <text x="25" y="265" fontSize="11" fill="#666">0</text>
              <text x="15" y="25" fontSize="11" fill="#666">{Math.max(...frequencyData)}</text>
            </svg>
          </div>
          <p className="chart-label">Watering Events - {timeRange}</p>
        </div>
      </section>

      {/* Watering Patterns by Time */}
      <section className="analytics-section">
        <h3>Watering Patterns by Time of Day</h3>
        <div className="time-patterns">
          {Object.entries(wateringPatterns).map(([time, count]) => (
            <div key={time} className="time-pattern-item">
              <span className="time-label">
                {time.charAt(0).toUpperCase() + time.slice(1)} 
                ({time === 'morning' ? '6-12' : time === 'afternoon' ? '12-17' : time === 'evening' ? '17-21' : '21-6'})
              </span>
              <div className="pattern-bar">
                <div 
                  className="pattern-bar-fill" 
                  style={{ 
                    width: `${wateringStats.totalWaterings > 0 ? (count / wateringStats.totalWaterings) * 100 : 0}%`,
                    backgroundColor: time === 'morning' ? '#fbbf24' : time === 'afternoon' ? '#f59e0b' : time === 'evening' ? '#d97706' : '#92400e'
                  }}
                ></div>
              </div>
              <span className="pattern-count">{count} waterings</span>
            </div>
          ))}
        </div>
      </section>

      {/* Watering Insights */}
      <section className="analytics-section insights">
        <h3>💡 Watering Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Peak Watering Time</h4>
            <p>{Object.keys(wateringPatterns).reduce((a, b) => 
              wateringPatterns[a] > wateringPatterns[b] ? a : b
            ).charAt(0).toUpperCase() + Object.keys(wateringPatterns).reduce((a, b) => 
              wateringPatterns[a] > wateringPatterns[b] ? a : b
            ).slice(1)}</p>
          </div>
          <div className="insight-card">
            <h4>Consistency</h4>
            <p>{frequencyData.filter(f => f > 0).length} active {timeRange === 'week' ? 'days' : timeRange === 'month' ? 'days' : 'weeks'}</p>
          </div>
          <div className="insight-card">
            <h4>Recommendation</h4>
            <p>{wateringStats.totalWaterings < plants.length * 7 ? 'Increase watering frequency' : 'Watering schedule looks good'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WateringAnalytics;