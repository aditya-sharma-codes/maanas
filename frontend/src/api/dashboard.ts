import apiClient from './client';

export const fetchDashboardStats = async () => {
  const { data } = await apiClient.get('/dashboard/stats');
  return data;
};

export const fetchDepartmentAnalysis = async () => {
  const { data } = await apiClient.get('/dashboard/departments');
  return data;
};
