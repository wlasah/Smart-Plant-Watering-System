import { useState } from 'react';

export function useLogin(onLogin) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      if (onLogin) onLogin(user);
    } else {
      setError('Invalid username or password');
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleSubmit
  };
}
