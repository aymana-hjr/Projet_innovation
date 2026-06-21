const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Fonction wrapper pour gérer automatiquement le token et les erreurs
export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);

    // Gestion de l'expiration du token / auth invalide
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      // On redirige vers /login pour forcer la reconnexion
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Votre session a expiré ou est invalide. Veuillez vous reconnecter.');
    }

    // Gestion des autres erreurs serveur
    if (!response.ok) {
      let errorMsg = `Erreur ${response.status}: Une erreur est survenue`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch {
        /* body text non JSON */
      }
      throw new Error(errorMsg);
    }
    
    // Certaines réponses peuvent être vides (ex: DELETE retourne souvent un 204 No Content)
    if (response.status === 204) {
      return null;
    }

    // Si on a du contenu, on le parse
    const data = await response.json();
    return data;
};
