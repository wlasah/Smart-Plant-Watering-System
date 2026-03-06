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
    <div className="form-page">
      <h2>Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Registration successful! <Link to="/login">Login</Link></div>}
        <button type="submit" className="form-btn">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default RegisterPage;
