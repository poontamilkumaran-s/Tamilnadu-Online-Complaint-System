import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Authenticating session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect user to their appropriate dashboard if wrong role
    if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'AGENT') return <Navigate to="/agent-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
