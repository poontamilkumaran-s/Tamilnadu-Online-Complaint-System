import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { UserCheck, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Search, RefreshCw } from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuth();
  const { complaints, loading, fetchComplaints, changeStatus } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', note: '', resolutionNotes: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const assignedComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = complaints.filter((c) => ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  const handleOpenUpdateModal = (complaint) => {
    setSelectedTicket(complaint);
    setStatusForm({
      status: complaint.status,
      note: '',
      resolutionNotes: complaint.resolutionNotes || '',
    });
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setUpdating(true);

    const res = await changeStatus(selectedTicket._id, statusForm);
    setUpdating(false);
    if (res.success) {
      setSelectedTicket(null);
      fetchComplaints();
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Agent Queue & Workbench</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Manage your assigned complaint queue for <strong>{user?.department}</strong> department
        </p>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid-3">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.9rem', borderRadius: 'var(--radius-md)', color: '#06b6d4' }}>
            <UserCheck size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Assigned</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{complaints.length}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.9rem', borderRadius: 'var(--radius-md)', color: '#3b82f6' }}>
            <RefreshCw size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active In-Progress</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{pendingCount}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.9rem', borderRadius: 'var(--radius-md)', color: '#10b981' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resolved</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{resolvedCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search assigned tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.75rem' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ minWidth: '160px' }}
        >
          <option value="">All Statuses</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Queue Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading assigned tickets...</div>
        ) : assignedComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No assigned complaints in queue.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject & User</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date Assigned</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedComplaints.map((item) => (
                <tr key={item._id}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{item.ticketId}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{item.title}</div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      User: {item.creator?.name} ({item.creator?.email})
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenUpdateModal(item)}
                        className="btn btn-secondary btn-sm"
                      >
                        Quick Status
                      </button>
                      <Link to={`/complaint/${item._id}`} className="btn btn-primary btn-sm">
                        View & Chat <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Status Update Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Update Ticket {selectedTicket.ticketId}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{selectedTicket.title}</p>

            <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Progress Note</label>
                <input
                  type="text"
                  placeholder="e.g. Applied database query fix"
                  value={statusForm.note}
                  onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              {(statusForm.status === 'RESOLVED' || statusForm.status === 'REJECTED') && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Resolution Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Enter details on how the complaint was resolved..."
                    value={statusForm.resolutionNotes}
                    onChange={(e) => setStatusForm({ ...statusForm, resolutionNotes: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedTicket(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgentDashboard;
