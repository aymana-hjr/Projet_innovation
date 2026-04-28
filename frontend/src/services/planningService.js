import { fetchApi } from './api';

export const planningService = {
  /**
   * Génère un planning hebdomadaire pour l'utilisateur
   * @param {string} weekStart - La date de début de la semaine (YYYY-MM-DD)
   */
  generatePlan: async (weekStart) => {
    return await fetchApi(`/planning/generate?weekStart=${weekStart}`, {
      method: 'POST',
    });
  },

  /**
   * Récupère les sessions d'étude pour une semaine spécifique
   * @param {string} weekStart - La date de début de la semaine (YYYY-MM-DD)
   */
  getWeekSessions: async (weekStart) => {
    return await fetchApi(`/planning/sessions?weekStart=${weekStart}`, {
      method: 'GET',
    });
  }
};
