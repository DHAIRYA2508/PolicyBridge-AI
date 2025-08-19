import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthToken, removeAuthToken } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setAuthToken(token);
          setUser(JSON.parse(userData));
          
          // Only verify token if we're not already on login page
          if (window.location.pathname !== '/login') {
            try {
              const response = await authAPI.getProfile();
              setUser(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
              console.error('Error verifying token:', error);
              // Only clear if it's a 401 error (token expired)
              if (error.response?.status === 401) {
                removeAuthToken();
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                // Don't redirect automatically - let the user continue
              }
            }
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid user data
          removeAuthToken();
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔑 AuthContext: Starting login process');
      console.log('🔑 AuthContext: Credentials:', credentials);
      console.log('🔑 AuthContext: API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000/api');
      
      const response = await authAPI.login(credentials);
      console.log('🔑 AuthContext: Login response:', response);
      console.log('🔑 AuthContext: Response data:', response.data);
      
      const { access, user: userData } = response.data;
      console.log('🔑 AuthContext: Access token:', access);
      console.log('🔑 AuthContext: User data:', userData);
      
      setAuthToken(access);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', access); // Store token with correct key
      
      console.log('🔑 AuthContext: Login successful, user set');
      toast.success('Welcome back! Login successful.');
      return { success: true };
    } catch (error) {
      console.error('🔑 AuthContext: Login error:', error);
      console.error('🔑 AuthContext: Error response:', error.response);
      console.error('🔑 AuthContext: Error status:', error.response?.status);
      console.error('🔑 AuthContext: Error data:', error.response?.data);
      
      let errorMessage = 'Login failed. Please try again.';
      
      // Get the most specific error message available
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0];
      } else if (error.response?.status === 401) {
        errorMessage = 'Wrong email or password. Please check your credentials and try again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid login information. Please check your email and password.';
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { access, user: newUser } = response.data;
      
      setAuthToken(access);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', access); // Store token with correct key
      
      toast.success('Account created successfully! Welcome to PolicyBridge AI.');
      return { success: true };
    } catch (error) {
      console.error('🔑 AuthContext: Registration error:', error);
      console.error('🔑 AuthContext: Error response:', error.response);
      console.error('🔑 AuthContext: Error data:', error.response?.data);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      // Get the most specific error message available
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.email && Array.isArray(error.response.data.email)) {
        errorMessage = error.response.data.email[0];
      } else if (error.response?.data?.username && Array.isArray(error.response.data.username)) {
        errorMessage = error.response.data.username[0];
      } else if (error.response?.data?.password && Array.isArray(error.response.data.password)) {
        errorMessage = error.response.data.password[0];
      } else if (error.response?.data?.password_confirm && Array.isArray(error.response.data.password_confirm)) {
        errorMessage = error.response.data.password_confirm[0];
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid registration information. Please check your details and try again.';
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if user is authenticated
      if (user) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      removeAuthToken();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.success('Logged out successfully.');
      
      // Force redirect to home page
      window.location.href = '/';
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      const response = await authAPI.updateProfile(updatedUser);
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to update profile.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return null;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    refreshProfile,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
