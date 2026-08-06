import axios from 'axios';
/* import { API_BASE_URL } from '@env'; */
import { getAccessToken } from './authService';

/* const API_BASE_URL = 'http://10.0.2.2:8000'; */

const API_BASE_URL = 'https://uzima-backend.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;