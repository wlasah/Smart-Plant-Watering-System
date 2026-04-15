import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

export function useSystemStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlants: 0,
    healthyPlants: 0,
    needsAttentionPlants: 0,
    averageMoisture: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        console.log('[STATS] Starting fetch...');
        console.log('[STATS] Auth token:', localStorage.getItem('auth_token')?.substring(0, 10) + '...');

        // Fetch users from API
        console.log('[STATS] Fetching users...');
        const usersData = await adminAPI.getAllUsers();
        const totalUsers = usersData.length;
        console.log('[STATS] Users fetched:', totalUsers, usersData);

        // Fetch admin plant statistics (all plants across all users)
        console.log('[STATS] Fetching admin stats...');
        const plantStats = await adminAPI.getAdminStats();
        console.log('[STATS] Admin stats fetched:', plantStats);
        
        setStats({
          totalUsers,
          totalPlants: plantStats.total_plants || 0,
          healthyPlants: plantStats.healthy || 0,
          needsAttentionPlants: plantStats.needing_water || 0,
          averageMoisture: Math.round(plantStats.average_moisture || 0),
          loading: false,
          error: null
        });
        console.log('[STATS] Stats updated successfully');
      } catch (error) {
        console.error('[STATS] Error fetching system stats from API:', error);
        console.error('[STATS] Full error object:', JSON.stringify(error, null, 2));
        
        // Fallback to empty state
        setStats(prev => ({ 
          ...prev, 
          totalUsers: 0,
          totalPlants: 0,
          healthyPlants: 0,
          needsAttentionPlants: 0,
          averageMoisture: 0,
          loading: false,
          error: error.message || 'Failed to fetch stats'
        }));
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds for real-time updates
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}