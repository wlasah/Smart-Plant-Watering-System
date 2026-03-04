import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navigation from './components/Navigation';
import NotificationToast from './components/NotificationToast';

// Pages
import DashboardPage from './pages/DashboardPage';
import PlantCarePage from './pages/PlantCarePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import PlantDetailPage from './pages/PlantDetailPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = useCallback((user) => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  }, []);

  // Show notification helper
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({
      isVisible: true,
      message,
      type
    });
    setTimeout(() => {
      closeNotification();
    }, 3000);
  }, []);

  // Close notification helper
  const closeNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const handleNotification = useCallback((message, type = 'success') => {
    showNotification(message, type);
  }, [showNotification]);

  return (
    <Router>
      <div className="App">
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={() => window.location.href = '/'} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage onNotification={handleNotification} />
              </ProtectedRoute>
            } />
            <Route path="/plant-care" element={
              <ProtectedRoute>
                <PlantCarePage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/plant/:id" element={
              <ProtectedRoute>
                <PlantDetailPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {notification.isVisible && (
          <NotificationToast 
            message={notification.message} 
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
