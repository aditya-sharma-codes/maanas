import apiClient from './client';

export const loginInstitute = async (credentials: any) => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};
