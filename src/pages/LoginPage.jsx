import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FormStyles.css';
import { useLogin } from '../hooks/useLogin';

const LoginPage = ({ onLogin }) => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleSubmit
  } = useLogin(onLogin);
  const [displayError, setDisplayError] = useState('');

  // Update error display when error changes
  useEffect(() => {
    if (error) {
      setDisplayError(error);
      // Auto-dismiss error after 5 seconds
      const timer = setTimeout(() => setDisplayError(''), 5000);
      return () => clearTimeout(timer);
    } else {
      setDisplayError('');
    }
  }, [error]);

  return (
    <div className="form-page-wrapper">
      <div className="form-side-decoration"></div>
      <div className="form-page">
        <div className="form-header-section">
          <h1>🌿 Smart Plant Watering</h1>
          <p>Admin Dashboard</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              className="form-input-enhanced"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Enter your username"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              className="form-input-enhanced"
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          {displayError && (
            <div className="login-error-box">
              <span className="error-icon">❌</span>
              <div className="error-content">
                <p className="error-title">Login Failed</p>
                <p className="error-message">{displayError}</p>
              </div>
              <button 
                type="button"
                className="error-close"
                onClick={() => setDisplayError('')}
              >
                ✕
              </button>
            </div>
          )}
          <button type="submit" className="form-btn-large">Sign In</button>
        </form>
        <div className="form-footer">
          <p>Don't have an account? <Link to="/register" className="link-primary">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
