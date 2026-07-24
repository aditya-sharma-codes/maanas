import apiClient from './client';

export const fetchCounselors = async () => {
  const { data } = await apiClient.get('/appointments/counselors');
  return data;
};

export const bookAppointment = async (appointmentData: any) => {
  const { data } = await apiClient.post('/appointments', appointmentData);
  return data;
};

export const fetchAppointments = async (deviceId: string) => {
  const { data } = await apiClient.get(`/appointments?deviceId=${deviceId}`);
  return data;
};
