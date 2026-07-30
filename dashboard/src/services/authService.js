import apiClient from './apiClient';

let accessToken = null;
let refreshToken = null;

export const login = async (username, password) => {
  const response = await apiClient.post('/api/token/', { username, password });
  accessToken = response.data.access;
  refreshToken = response.data.refresh;
  return response.data;
};

export const getAccessToken = () => accessToken;

export const logout = () => {
  accessToken = null;
  refreshToken = null;
};