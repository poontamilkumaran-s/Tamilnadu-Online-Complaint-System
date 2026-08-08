import React, { createContext, useContext, useState, useCallback } from 'react';
import { getComplaints, getComplaintById, createComplaint, updateComplaintStatus, assignAgentToComplaint } from '../services/complaintService';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaints = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComplaints(filters);
      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (err) {
      console.error('Fetch complaints error:', err);
      setError(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComplaintDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComplaintById(id);
      if (data.success) {
        setActiveComplaint(data.complaint);
        return data.complaint;
      }
    } catch (err) {
      console.error('Fetch details error:', err);
      setError(err.response?.data?.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const addComplaint = async (complaintData) => {
    try {
      const data = await createComplaint(complaintData);
      if (data.success) {
        setComplaints((prev) => [data.complaint, ...prev]);
        return { success: true, complaint: data.complaint };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error creating complaint' };
    }
  };

  const changeStatus = async (id, statusData) => {
    try {
      const data = await updateComplaintStatus(id, statusData);
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? data.complaint : c))
        );
        if (activeComplaint && activeComplaint._id === id) {
          setActiveComplaint(data.complaint);
        }
        return { success: true, complaint: data.complaint };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error updating status' };
    }
  };

  const assignAgent = async (id, agentId) => {
    try {
      const data = await assignAgentToComplaint(id, agentId);
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? data.complaint : c))
        );
        if (activeComplaint && activeComplaint._id === id) {
          setActiveComplaint(data.complaint);
        }
        return { success: true, complaint: data.complaint };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error assigning agent' };
    }
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        activeComplaint,
        loading,
        error,
        fetchComplaints,
        fetchComplaintDetails,
        addComplaint,
        changeStatus,
        assignAgent,
        setActiveComplaint,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => useContext(ComplaintContext);
