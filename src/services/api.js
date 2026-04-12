/**
 * API Service for Smart Plant Watering System Web App
 * Uses environment variables for backend URL configuration
 */

// Get API URL from environment or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

console.log(`[API] Environment: ${process.env.REACT_APP_ENV || 'development'}`);
console.log(`[API] Connecting to: ${API_BASE_URL}`);

/**
 * Helper function to make API requests with authentication token
 */
const fetchWithToken = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers.Authorization = `Token ${token}`;
    }
    
    let response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (networkError) {
      console.error(`[API] Network error on ${endpoint}:`, networkError);
      throw {
        status: 0,
        message: 'Network request failed. Please check your connection.',
        error: networkError.message,
      };
    }
    
    if (!response.ok) {
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw {
          status: response.status,
          message: 'Server error - invalid response',
          error: e.message,
        };
      }
      throw {
        status: response.status,
        message: data.detail || data.message || 'An error occurred',
        data,
      };
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return { success: true };
    }
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw {
        status: response.status,
        message: 'Invalid response from server',
        error: e.message,
      };
    }
    
    return data;
  } catch (error) {
    console.error(`[API] Error on ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * Register a new user
   */
  register: async (username, email, password) => {
    try {
      // NOW: Backend handles spaces! Don't convert them
      const cleanUsername = username.trim();
      
      const response = await fetch(`${API_BASE_URL}/users/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          email,
          password,
          password_confirm: password,
        }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw {
          status: response.status,
          message: 'Invalid response from server',
          error: e.message,
        };
      }
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: data.detail || data.message || 'Registration failed',
          data,
        };
      }
      
      return data;
    } catch (networkError) {
      console.error('Registration network error:', networkError);
      throw {
        status: 0,
        message: 'Network request failed. Check server status.',
        error: networkError.message,
      };
    }
  },

  /**
   * Register an admin user (only if no superusers exist)
   */
  registerAdmin: async (username, email, password, token = null) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Token ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/users/register_admin/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirm: password,
        }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw {
          status: response.status,
          message: 'Invalid response from server',
          error: e.message,
        };
      }
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: data.detail || data.message || data.error || 'Admin registration failed',
          data,
        };
      }
      
      return data;
    } catch (networkError) {
      console.error('Admin registration network error:', networkError);
      throw {
        status: 0,
        message: 'Network request failed. Check server status.',
        error: networkError.message,
      };
    }
  },

  /**
   * Login user and get token
   */
  login: async (username, password) => {
    try {
      // NOW: Backend handles spaces! Don't convert them
      const cleanUsername = username.trim();
      
      console.log(`[AUTH] Attempting login for user: ${cleanUsername}`);
      console.log(`[AUTH] Login endpoint: ${API_BASE_URL}/users/login/`);
      
      const response = await fetch(`${API_BASE_URL}/users/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password }),
      });
      
      console.log(`[AUTH] Response status: ${response.status}`);
      
      let data;
      try {
        data = await response.json();
        console.log(`[AUTH] Response data:`, data);
      } catch (e) {
        console.error('[AUTH] JSON parse error:', e);
        throw {
          status: response.status,
          message: 'Invalid response from server',
          error: e.message,
        };
      }
      
      if (!response.ok) {
        const errorMsg = data.detail || data.message || data.non_field_errors?.[0] || 'Login failed';
        console.error(`[AUTH] Login failed: ${errorMsg}`, data);
        throw {
          status: response.status,
          message: errorMsg,
          data,
        };
      }
      
      console.log('[AUTH] Login successful, token:', data.token?.substring(0, 10) + '...');
      return data;
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      if (error.message?.includes('Network')) {
        throw {
          status: 0,
          message: 'Cannot connect to server. Make sure Django is running on http://localhost:8000',
          error: error.message,
        };
      }
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: () => fetchWithToken('/users/me/'),

  /**
   * Logout (delete token)
   */
  logout: () => fetchWithToken('/users/logout/', { method: 'POST' }),
};

/**
 * Plants API endpoints
 */
export const plantsAPI = {
  /**
   * Get all plants for current user
   */
  getAllPlants: () => fetchWithToken('/plants/'),

  /**
   * Get a specific plant by ID
   */
  getPlant: (plantId) => fetchWithToken(`/plants/${plantId}/`),

  /**
   * Create a new plant
   */
  createPlant: (plantData) =>
    fetchWithToken('/plants/', {
      method: 'POST',
      body: JSON.stringify(plantData),
    }),

  /**
   * Update an existing plant
   */
  updatePlant: (plantId, plantData) =>
    fetchWithToken(`/plants/${plantId}/`, {
      method: 'PUT',
      body: JSON.stringify(plantData),
    }),

  /**
   * Delete a plant
   */
  deletePlant: (plantId) =>
    fetchWithToken(`/plants/${plantId}/`, {
      method: 'DELETE',
    }),

  /**
   * Water a plant and record in history
   */
  waterPlant: (plantId, notes = '') =>
    fetchWithToken(`/plants/${plantId}/water/`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  /**
   * Get plants that need watering (moisture < 40%)
   */
  getPlantsNeedingWater: () => fetchWithToken('/plants/needing_water/'),

  /**
   * Get statistics about plants
   */
  getStats: () => {
    console.log('[STATS] Fetching plant statistics');
    return fetchWithToken('/plants/stats/').then(data => {
      console.log('[STATS] Received:', data);
      return data;
    }).catch(error => {
      console.error('[STATS] Error:', error);
      throw error;
    });
  },

  /**
   * Get all plants across all users (admin only) - for analytics and reporting
   */
  getAllPlantsAdmin: () =>
    fetchWithToken('/plants/all_plants/'),
};

/**
 * Watering History API endpoints
 */
export const historyAPI = {
  /**
   * Get all watering history for current user
   */
  getHistory: () => fetchWithToken('/watering-history/'),

  /**
   * Get watering history for a specific plant
   */
  getPlantHistory: (plantId) =>
    fetchWithToken(`/watering-history/by_plant/?plant_id=${plantId}`),

  /**
   * Get all watering history across all users (admin only) - for analytics and reporting
   */
  getAllHistoryAdmin: () =>
    fetchWithToken('/watering-history/all_history/'),
};

/**
 * Admin API endpoints (for admin dashboard)
 */
export const adminAPI = {
  /**
   * Get all users
   */
  getAllUsers: () =>
    fetchWithToken('/users/all_users/'),

  /**
   * Update a user
   */
  updateUser: (userId, userData) =>
    fetchWithToken('/users/update_user_admin/', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ...userData,
      }),
    }),

  /**
   * Delete a user
   */
  deleteUser: (userId) =>
    fetchWithToken('/users/delete_user_admin/', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),

  /**
   * Reset a user's password
   */
  resetPassword: (userId, newPassword) =>
    fetchWithToken('/users/reset_password/', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        new_password: newPassword,
      }),
    }),

  /**
   * Get system-wide admin statistics (all plants, all users)
   */
  getAdminStats: () =>
    fetchWithToken('/plants/admin_stats/'),
};

export default {
  authAPI,
  plantsAPI,
  historyAPI,
  adminAPI,
};
