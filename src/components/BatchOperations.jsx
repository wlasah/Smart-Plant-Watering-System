import React, { useState } from 'react';

const BatchOperations = ({ users, plants }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [operation, setOperation] = useState('');
  const [operationData, setOperationData] = useState({});

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handlePlantSelect = (plantId) => {
    setSelectedPlants(prev => 
      prev.includes(plantId) 
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(users.map(u => u.id));
  };

  const selectAllPlants = () => {
    setSelectedPlants(plants.map(p => p.id));
  };

  const clearSelections = () => {
    setSelectedUsers([]);
    setSelectedPlants([]);
  };

  const executeBatchOperation = () => {
    if (selectedUsers.length === 0 && selectedPlants.length === 0) {
      alert('Please select users or plants to perform the operation on.');
      return;
    }

    if (!operation) {
      alert('Please select an operation to perform.');
      return;
    }

    // Mock batch operation execution
    let message = `Batch operation "${operation}" executed successfully!\n\n`;
    
    if (selectedUsers.length > 0) {
      message += `Affected users: ${selectedUsers.length}\n`;
    }
    
    if (selectedPlants.length > 0) {
      message += `Affected plants: ${selectedPlants.length}\n`;
    }

    // In a real app, this would make API calls
    alert(message);

    // Reset form
    setSelectedUsers([]);
    setSelectedPlants([]);
    setOperation('');
    setOperationData({});
  };

  const renderOperationForm = () => {
    switch (operation) {
      case 'send_reminder':
        return (
          <div className="operation-form">
            <div className="form-group">
              <label>Reminder Type</label>
              <select
                value={operationData.reminderType || ''}
                onChange={(e) => setOperationData({...operationData, reminderType: e.target.value})}
              >
                <option value="">Select type</option>
                <option value="watering">Watering Reminder</option>
                <option value="maintenance">Maintenance Reminder</option>
                <option value="health_check">Health Check</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={operationData.message || ''}
                onChange={(e) => setOperationData({...operationData, message: e.target.value})}
                placeholder="Custom reminder message"
                rows="3"
              />
            </div>
          </div>
        );

      case 'update_schedule':
        return (
          <div className="operation-form">
            <div className="form-group">
              <label>New Watering Frequency</label>
              <select
                value={operationData.frequency || ''}
                onChange={(e) => setOperationData({...operationData, frequency: e.target.value})}
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="every_2_days">Every 2 days</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
              </select>
            </div>
            <div className="form-group">
              <label>Water Amount (ml)</label>
              <input
                type="number"
                value={operationData.amount || ''}
                onChange={(e) => setOperationData({...operationData, amount: e.target.value})}
                placeholder="Amount per watering"
              />
            </div>
          </div>
        );

      case 'bulk_notification':
        return (
          <div className="operation-form">
            <div className="form-group">
              <label>Notification Title</label>
              <input
                type="text"
                value={operationData.title || ''}
                onChange={(e) => setOperationData({...operationData, title: e.target.value})}
                placeholder="Notification title"
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={operationData.message || ''}
                onChange={(e) => setOperationData({...operationData, message: e.target.value})}
                placeholder="Notification message"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={operationData.priority || 'normal'}
                onChange={(e) => setOperationData({...operationData, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="batch-operations">
      <header className="analytics-header">
        <h2>⚙️ Batch Operations</h2>
        <p>Perform bulk actions on users and plants</p>
      </header>

      {/* Selection Section */}
      <section className="analytics-section">
        <h3>Select Targets</h3>
        
        <div className="selection-controls">
          <button onClick={selectAllUsers} className="select-all-btn">
            Select All Users ({users.length})
          </button>
          <button onClick={selectAllPlants} className="select-all-btn">
            Select All Plants ({plants.length})
          </button>
          <button onClick={clearSelections} className="clear-btn">
            Clear All
          </button>
        </div>

        <div className="selection-grids">
          <div className="selection-group">
            <h4>Users ({selectedUsers.length} selected)</h4>
            <div className="selection-list">
              {users.map(user => (
                <label key={user.id} className="selection-item">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelect(user.id)}
                  />
                  <span>{user.username} ({user.role})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="selection-group">
            <h4>Plants ({selectedPlants.length} selected)</h4>
            <div className="selection-list">
              {plants.map(plant => (
                <label key={plant.id} className="selection-item">
                  <input
                    type="checkbox"
                    checked={selectedPlants.includes(plant.id)}
                    onChange={() => handlePlantSelect(plant.id)}
                  />
                  <span>{plant.name} ({plant.location}) - {plant.moistureLevel}%</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operation Selection */}
      <section className="analytics-section">
        <h3>Select Operation</h3>
        <div className="operation-selection">
          <label className="operation-option">
            <input
              type="radio"
              name="operation"
              value="send_reminder"
              checked={operation === 'send_reminder'}
              onChange={(e) => setOperation(e.target.value)}
            />
            <span>📢 Send Reminder</span>
          </label>
          <label className="operation-option">
            <input
              type="radio"
              name="operation"
              value="update_schedule"
              checked={operation === 'update_schedule'}
              onChange={(e) => setOperation(e.target.value)}
            />
            <span>📅 Update Watering Schedule</span>
          </label>
          <label className="operation-option">
            <input
              type="radio"
              name="operation"
              value="bulk_notification"
              checked={operation === 'bulk_notification'}
              onChange={(e) => setOperation(e.target.value)}
            />
            <span>🔔 Send Bulk Notification</span>
          </label>
        </div>

        {renderOperationForm()}
      </section>

      {/* Execute Operation */}
      <section className="analytics-section">
        <div className="execution-summary">
          <h3>Operation Summary</h3>
          <div className="summary-details">
            <p><strong>Operation:</strong> {operation || 'None selected'}</p>
            <p><strong>Target Users:</strong> {selectedUsers.length}</p>
            <p><strong>Target Plants:</strong> {selectedPlants.length}</p>
            <p><strong>Total Targets:</strong> {selectedUsers.length + selectedPlants.length}</p>
          </div>
          
          <button 
            onClick={executeBatchOperation}
            className="execute-btn"
            disabled={!operation || (selectedUsers.length === 0 && selectedPlants.length === 0)}
          >
            🚀 Execute Batch Operation
          </button>
        </div>
      </section>

      {/* Operation History */}
      <section className="analytics-section">
        <h3>Recent Batch Operations</h3>
        <div className="operation-history">
          <div className="history-item">
            <div className="history-header">
              <span className="operation-name">Send Watering Reminders</span>
              <span className="operation-date">2 hours ago</span>
            </div>
            <p className="history-details">Sent to 15 users, 45 plants affected</p>
          </div>
          <div className="history-item">
            <div className="history-header">
              <span className="operation-name">Update Schedules</span>
              <span className="operation-date">1 day ago</span>
            </div>
            <p className="history-details">Updated watering schedules for 23 plants</p>
          </div>
          <div className="history-item">
            <div className="history-header">
              <span className="operation-name">Bulk Notification</span>
              <span className="operation-date">3 days ago</span>
            </div>
            <p className="history-details">System maintenance notification sent to all users</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BatchOperations;