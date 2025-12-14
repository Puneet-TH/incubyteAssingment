import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://assingment-m41t.onrender.com'
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
