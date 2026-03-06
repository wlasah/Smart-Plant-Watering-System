import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

// Internal component to access useNavigate and useLocation
function AppContent({ isLoggedIn, setIsLoggedIn, notification, setNotification, closeNotification, handleNotification }) {
  const navigate = useNavigate();
  const location = useLocation(); // Track location changes to force re-renders

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogin = useCallback((user) => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    // Navigate to dashboard after login using React Router
    navigate('/');
  }, [navigate, setIsLoggedIn]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    // Navigate to login after logout using React Router
    navigate('/login', { replace: true });
  }, [navigate, setIsLoggedIn]);

  return (
    <>
      <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
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
    </>
  );
}

function App() {
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // Listen for localStorage changes to update nav in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({
      isVisible: true,
      message,
      type
    });
    setTimeout(() => {
      closeNotification();
    }, 3000);
  }, [closeNotification]);

  const handleNotification = useCallback((message, type = 'success') => {
    showNotification(message, type);
  }, [showNotification]);

  return (
    <Router>
      <div className="App">
        <AppContent 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
          notification={notification}
          setNotification={setNotification}
          closeNotification={closeNotification}
          handleNotification={handleNotification}
        />
      </div>
    </Router>
  );
}

export default App;