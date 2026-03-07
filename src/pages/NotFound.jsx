import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>404</h1>
        <p>Page Not Found</p>
        <p className="description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button 
          className="back-button" 
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
