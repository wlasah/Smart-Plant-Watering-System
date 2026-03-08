import React, { useState } from 'react';
import '../styles/Pages.css';
import EnhancedSettings from '../components/EnhancedSettings';
import WateringScheduleManager from '../components/WateringScheduleManager';
import PlantTypeLocationManager from '../components/PlantTypeLocationManager';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('system-config');

  const tabs = [
    { id: 'system-config', label: '⚙️ System Configuration' },
    { id: 'watering-schedule', label: '💧 Watering Schedules' },
    { id: 'plant-management', label: '🌱 Plant Type & Location' }
  ];

  return (
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
      </div>
    </div>
  );
};

export default SettingsPage;
