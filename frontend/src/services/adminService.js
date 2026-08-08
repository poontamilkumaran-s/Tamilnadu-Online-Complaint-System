import API from './api';

export const getDashboardStats = async () => {
  const response = await API.get('/analytics/dashboard');
  return response.data;
};
