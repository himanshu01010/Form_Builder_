import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: 'https://form-builder-backend-xi.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
