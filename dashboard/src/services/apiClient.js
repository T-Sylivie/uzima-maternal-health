import axios from 'axios';
import { getAccessToken } from './authService';

/* const API_BASE_URL = 'http://127.0.0.1:8000'; */

const API_BASE_URL = 'https://uzima-backend.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;