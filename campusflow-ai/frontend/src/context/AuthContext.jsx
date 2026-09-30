import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusflow_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default demo user: Admin
    return {
      id: 'u0000000-0000-0000-0000-000000000001',
      full_name: 'Dr. Vikram Patel',
      email: 'admin@campusflow.ai',
      role: 'admin',
      status: 'active'
    };
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no token exists, get initial token for default role
    const token = localStorage.getItem('campusflow_token');
    if (!token) {
      switchRole('admin');
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        setUser(res.data.user);
        localStorage.setItem('campusflow_user', JSON.stringify(res.data.user));
        localStorage.setItem('campusflow_token', res.data.token);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', payload);
      if (res.success && res.data) {
        setUser(res.data.user);
        localStorage.setItem('campusflow_user', JSON.stringify(res.data.user));
        localStorage.setItem('campusflow_token', res.data.token);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole) => {
    try {
      const res = await api.post('/auth/switch-role', { role: targetRole });
      if (res.success && res.data) {
        setUser(res.data.user);
        localStorage.setItem('campusflow_user', JSON.stringify(res.data.user));
        localStorage.setItem('campusflow_token', res.data.token);
      }
    } catch (err) {
      console.warn('Switch role local fallback:', err.message);
      // Fallback local mock user
      const roleMap = {
        admin: { id: 'u0000000-0000-0000-0000-000000000001', full_name: 'Dr. Vikram Patel', email: 'admin@campusflow.ai', role: 'admin' },
        department_head: { id: 'u0000000-0000-0000-0000-000000000002', full_name: 'Dr. Sunita Rao', email: 'hod.it@campusflow.ai', role: 'department_head' },
        faculty: { id: 'u0000000-0000-0000-0000-000000000004', full_name: 'Prof. Rajesh Nair', email: 'faculty@campusflow.ai', role: 'faculty' },
        staff: { id: 'u0000000-0000-0000-0000-000000000010', full_name: 'Rahul Sharma', email: 'rahul.it@campusflow.ai', role: 'staff' },
        student: { id: 'u0000000-0000-0000-0000-000000000020', full_name: 'Aarav Mehta', email: 'student@campusflow.ai', role: 'student' },
        guest: { id: 'u0000000-0000-0000-0000-000000000099', full_name: 'Campus Guest (Visitor)', email: 'guest@campus.edu', role: 'guest' }
      };
      const fallbackUser = roleMap[targetRole] || roleMap.admin;
      setUser(fallbackUser);
      localStorage.setItem('campusflow_user', JSON.stringify(fallbackUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusflow_user');
    localStorage.removeItem('campusflow_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
