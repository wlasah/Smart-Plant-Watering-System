import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/AdminSidebar.css';

const AdminSidebar = ({ onLogout, currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/login', { replace: true });
    if (onLogout) onLogout();
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/all-plants', label: 'All Users\' Plants', icon: '🌍' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <>
      <div
        className={`mobile-sidebar-backdrop ${isMobileOpen ? 'show' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />
      <button
        className="mobile-menu-trigger"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'open' : ''}`}>
        {/* Header with toggle */}
        <div className="sidebar-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
          <button
            className="mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

      {/* Admin Profile Section */}
      <div className="admin-profile">
        <div className="profile-avatar">
          {currentUser?.username?.charAt(0).toUpperCase() || '👤'}
        </div>
        {!isCollapsed && (
          <div className="profile-info">
            <h3>{currentUser?.username || 'Admin'}</h3>
            <p className="profile-role">{currentUser?.role?.toUpperCase()}</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="sidebar-divider"></div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-menu-item ${isActive(item.path) ? 'active' : ''}`}
            title={isCollapsed ? item.label : ''}
          >
            <span className="menu-icon">{item.icon}</span>
            {!isCollapsed && <span className="menu-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="sidebar-divider"></div>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <span className="logout-icon">🚪</span>
          {!isCollapsed && <span className="logout-text">Logout</span>}
        </button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;
