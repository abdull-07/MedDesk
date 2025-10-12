import axios from 'axios';

// Create axios instance with default config
const getBaseURL = () => {
  let baseUrl;

  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    baseUrl = import.meta.env.VITE_API_URL;
  }
  // If in production (deployed), use the production backend URL
  else if (import.meta.env.PROD) {
    baseUrl = 'https://meddesk-l85w.onrender.com/api';
  }
  // Default to localhost for development
  else {
    baseUrl = 'http://localhost:5000/api';
  }

  // Ensure the URL ends with /api if it doesn't already
  if (!baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace(/\/$/, '') + '/api';
  }

  return baseUrl;
};

const baseURL = getBaseURL();
console.log('API Base URL:', baseURL);
console.log('Environment variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE
});

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Debug: Log the full URL being requested
    console.log('Making API request to:', config.baseURL + config.url);

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/sign-in';
      }

      // Handle 403 Forbidden errors for doctor pending verification
      if (error.response.status === 403 &&
        error.response.data &&
        error.response.data.pendingVerification) {
        // Return the pending verification data
        return Promise.reject({
          ...error.response.data,
          message: error.response.data.message || 'Your account is pending verification'
        });
      }

      // Handle 400 Bad Request errors with more detailed error messages
      if (error.response.status === 400) {
        console.log('400 Bad Request Error:', error.response.data);

        // If the error data is an object with a message property, use that
        if (error.response.data && typeof error.response.data === 'object' && error.response.data.message) {
          return Promise.reject({ message: error.response.data.message });
        }
      }

      // Return the error message from the server
      return Promise.reject(error.response.data);
    }

    // Handle network errors
    if (error.request) {
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    }

    return Promise.reject(error);
  }
);

export default api; 