const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/notifications`;

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export const notificationService = {
  getNotifications: async () => {
    const response = await fetch(API_URL, { headers: getHeaders() });
    return response.json();
  },

  getUnreadCount: async () => {
    const response = await fetch(`${API_URL}/unread-count`, { headers: getHeaders() });
    return response.json();
  },

  markAsRead: async (id) => {
    await fetch(`${API_URL}/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders()
    });
  },

  markAllAsRead: async () => {
    await fetch(`${API_URL}/read-all`, {
      method: 'POST',
      headers: getHeaders()
    });
  }
};
