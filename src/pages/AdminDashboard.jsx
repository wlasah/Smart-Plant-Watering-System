import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminUserList from '../components/AdminUserList';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import SystemOverview from '../components/SystemOverview';
import CriticalPlantsAlert from '../components/CriticalPlantsAlert';
import PlantHealthAlerts from '../components/PlantHealthAlerts';
import { useUserManagement } from '../hooks/useUserManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ onNotification }) => {
  const { users, loading, error, addUser, updateUser, deleteUser, resetPassword, refetchUsers } = useUserManagement();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [plants, setPlants] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    // Load current user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }
    
    // Load plants and activity log from localStorage
    setPlants(JSON.parse(localStorage.getItem('plants')) || []);
    setActivityLog(JSON.parse(localStorage.getItem('userActivityLog')) || []);
  }, []);

  const handleAddUser = async (userData) => {
    try {
      const result = await addUser(userData);
      if (result.success) {
        setIsAddModalOpen(false);
        if (onNotification) {
          onNotification(`✅ User "${userData.username}" created successfully!`, 'success');
        }
      } else {
        if (onNotification) {
          onNotification(`❌ Error creating user: ${result.error}`, 'error');
        }
      }
    } catch (error) {
      if (onNotification) {
        onNotification(`❌ Error creating user: ${error.message}`, 'error');
      }
    }
  };

  const handleEditUser = (user) => {
    const isSelf = currentUser && (String(user.id) === String(currentUser.id) || user.username === currentUser.username);
    
    // Prevent editing other admins
    if (user.is_staff && !isSelf) {
      if (onNotification) onNotification('❌ Cannot edit other admin accounts', 'error');
      return;
    }
    
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userId, userData) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      if (onNotification) onNotification('❌ User not found', 'error');
      return;
    }

    const isSelf = currentUser && (String(targetUser.id) === String(currentUser.id) || targetUser.username === currentUser.username);
    
    // Prevent updating other admins
    if (targetUser.is_staff && !isSelf) {
      if (onNotification) onNotification('❌ Cannot update other admin accounts', 'error');
      return;
    }
    
    try {
      const result = await updateUser(userId, userData);
      if (result.success) {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        if (onNotification) {
          onNotification(`✅ User updated successfully!`, 'success');
        }
      } else {
        if (onNotification) {
          onNotification(`❌ Error updating user: ${result.error}`, 'error');
        }
      }
    } catch (error) {
      if (onNotification) {
        onNotification(`❌ Error updating user: ${error.message}`, 'error');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    
    // Prevent deleting admin accounts
    if (userToDelete?.is_staff) {
      if (onNotification) onNotification('❌ Cannot delete admin accounts', 'error');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete user "${userToDelete?.username}"? This action cannot be undone.`)) {
      try {
        const result = await deleteUser(userId);
        if (result.success) {
          if (onNotification) {
            onNotification(`🗑️ User "${userToDelete?.username}" deleted successfully!`, 'success');
          }
        } else {
          if (onNotification) {
            onNotification(`❌ Error deleting user: ${result.error}`, 'error');
          }
        }
      } catch (error) {
        if (onNotification) {
          onNotification(`❌ Error deleting user: ${error.message}`, 'error');
        }
      }
    }
  };

  const handleResetPassword = async (userId) => {
    const tempPassword = `TempPass${Math.floor(Math.random() * 100000)}!`;
    if (window.confirm(`Reset password for this user? Temporary password: ${tempPassword}`)) {
      try {
        const result = await resetPassword(userId, tempPassword);
        if (result.success) {
          if (onNotification) {
            onNotification(`✅ Password reset! Temporary password: ${tempPassword}`, 'success');
          }
        } else {
          if (onNotification) {
            onNotification(`❌ Error resetting password: ${result.error}`, 'error');
          }
        }
      } catch (error) {
        if (onNotification) {
          onNotification(`❌ Error resetting password: ${error.message}`, 'error');
        }
      }
    }
  };

  return (
    <div className="admin-page-wrapper">
      <AdminSidebar currentUser={currentUser} onLogout={() => {}} />
      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="header-content">
            <h1>⚙️ Admin Dashboard</h1>
            <p>Manage users, plants, and system activity</p>
          </div>
        </header>

        {loading ? (
          <div className="loading-message">
            <p>Loading admin data...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={refetchUsers} className="btn-secondary">Retry</button>
          </div>
        ) : (
          <>
            {/* System Overview Section */}
            <section className="admin-section">
              <SystemOverview users={users} activityLog={activityLog} />
            </section>

            {/* Alerts Section */}
            <div className="alerts-grid">
              <section className="admin-section alert-section">
                <CriticalPlantsAlert plants={plants} users={users} />
              </section>
              <section className="admin-section alert-section">
                <PlantHealthAlerts plants={plants} />
              </section>
            </div>

            {/* User Management Section */}
            <section className="admin-section">
              <AdminUserList
                users={users}
                currentUser={currentUser}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onResetPassword={handleResetPassword}
                onAddUser={() => setIsAddModalOpen(true)}
              />
            </section>

            {/* Modals */}
            <AddUserModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddUser}
            />

            <EditUserModal
              isOpen={isEditModalOpen}
              user={selectedUser}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
              }}
              onUpdate={handleUpdateUser}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
