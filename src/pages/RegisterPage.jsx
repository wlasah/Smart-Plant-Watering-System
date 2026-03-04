import React from 'react';
import '../styles/FormStyles.css';
import { useRegister } from '../hooks/useRegister';

const RegisterPage = ({ onRegister }) => {
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
  } = useRegister(onRegister);

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
        {success && <div className="form-success">Registration successful! <a href="/login">Login</a></div>}
        <button type="submit" className="form-btn">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default RegisterPage;
