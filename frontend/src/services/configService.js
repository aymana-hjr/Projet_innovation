import { fetchApi } from './api';

export const configService = {
  getAvailabilities: async () => {
    return await fetchApi('/availabilities', { method: 'GET' });
  },
  saveAvailability: async (data) => {
    return await fetchApi('/availabilities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  deleteAvailability: async (id) => {
    return await fetchApi(`/availabilities/${id}`, { method: 'DELETE' });
  },
  getGoals: async () => {
    return await fetchApi('/weekly-goals', { method: 'GET' });
  },
  saveGoal: async (data) => {
    return await fetchApi('/weekly-goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
