import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User as UserIcon, LogOut, Bell, FileText, CheckCircle2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '0.9rem 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--accent-glow)'
          }}>
            <Shield size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tamilnadu
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Online Complaint System
            </span>
          </div>
        </Link>

        {/* Navigation Links & User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {isAuthenticated ? (
            <>
              {/* Role Indicator Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: user?.role === 'ADMIN' ? '#d946ef' : user?.role === 'AGENT' ? '#06b6d4' : '#10b981' }}></div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user?.role} {user?.department && user.role === 'AGENT' ? `(${user.department})` : ''}
                </span>
              </div>

              {/* Profile Avatar & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#fff',
                  border: '2px solid rgba(255,255,255,0.1)'
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.email}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Sign out"
                style={{ marginLeft: '0.5rem' }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
