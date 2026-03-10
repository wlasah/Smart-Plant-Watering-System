import { useState } from 'react';

export function useRegister(onRegister, navigate) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const role = 'admin'; // All users are admins in this system

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
    users.push({ username, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess(true);
    setError('');
    if (onRegister) onRegister({ username, email, role });
    if (navigate) {
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    }
  };

  return {
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
  };
}
