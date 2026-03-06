import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>403</h1>
        <p>Unauthorized Access</p>
        <p className="description">
          You don't have permission to access this page. Only admin users can access this area.
        </p>
        <button
          className="back-button"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
