import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminUserList from '../components/AdminUserList';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import PasswordResetModal from '../components/PasswordResetModal';
import SuccessNotificationModal from '../components/SuccessNotificationModal';
import SystemOverview from '../components/SystemOverview';
import CriticalPlantsAlert from '../components/CriticalPlantsAlert';
import PlantHealthAlerts from '../components/PlantHealthAlerts';
import { useUserManagement } from '../hooks/useUserManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ onNotification }) => {
  const { users, loading, error, addUser, updateUser, deleteUser, resetPassword, changeRole, refetchUsers } = useUserManagement();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successDetails, setSuccessDetails] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tempPassword, setTempPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [plants, setPlants] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    // Load current user from localStorage (auth only)
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleAddUser = async (userData) => {
    try {
      const result = await addUser(userData);
      if (result.success) {
        setIsAddModalOpen(false);
        
        setSuccessMessage(`New user created successfully!`);
        setSuccessDetails(
          <div>
            <p>✅ The user account has been created and is ready to use.</p>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              User can now log in with their credentials.
            </p>
          </div>
        );
        setIsSuccessModalOpen(true);
        
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
      const hasPasswordChange = userData.password && userData.password.length > 0;
      const result = await updateUser(userId, userData);
      if (result.success) {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        
        setSuccessMessage(`User updated successfully!`);
        
        const detailsParts = [
          '<p>✅ User profile has been updated.</p>',
          `<p><strong>Username:</strong> ${targetUser?.username}</p>`,
          `<p><strong>Email:</strong> ${userData.email || targetUser?.email}</p>`
        ];
        
        if (hasPasswordChange) {
          detailsParts.push('<p style="margin-top: 15px; padding: 12px; background: #fffbea; border-left: 3px solid #ffc107; border-radius: 4px;"><strong>🔐 Password Changed:</strong> The user can now login with the new password.</p>');
        }
        
        setSuccessDetails(
          <div dangerouslySetInnerHTML={{ __html: detailsParts.join('') }} />
        );
        setIsSuccessModalOpen(true);
        
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
          setSuccessMessage(`User "${userToDelete?.username}" deleted successfully!`);
          setSuccessDetails(
            <div>
              <p>✅ The user account has been permanently removed from the system.</p>
              <p><strong>Username:</strong> {userToDelete?.username}</p>
            </div>
          );
          setIsSuccessModalOpen(true);
          
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

  const handleResetPassword = async (userId, newPassword) => {
    setIsResettingPassword(true);
    try {
      console.log(`[AdminDashboard] Starting password reset for user ID: ${userId}`);
      const result = await resetPassword(userId, newPassword);
      console.log(`[AdminDashboard] Password reset result:`, result);
      
      if (result.success) {
        setIsPasswordResetModalOpen(false);
        
        // Show success modal
        setSuccessMessage(`Password reset successfully for user "${selectedUser?.username}"!`);
        setSuccessDetails(
          <div>
            <p><strong>Temporary Password:</strong></p>
            <code style={{ 
              display: 'block', 
              background: '#f0f0f0', 
              padding: '8px', 
              marginTop: '8px',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '1rem',
              wordBreak: 'break-all'
            }}>
              {tempPassword}
            </code>
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              📌 <strong>Important:</strong> Share this password securely with the user. They should change it on first login.
            </p>
          </div>
        );
        setIsSuccessModalOpen(true);
        
        // Refresh users list
        setTimeout(() => {
          refetchUsers();
        }, 1000);
        
        setSelectedUser(null);
        setTempPassword('');
      } else {
        console.error(`[AdminDashboard] Password reset failed:`, result.error);
        if (onNotification) {
          onNotification(`❌ Error resetting password: ${result.error}`, 'error');
        }
      }
    } catch (error) {
      console.error(`[AdminDashboard] Exception during password reset:`, error);
      if (onNotification) {
        onNotification(`❌ Error: ${error.message}`, 'error');
      }
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleOpenPasswordResetModal = (userId) => {
    const user = users.find(u => u.id === userId || u.username === userId);
    if (!user) return;
    
    const tempPassword = `TempPass${Math.floor(Math.random() * 100000)}!`;
    setSelectedUser(user);
    setTempPassword(tempPassword);
    setIsPasswordResetModalOpen(true);
  };

  const handleConfirmPasswordReset = async () => {
    if (selectedUser && tempPassword) {
      await handleResetPassword(selectedUser.id || selectedUser.username, tempPassword);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const result = await changeRole(userId, newRole);
      if (result.success) {
        const userObj = users.find(u => u.id === userId);
        const roleDisplay = newRole === 'admin' ? '👑 Admin' : '👤 User';
        
        setSuccessMessage(`User role changed successfully!`);
        setSuccessDetails(
          <div>
            <p>✅ Role change has been applied to the user account.</p>
            <p><strong>Username:</strong> {userObj?.username}</p>
            <p><strong>New Role:</strong> {roleDisplay}</p>
          </div>
        );
        setIsSuccessModalOpen(true);
        
        if (onNotification) {
          onNotification(`✅ User "${userObj?.username}" role changed to ${newRole}!`, 'success');
        }
      } else {
        if (onNotification) {
          onNotification(`❌ Error changing role: ${result.error}`, 'error');
        }
      }
    } catch (error) {
      if (onNotification) {
        onNotification(`❌ Error changing role: ${error.message}`, 'error');
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
                onResetPassword={handleOpenPasswordResetModal}
                onChangeRole={handleChangeRole}
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

            <PasswordResetModal
              isOpen={isPasswordResetModalOpen}
              userName={selectedUser?.username}
              tempPassword={tempPassword}
              isLoading={isResettingPassword}
              onClose={() => {
                setIsPasswordResetModalOpen(false);
                setSelectedUser(null);
                setTempPassword('');
              }}
              onConfirm={handleConfirmPasswordReset}
            />

            <SuccessNotificationModal
              isOpen={isSuccessModalOpen}
              title="✅ Password Reset Complete"
              message={successMessage}
              details={successDetails}
              autoCloseSeconds={8}
              onClose={() => {
                setIsSuccessModalOpen(false);
                setSuccessMessage('');
                setSuccessDetails(null);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
