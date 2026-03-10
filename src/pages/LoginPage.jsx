import React from 'react';
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
          {error && <div className="form-error">{error}</div>}
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
