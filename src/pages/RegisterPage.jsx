import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/FormStyles.css';
import { useRegister } from '../hooks/useRegister';

const RegisterPage = ({ onRegister }) => {
  const navigate = useNavigate();
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    handleSubmit
  } = useRegister(onRegister, navigate);

  return (
    <div className="form-page-wrapper">
      <div className="form-side-decoration"></div>
      <div className="form-page">
        <div className="form-header-section">
          <h1>🌿 Create Admin Account</h1>
          <p>Join the Smart Plant Watering System</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              className="form-input-enhanced"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Choose a username"
              required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              className="form-input-enhanced"
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="your@email.com"
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              className="form-input-enhanced"
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">Registration successful! <Link to="/login">Login now</Link></div>}
          <button type="submit" className="form-btn-large">Create Account</button>
        </form>
        <div className="form-footer">
          <p>Already have an account? <Link to="/login" className="link-primary">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
