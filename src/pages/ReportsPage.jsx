import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AuditLog from '../components/AuditLog';
import UserActivityLog from '../components/UserActivityLog';
import '../styles/AdminDashboard.css';

const ReportsPage = () => {
  // eslint-disable-next-line no-unused-vars
  const [activityLog, setActivityLog] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Load current user from localStorage (auth only)
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div className="admin-page-wrapper">
      <AdminSidebar currentUser={currentUser} onLogout={() => {}} />
      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="header-content">
            <h1>📋 Reports & Audit Logs</h1>
            <p>Track all system activities and audit trails for security and compliance</p>
          </div>
        </header>

        {/* Audit Log */}
        <section className="admin-section">
          <AuditLog />
        </section>

        {/* Activity Log */}
        <section className="admin-section">
          <UserActivityLog activities={activityLog} />
        </section>
      </div>
    </div>
  );
};

export default ReportsPage;
