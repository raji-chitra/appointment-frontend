import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'false') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    const rawMessage = error.response?.data?.message || 'Something went wrong'
    const message = typeof rawMessage === 'string' ? rawMessage : JSON.stringify(rawMessage)
    // Diagnostic logging to help debug invalid toast payloads
    try {
      console.log('API interceptor - toast payload type:', typeof message, 'payload:', message)
      toast.error(message)
    } catch (e) {
      console.warn('toast.error failed to render message, falling back to string:', message, e)
      try {
        toast.error(String(message))
      } catch (e2) {
        console.error('Secondary toast.error failed as well:', String(message), e2)
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Sign up
  signup: async (userData) => {
    try {
      const response = await API.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('API Error during signup:', error);
      // Return error response instead of throwing
      if (error.response?.data) {
        return error.response.data;
      }
      return { success: false, message: error.message || 'Network error occurred' };
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('API Error during login:', error);
      // Return error response instead of throwing
      if (error.response?.data) {
        return error.response.data;
      }
      return { success: false, message: error.message || 'Network error occurred' };
    }
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Appointments API calls
export const appointmentsAPI = {
  // Book appointment
  bookAppointment: async (appointmentData) => {
    try {
      const response = await API.post('/appointments/book', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's appointments
  getMyAppointments: async () => {
    try {
      const response = await API.get('/appointments/my-appointments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await API.put(`/appointments/${appointmentId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('API Error during appointment cancellation:', error);
      // Return error response instead of throwing
      if (error.response?.data) {
        return error.response.data;
      }
      return { success: false, message: error.message || 'Network error occurred' };
    }
  },

  // Update payment status
  updatePayment: async (appointmentId, paymentData) => {
    try {
      const response = await API.put(`/appointments/${appointmentId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('API Error during payment update:', error);
      // Return error response instead of throwing
      if (error.response?.data) {
        return error.response.data;
      }
      return { success: false, message: error.message || 'Network error occurred' };
    }
  }
};

// Admin API calls
export const adminAPI = {
  login: async (credentials) => {
    try {
      const response = await API.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response?.data) return error.response.data;
      return { success: false, message: error.message || 'Network error occurred' };
    }
  },
  // Doctor management
  getDoctors: async () => {
    const adminToken = localStorage.getItem('adminToken');
    const res = await API.get('/admin/doctors', { headers: { Authorization: `Bearer ${adminToken}` } });
    return res.data;
  },
  addDoctor: async (payload) => {
    const adminToken = localStorage.getItem('adminToken');
    const res = await API.post('/admin/doctors', payload, { headers: { Authorization: `Bearer ${adminToken}` } });
    return res.data;
  },
  updateDoctor: async (id, payload) => {
    const adminToken = localStorage.getItem('adminToken');
    const res = await API.put(`/admin/doctors/${id}`, payload, { headers: { Authorization: `Bearer ${adminToken}` } });
    return res.data;
  },
  removeDoctor: async (id) => {
    const adminToken = localStorage.getItem('adminToken');
    const res = await API.delete(`/admin/doctors/${id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    return res.data;
  },
  getAppointments: async () => {
    const adminToken = localStorage.getItem('adminToken');
    const res = await API.get('/admin/appointments', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res.data;
  },
  updateAppointmentStatus: async (appointmentId, status) => {
    const adminToken = localStorage.getItem('adminToken');
    const res = await API.put(`/admin/appointments/${appointmentId}/status`, { status }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res.data;
  },
  getDashboardStats: async () => {
    const adminToken = localStorage.getItem('adminToken');
    const res = await API.get('/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res.data;
  }
};

// Public API - endpoints accessible without admin auth
export const publicAPI = {
  getDoctors: async () => {
    try {
      const response = await API.get('/doctors');
      return response.data;
    } catch (error) {
      console.error('Public API getDoctors error:', error);
      if (error.response?.data) return error.response.data;
      return { success: false, message: error.message || 'Network error occurred' };
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await API.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default API;
