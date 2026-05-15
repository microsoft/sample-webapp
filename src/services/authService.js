import api from './api';
import { setAuthToken, clearAuthToken, getAuthToken } from './tokenStore';

export const authService = {
  async login(username, password) {
    const data = await api.post('/auth/login', { username, password });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async logout() {
    clearAuthToken();
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  },

  isAuthenticated() {
    return !!getAuthToken();
  },
};

export default authService;
