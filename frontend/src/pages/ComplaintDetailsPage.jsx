import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../services/authService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ChatBox from '../components/ChatBox';
import RatingStars from '../components/RatingStars';
import { ArrowLeft, Clock, UserCheck, Shield, CheckCircle, Paperclip, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeComplaint, fetchComplaintDetails, changeStatus, assignAgent, loading } = useComplaints();

  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({ status: '', resolutionNotes: '', note: '' });
  const [updating, setUpdating] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchComplaintDetails(id);
  }, [id, fetchComplaintDetails]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      getUsers('AGENT').then((res) => {
        if (res.success) setAgents(res.users);
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeComplaint) {
      setStatusUpdate({
        status: activeComplaint.status,
        resolutionNotes: activeComplaint.resolutionNotes || '',
        note: '',
      });
      if (activeComplaint.assignedAgent) {
        setSelectedAgentId(activeComplaint.assignedAgent._id);
      }
    }
  }, [activeComplaint]);

  if (loading || !activeComplaint) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading ticket details...
      </div>
    );
  }

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setActionMsg('');

    const res = await changeStatus(activeComplaint._id, statusUpdate);
    setUpdating(false);
    if (res.success) {
      setActionMsg(`Ticket status updated to ${res.complaint.status}`);
      fetchComplaintDetails(id);
    }
  };

  const handleAgentAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgentId) return;
    setUpdating(true);
    setActionMsg('');

    const res = await assignAgent(activeComplaint._id, selectedAgentId);
    setUpdating(false);
    if (res.success) {
      setActionMsg('Agent assigned successfully');
      fetchComplaintDetails(id);
    }
  };

  const isUser = user?.role === 'USER';
  const isAgent = user?.role === 'AGENT';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Back button & Ticket Header */}
      <div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{activeComplaint.ticketId}</span>
              <StatusBadge status={activeComplaint.status} />
              <PriorityBadge priority={activeComplaint.priority} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>{activeComplaint.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              <span>Category: <strong style={{ color: '#fff' }}>{activeComplaint.category}</strong></span>
              <span>Submitted by: <strong style={{ color: '#fff' }}>{activeComplaint.creator?.name}</strong> ({activeComplaint.creator?.email})</span>
              <span>Created: {new Date(activeComplaint.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Assigned Agent Box */}
          <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-color)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', minWidth: '240px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Assigned Handler
            </span>
            <div style={{ marginTop: '0.4rem', fontWeight: 700, color: '#67e8f9', fontSize: '0.95rem' }}>
              {activeComplaint.assignedAgent ? activeComplaint.assignedAgent.name : 'Unassigned'}
            </div>
            {activeComplaint.assignedAgent && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                {activeComplaint.assignedAgent.department} Department
              </div>
            )}
          </div>
        </div>
      </div>

      {actionMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: '#6ee7b7', fontSize: '0.88rem' }}>
          ✓ {actionMsg}
        </div>
      )}

      {/* Main 2-Column Details Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Description, Timeline Stepper, Resolution Notes, Feedback Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Description Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem' }}>Complaint Description</h3>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', whitespace: 'pre-wrap', lineHeight: 1.6 }}>
              {activeComplaint.description}
            </p>

            {/* Attachments if any */}
            {activeComplaint.attachments && activeComplaint.attachments.length > 0 && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attachments</span>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  {activeComplaint.attachments.map((att, idx) => (
                    <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                      <Paperclip size={14} /> {att.name || 'View Attachment'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resolution Notes Box (if available) */}
          {activeComplaint.resolutionNotes && (
            <div className="glass-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, marginBottom: '0.5rem' }}>
                <CheckCircle size={18} /> Resolution Summary
              </div>
              <p style={{ color: '#d1fae5', fontSize: '0.92rem', lineHeight: 1.5 }}>
                {activeComplaint.resolutionNotes}
              </p>
            </div>
          )}

          {/* User Feedback Callout */}
          {isUser && activeComplaint.status === 'RESOLVED' && (
            <div className="glass-card" style={{ textAlign: 'center', borderColor: 'rgba(251, 191, 36, 0.4)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>How was your experience?</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                Your ticket has been resolved! Please leave feedback for our team.
              </p>
              <Link to="/feedback" className="btn btn-primary btn-sm">
                Submit Feedback & Rating
              </Link>
            </div>
          )}

          {/* Status Timeline Stepper */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Status History Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '1rem' }}>
              {activeComplaint.statusHistory?.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', marginTop: '4px', boxShadow: 'var(--accent-glow)' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <StatusBadge status={step.status} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {new Date(step.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {step.note && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{step.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin & Agent Control Panel */}
          {(isAgent || isAdmin) && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Ticket Management Controls</h3>

              {/* Status Update Form */}
              <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: isAdmin ? '1.5rem' : 0 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Update Status</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Progress Note / Event Log</label>
                  <input
                    type="text"
                    placeholder="Brief update note (e.g. Applied patch fix v1.2)"
                    value={statusUpdate.note}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, note: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                {(statusUpdate.status === 'RESOLVED' || statusUpdate.status === 'REJECTED') && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Resolution Summary Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Explain how the issue was resolved or why it was rejected..."
                      value={statusUpdate.resolutionNotes}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, resolutionNotes: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-sm" disabled={updating}>
                  {updating ? 'Updating...' : 'Save Status Update'}
                </button>
              </form>

              {/* Admin Agent Reassignment */}
              {isAdmin && (
                <form onSubmit={handleAgentAssignSubmit} style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#67e8f9' }}>Admin: Assign / Reassign Agent</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="">Select Agent...</option>
                      {agents.map((ag) => (
                        <option key={ag._id} value={ag._id}>
                          {ag.name} ({ag.department})
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-secondary btn-sm" disabled={updating || !selectedAgentId}>
                      Assign
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Embedded Real-time Chat Box */}
        <div>
          <ChatBox complaintId={activeComplaint._id} />
        </div>

      </div>
    </div>
  );
};

export default ComplaintDetailsPage;
