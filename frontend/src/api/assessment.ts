import apiClient from './client';

export const submitAssessment = async (assessmentPayload: any) => {
  const { data } = await apiClient.post('/assessments', assessmentPayload);
  return data;
};
