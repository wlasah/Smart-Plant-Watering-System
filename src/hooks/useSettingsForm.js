import { useState } from 'react';

const defaultSettings = {
  username: '',
  email: '',
  wateringTime: '08:00',
  alertMethod: 'email',
  notifications: true
};

export function useSettingsForm(userSettings = {}, onSave, onClose) {
  const [formData, setFormData] = useState({ ...defaultSettings, ...userSettings });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await new Promise(res => setTimeout(res, 800));
      setSuccess(true);
      if (onSave) onSave(formData);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    error,
    success,
    handleInputChange,
    handleSubmit
  };
}
