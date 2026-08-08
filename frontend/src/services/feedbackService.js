import API from './api';

export const submitFeedback = async (feedbackData) => {
  const response = await API.post('/feedback', feedbackData);
  return response.data;
};

export const getFeedbacks = async () => {
  const response = await API.get('/feedback');
  return response.data;
};
