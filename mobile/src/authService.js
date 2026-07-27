import apiClient from './apiClient';

let accessToken = null;
let refreshToken = null;

export const login = async (username, password) => {
  const response = await apiClient.post('/api/token/', { username, password });
  accessToken = response.data.access;
  refreshToken = response.data.refresh;
  return response.data;
};

export const getAccessToken = async () => accessToken;

export const refreshAccessToken = async () => {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  const response = await apiClient.post('/api/token/refresh/', { refresh: refreshToken });
  accessToken = response.data.access;
  return accessToken;
};

export const logout = () => {
  accessToken = null;
  refreshToken = null;
};