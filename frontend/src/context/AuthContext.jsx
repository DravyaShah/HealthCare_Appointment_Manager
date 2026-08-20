import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const storedToken = localStorage.getItem('access_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/accounts/me/');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, [fetchUser]);

  const login = async (emailOrUsername, password) => {
    const res = await api.post('/api/token/', {
      email: emailOrUsername,
      password,
    });
    const { access, refresh } = res.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setToken(access);

    const userRes = await api.get('/accounts/me/');
    setUser(userRes.data);
    return userRes.data;
  };

  const registerUser = async (data) => {
    await api.post('/accounts/register/', data);
    return await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : data));
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    loading,
    login,
    register: registerUser,
    logout,
    updateUser,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
