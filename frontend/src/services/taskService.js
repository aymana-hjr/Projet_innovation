import { fetchApi } from './api';

export const taskService = {
  /**
   * Récupère toutes les tâches de l'utilisateur connecté
   */
  getTasks: async () => {
    return await fetchApi('/tasks', {
      method: 'GET',
    });
  },

  /**
   * Crée une nouvelle tâche
   * @param {Object} taskData - Les données de la tâche (title, description, status, priority, dueDate)
   */
  createTask: async (taskData) => {
    return await fetchApi('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Met à jour une tâche existante
   * @param {number} id - L'ID de la tâche
   * @param {Object} taskData - Les nouvelles données
   */
  updateTask: async (id, taskData) => {
    return await fetchApi(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Supprime une tâche
   * @param {number} id - L'ID de la tâche à supprimer
   */
  deleteTask: async (id) => {
    return await fetchApi(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }
};
