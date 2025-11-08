import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
};

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    default:
      return state;
  }
};

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/auth/me');
          
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: response.data.data.user,
              token,
            },
          });
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await axios.post('/auth/login', credentials);
      const { user, token } = response.data.data;
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: message,
      });
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      
      const response = await axios.post('/auth/register', userData);
      const { user, token } = response.data.data;
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user, token },
      });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: message,
      });
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Logged out successfully');
    }
  };

  // Connect wallet function
  const connectWallet = async (walletAddress, signature) => {
    try {
      const response = await axios.post('/auth/connect-wallet', {
        walletAddress,
        signature,
      });
      
      const { user } = response.data.data;
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: user,
      });
      
      toast.success('Wallet connected successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to connect wallet';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/users/profile', profileData);
      const { user } = response.data.data;
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: user,
      });
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await axios.post('/auth/refresh');
      const { token } = response.data.data;
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: { token },
      });
      
      return { success: true };
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return { success: false };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!state.user) return false;
    if (Array.isArray(role)) {
      return role.includes(state.user.role);
    }
    return state.user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole(['admin', 'super_admin']);
  };

  // Check if user is verified
  const isVerified = () => {
    return state.user?.isVerified && state.user?.isBlockchainVerified;
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    connectWallet,
    updateProfile,
    refreshToken,
    hasRole,
    isAdmin,
    isVerified,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
