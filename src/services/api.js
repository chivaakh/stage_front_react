// src/services/api.js - VERSION FINALE CORRIGÉE
import axios from 'axios';

// Configuration de base
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

// Instance Axios avec configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
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
      console.log('🔑 Token ajouté à la requête:', config.method?.toUpperCase(), config.url);
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
    console.log('✅ Réponse API réussie:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('❌ Erreur API:', error.response?.status, error.config?.method?.toUpperCase(), error.config?.url);
    
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
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ====================================
// SERVICE D'AUTHENTIFICATION
// ====================================

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
  }
};

// ====================================
// SERVICE API PRINCIPAL (UNIFIÉ)
// ====================================

export const apiService = {
  // ===== MÉTHODES GÉNÉRIQUES =====
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),

  // ===== TEST DE CONNEXION =====
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

  // ===== DASHBOARD =====
  async getDashboard(type = 'auto') {
    try {
      const response = await api.get(`/dashboard/${type}/`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getDashboard:', error);
      throw error;
    }
  },

  // ===== UTILISATEURS =====
  async getUsers(params = {}) {
    try {
      const response = await api.get('/users/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getUsers:', error);
      throw error;
    }
  },

  // ===== SERVICES =====
  async getServices(params = {}) {
    try {
      const response = await api.get('/services/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getServices:', error);
      throw error;
    }
  },

  // ===== PERSONNES =====
  async getPersonnes(params = {}) {
    try {
      const response = await api.get('/personnes/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getPersonnes:', error);
      throw error;
    }
  },

  async getMonProfil() {
    try {
      const response = await api.get('/personnes/mon_profil/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getMonProfil:', error);
      throw error;
    }
  },

  // ===== ENSEIGNANTS =====
  async getEnseignants(params = {}) {
    try {
      console.log('👨‍🏫 Récupération des enseignants avec params:', params);
      const response = await api.get('/enseignants/', { params });
      console.log('✅ Enseignants récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getEnseignants:', error);
      throw error;
    }
  },

  async getEnseignant(id) {
    try {
      console.log('👁️ Récupération enseignant ID:', id);
      const response = await api.get(`/enseignants/${id}/`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getEnseignant:', error);
      throw error;
    }
  },

  async createEnseignant(enseignantData) {
    try {
      console.log('➕ Création nouvel enseignant:', enseignantData);
      const response = await api.post('/enseignants/', enseignantData);
      console.log('✅ Enseignant créé:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur createEnseignant:', error);
      throw error;
    }
  },

  async updateEnseignant(id, enseignantData) {
    try {
      console.log('✏️ Modification enseignant ID:', id, enseignantData);
      const response = await api.put(`/enseignants/${id}/`, enseignantData);
      console.log('✅ Enseignant modifié:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updateEnseignant:', error);
      throw error;
    }
  },

  async deleteEnseignant(id) {
    try {
      console.log('🗑️ Suppression enseignant ID:', id);
      const response = await api.delete(`/enseignants/${id}/`);
      console.log('✅ Enseignant supprimé');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur deleteEnseignant:', error);
      throw error;
    }
  },

  async getEnseignantsParGrade() {
    try {
      console.log('📊 Récupération stats enseignants par grade');
      const response = await api.get('/enseignants/par_grade/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getEnseignantsParGrade:', error);
      throw error;
    }
  },

  async getEnseignantsFinsServiceProche() {
    try {
      console.log('⚠️ Récupération enseignants fin de service proche');
      const response = await api.get('/enseignants/fins_service_proche/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getEnseignantsFinsServiceProche:', error);
      throw error;
    }
  },

  async getEnseignantsDebugInfo() {
    try {
      console.log('🐛 Récupération debug info enseignants');
      const response = await api.get('/enseignants/debug_info/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getEnseignantsDebugInfo:', error);
      throw error;
    }
  },

  // ===== PERSONNEL PAT (NOUVELLES MÉTHODES) =====
  async getPersonnelPAT(params = {}) {
    try {
      console.log('🏢 Récupération du personnel PAT avec params:', params);
      const response = await api.get('/personnel-pat/', { params });
      console.log('✅ Personnel PAT récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getPersonnelPAT:', error);
      throw error;
    }
  },

  async getPersonnelPATById(id) {
    try {
      console.log('👁️ Récupération agent PAT ID:', id);
      const response = await api.get(`/personnel-pat/${id}/`);
      console.log('✅ Agent PAT récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getPersonnelPATById:', error);
      throw error;
    }
  },

  async createPersonnelPAT(patData) {
    try {
      console.log('➕ Création nouvel agent PAT:', patData);
      const response = await api.post('/personnel-pat/', patData);
      console.log('✅ Agent PAT créé:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur createPersonnelPAT:', error);
      throw error;
    }
  },

  async updatePersonnelPAT(id, patData) {
    try {
      console.log('✏️ Modification agent PAT ID:', id, patData);
      const response = await api.put(`/personnel-pat/${id}/`, patData);
      console.log('✅ Agent PAT modifié:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updatePersonnelPAT:', error);
      throw error;
    }
  },

  async deletePersonnelPAT(id) {
    try {
      console.log('🗑️ Suppression agent PAT ID:', id);
      const response = await api.delete(`/personnel-pat/${id}/`);
      console.log('✅ Agent PAT supprimé');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur deletePersonnelPAT:', error);
      throw error;
    }
  },

  async getPersonnelPATParPoste() {
    try {
      console.log('📊 Récupération stats PAT par poste');
      const response = await api.get('/personnel-pat/par_poste/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getPersonnelPATParPoste:', error);
      throw error;
    }
  },

  // ===== ABSENCES =====
  async getAbsences(params = {}) {
    try {
      console.log('📅 Récupération des absences avec params:', params);
      const response = await api.get('/absences/', { params });
      console.log('✅ Absences récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAbsences:', error);
      throw error;
    }
  },

  async getAbsence(id) {
    try {
      console.log('👁️ Récupération absence ID:', id);
      const response = await api.get(`/absences/${id}/`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAbsence:', error);
      throw error;
    }
  },

  async createAbsence(absenceData) {
    try {
      console.log('➕ Création nouvelle absence:', absenceData);
      const response = await api.post('/absences/', absenceData);
      console.log('✅ Absence créée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur createAbsence:', error);
      throw error;
    }
  },

  async updateAbsence(id, absenceData) {
    try {
      console.log('✏️ Modification absence ID:', id, absenceData);
      const response = await api.put(`/absences/${id}/`, absenceData);
      console.log('✅ Absence modifiée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updateAbsence:', error);
      throw error;
    }
  },

  async deleteAbsence(id) {
    try {
      console.log('🗑️ Suppression absence ID:', id);
      const response = await api.delete(`/absences/${id}/`);
      console.log('✅ Absence supprimée');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur deleteAbsence:', error);
      throw error;
    }
  },

  // ===== GESTION DES ABSENCES POUR CHEF (CORRIGÉES) =====
  async getAbsencesEnAttenteApprobation() {
    try {
      console.log('⏰ Récupération absences en attente d\'approbation');
      const response = await api.get('/absences/en_attente_approbation/');
      console.log('✅ Absences en attente récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAbsencesEnAttenteApprobation:', error);
      // Fallback: essayer avec un filtre statut
      try {
        console.log('🔄 Tentative fallback avec filtre statut...');
        const fallbackResponse = await api.get('/absences/', { params: { statut: 'EN_ATTENTE' } });
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('❌ Erreur fallback:', fallbackError);
        throw error;
      }
    }
  },

  async approuverAbsence(absenceId, commentaire = '') {
    try {
      console.log('✅ Approbation absence ID:', absenceId, 'Commentaire:', commentaire);
      
      // Tentative 1: Endpoint dédié approuver
      try {
        const response = await api.post(`/absences/${absenceId}/approuver/`, {
          commentaire: commentaire || 'Approuvé par le chef de service'
        });
        console.log('✅ Absence approuvée avec succès (méthode 1):', response.data);
        return response.data;
      } catch (error1) {
        console.log('🔄 Tentative méthode alternative...');
        
        // Tentative 2: Modification directe du statut
        const response = await api.patch(`/absences/${absenceId}/`, {
          statut: 'APPROUVÉ',
          commentaire_approbateur: commentaire || 'Approuvé par le chef de service',
          date_approbation: new Date().toISOString()
        });
        console.log('✅ Absence approuvée avec succès (méthode 2):', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ Erreur approuverAbsence:', error);
      throw error;
    }
  },

  async refuserAbsence(absenceId, motifRefus) {
    try {
      console.log('❌ Refus absence ID:', absenceId, 'Motif:', motifRefus);
      
      // Tentative 1: Endpoint dédié refuser
      try {
        const response = await api.post(`/absences/${absenceId}/refuser/`, {
          motif_refus: motifRefus || 'Refusé par le chef de service'
        });
        console.log('❌ Absence refusée avec succès (méthode 1):', response.data);
        return response.data;
      } catch (error1) {
        console.log('🔄 Tentative méthode alternative...');
        
        // Tentative 2: Modification directe du statut
        const response = await api.patch(`/absences/${absenceId}/`, {
          statut: 'REFUSÉ',
          motif_refus: motifRefus || 'Refusé par le chef de service',
          date_refus: new Date().toISOString()
        });
        console.log('❌ Absence refusée avec succès (méthode 2):', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ Erreur refuserAbsence:', error);
      throw error;
    }
  },

  async getAbsencesEnCours() {
    try {
      console.log('📅 Récupération absences en cours');
      const response = await api.get('/absences/en_cours/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAbsencesEnCours:', error);
      throw error;
    }
  },

  async getAbsencesStatistiques() {
    try {
      console.log('📊 Récupération statistiques absences');
      const response = await api.get('/absences/statistiques/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAbsencesStatistiques:', error);
      throw error;
    }
  },

  // ===== CONTRACTUELS =====
  async getContractuels(params = {}) {
    try {
      const response = await api.get('/contractuels/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getContractuels:', error);
      throw error;
    }
  },

  async getContractuelsExpirantBientot() {
    try {
      const response = await api.get('/contractuels/expires_bientot/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getContractuelsExpirantBientot:', error);
      throw error;
    }
  },

  // ===== DOCUMENTS =====
  async getDocuments(params = {}) {
    try {
      const response = await api.get('/documents/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getDocuments:', error);
      throw error;
    }
  },

  async getMesDocuments() {
    try {
      const response = await api.get('/documents/mes_documents/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getMesDocuments:', error);
      throw error;
    }
  },

  async uploadDocument(documentData) {
    try {
      const response = await api.post('/documents/', documentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur uploadDocument:', error);
      throw error;
    }
  },

  // ===== PAIES =====
  async getPaies(params = {}) {
    try {
      const response = await api.get('/paies/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getPaies:', error);
      throw error;
    }
  },

  async getResumeMensuelPaie(mois) {
    try {
      const response = await api.get('/paies/resume_mensuel/', { params: { mois } });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getResumeMensuelPaie:', error);
      throw error;
    }
  },

  // ===== RECRUTEMENTS =====
  async getRecrutements(params = {}) {
    try {
      const response = await api.get('/recrutements/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getRecrutements:', error);
      throw error;
    }
  },

  async getCandidats(params = {}) {
    try {
      const response = await api.get('/candidats/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getCandidats:', error);
      throw error;
    }
  },

  // ===== STRUCTURES =====
  async getStructures(params = {}) {
    try {
      const response = await api.get('/structures/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getStructures:', error);
      throw error;
    }
  },

  async getStructuresArborescence() {
    try {
      const response = await api.get('/structures/arborescence/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getStructuresArborescence:', error);
      throw error;
    }
  },

  // ===== DÉTACHEMENTS =====
  async getDetachements(params = {}) {
    try {
      const response = await api.get('/detachements/', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getDetachements:', error);
      throw error;
    }
  },

  // ===== PERMISSIONS =====
  async getMesPermissions() {
    try {
      const response = await api.get('/permissions/mes_permissions/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getMesPermissions:', error);
      throw error;
    }
  },

  async testHierarchie() {
    try {
      const response = await api.get('/permissions/test_hierarchie/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur testHierarchie:', error);
      throw error;
    }
  },

  // ===== ÉNUMÉRATIONS =====
  async getStatutOffres() {
    try {
      const response = await api.get('/statut-offres/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getStatutOffres:', error);
      throw error;
    }
  },

  async getTypeStructures() {
    try {
      const response = await api.get('/type-structures/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getTypeStructures:', error);
      throw error;
    }
  },

  async getTypeContrats() {
    try {
      const response = await api.get('/type-contrats/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getTypeContrats:', error);
      throw error;
    }
  },

  async getTypeAbsences() {
    try {
      const response = await api.get('/type-absences/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getTypeAbsences:', error);
      throw error;
    }
  },

  async getStatutPaiements() {
    try {
      const response = await api.get('/statut-paiements/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getStatutPaiements:', error);
      throw error;
    }
  },

  async getStatutAbsences() {
    try {
      const response = await api.get('/statut-absences/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getStatutAbsences:', error);
      throw error;
    }
  },

  async getTypeDocuments() {
    try {
      const response = await api.get('/type-documents/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getTypeDocuments:', error);
      throw error;
    }
  },

  async getStatutCandidatures() {
    try {
      const response = await api.get('/statut-candidatures/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getStatutCandidatures:', error);
      throw error;
    }
  },

  // ===== MÉTHODES UTILITAIRES =====
  
  // Méthode pour faire des requêtes personnalisées
  async customRequest(method, url, data = null, config = {}) {
    try {
      console.log(`🔧 Requête personnalisée: ${method.toUpperCase()} ${url}`);
      const response = await api.request({
        method: method.toLowerCase(),
        url,
        data,
        ...config
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur requête personnalisée ${method} ${url}:`, error);
      throw error;
    }
  },

  // Méthode pour télécharger des fichiers
  async downloadFile(url, filename = null) {
    try {
      console.log('📥 Téléchargement fichier:', url);
      const response = await api.get(url, {
        responseType: 'blob'
      });
      
      // Créer un lien de téléchargement
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('✅ Fichier téléchargé avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur downloadFile:', error);
      throw error;
    }
  },

  // Méthode pour vérifier la santé de l'API
  async healthCheck() {
    try {
      console.log('🏥 Vérification de la santé de l\'API...');
      const response = await api.get('/health/', { timeout: 5000 });
      console.log('✅ API en bonne santé');
      return response.data;
    } catch (error) {
      console.error('❌ Problème de santé de l\'API:', error);
      return { status: 'error', message: error.message };
    }
  }
};

// ====================================
// EXPORTS
// ====================================

// Export de l'instance Axios pour usage direct si nécessaire
export { api };

// Export par défaut du service principal
export default apiService;