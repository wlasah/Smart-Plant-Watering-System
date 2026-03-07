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
    <div className="form-page">
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="form-btn">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default LoginPage;
