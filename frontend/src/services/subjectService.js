import { fetchApi } from './api';

export const subjectService = {
  getSubjects: async () => {
    return await fetchApi('/subjects', { method: 'GET' });
  },
  createSubject: async (data) => {
    return await fetchApi('/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  deleteSubject: async (id) => {
    return await fetchApi(`/subjects/${id}`, { method: 'DELETE' });
  }
};
