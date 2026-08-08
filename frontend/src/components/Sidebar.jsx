import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, UserCheck, BarChart3, Star, Users, MessageSquare } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const userNav = [
    { label: 'My Complaints', path: '/dashboard', icon: LayoutDashboard },
    { label: 'File Complaint', path: '/create-complaint', icon: PlusCircle },
    { label: 'Feedback & Ratings', path: '/feedback', icon: Star },
  ];

  const agentNav = [
    { label: 'Assigned Complaints', path: '/agent-dashboard', icon: UserCheck },
    { label: 'Feedback Received', path: '/feedback', icon: Star },
  ];

  const adminNav = [
    { label: 'Complaints Hub', path: '/admin-dashboard', icon: LayoutDashboard },
    { label: 'Analytics Dashboard', path: '/analytics', icon: BarChart3 },
    { label: 'Manage Users & Agents', path: '/admin/users', icon: Users },
    { label: 'Customer Feedback', path: '/feedback', icon: Star },
  ];

  const navItems = role === 'ADMIN' ? adminNav : role === 'AGENT' ? agentNav : userNav;

  return (
    <aside
      className="glass-panel"
      style={{
        width: '260px',
        minHeight: 'calc(100vh - 65px)',
        borderRadius: 0,
        borderTop: 0,
        borderBottom: 0,
        borderLeft: 0,
        padding: '1.75rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div style={{ padding: '0 0.5rem 1rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {role} WORKSPACE
        </span>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive ? '#fff' : 'var(--text-muted)',
              background: isActive ? 'var(--accent-gradient)' : 'transparent',
              boxShadow: isActive ? 'var(--accent-glow)' : 'none',
              transition: 'var(--transition-fast)',
              textDecoration: 'none',
            })}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;
