import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: 'https://form-builder-backend-u2pj.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
