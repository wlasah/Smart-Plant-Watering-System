import React from 'react';
import AdminDashboard from './AdminDashboard';
import DashboardComponent from '../components/Dashboard';
import '../styles/DashboardPage.css';

const DashboardPage = ({ onNotification }) => {
  const currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="dashboard-page">
      {isAdmin ? (
        <AdminDashboard onNotification={onNotification} />
      ) : (
        <DashboardComponent onNotification={onNotification} />
      )}
    </div>
  );
};

export default DashboardPage;
