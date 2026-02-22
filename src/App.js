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

function App() {
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

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
        <Navigation />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<DashboardPage onNotification={handleNotification} />} />
            <Route path="/plant-care" element={<PlantCarePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/plant/:id" element={<PlantDetailPage />} />
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
