import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getProfile();
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session restoration failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials or server error';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await registerUser(userData);
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration error';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // 1-Click Demo Login
  const loginAsDemo = async (role) => {
    const demoCredentials = {
      ADMIN: { email: 'admin@complaintpro.com', pass: 'Admin@123' },
      AGENT: { email: 'agent.tech@complaintpro.com', pass: 'Agent@123' },
      USER: { email: 'john.doe@example.com', pass: 'User@123' },
    };

    const creds = demoCredentials[role];
    if (creds) {
      return await login(creds.email, creds.pass);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        loginAsDemo,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
