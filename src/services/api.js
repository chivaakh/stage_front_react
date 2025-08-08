import axios from 'axios';
import toast from 'react-hot-toast';

// Configuration de base d'Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

// Instance Axios avec configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token ajouté à la requête:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Erreur dans intercepteur request:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse API réussie:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('❌ Erreur API:', error.response?.status, error.config?.url);
    
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('🔄 Tentative de refresh du token...');

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          console.log('✅ Token refreshé avec succès');

          // Retry la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Échec du refresh token:', refreshError);
        // Le refresh a échoué, déconnecter l'utilisateur
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Afficher les messages d'erreur
    if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.message && !error.message.includes('Network Error')) {
      toast.error(`Erreur: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  // Connexion
  async login(credentials) {
    try {
      console.log('🔐 Tentative de connexion...', credentials.username);
      const response = await api.post('/auth/login/', credentials);
      console.log('✅ Réponse de connexion:', response.data);
      
      const { access, refresh, user } = response.data;

      // Stocker les tokens et les infos utilisateur
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Bienvenue ${user.full_name || user.username} !`);
      console.log('✅ Connexion réussie pour:', user.username, 'Rôle:', user.role);
      
      return { success: true, user, tokens: { access, refresh } };
    } catch (error) {
      console.error('❌ Erreur de connexion:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.error || 'Erreur de connexion' 
      };
    }
  },

  // Déconnexion
  logout() {
    console.log('🚪 Déconnexion...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    toast.success('Déconnexion réussie');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    const isAuth = !!(token && user);
    console.log('🔍 Vérification authentification:', isAuth);
    return isAuth;
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('👤 Utilisateur actuel:', user.username, user.role);
        return user;
      } catch (error) {
        console.error('❌ Erreur parsing user:', error);
        return null;
      }
    }
    return null;
  },

  // Récupérer le token d'accès
  getAccessToken() {
    return localStorage.getItem('access_token');
  },
};

// Services API pour les différentes entités
export const apiService = {
  // Test de connexion
  async testConnection() {
    try {
      const response = await api.get('/permissions/mes_permissions/');
      console.log('✅ Test de connexion API réussi');
      return response.data;
    } catch (error) {
      console.error('❌ Test de connexion API échoué:', error);
      throw error;
    }
  },

  // Dashboard
  async getDashboard(type = 'auto') {
    const response = await api.get(`/dashboard/${type}/`);
    return response.data;
  },

  // Utilisateurs
  async getUsers(params = {}) {
    const response = await api.get('/users/', { params });
    return response.data;
  },

  // Services
  async getServices(params = {}) {
    const response = await api.get('/services/', { params });
    return response.data;
  },

  // Personnes
  async getPersonnes(params = {}) {
    const response = await api.get('/personnes/', { params });
    return response.data;
  },

  async getMonProfil() {
    const response = await api.get('/personnes/mon_profil/');
    return response.data;
  },

  // Absences
  async getAbsences(params = {}) {
    const response = await api.get('/absences/', { params });
    return response.data;
  },

  async createAbsence(absenceData) {
    const response = await api.post('/absences/', absenceData);
    return response.data;
  },

  // Permissions
  async getMesPermissions() {
    const response = await api.get('/permissions/mes_permissions/');
    return response.data;
  },
};

export default api;