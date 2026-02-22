import React from 'react';
import DashboardComponent from '../components/Dashboard';
import '../styles/DashboardPage.css';

const DashboardPage = ({ onNotification }) => {
  return (
    <div className="dashboard-page">
      <DashboardComponent onNotification={onNotification} />
    </div>
  );
};

export default DashboardPage;
