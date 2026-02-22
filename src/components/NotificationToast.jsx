import React, { useEffect } from 'react';
import '../styles/NotificationToast.css';

const NotificationToast = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  isVisible, 
  onClose 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💧';
    }
  };

  return (
    <div className={`toast toast--${type}`}>
      <span className="toast__icon">{getIcon()}</span>
      <p className="toast__message">{message}</p>
      <button 
        className="toast__close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationToast;
