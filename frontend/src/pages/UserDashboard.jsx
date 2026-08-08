import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { PlusCircle, Search, Filter, Clock, CheckCircle2, AlertCircle, ArrowUpRight, MessageSquare } from 'lucide-react';

const UserDashboard = () => {
  const { complaints, loading, fetchComplaints } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    const matchesCategory = !categoryFilter || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalCount = complaints.length;
  const activeCount = complaints.filter((c) => ['PENDING', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Complaint Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Submit, track, and interact with support on your submitted tickets</p>
        </div>
        <Link to="/create-complaint" className="btn btn-primary">
          <PlusCircle size={18} /> File New Complaint
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid-3">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.9rem', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)' }}>
            <Clock size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Submitted</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalCount}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.9rem', borderRadius: 'var(--radius-md)', color: '#3b82f6' }}>
            <AlertCircle size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active In-Progress</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{activeCount}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.9rem', borderRadius: 'var(--radius-md)', color: '#10b981' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resolved Tickets</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{resolvedCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by ticket ID, title or keywords..."
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

      {/* Complaints Table / Cards */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading tickets...</div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No complaints found</p>
            <p style={{ fontSize: '0.88rem' }}>File a new complaint or try clearing your search filters.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject & Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Handler</th>
                <th>Submitted Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
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
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Category: {item.category}</span>
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
                        {item.assignedAgent.name}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', italic: true }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/complaint/${item._id}`} className="btn btn-secondary btn-sm">
                      Details & Chat <ArrowUpRight size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
