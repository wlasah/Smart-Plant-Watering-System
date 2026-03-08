import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/Pages.css';
import EnhancedSettings from '../components/EnhancedSettings';
import WateringScheduleManager from '../components/WateringScheduleManager';
import PlantTypeLocationManager from '../components/PlantTypeLocationManager';
import AutomatedActionsManager from '../components/AutomatedActionsManager';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('system-config');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const tabs = [
    { id: 'system-config', label: '⚙️ System Configuration' },
    { id: 'watering-schedule', label: '💧 Watering Schedules' },
    { id: 'plant-management', label: '🌱 Plant Type & Location' },
    { id: 'automation', label: '🤖 Automation Rules' }
  ];

  return (
    <div className="admin-page-wrapper">
      <AdminSidebar currentUser={currentUser} onLogout={() => {}} />
      <div className="page-container settings-page">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'system-config' && <EnhancedSettings />}
          {activeTab === 'watering-schedule' && <WateringScheduleManager />}
          {activeTab === 'plant-management' && <PlantTypeLocationManager />}
          {activeTab === 'automation' && <AutomatedActionsManager />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
