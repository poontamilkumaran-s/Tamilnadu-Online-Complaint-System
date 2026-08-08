import API from './api';

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const getUsers = async (role = '') => {
  const response = await API.get(`/auth/users?role=${role}`);
  return response.data;
};

export const updateUserRole = async (userId, roleData) => {
  const response = await API.put(`/auth/users/${userId}/role`, roleData);
  return response.data;
};
