import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = ({ isLoggedIn, onLogout, currentUser }) => {
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

  // Hide navigation tabs during login/register
  const hideTabs = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          🌱 Smart Plant System
        </Link>
        {!hideTabs && (
          <>
            <div className="hamburger" onClick={toggleMobileMenu}>
              <span className={isMobileMenuOpen ? 'active' : ''}></span>
              <span className={isMobileMenuOpen ? 'active' : ''}></span>
              <span className={isMobileMenuOpen ? 'active' : ''}></span>
            </div>
            <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
              {isLoggedIn && (
                <>
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
                      to="/analytics" 
                      className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <span className="icon">📈</span>
                      Analytics
                    </Link>
                  </li>
                  {currentUser?.role === 'admin' && (
                    <>
                      <li className="nav-item">
                        <Link
                          to="/reports"
                          className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
                          onClick={closeMobileMenu}
                        >
                          <span className="icon">📋</span>
                          Reports
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link 
                      to="/login" 
                      className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <span className="icon">🔑</span>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      to="/register" 
                      className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <span className="icon">📝</span>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
