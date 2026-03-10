import React, { useState, useEffect } from 'react';
import '../styles/AuditLog.css';

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('userActivityLog')) || [];
    setAuditLogs(logs);
    applyFilters(logs);
  }, []);

  useEffect(() => {
    applyFilters(auditLogs);
  }, [filterAction, filterUser, filterDateRange, searchTerm, auditLogs]);

  const applyFilters = (logs) => {
    let filtered = [...logs];

    // Date range filter
    const cutoffDate = new Date();
    if (filterDateRange === '7days') cutoffDate.setDate(cutoffDate.getDate() - 7);
    else if (filterDateRange === '30days') cutoffDate.setDate(cutoffDate.getDate() - 30);
    else if (filterDateRange === '90days') cutoffDate.setDate(cutoffDate.getDate() - 90);
    else if (filterDateRange === '1year') cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

    filtered = filtered.filter(log => new Date(log.timestamp) >= cutoffDate);

    // Action filter
    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action.includes(filterAction));
    }

    // User filter
    if (filterUser !== 'all') {
      filtered = filtered.filter(log => log.performedBy === filterUser);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(term) ||
        log.performedBy.toLowerCase().includes(term) ||
        (log.plant_name && log.plant_name.toLowerCase().includes(term)) ||
        (log.description && log.description.toLowerCase().includes(term))
      );
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setFilteredLogs(filtered);
  };

  const getActionIcon = (action) => {
    if (action.includes('water')) return '💧';
    if (action.includes('add')) return '➕';
    if (action.includes('delete')) return '🗑️';
    if (action.includes('update') || action.includes('edit')) return '✏️';
    if (action.includes('alert')) return '🚨';
    if (action.includes('create')) return '🆕';
    if (action.includes('export')) return '📥';
    return '📝';
  };

  const getActionColor = (action) => {
    if (action.includes('delete')) return 'danger';
    if (action.includes('alert')) return 'warning';
    if (action.includes('water') || action.includes('add')) return 'success';
    return 'neutral';
  };

  const getUniqueUsers = () => {
    const users = new Set(auditLogs.map(log => log.performedBy));
    return Array.from(users).sort();
  };

  const getUniqueActions = () => {
    const actions = new Set();
    auditLogs.forEach(log => {
      const actionBase = log.action.split('_')[0];
      actions.add(actionBase);
    });
    return Array.from(actions).sort();
  };

  const getActionStats = () => {
    const stats = {};
    auditLogs.forEach(log => {
      const action = log.action.split('_')[0];
      stats[action] = (stats[action] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const handleExportAuditLog = () => {
    const csvContent = [
      ['AUDIT LOG EXPORT - ' + new Date().toISOString().split('T')[0]],
      [],
      ['Timestamp', 'User', 'Action', 'Plant', 'Description'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.performedBy,
        log.action,
        log.plant_name || '-',
        log.description || '-'
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('✅ Audit log exported successfully!');
  };

  const actionStats = getActionStats();

  return (
    <div className="audit-log">
      <header className="audit-header">
        <h2>🔍 Audit Log & System Activity</h2>
        <p>Track all system activities and changes for security and accountability</p>
      </header>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <span className="stat-label">Total Activities</span>
          <span className="stat-value">{auditLogs.length}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Filtered Results</span>
          <span className="stat-value">{filteredLogs.length}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Unique Users</span>
          <span className="stat-value">{getUniqueUsers().length}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Top Action</span>
          <span className="stat-value">{actionStats[0]?.[0] || '-'}</span>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Search Activities</label>
          <input
            type="text"
            placeholder="Search by action, user, plant, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Date Range</label>
          <select value={filterDateRange} onChange={(e) => setFilterDateRange(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="filter-group">
          <label>User</label>
          <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
            <option value="all">All Users</option>
            {getUniqueUsers().map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Action Type</label>
          <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
            <option value="all">All Actions</option>
            {getUniqueActions().map(action => (
              <option key={action} value={action}>
                {action.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-export-log" onClick={handleExportAuditLog}>
          📥 Export Log
        </button>
      </div>

      {/* Top Actions Chart */}
      <div className="top-actions-section">
        <h3>📊 Top 5 Actions</h3>
        <div className="actions-chart">
          {actionStats.map(([action, count], idx) => (
            <div key={idx} className="chart-item">
              <span className="action-name">{action.replace(/_/g, ' ')}</span>
              <div className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{ width: `${(count / actionStats[0][1]) * 100}%` }}
                />
              </div>
              <span className="action-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="logs-container">
        <h3>Activity Log ({filteredLogs.length} entries)</h3>

        {filteredLogs.length === 0 ? (
          <div className="no-logs">
            <p>📭 No activities match your filters</p>
          </div>
        ) : (
          <div className="logs-list">
            {filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className={`log-entry ${getActionColor(log.action)}`}
                onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
              >
                <div className="log-main">
                  <span className="log-icon">{getActionIcon(log.action)}</span>

                  <div className="log-content">
                    <div className="log-action">
                      <span className="action-badge">{log.action.replace(/_/g, ' ').toUpperCase()}</span>
                      {log.plant_name && <span className="plant-name">• {log.plant_name}</span>}
                    </div>

                    <div className="log-meta">
                      <span className="user-badge">👤 {log.performedBy}</span>
                      <span className="timestamp">
                        📅 {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {log.description && (
                      <div className="log-description">
                        {log.description}
                      </div>
                    )}
                  </div>
                </div>

                {selectedLog?.id === log.id && (
                  <div className="log-details">
                    <h4>Full Event Details</h4>
                    <div className="details-grid">
                      <div className="detail">
                        <span className="detail-key">User:</span>
                        <span className="detail-value">{log.performedBy}</span>
                      </div>
                      <div className="detail">
                        <span className="detail-key">Action:</span>
                        <span className="detail-value">{log.action}</span>
                      </div>
                      <div className="detail">
                        <span className="detail-key">Timestamp:</span>
                        <span className="detail-value">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      {log.plant_name && (
                        <div className="detail">
                          <span className="detail-key">Plant:</span>
                          <span className="detail-value">{log.plant_name}</span>
                        </div>
                      )}
                      {log.plant_id && (
                        <div className="detail">
                          <span className="detail-key">Plant ID:</span>
                          <span className="detail-value">{log.plant_id}</span>
                        </div>
                      )}
                      {log.description && (
                        <div className="detail full-width">
                          <span className="detail-key">Description:</span>
                          <span className="detail-value">{log.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Tips */}
      <div className="security-tips">
        <h3>🛡️ Security & Compliance Notes</h3>
        <ul>
          <li>All user actions are automatically logged for accountability</li>
          <li>Audit logs help track who made what changes and when</li>
          <li>Export logs regularly for compliance and backup purposes</li>
          <li>Review suspicious activities to identify potential issues</li>
          <li>Logs are stored locally in your browser (no cloud backup)</li>
          <li>Consider backing up audit logs as part of your regular maintenance</li>
        </ul>
      </div>
    </div>
  );
};

export default AuditLog;
