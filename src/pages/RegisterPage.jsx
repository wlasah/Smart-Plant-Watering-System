import React, { useState } from 'react';
import '../styles/FormStyles.css';

const RegisterPage = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === username)) {
      setError('Username already exists');
      return;
    }
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess(true);
    setError('');
    if (onRegister) onRegister({ username, email });
    // Redirect to login after successful registration
    setTimeout(() => {
      window.location.href = '/login';
    }, 1200);
  };

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
