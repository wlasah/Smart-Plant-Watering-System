import React, { useState } from 'react';
import '../styles/PasswordResetModal.css';

const PasswordResetModal = ({ isOpen, userName, tempPassword, onClose, onConfirm, isLoading }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    onConfirm();
    setCopied(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal password-reset-modal">
        <div className="modal-header">
          <h2>🔑 Password Reset</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="reset-info">
            <p>Password reset for user:</p>
            <div className="username-box">
              <strong>{userName}</strong>
            </div>
          </div>

          <div className="password-section">
            <label>Temporary Password:</label>
            <div className="password-display">
              <code className="password-text">{tempPassword}</code>
              <button 
                className={`btn-copy ${copied ? 'copied' : ''}`}
                onClick={handleCopyPassword}
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>

          <div className="warning-box">
            <p><strong>📌 Important:</strong></p>
            <ul>
              <li>Share this password securely with the user</li>
              <li>The user should change it on first login</li>
              <li>This password will be visible here only once</li>
              <li>Do NOT share via unencrypted channels</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="btn-primary"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? '⟳ Resetting...' : '✅ Confirm & Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
