import { useAuth } from '../contexts/AuthContext';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || '';

// Create memory service functions
export const useMemoryService = () => {
  const { authAxios } = useAuth();

  return {
    // Get all memories with optional filters
    getMemories: async (params = {}) => {
      try {
        const response = await authAxios.get(`${API_URL}/api/memories`, { params });
        return response.data;
      } catch (error) {
        console.error('Error fetching memories:', error);
        throw error;
      }
    },

    // Get a specific memory
    getMemory: async (id) => {
      try {
        const response = await authAxios.get(`${API_URL}/api/memories/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching memory ${id}:`, error);
        throw error;
      }
    },

    // Create a new memory
    createMemory: async (memoryData) => {
      try {
        const response = await authAxios.post(`${API_URL}/api/memories`, memoryData);
        return response.data;
      } catch (error) {
        console.error('Error creating memory:', error);
        throw error;
      }
    },

    // Update a memory
    updateMemory: async (id, memoryData) => {
      try {
        const response = await authAxios.put(`${API_URL}/api/memories/${id}`, memoryData);
        return response.data;
      } catch (error) {
        console.error(`Error updating memory ${id}:`, error);
        throw error;
      }
    },

    // Delete a memory
    deleteMemory: async (id) => {
      try {
        const response = await authAxios.delete(`${API_URL}/api/memories/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting memory ${id}:`, error);
        throw error;
      }
    },

    // Search memories
    searchMemories: async (query, page = 1, limit = 10) => {
      try {
        const response = await authAxios.get(`${API_URL}/api/search/memories`, {
          params: { query, page, limit }
        });
        return response.data;
      } catch (error) {
        console.error('Error searching memories:', error);
        throw error;
      }
    },

    // Upload a file for memory
    uploadFile: async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await authAxios.post(`${API_URL}/api/uploads`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }
  };
};

// Create tag service functions
export const useTagService = () => {
  const { authAxios } = useAuth();

  return {
    // Get all tags
    getAllTags: async () => {
      try {
        const response = await authAxios.get(`${API_URL}/api/tags`);
        return response.data;
      } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }
    }
  };
};

// Create user service functions
export const useUserService = () => {
  const { authAxios } = useAuth();

  return {
    // Get current user profile
    getCurrentUser: async () => {
      try {
        const response = await authAxios.get(`${API_URL}/api/users/me`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
    connectWithPatient: async (patientEmail) => {
      try {
        const response = await authAxios.post(`${API_URL}/api/users/connect-patient`, {
          patientEmail
        });
        return response.data;
      } catch (error) {
        console.error('Error connecting with patient:', error);
        throw error;
      }
    },
    // Update current user profile
    updateProfile: async (userData) => {
      try {
        const response = await authAxios.put(`${API_URL}/api/users/me`, userData);
        return response.data;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },

    // Get user's caregivers
    getCaregivers: async (userId) => {
      try {
        const response = await authAxios.get(`${API_URL}/api/users/${userId}/caregivers`);
        return response.data;
      } catch (error) {
        console.error('Error fetching caregivers:', error);
        throw error;
      }
    },

    // Get caregiver's patients
    getPatients: async () => {
      try {
        const response = await authAxios.get(`${API_URL}/api/users/patients`);
        return response.data;
      } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }
    }
  };
};