import React, { useState, useEffect } from 'react';
import '../styles/ReportingDashboard.css';

const ReportingDashboard = () => {
  const [plants, setPlants] = useState([]);
  const [users, setUsers] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [dateRange, setDateRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('health-trends');

  useEffect(() => {
    setPlants(JSON.parse(localStorage.getItem('plants')) || []);
    setUsers(JSON.parse(localStorage.getItem('users')) || []);
    setActivityLog(JSON.parse(localStorage.getItem('userActivityLog')) || []);
  }, []);

  // Calculate metrics
  const getHealthTrend = () => {
    const threshold = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - threshold);

    const recentActivities = activityLog.filter(log =>
      new Date(log.timestamp) > cutoffDate && log.action.includes('water')
    );

    const healthyPlants = plants.filter(p => p.moistureLevel >= 50).length;
    const totalPlants = plants.length;

    return {
      healthy: healthyPlants,
      total: totalPlants,
      percentage: totalPlants > 0 ? Math.round((healthyPlants / totalPlants) * 100) : 0,
      waterings: recentActivities.length
    };
  };

  const getUserEngagement = () => {
    const threshold = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - threshold);

    const userStats = users.map(user => {
      const userActivities = activityLog.filter(log =>
        log.performedBy === user.username && new Date(log.timestamp) > cutoffDate
      );

      const userPlants = plants.filter(p => (p.user_id === user.id || p.owner === user.username)).length;

      return {
        username: user.username,
        activities: userActivities.length,
        plants: userPlants,
        engagement: userPlants > 0 ? Math.round((userActivities.length / (userPlants * 2)) * 100) : 0
      };
    });

    return userStats.sort((a, b) => b.activities - a.activities);
  };

  const getMostProblematicPlants = () => {
    return plants
      .map(p => ({
        name: p.name,
        owner: p.owner || 'Unknown',
        moisture: p.moistureLevel,
        status: p.moistureLevel < 30 ? 'Critical' : p.moistureLevel < 50 ? 'Warning' : 'Healthy',
        lastWatered: p.lastWatered || 'Never'
      }))
      .filter(p => p.status !== 'Healthy')
      .sort((a, b) => a.moisture - b.moisture)
      .slice(0, 10);
  };

  const getWateringTrend = () => {
    const threshold = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - threshold);

    const wateringHistory = JSON.parse(localStorage.getItem('wateringHistory')) || [];
    const recentWaterings = wateringHistory.filter(w =>
      new Date(w.watering_date) > cutoffDate
    );

    const daysArray = Array.from({ length: threshold }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (threshold - i - 1));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const wateringByDay = {};
    daysArray.forEach(day => wateringByDay[day] = 0);

    recentWaterings.forEach(w => {
      const date = new Date(w.watering_date);
      const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (wateringByDay[dayStr] !== undefined) {
        wateringByDay[dayStr]++;
      }
    });

    return { daysArray, wateringByDay, total: recentWaterings.length };
  };

  const getSystemStats = () => {
    const critical = plants.filter(p => p.moistureLevel < 30).length;
    const warning = plants.filter(p => p.moistureLevel >= 30 && p.moistureLevel < 50).length;
    const healthy = plants.filter(p => p.moistureLevel >= 50).length;

    return { critical, warning, healthy, total: plants.length };
  };

  const handleExportReport = () => {
    const health = getHealthTrend();
    const engagement = getUserEngagement();
    const problematic = getMostProblematicPlants();
    const stats = getSystemStats();

    const csvContent = [
      ['SYSTEM REPORT - ' + new Date().toISOString().split('T')[0]],
      [],
      ['OVERALL HEALTH METRICS'],
      ['Total Plants', stats.total],
      ['Healthy', stats.healthy],
      ['Warning', stats.warning],
      ['Critical', stats.critical],
      [],
      ['USER ENGAGEMENT TRENDS'],
      ['Username', 'Activities', 'Plants', 'Engagement %'],
      ...engagement.map(u => [u.username, u.activities, u.plants, u.engagement])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `plant-report-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('✅ Report exported successfully!');
  };

  const health = getHealthTrend();
  const engagement = getUserEngagement();
  const problematic = getMostProblematicPlants();
  const wateringTrend = getWateringTrend();
  const stats = getSystemStats();

  const maxWatering = Math.max(...Object.values(wateringTrend.wateringByDay), 1);

  return (
    <div className="reporting-dashboard">
      <header className="report-header">
        <h2>📊 Advanced Reporting & Analytics</h2>
        <p>Comprehensive system insights and performance metrics</p>
      </header>

      {/* Date Range & Export */}
      <div className="report-controls">
        <div className="date-range-selector">
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        <button className="btn-export-report" onClick={handleExportReport}>
          📥 Export Full Report
        </button>
      </div>

      {/* Key Metrics Overview */}
      <div className="metrics-overview">
        <div className="metric-card success">
          <h3>🌿 System Health</h3>
          <p className="metric-value">{health.percentage}%</p>
          <p className="metric-detail">{health.healthy}/{health.total} plants healthy</p>
        </div>

        <div className="metric-card info">
          <h3>💧 Waterings Recorded</h3>
          <p className="metric-value">{health.waterings}</p>
          <p className="metric-detail">in {dateRange.replace('days', '')} days</p>
        </div>

        <div className="metric-card warning">
          <h3>⚠️ Plants Needing Attention</h3>
          <p className="metric-value">{stats.critical + stats.warning}</p>
          <p className="metric-detail">{stats.critical} critical, {stats.warning} warning</p>
        </div>

        <div className="metric-card neutral">
          <h3>👥 Active Users</h3>
          <p className="metric-value">{engagement.filter(e => e.activities > 0).length}</p>
          <p className="metric-detail">of {users.length} total users</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="metric-tabs">
        <button
          className={`tab-btn ${selectedMetric === 'health-trends' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('health-trends')}
        >
          🌱 Health Trends
        </button>
        <button
          className={`tab-btn ${selectedMetric === 'user-engagement' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('user-engagement')}
        >
          👥 User Engagement
        </button>
        <button
          className={`tab-btn ${selectedMetric === 'problematic-plants' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('problematic-plants')}
        >
          ⚠️ Problem Plants
        </button>
        <button
          className={`tab-btn ${selectedMetric === 'watering-trend' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('watering-trend')}
        >
          💧 Watering Trend
        </button>
      </div>

      {/* Health Trends Section */}
      {selectedMetric === 'health-trends' && (
        <div className="report-section">
          <h3>Plant Health Overview</h3>

          <div className="health-breakdown">
            <div className="health-bar-item">
              <span className="health-label">🟢 Healthy</span>
              <div className="health-bar">
                <div
                  className="health-fill healthy"
                  style={{ width: `${(stats.healthy / stats.total) * 100}%` }}
                >
                  {stats.healthy}
                </div>
              </div>
              <span className="health-value">{stats.healthy}/{stats.total}</span>
            </div>

            <div className="health-bar-item">
              <span className="health-label">🟡 Warning</span>
              <div className="health-bar">
                <div
                  className="health-fill warning"
                  style={{ width: `${(stats.warning / stats.total) * 100}%` }}
                >
                  {stats.warning}
                </div>
              </div>
              <span className="health-value">{stats.warning}/{stats.total}</span>
            </div>

            <div className="health-bar-item">
              <span className="health-label">🔴 Critical</span>
              <div className="health-bar">
                <div
                  className="health-fill critical"
                  style={{ width: `${(stats.critical / stats.total) * 100}%` }}
                >
                  {stats.critical}
                </div>
              </div>
              <span className="health-value">{stats.critical}/{stats.total}</span>
            </div>
          </div>

          <div className="insights-box">
            <h4>💡 Insights</h4>
            <ul>
              <li>{health.percentage}% of plants are in good condition</li>
              <li>{stats.critical} plants require immediate watering</li>
              <li>{health.waterings} watering activities recorded</li>
              <li>Average plant health: {health.percentage}%</li>
            </ul>
          </div>
        </div>
      )}

      {/* User Engagement Section */}
      {selectedMetric === 'user-engagement' && (
        <div className="report-section">
          <h3>User Activity & Engagement</h3>

          <div className="engagement-table">
            <div className="table-header">
              <div className="col-user">Username</div>
              <div className="col-plants">Plants</div>
              <div className="col-activities">Activities</div>
              <div className="col-engagement">Engagement</div>
            </div>

            {engagement.map((user, idx) => (
              <div key={idx} className="table-row">
                <div className="col-user">{user.username}</div>
                <div className="col-plants">{user.plants}</div>
                <div className="col-activities">{user.activities}</div>
                <div className="col-engagement">
                  <div className="engagement-bar">
                    <div
                      className="engagement-fill"
                      style={{
                        width: `${user.engagement}%`,
                        background: user.engagement >= 80 ? '#27ae60' : user.engagement >= 50 ? '#f39c12' : '#e74c3c'
                      }}
                    />
                  </div>
                  <span>{user.engagement}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="insights-box">
            <h4>💡 User Insights</h4>
            <ul>
              <li>Top user: {engagement[0]?.username} with {engagement[0]?.activities} activities</li>
              <li>Average engagement: {Math.round(engagement.reduce((a, b) => a + b.engagement, 0) / engagement.length)}%</li>
              <li>Inactive users: {engagement.filter(e => e.engagement < 25).length}</li>
            </ul>
          </div>
        </div>
      )}

      {/* Problematic Plants Section */}
      {selectedMetric === 'problematic-plants' && (
        <div className="report-section">
          <h3>Plants Requiring Attention</h3>

          {problematic.length === 0 ? (
            <p className="no-data">✅ All plants are in good condition!</p>
          ) : (
            <div className="problematic-plants-list">
              {problematic.map((plant, idx) => (
                <div key={idx} className={`problem-plant-item ${plant.status.toLowerCase()}`}>
                  <div className="plant-info">
                    <span className="plant-name">{plant.name}</span>
                    <span className={`status-badge ${plant.status.toLowerCase()}`}>
                      {plant.status}
                    </span>
                  </div>
                  <div className="plant-details">
                    <span>Owner: {plant.owner}</span>
                    <span>Moisture: {plant.moisture}%</span>
                    <span>Last Watered: {plant.lastWatered}</span>
                  </div>
                  <div className="moisture-bar">
                    <div
                      className="moisture-fill"
                      style={{
                        width: `${plant.moisture}%`,
                        background: plant.moisture < 30 ? '#e74c3c' : '#f39c12'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Watering Trend Section */}
      {selectedMetric === 'watering-trend' && (
        <div className="report-section">
          <h3>Watering Activity Timeline</h3>

          <div className="watering-chart">
            <div className="chart-container">
              {wateringTrend.daysArray.map((day, idx) => {
                const count = wateringTrend.wateringByDay[day] || 0;
                const height = maxWatering > 0 ? (count / maxWatering) * 200 : 0;

                return (
                  <div key={idx} className="chart-bar-container">
                    <div className="chart-bar-wrapper">
                      {height > 0 && (
                        <div
                          className="chart-bar"
                          style={{ height: `${height}px` }}
                          title={`${day}: ${count} waterings`}
                        >
                          {count > 0 && <span className="bar-label">{count}</span>}
                        </div>
                      )}
                    </div>
                    <div className="chart-label">{day}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="insights-box">
            <h4>💡 Watering Insights</h4>
            <ul>
              <li>Total waterings recorded: {wateringTrend.total}</li>
              <li>Average waterings per day: {Math.round(wateringTrend.total / wateringTrend.daysArray.length)}</li>
              <li>Peak watering day: {Math.max(...Object.values(wateringTrend.wateringByDay))} waterings</li>
              <li>Date range: {dateRange.replace('days', '')} days</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingDashboard;
