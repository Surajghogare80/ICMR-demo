// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService.js';
import toast from 'react-hot-toast';
import { APP_NAME } from '../config/appConfig.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'prabha_token';
const USER_KEY = 'prabha_user';

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  const saveAuth = useCallback((userData, authToken) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  }, []);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const { data } = await authService.getProfile();
        saveAuth(data.user, token);
      } catch {
        clearAuth();
      } finally {
        setInitializing(false);
      }
    };
    validateToken();
  }, []); // eslint-disable-line

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data, message } = await authService.register(formData);
      saveAuth(data.user, data.token);
      toast.success(message || t('auth.toast.registration_success', { appName: APP_NAME }));
      return { success: true };
    } catch (error) {
      toast.error(error.message || t('auth.toast.registration_failed'));
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [saveAuth, t]);

  const login = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data, message } = await authService.login(formData);
      saveAuth(data.user, data.token);
      toast.success(message || t('auth.toast.login_welcome_back', { name: data.user.name }));
      return { success: true, user: data.user };
    } catch (error) {
      toast.error(error.message || t('auth.toast.login_failed'));
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [saveAuth, t]);

  const logout = useCallback(() => {
    clearAuth();
    toast.success(t('auth.toast.logout_success'));
  }, [clearAuth, t]);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        initializing,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
