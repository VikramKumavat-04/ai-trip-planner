import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('accessToken');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) { fetchUser(); }
    else { setLoading(false); }
  }, [token, fetchUser]);

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const { user, accessToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    setUser(user);
    toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
    return user;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { user, accessToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    setUser(user);
    toast.success('Account created! Welcome aboard 🎉');
    return user;
  };

  const googleLogin = async (credential) => {
    const res = await api.post('/auth/google', { credential });
    const { user, accessToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    setUser(user);
    toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
    return user;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => setUser(prev => ({ ...prev, ...updatedUser }));

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, googleLogin, logout, updateUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
