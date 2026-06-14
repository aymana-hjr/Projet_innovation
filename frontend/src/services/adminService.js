import { fetchApi } from './api';

export const adminService = {
  getGlobalStats: async () => {
    return fetchApi('/admin/stats');
  },

  getUsers: async () => {
    return fetchApi('/admin/users');
  },

  updateUser: async (id, userData) => {
    return fetchApi(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id) => {
    return fetchApi(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};
