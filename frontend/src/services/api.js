import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Don't add token for authentication requests
    if (!config.url?.includes('/auth/login/') && !config.url?.includes('/auth/register/')) {
      const token = localStorage.getItem('token') || localStorage.getItem('access');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 API Request: Token added to', config.url);
      } else {
        console.log('⚠️ API Request: No token found for', config.url);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('❌ API Response Error:', error.response?.status, error.response?.data);
    
    // Only redirect to login for 401 errors on authenticated requests
    // Don't redirect if it's a login/register request that failed
    // Don't redirect if user is already on login page or if it's a profile check
    if (error.response?.status === 401 && 
        !error.config?.url?.includes('/auth/login/') && 
        !error.config?.url?.includes('/auth/register/') &&
        !error.config?.url?.includes('/users/profile/') &&
        window.location.pathname !== '/login') {
      
      // Check if we actually have a user token before redirecting
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        // Token exists but server says it's invalid - clear and redirect
        console.log('🔑 Token expired, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        // No token, just log the error without redirecting
        console.log('🔑 No token found, not redirecting');
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // User registration
  register: (userData) => api.post('/api/users/auth/register/', userData),
  
  // User login
  login: (credentials) => api.post('/api/users/auth/login/', credentials),
  
  // User logout
  logout: () => api.post('/api/users/auth/logout/'),
  
  // Get user profile
  getProfile: () => api.get('/api/users/users/profile/'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/api/users/users/profile/', userData),
  
  // Get user statistics
  getUserStats: () => api.get('/api/users/users/stats/'),
};

// Policy API
export const policyAPI = {
  // Get all policies
  getPolicies: (params) => api.get('/api/policies/policies/', { params }),
  
  // Get single policy
  getPolicy: (id) => api.get(`/api/policies/policies/${id}/`),
  
  // Upload new policy
  uploadPolicy: (formData) => {
    return api.post('/api/policies/policies/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Create new policy
  createPolicy: (policyData) => {
    const formData = new FormData();
    
    // Add file if present
    if (policyData.document) {
      formData.append('document', policyData.document);
    }
    
    // Add other fields
    Object.keys(policyData).forEach(key => {
      if (key !== 'document' && policyData[key] !== undefined && policyData[key] !== null) {
        formData.append(key, policyData[key]);
      }
    });
    
    return api.post('/api/policies/policies/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Update policy
  updatePolicy: (id, policyData) => {
    // For text-only updates (name, provider, policy_type), use JSON
    if (!policyData.document) {
      return api.put(`/api/policies/policies/${id}/`, policyData);
    }
    
    // For updates with files, use FormData
    const formData = new FormData();
    
    // Add file if present
    if (policyData.document) {
      formData.append('document', policyData.document);
    }
    
    // Add other fields
    Object.keys(policyData).forEach(key => {
      if (key !== 'document' && policyData[key] !== undefined && policyData[key] !== null) {
        formData.append(key, policyData[key]);
      }
    });
    
    return api.put(`/api/policies/policies/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete policy
  deletePolicy: (id) => api.delete(`/api/policies/policies/${id}/`),
  
  // Search policies
  searchPolicies: (params) => api.get('/api/policies/search/', { params }),
  
  // Get policy statistics
  getPolicyStats: () => api.get('/api/policies/stats/'),
  
  // Bulk delete policies
  bulkDeletePolicies: (policyIds) => api.post('/api/policies/policies/bulk-delete/', { policy_ids: policyIds }),
};

// AI API endpoints
export const aiAPI = {
  // Extract policy details from uploaded document
  extractPolicyDetails: async (policyId) => {
    try {
      const response = await api.post(`/api/ai/extract-policy-details/${policyId}/`);
      return response.data;
    } catch (error) {
      console.error('Error extracting policy details:', error);
      throw error;
    }
  },

  // Compare two policies using AI
  comparePolicies: async (policy1Id, policy2Id) => {
    try {
      const response = await api.post('/api/ai/compare/', {
        policy1_id: policy1Id,
        policy2_id: policy2Id
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing policies:', error);
      throw error;
    }
  },

  // Get policy extraction text
  getPolicyExtraction: async (policyId) => {
    try {
      const response = await api.get(`/api/ai/policy-extraction/${policyId}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting policy extraction:', error);
      throw error;
    }
  },

  // Test Gemini connection
  testGemini: async () => {
    try {
      const response = await api.get('/api/ai/test-connection/');
      return response.data;
    } catch (error) {
      console.error('Error testing Gemini connection:', error);
      throw error;
    }
  },

  // Query specific policy
  queryPolicy: async (queryData) => {
    try {
      const response = await api.post('/api/ai/query-policy/', queryData);
      return response.data;
    } catch (error) {
      console.error('Error querying policy:', error);
      throw error;
    }
  },

  // General insurance chat
  generalChat: async (question) => {
    try {
      const response = await api.post('/api/ai/general-chat/', { question });
      return response.data;
    } catch (error) {
      console.error('Error in general chat:', error);
      throw error;
    }
  },
  
  // Get all conversations
  getConversations: async () => {
    try {
      const response = await api.get('/api/ai/conversations/');
      return response.data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  },
  
  // Get conversation messages
  getConversationMessages: async (conversationId) => {
    try {
      const response = await api.get(`/api/ai/conversations/${conversationId}/messages/`);
      return response.data;
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw error;
    }
  },
  
  // Delete conversation
  deleteConversation: async (conversationId) => {
    try {
      const response = await api.delete(`/api/ai/conversations/${conversationId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('access', token); // Store in both places for compatibility
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('access');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('access');
  delete api.defaults.headers.common['Authorization'];
};

export default api;
