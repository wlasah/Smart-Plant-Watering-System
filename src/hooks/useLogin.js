import { useState } from 'react';
import { authAPI } from '../services/api';

export function useLogin(onLogin) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[LOGIN] Starting login process...');
      const response = await authAPI.login(username, password);

      // Determine role based on backend is_staff flag
      const role = response.is_staff ? 'admin' : 'user';

      // Store token and user info
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('currentUser', JSON.stringify({ 
        username: response.username || username,
        email: response.email,
        id: response.id,
        is_staff: response.is_staff,
        role
      }));
      localStorage.setItem('isLoggedIn', 'true');

      console.log('[LOGIN] Login successful - Role:', role);
      if (onLogin) onLogin({ username, email: response.email, role });
    } catch (err) {
      console.error('[LOGIN] Error:', err);
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleSubmit,
    loading
  };
}
