import API from './api';

export const getMessages = async (complaintId) => {
  const response = await API.get(`/chat/${complaintId}`);
  return response.data;
};

export const sendMessage = async (complaintId, messageText) => {
  const response = await API.post(`/chat/${complaintId}`, { message: messageText });
  return response.data;
};
