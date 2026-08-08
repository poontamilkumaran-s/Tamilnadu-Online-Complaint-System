import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/adminService';
import RatingStars from '../components/RatingStars';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, Users, Award, Shield } from 'lucide-react';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        if (res.success) {
          setData(res);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Generating operational analytics...
      </div>
    );
  }

  const { stats, categoryStats, priorityStats, agentPerformance, recentComplaints } = data;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Analytics & Performance Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Real-time transparency metrics, resolution rates, and support agent ratings</p>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid-4">
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resolution Rate</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>{stats.resolutionRate}%</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stats.resolvedCount} of {stats.totalComplaints} tickets resolved</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Complaints</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{stats.totalComplaints}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stats.pendingCount} pending initial assignment</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Workloads</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6', marginTop: '0.2rem' }}>{stats.inProgressCount + stats.assignedCount}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Currently in progress by agents</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Agents</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#06b6d4', marginTop: '0.2rem' }}>{stats.totalAgents}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stats.totalUsers} registered users</span>
        </div>
      </div>

      {/* Category Breakdown & Priority Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Category Breakdown Progress Bars */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--accent-primary)" /> Complaints Distribution by Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {categoryStats.map((item) => {
              const pct = stats.totalComplaints > 0 ? ((item.count / stats.totalComplaints) * 100).toFixed(0) : 0;
              return (
                <div key={item.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <span>{item.category} Support</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{item.count} tickets ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="#f97316" /> Tickets by Priority
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {priorityStats.map((p) => (
              <div key={p.priority} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.priority} Priority</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: p.priority === 'Urgent' ? '#f43f5e' : p.priority === 'High' ? '#f97316' : '#60a5fa' }}>
                  {p.count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Agent Performance Leaderboard */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} color="#fbbf24" /> Agent Performance & Rating Leaderboard
        </h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Department</th>
              <th>Total Assigned</th>
              <th>Resolved</th>
              <th>Active Pending</th>
              <th>User Rating Score</th>
            </tr>
          </thead>
          <tbody>
            {agentPerformance.map((ag) => (
              <tr key={ag.agentId}>
                <td style={{ fontWeight: 700, color: '#fff' }}>{ag.name}</td>
                <td>{ag.department}</td>
                <td>{ag.totalAssigned}</td>
                <td style={{ color: '#10b981', fontWeight: 700 }}>{ag.resolved}</td>
                <td style={{ color: '#3b82f6' }}>{ag.pending}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RatingStars rating={Number(ag.avgRating) || 0} readOnly size={15} />
                    <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.9rem' }}>{ag.avgRating} / 5</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AnalyticsPage;
