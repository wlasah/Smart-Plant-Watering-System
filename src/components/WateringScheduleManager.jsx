import React, { useState, useEffect } from 'react';
import '../styles/WateringScheduleManager.css';

const WateringScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [plants, setPlants] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    plantType: '',
    frequency: 'every-2-days',
    waterAmount: 50,
    optimalTimeOfDay: '06:00',
    assignedUsers: [],
    notes: ''
  });

  useEffect(() => {
    // Load data from localStorage
    const savedSchedules = localStorage.getItem('wateringSchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }

    const plantsData = JSON.parse(localStorage.getItem('plants')) || [];
    setPlants(plantsData);

    const usersData = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(usersData);
  }, []);

  const plantTypes = ['Succulent', 'Fern', 'Tropical', 'Cactus', 'Vegetable', 'Herb', 'Flowering', 'Indoor', 'Outdoor'];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'every-2-days', label: 'Every 2 Days' },
    { value: 'every-3-days', label: 'Every 3 Days' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter(id => id !== userId)
        : [...prev.assignedUsers, userId]
    }));
  };

  const handleAddSchedule = () => {
    if (!formData.name || !formData.plantType) {
      alert('Please fill in required fields');
      return;
    }

    if (editingId) {
      setSchedules(prev =>
        prev.map(s => s.id === editingId ? { ...formData, id: editingId } : s)
      );
      setEditingId(null);
    } else {
      const newSchedule = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setSchedules(prev => [newSchedule, ...prev]);
    }

    localStorage.setItem('wateringSchedules', JSON.stringify(schedules));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      plantType: '',
      frequency: 'every-2-days',
      waterAmount: 50,
      optimalTimeOfDay: '06:00',
      assignedUsers: [],
      notes: ''
    });
    setShowForm(false);
  };

  const handleEditSchedule = (schedule) => {
    setFormData(schedule);
    setEditingId(schedule.id);
    setShowForm(true);
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm('Delete this schedule?')) {
      setSchedules(prev => prev.filter(s => s.id !== id));
      localStorage.setItem('wateringSchedules', JSON.stringify(schedules));
    }
  };

  const getComplianceMetrics = (schedule) => {
    const affectedPlants = plants.filter(p => p.type === schedule.plantType && schedule.assignedUsers.includes(p.user_id || p.owner_id));
    const totalPlants = affectedPlants.length;

    if (totalPlants === 0) return null;

    const wateringHistories = JSON.parse(localStorage.getItem('wateringHistory')) || [];
    const scheduleWaterings = wateringHistories.filter(w =>
      affectedPlants.some(p => p.id === w.plant_id)
    );

    const complianceRate = totalPlants > 0
      ? Math.round((scheduleWaterings.length / totalPlants) * 100)
      : 0;

    return {
      totalPlants,
      waterings: scheduleWaterings.length,
      complianceRate
    };
  };

  const frequencyTooltips = {
    'daily': 'Water every single day',
    'every-2-days': 'Water on alternating days',
    'every-3-days': 'Water every third day',
    'weekly': 'Water once per week',
    'bi-weekly': 'Water every two weeks',
    'monthly': 'Water once per month'
  };

  return (
    <div className="watering-schedule-manager">
      <header className="schedule-header">
        <h2>💧 Watering Schedule Manager</h2>
        <p>Create and manage watering schedules for different plant types</p>
      </header>

      {/* Add/Edit Schedule Form */}
      {showForm && (
        <div className="schedule-form-container">
          <div className="schedule-form">
            <h3>{editingId ? 'Edit Schedule' : 'Create New Schedule'}</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Schedule Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Succulent Care"
                />
              </div>

              <div className="form-group">
                <label>Plant Type *</label>
                <select
                  name="plantType"
                  value={formData.plantType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Plant Type</option>
                  {plantTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Watering Frequency *</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  title={frequencyTooltips[formData.frequency]}
                >
                  {frequencyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Water Amount (%) *</label>
                <div className="water-amount-input">
                  <input
                    type="range"
                    name="waterAmount"
                    min="10"
                    max="100"
                    value={formData.waterAmount}
                    onChange={handleInputChange}
                  />
                  <span className="water-value">{formData.waterAmount}%</span>
                </div>
              </div>

              <div className="form-group">
                <label>Optimal Time of Day</label>
                <input
                  type="time"
                  name="optimalTimeOfDay"
                  value={formData.optimalTimeOfDay}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* User Assignment */}
            <div className="users-assignment">
              <label>Assign to Users (who maintain these plants)</label>
              <div className="users-checklist">
                {users.map(user => (
                  <div key={user.id} className="user-checkbox">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={formData.assignedUsers.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                    />
                    <label htmlFor={`user-${user.id}`}>
                      {user.username}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Special care instructions, seasonal adjustments, etc."
                rows="4"
              />
            </div>

            {/* Form Buttons */}
            <div className="form-buttons">
              <button className="btn-primary" onClick={handleAddSchedule}>
                {editingId ? '✏️ Update Schedule' : '➕ Create Schedule'}
              </button>
              <button className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedules List */}
      <div className="schedules-container">
        {!showForm && (
          <button className="btn-new-schedule" onClick={() => setShowForm(true)}>
            ➕ Create New Schedule
          </button>
        )}

        <div className="schedules-list">
          {schedules.length === 0 ? (
            <div className="no-schedules">
              <p>📅 No schedules yet. Create one to get started!</p>
            </div>
          ) : (
            schedules.map(schedule => {
              const metrics = getComplianceMetrics(schedule);
              return (
                <div key={schedule.id} className="schedule-card">
                  <div className="schedule-header-info">
                    <h4>{schedule.name}</h4>
                    <span className="plant-type-badge">{schedule.plantType}</span>
                  </div>

                  <div className="schedule-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Frequency</span>
                      <span className="detail-value">
                        {frequencyOptions.find(o => o.value === schedule.frequency)?.label}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Water Amount</span>
                      <span className="detail-value">{schedule.waterAmount}%</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Optimal Time</span>
                      <span className="detail-value">{schedule.optimalTimeOfDay}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Assigned Users</span>
                      <span className="detail-value">
                        {schedule.assignedUsers.length > 0
                          ? schedule.assignedUsers.length + ' user(s)'
                          : 'None'}
                      </span>
                    </div>
                  </div>

                  {/* Compliance Metrics */}
                  {metrics && (
                    <div className="compliance-section">
                      <h5>Compliance Metrics</h5>
                      <div className="metrics-grid">
                        <div className="metric">
                          <span className="metric-label">Plants Affected</span>
                          <span className="metric-value">{metrics.totalPlants}</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Waterings Completed</span>
                          <span className="metric-value">{metrics.waterings}</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Compliance Rate</span>
                          <div className="compliance-bar">
                            <div
                              className="compliance-fill"
                              style={{
                                width: `${metrics.complianceRate}%`,
                                background: metrics.complianceRate >= 80 ? '#27ae60' : metrics.complianceRate >= 50 ? '#f39c12' : '#e74c3c'
                              }}
                            />
                          </div>
                          <span className="compliance-percent">{metrics.complianceRate}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {schedule.notes && (
                    <div className="schedule-notes">
                      <strong>📝 Notes:</strong>
                      <p>{schedule.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="schedule-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
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
  );
};

export default WateringScheduleManager;
