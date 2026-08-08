import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import CreateComplaintPage from './pages/CreateComplaintPage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import FeedbackPage from './pages/FeedbackPage';

const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="app-container" style={{ flex: 1 }}>
        {isAuthenticated && <Sidebar />}
        <main className="main-content">
          <div className="page-body">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'AGENT', 'ADMIN']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-complaint"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <CreateComplaintPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complaint/:id"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'AGENT', 'ADMIN']}>
                    <ComplaintDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agent-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                    <AgentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'AGENT', 'ADMIN']}>
                    <FeedbackPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;
