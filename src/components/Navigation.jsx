import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          🌱 Smart Plant System
        </Link>

        <div className="hamburger" onClick={toggleMobileMenu}>
          <span className={isMobileMenuOpen ? 'active' : ''}></span>
          <span className={isMobileMenuOpen ? 'active' : ''}></span>
          <span className={isMobileMenuOpen ? 'active' : ''}></span>
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="icon">📊</span>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/plant-care" 
              className={`nav-link ${isActive('/plant-care') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="icon">🌿</span>
              Plant Care
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/analytics" 
              className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="icon">📈</span>
              Analytics
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/settings" 
              className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="icon">⚙️</span>
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
