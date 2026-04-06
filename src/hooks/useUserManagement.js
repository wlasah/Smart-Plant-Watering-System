import { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../services/api';

export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, updatedUserData) => {
    try {
      const result = await adminAPI.updateUser(userId, updatedUserData);
      
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(u => u.id === userId ? { ...u, ...result } : u)
      );
      
      console.log(`[ADMIN] User ${userId} updated successfully`);
      return { success: true, user: result };
    } catch (err) {
      console.error('Error updating user:', err);
      return { success: false, error: err.message || 'Failed to update user' };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      
      // Remove from local state
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      
      console.log(`[ADMIN] User ${userId} deleted successfully`);
      return { success: true };
    } catch (err) {
      console.error('Error deleting user:', err);
      return { success: false, error: err.message || 'Failed to delete user' };
    }
  };

  const resetPassword = async (userId, newPassword) => {
    try {
      const result = await adminAPI.resetPassword(userId, newPassword);
      console.log(`[ADMIN] Password reset for user ${userId}`);
      return { success: true, message: result.message };
    } catch (err) {
      console.error('Error resetting password:', err);
      return { success: false, error: err.message || 'Failed to reset password' };
    }
  };

  const addUser = async (newUserData) => {
    try {
      // Register the new user
      const result = await authAPI.register(
        newUserData.username,
        newUserData.email,
        newUserData.password
      );

      // Add to users list (refetch to ensure consistency)
      await fetchUsers();
      
      console.log(`[ADMIN] User ${newUserData.username} created successfully`);
      return { success: true, user: result };
    } catch (err) {
      console.error('Error adding user:', err);
      return { success: false, error: err.message || 'Failed to create user' };
    }
  };

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    resetPassword,
    refetchUsers: fetchUsers,
  };
}
