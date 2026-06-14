const API_URL = 'http://localhost:8080/api/analytics';

export const analyticsService = {
  getSummary: async () => {
    const response = await fetch(`${API_URL}/summary`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },
  getSubjectProgress: async () => {
    const response = await fetch(`${API_URL}/subject-progress`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },
  getWeeklyProductivity: async () => {
    const response = await fetch(`${API_URL}/weekly-productivity`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  }
};
