import { useState, useEffect } from 'react';

export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
    setLoading(false);
  }, []);

  const addUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...users, userWithId];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Log activity
    logUserActivity('create', `User "${newUser.username}" created`, 'create');

    return userWithId;
  };

  const updateUser = (userId, updatedUserData) => {
    const updatedUsers = users.map(u =>
      (u.id === userId || u.username === userId) ? { ...u, ...updatedUserData } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Log activity
    logUserActivity('update', `User "${updatedUserData.username || userId}" updated`, 'update');

    return updatedUsers.find(u => u.id === userId || u.username === userId);
  };

  const deleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId || u.username === userId);
    const updatedUsers = users.filter(u => u.id !== userId && u.username !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Log activity
    logUserActivity('delete', `User "${userToDelete?.username}" deleted`, 'delete');

    return true;
  };

  const changeUserRole = (userId, newRole) => {
    const updatedUsers = users.map(u =>
      (u.id === userId || u.username === userId) ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const user = updatedUsers.find(u => u.id === userId || u.username === userId);
    // Log activity
    logUserActivity('update', `User "${user?.username}" role changed to "${newRole}"`, 'role_change');

    return user;
  };

  const logUserActivity = (type, description, action) => {
    const activityLog = JSON.parse(localStorage.getItem('userActivityLog')) || [];
    const currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

    activityLog.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type,
      action,
      description,
      performedBy: currentUser?.username || 'system'
    });

    // Keep only last 500 entries
    if (activityLog.length > 500) {
      activityLog.shift();
    }

    localStorage.setItem('userActivityLog', JSON.stringify(activityLog));
  };

  const getActivityLog = () => {
    return JSON.parse(localStorage.getItem('userActivityLog')) || [];
  };

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    changeUserRole,
    getActivityLog,
    logUserActivity
  };
}
