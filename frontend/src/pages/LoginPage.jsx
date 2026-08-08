import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Zap, UserCheck, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'ADMIN') navigate('/admin-dashboard');
      else if (res.user.role === 'AGENT') navigate('/agent-dashboard');
      else navigate('/dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDemoClick = async (role) => {
    setErrorMsg('');
    setLoading(true);
    const res = await loginAsDemo(role);
    setLoading(false);
    if (res?.success) {
      if (res.user.role === 'ADMIN') navigate('/admin-dashboard');
      else if (res.user.role === 'AGENT') navigate('/agent-dashboard');
      else navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: 'var(--accent-glow)'
          }}>
            <Shield size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Sign in to access your complaint management hub</p>
        </div>

        {/* Quick Demo Credentials Switcher */}
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            <Zap size={13} /> 1-Click Evaluation Logins
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoClick('ADMIN')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem', borderColor: '#d946ef', color: '#f0abfc' }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('AGENT')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem', borderColor: '#06b6d4', color: '#67e8f9' }}
            >
              Agent
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('USER')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem', borderColor: '#10b981', color: '#6ee7b7' }}
            >
              User
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
