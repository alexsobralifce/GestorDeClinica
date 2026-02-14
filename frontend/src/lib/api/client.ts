import axios from 'axios';

const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_URL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle 401 by redirecting to login
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Don't redirect if already on login endpoint
        const url = error.config?.url || '';
        if (!url.includes('/auth/login') && !url.includes('/auth/me')) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      }
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
