import API from './api';

export const createComplaint = async (complaintData) => {
  const response = await API.post('/complaints', complaintData);
  return response.data;
};

export const getComplaints = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await API.get(`/complaints?${query}`);
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await API.get(`/complaints/${id}`);
  return response.data;
};

export const updateComplaintStatus = async (id, statusData) => {
  const response = await API.put(`/complaints/${id}/status`, statusData);
  return response.data;
};

export const assignAgentToComplaint = async (id, agentId) => {
  const response = await API.put(`/complaints/${id}/assign`, { agentId });
  return response.data;
};

export const deleteComplaint = async (id) => {
  const response = await API.delete(`/complaints/${id}`);
  return response.data;
};
