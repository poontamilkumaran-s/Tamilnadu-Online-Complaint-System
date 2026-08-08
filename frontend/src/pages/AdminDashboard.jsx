import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { getUsers } from '../services/authService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { Shield, Users, UserCheck, Trash2, ArrowUpRight, Search, BarChart, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { complaints, loading, fetchComplaints, assignAgent, deleteComplaint } = useComplaints();
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchComplaints();
    getUsers('AGENT').then((res) => {
      if (res.success) setAgents(res.users);
    });
  }, [fetchComplaints]);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    const matchesCategory = !categoryFilter || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAssignAgentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !selectedAgentId) return;

    const res = await assignAgent(selectedTicket._id, selectedAgentId);
    if (res.success) {
      setActionMsg(`Assigned ticket ${selectedTicket.ticketId} to agent`);
      setSelectedTicket(null);
      fetchComplaints();
    }
  };

  const handleDelete = async (id, ticketId) => {
    if (window.confirm(`Are you sure you want to permanently delete complaint ${ticketId}?`)) {
      const res = await deleteComplaint(id);
      if (res.success) {
        setActionMsg(`Complaint ${ticketId} deleted`);
        fetchComplaints();
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Complaints Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Oversee all system complaints, manage agent workloads & access controls</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/analytics" className="btn btn-primary">
            <BarChart size={18} /> Analytics & Performance Insights
          </Link>
        </div>
      </div>

      {actionMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: '#6ee7b7', fontSize: '0.88rem' }}>
          ✓ {actionMsg}
        </div>
      )}

      {/* Filter & Search Controls */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by ticket ID, title, or user name..."
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
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ minWidth: '160px' }}
        >
          <option value="">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Billing">Billing</option>
          <option value="Service">Service</option>
          <option value="Product">Product</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Complaints Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading all complaints...</div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No complaints matching filter criteria.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title & Category</th>
                <th>Creator</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Agent</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((item) => (
                <tr key={item._id}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{item.ticketId}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{item.title}</div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.category}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.creator?.name}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.creator?.email}</span>
                  </td>
                  <td>
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>
                    {item.assignedAgent ? (
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#67e8f9' }}>
                        {item.assignedAgent.name} ({item.assignedAgent.department})
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedTicket(item)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                      >
                        + Assign Agent
                      </button>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setSelectedTicket(item)}
                        className="btn btn-secondary btn-sm"
                        title="Reassign Agent"
                      >
                        <UserCheck size={14} />
                      </button>
                      <Link to={`/complaint/${item._id}`} className="btn btn-secondary btn-sm" title="View Details">
                        <ArrowUpRight size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id, item.ticketId)}
                        className="btn btn-danger btn-sm"
                        title="Delete Ticket"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Agent Assignment Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Assign Agent to {selectedTicket.ticketId}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{selectedTicket.title}</p>

            <form onSubmit={handleAssignAgentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Select Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">Select an Agent...</option>
                  {agents.map((ag) => (
                    <option key={ag._id} value={ag._id}>
                      {ag.name} — Department: {ag.department} ({ag.email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedTicket(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={!selectedAgentId}>
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
