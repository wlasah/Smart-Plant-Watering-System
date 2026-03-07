import React, { useState } from 'react';
import AdminUserList from '../components/AdminUserList';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import UserActivityLog from '../components/UserActivityLog';
import SystemOverview from '../components/SystemOverview';
import { useUserManagement } from '../hooks/useUserManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ onNotification }) => {
  const { users, loading, addUser, updateUser, deleteUser, changeUserRole, getActivityLog } = useUserManagement();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const activityLog = getActivityLog();

  const handleAddUser = (userData) => {
    try {
      const newUser = addUser(userData);
      setIsAddModalOpen(false);
      if (onNotification) {
        onNotification(`✅ User "${userData.username}" created successfully!`, 'success');
      }
    } catch (error) {
      if (onNotification) {
        onNotification(`❌ Error creating user: ${error.message}`, 'error');
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = (userId, userData) => {
    try {
      updateUser(userId, userData);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      if (onNotification) {
        onNotification(`✅ User "${userData.username}" updated successfully!`, 'success');
      }
    } catch (error) {
      if (onNotification) {
        onNotification(`❌ Error updating user: ${error.message}`, 'error');
      }
    }
  };

  const handleDeleteUser = (userId) => {
    try {
      const userToDelete = users.find(u => u.id === userId || u.username === userId);
      deleteUser(userId);
      if (onNotification) {
        onNotification(`🗑️ User "${userToDelete?.username}" deleted successfully!`, 'success');
      }
    } catch (error) {
      if (onNotification) {
        onNotification(`❌ Error deleting user: ${error.message}`, 'error');
      }
    }
  };

  const handleChangeRole = (userId, newRole) => {
    try {
      const user = changeUserRole(userId, newRole);
      if (onNotification) {
        onNotification(`✅ User role changed to "${newRole}"!`, 'success');
      }
    } catch (error) {
      if (onNotification) {
        onNotification(`❌ Error changing role: ${error.message}`, 'error');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Manage users, roles, and system activity</p>
        </div>
      </header>

      {loading ? (
        <div className="loading-message">
          <p>Loading admin data...</p>
        </div>
      ) : (
        <>
          {/* System Overview Section */}
          <section className="admin-section">
            <SystemOverview users={users} activityLog={activityLog} />
          </section>

          {/* User Management Section */}
          <section className="admin-section">
            <AdminUserList
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onChangeRole={handleChangeRole}
              onAddUser={() => setIsAddModalOpen(true)}
            />
          </section>

          {/* Activity Log Section */}
          <section className="admin-section">
            <UserActivityLog activities={activityLog} />
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
  );
};

export default AdminDashboard;
