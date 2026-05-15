import api from './api';

export const authService = {
  async login(username, password) {
    const data = await api.post('/auth/login', { username, password });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  async logout() {
    localStorage.removeItem('auth_token');
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },
};

export default authService;
