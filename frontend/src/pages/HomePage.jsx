import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, MessageSquare, Zap, BarChart, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user, loginAsDemo } = useAuth();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        padding: '5rem 2rem 4rem 2rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#a5b4fc',
          marginBottom: '1.5rem'
        }}>
          <Zap size={14} /> Next-Gen Complaint Handling & Transparency
        </div>

        <h1 style={{
          fontSize: '3.2rem',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          margin: '0 auto 1.25rem auto',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Streamline Resolutions with Real-Time Visibility & Control
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          Tamilnadu Online Complaint System bridges the gap between Users, Support Agents, and Administrators. Track ticket lifecycles, communicate seamlessly, and gain deep operational insights.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <Link
              to={user?.role === 'ADMIN' ? '/admin-dashboard' : user?.role === 'AGENT' ? '/agent-dashboard' : '/dashboard'}
              className="btn btn-primary"
              style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}
            >
              Go to Workspace ({user?.role}) <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}>
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}>
                Sign In to Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Quick Demo Login Feature */}
      {!isAuthenticated && (
        <div className="page-body">
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>⚡ Instant Demo Access</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Explore the system instantly as an Admin, Support Agent, or End-User with 1-click evaluation logins:
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => loginAsDemo('ADMIN')} className="btn btn-secondary btn-sm" style={{ borderColor: '#d946ef', color: '#f0abfc' }}>
                <Shield size={16} /> Login as Admin
              </button>
              <button onClick={() => loginAsDemo('AGENT')} className="btn btn-secondary btn-sm" style={{ borderColor: '#06b6d4', color: '#67e8f9' }}>
                <UserCheck size={16} /> Login as Agent (Tech)
              </button>
              <button onClick={() => loginAsDemo('USER')} className="btn btn-secondary btn-sm" style={{ borderColor: '#10b981', color: '#6ee7b7' }}>
                <CheckCircle2 size={16} /> Login as User (John)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="page-body">
        <div className="grid-3" style={{ marginTop: '2rem' }}>
          <div className="glass-card">
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Role-Based Access</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Strict JWT authorization protocols ensuring secure access boundaries for Users, Agents, and Administrators.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#06b6d4' }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Real-time Communication</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Direct message thread between ticket creators and assigned handlers with system event logs.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#10b981' }}>
              <BarChart size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Admin Analytics</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Real-time platform KPIs, category breakdowns, resolution rates, and agent performance leaderboards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
