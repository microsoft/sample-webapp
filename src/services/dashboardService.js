import api from './api';

export const dashboardService = {
  async getStats() {
    return api.get('/dashboard/stats');
  },

  async getRecentActivity(page = 1, limit = 10) {
    return api.get(`/dashboard/activity?page=${page}&limit=${limit}`);
  },

  async getTodos() {
    return api.get('/todos');
  },

  async addTodo(text) {
    return api.post('/todos', { text });
  },

  async toggleTodo(id) {
    return api.put(`/todos/${id}/toggle`);
  },

  async deleteTodo(id) {
    return api.delete(`/todos/${id}`);
  },
};

export default dashboardService;
