import React, { useState, useEffect } from 'react';
import '../styles/AutomatedActionsManager.css';

const AutomatedActionsManager = () => {
  const [automationRules, setAutomationRules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [plants, setPlants] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    trigger: 'low-moisture',
    triggerValue: 30,
    action: 'send-notification',
    actionDetails: '',
    enabled: true,
    appliesTo: 'all-plants',
    specificPlants: [],
    specificUsers: [],
    frequency: 'once-per-day'
  });

  useEffect(() => {
    const saved = localStorage.getItem('automationRules');
    if (saved) {
      setAutomationRules(JSON.parse(saved));
    }

    setPlants(JSON.parse(localStorage.getItem('plants')) || []);
    setUsers(JSON.parse(localStorage.getItem('users')) || []);
  }, []);

  const triggers = [
    { value: 'low-moisture', label: '💧 Low Moisture Level' },
    { value: 'high-moisture', label: '🌊 High Moisture Level' },
    { value: 'overdue-watering', label: '⏰ Overdue Watering' },
    { value: 'no-activity', label: '⏸️ No Activity for Days' }
  ];

  const actions = [
    { value: 'send-notification', label: '📬 Send Notification' },
    { value: 'water-plant', label: '💦 Water Plant' },
    { value: 'archive-plant', label: '📦 Archive Plant' },
    { value: 'alert-user', label: '🚨 Alert User' },
    { value: 'adjust-schedule', label: '📅 Adjust Schedule' }
  ];

  const frequencies = [
    { value: 'once-per-day', label: 'Once Per Day' },
    { value: 'twice-per-day', label: 'Twice Per Day' },
    { value: 'every-12-hours', label: 'Every 12 Hours' },
    { value: 'every-6-hours', label: 'Every 6 Hours' },
    { value: 'once-per-week', label: 'Once Per Week' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlantToggle = (plantId) => {
    setFormData(prev => ({
      ...prev,
      specificPlants: prev.specificPlants.includes(plantId)
        ? prev.specificPlants.filter(id => id !== plantId)
        : [...prev.specificPlants, plantId]
    }));
  };

  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      specificUsers: prev.specificUsers.includes(userId)
        ? prev.specificUsers.filter(id => id !== userId)
        : [...prev.specificUsers, userId]
    }));
  };

  const handleAddOrUpdateRule = () => {
    if (!formData.name) {
      alert('Please enter a rule name');
      return;
    }

    if (editingId) {
      setAutomationRules(prev =>
        prev.map(r => r.id === editingId ? { ...formData, id: editingId } : r)
      );
      setEditingId(null);
    } else {
      const newRule = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastTriggered: null,
        triggerCount: 0
      };
      setAutomationRules(prev => [newRule, ...prev]);
    }

    localStorage.setItem('automationRules', JSON.stringify(automationRules));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      trigger: 'low-moisture',
      triggerValue: 30,
      action: 'send-notification',
      actionDetails: '',
      enabled: true,
      appliesTo: 'all-plants',
      specificPlants: [],
      specificUsers: [],
      frequency: 'once-per-day'
    });
    setShowForm(false);
  };

  const handleEditRule = (rule) => {
    setFormData(rule);
    setEditingId(rule.id);
    setShowForm(true);
  };

  const handleDeleteRule = (id) => {
    if (window.confirm('Delete this automation rule?')) {
      setAutomationRules(prev => prev.filter(r => r.id !== id));
      localStorage.setItem('automationRules', JSON.stringify(automationRules));
    }
  };

  const handleToggleRule = (id) => {
    setAutomationRules(prev => {
      const updated = prev.map(r =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      );
      localStorage.setItem('automationRules', JSON.stringify(updated));
      return updated;
    });
  };

  const getTriggerDescription = (rule) => {
    const trigger = triggers.find(t => t.value === rule.trigger);
    if (rule.trigger === 'low-moisture' || rule.trigger === 'high-moisture') {
      return `${trigger.label}: ${rule.triggerValue}%`;
    }
    return trigger?.label || rule.trigger;
  };

  const getActionDescription = (rule) => {
    const action = actions.find(a => a.value === rule.action);
    return action?.label || rule.action;
  };

  const getAffectedPlants = (rule) => {
    if (rule.appliesTo === 'all-plants') {
      return plants.length;
    }
    return rule.specificPlants.length;
  };

  return (
    <div className="automated-actions-manager">
      <header className="automation-header">
        <h2>⚙️ Automated Actions Manager</h2>
        <p>Set up rules to automatically manage your plants</p>
      </header>

      {showForm && (
        <div className="form-container">
          <div className="automation-form">
            <h3>{editingId ? 'Edit Automation Rule' : 'Create New Automation Rule'}</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Rule Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Low Moisture Alert"
                />
              </div>

              <div className="form-group">
                <label>Trigger *</label>
                <select
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleInputChange}
                >
                  {triggers.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {(formData.trigger === 'low-moisture' || formData.trigger === 'high-moisture') && (
                <div className="form-group">
                  <label>Trigger Value ({formData.trigger === 'low-moisture' ? 'below' : 'above'}) %</label>
                  <input
                    type="number"
                    name="triggerValue"
                    min="0"
                    max="100"
                    value={formData.triggerValue}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Action *</label>
                <select
                  name="action"
                  value={formData.action}
                  onChange={handleInputChange}
                >
                  {actions.map(a => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                >
                  {frequencies.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Action Details</label>
                <textarea
                  name="actionDetails"
                  value={formData.actionDetails}
                  onChange={handleInputChange}
                  placeholder="Additional details for this action"
                  rows="3"
                />
              </div>
            </div>

            {/* Applies To */}
            <div className="rule-scope-section">
              <h4>Scope</h4>
              <div className="scope-options">
                <div className="scope-option">
                  <input
                    type="radio"
                    id="scope-all"
                    name="appliesTo"
                    value="all-plants"
                    checked={formData.appliesTo === 'all-plants'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="scope-all">Apply to All Plants</label>
                </div>

                <div className="scope-option">
                  <input
                    type="radio"
                    id="scope-specific"
                    name="appliesTo"
                    value="specific-plants"
                    checked={formData.appliesTo === 'specific-plants'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="scope-specific">Apply to Specific Plants</label>
                </div>

                <div className="scope-option">
                  <input
                    type="radio"
                    id="scope-users"
                    name="appliesTo"
                    value="specific-users"
                    checked={formData.appliesTo === 'specific-users'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="scope-users">Apply to Specific Users</label>
                </div>
              </div>

              {formData.appliesTo === 'specific-plants' && (
                <div className="selection-list">
                  <label>Select Plants:</label>
                  <div className="items-checklist">
                    {plants.map(plant => (
                      <div key={plant.id} className="item-checkbox">
                        <input
                          type="checkbox"
                          id={`plant-${plant.id}`}
                          checked={formData.specificPlants.includes(plant.id)}
                          onChange={() => handlePlantToggle(plant.id)}
                        />
                        <label htmlFor={`plant-${plant.id}`}>{plant.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.appliesTo === 'specific-users' && (
                <div className="selection-list">
                  <label>Select Users:</label>
                  <div className="items-checklist">
                    {users.map(user => (
                      <div key={user.id} className="item-checkbox">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={formData.specificUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                        />
                        <label htmlFor={`user-${user.id}`}>{user.username}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={handleInputChange}
                />
                Enabled
              </label>
            </div>

            <div className="form-buttons">
              <button className="btn-primary" onClick={handleAddOrUpdateRule}>
                {editingId ? '✏️ Update Rule' : '➕ Create Rule'}
              </button>
              <button className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="rules-section">
        {!showForm && (
          <button className="btn-new-rule" onClick={() => setShowForm(true)}>
            ➕ Create New Rule
          </button>
        )}

        <div className="rules-list">
          {automationRules.length === 0 ? (
            <div className="no-rules">
              <p>📋 No automation rules yet. Create one to get started!</p>
            </div>
          ) : (
            automationRules.map(rule => (
              <div key={rule.id} className={`rule-card ${rule.enabled ? 'active' : 'inactive'}`}>
                <div className="rule-header">
                  <div className="rule-title-section">
                    <h4>{rule.name}</h4>
                    <span className={`status-badge ${rule.enabled ? 'enabled' : 'disabled'}`}>
                      {rule.enabled ? '🟢 Active' : '⚫ Inactive'}
                    </span>
                  </div>

                  <button
                    className={`btn-toggle ${rule.enabled ? 'on' : 'off'}`}
                    onClick={() => handleToggleRule(rule.id)}
                    title="Toggle rule"
                  >
                    {rule.enabled ? '✔️' : '✕'}
                  </button>
                </div>

                <div className="rule-condition">
                  <span className="condition-label">When:</span>
                  <span className="condition-value">{getTriggerDescription(rule)}</span>
                </div>

                <div className="rule-action">
                  <span className="action-label">Then:</span>
                  <span className="action-value">{getActionDescription(rule)}</span>
                </div>

                <div className="rule-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Frequency</span>
                    <span className="detail-value">{rule.frequency.replace(/-/g, ' ')}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Applies To</span>
                    <span className="detail-value">
                      {rule.appliesTo === 'all-plants' ? 'All Plants' : `${getAffectedPlants(rule)} items`}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Triggers</span>
                    <span className="detail-value">{rule.triggerCount || 0}</span>
                  </div>

                  {rule.lastTriggered && (
                    <div className="detail-item">
                      <span className="detail-label">Last Triggered</span>
                      <span className="detail-value">
                        {new Date(rule.lastTriggered).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {rule.actionDetails && (
                  <div className="rule-notes">
                    <strong>📝 Details:</strong>
                    <p>{rule.actionDetails}</p>
                  </div>
                )}

                <div className="rule-actions">
                  <button className="btn-edit" onClick={() => handleEditRule(rule)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteRule(rule.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Automation Tips */}
      <div className="automation-tips">
        <h3>💡 Automation Tips</h3>
        <ul>
          <li>Create rules to automatically water plants when moisture drops below a threshold</li>
          <li>Set up notifications to alert you about plant problems before they become critical</li>
          <li>Use frequency settings to prevent alert fatigue - choose appropriate intervals</li>
          <li>Combine multiple rules with different triggers for comprehensive plant care automation</li>
          <li>Rules only apply when enabled - disable rules you want to keep but not use currently</li>
        </ul>
      </div>
    </div>
  );
};

export default AutomatedActionsManager;
