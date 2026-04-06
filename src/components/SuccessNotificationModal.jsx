import React, { useEffect } from 'react';
import '../styles/SuccessNotificationModal.css';

const SuccessNotificationModal = ({ 
  isOpen, 
  title, 
  message, 
  details,
  onClose, 
  autoCloseSeconds = 5 
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseSeconds * 1000);

    return () => clearTimeout(timer);
  }, [isOpen, autoCloseSeconds, onClose]);

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-header">
          <span className="success-icon">✅</span>
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="success-body">
          <p className="success-message">{message}</p>
          {details && (
            <div className="success-details">
              {details}
            </div>
          )}
        </div>

        <div className="success-footer">
          <p className="auto-close-text">
            ⏱️ Closing in {autoCloseSeconds} seconds...
          </p>
          <button className="btn-primary" onClick={onClose}>
            ✓ Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotificationModal;
