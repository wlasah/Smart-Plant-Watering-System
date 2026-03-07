import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';

const UserEngagement = ({ users, activityLog }) => {
  const [loginFrequency, setLoginFrequency] = useState({});
  const [activityMetrics, setActivityMetrics] = useState({});

  useEffect(() => {
    // Calculate login frequency from activity log
    const loginEvents = activityLog.filter(activity => activity.action === 'login');
    const frequency = {};

    loginEvents.forEach(event => {
      const date = new Date(event.timestamp).toDateString();
      frequency[date] = (frequency[date] || 0) + 1;
    });

    setLoginFrequency(frequency);

    // Calculate activity metrics
    const metrics = {
      totalActivities: activityLog.length,
      userCreations: activityLog.filter(a => a.action === 'create').length,
      userUpdates: activityLog.filter(a => a.action === 'update').length,
      userDeletions: activityLog.filter(a => a.action === 'delete').length,
      recentActivities: activityLog.filter(a => {
        const activityDate = new Date(a.timestamp);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return activityDate > weekAgo;
      }).length
    };

    setActivityMetrics(metrics);
  }, [users, activityLog]);

  const getUserActivityData = () => {
    const userActivity = {};
    activityLog.forEach(activity => {
      userActivity[activity.performedBy] = (userActivity[activity.performedBy] || 0) + 1;
    });
    return userActivity;
  };

  const userActivityData = getUserActivityData();

  return (
    <div className="user-engagement">
      <header className="analytics-header">
        <h2>👥 User Engagement Metrics</h2>
        <p>Track user activity, login patterns, and system usage</p>
      </header>

      {/* User Engagement Metrics */}
      <section className="analytics-section">
        <h3>User Activity Overview</h3>
        <div className="analytics-metrics-grid">
          <StatsCard 
            title="Total Users" 
            value={users.length}
            icon="👥"
          />
          <StatsCard 
            title="Total Activities" 
            value={activityMetrics.totalActivities}
            color="healthy"
            icon="📊"
          />
          <StatsCard 
            title="Recent Activities (7d)" 
            value={activityMetrics.recentActivities}
            color="moisture"
            icon="⚡"
          />
          <StatsCard 
            title="User Creations" 
            value={activityMetrics.userCreations}
            color="attention"
            icon="➕"
          />
          <StatsCard 
            title="User Updates" 
            value={activityMetrics.userUpdates}
            color="healthy"
            icon="✏️"
          />
          <StatsCard 
            title="User Deletions" 
            value={activityMetrics.userDeletions}
            color="attention"
            icon="🗑️"
          />
        </div>
      </section>

      {/* User Activity Breakdown */}
      <section className="analytics-section">
        <h3>Activity by User</h3>
        <div className="user-activity-breakdown">
          {Object.entries(userActivityData).map(([user, count]) => (
            <div key={user} className="activity-item">
              <span className="user-name">👤 {user}</span>
              <div className="activity-bar">
                <div 
                  className="activity-bar-fill" 
                  style={{ width: `${(count / Math.max(...Object.values(userActivityData))) * 100}%` }}
                ></div>
              </div>
              <span className="activity-count">{count} activities</span>
            </div>
          ))}
        </div>
      </section>

      {/* Login Frequency Chart */}
      <section className="analytics-section">
        <h3>Login Frequency (Last 30 Days)</h3>
        <div className="analytics-chart">
          <div className="chart-container">
            <svg className="bar-chart" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
              {/* Y-axis line */}
              <line x1="40" y1="20" x2="40" y2="260" stroke="#ccc" strokeWidth="2" />
              
              {/* X-axis line */}
              <line x1="40" y1="260" x2="780" y2="260" stroke="#ccc" strokeWidth="2" />

              {Object.entries(loginFrequency).slice(-10).map(([, count], index) => {
                const x = 80 + (index * 70);
                const maxCount = Math.max(...Object.values(loginFrequency));
                const height = (count / maxCount) * 220;
                const y = 260 - height;
                
                return (
                  <g key={index}>
                    {/* Bar */}
                    <rect x={x - 15} y={y} width="30" height={height} fill="#06b6d4" />
                    
                    {/* Value label */}
                    <text x={x} y={y - 5} textAnchor="middle" fontSize="11" fill="#666">
                      {count}
                    </text>
                  </g>
                );
              })}

              {/* Y-axis labels */}
              <text x="25" y="265" fontSize="11" fill="#666">0</text>
              <text x="15" y="25" fontSize="11" fill="#666">{Math.max(...Object.values(loginFrequency))}</text>
            </svg>
          </div>
          <p className="chart-label">Daily Login Count</p>
        </div>
      </section>

      {/* User Roles Distribution */}
      <section className="analytics-section">
        <h3>User Roles Distribution</h3>
        <div className="role-distribution">
          {['admin', 'user', 'moderator'].map(role => {
            const count = users.filter(u => u.role === role).length;
            return (
              <div key={role} className="role-item">
                <div className="role-color" style={{ backgroundColor: role === 'admin' ? '#ff6b6b' : role === 'user' ? '#4ecdc4' : '#45b7d1' }}></div>
                <div className="role-info">
                  <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  <strong>{count} users</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default UserEngagement;