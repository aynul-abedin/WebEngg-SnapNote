import axios from 'axios';

const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  
  // If token exists, add it to the headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
