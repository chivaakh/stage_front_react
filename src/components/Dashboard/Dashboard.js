import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import AdminDashboard from './AdminDashboard';
import ChefDashboard from './ChefDashboard';
import EmployeDashboard from './EmployeDashboard';

const Dashboard = () => {
  const { user, isAdminRH, isChefService, getDashboardType } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const dashboardType = getDashboardType();
        console.log('🔍 Récupération des données dashboard pour:', dashboardType);
        
        // Pour le moment, utilisons des données simulées
        const mockData = {
          admin_rh: {
            statistiques_generales: {
              total_employes: 150,
              total_services: 5,
              absences_en_attente: 12,
              contrats_expirant_bientot: 3
            },
            services: [
              { nom: 'Service Enseignant', type: 'enseignant', chef: 'Dr. Ahmed', nombre_employes: 80 },
              { nom: 'Service PAT', type: 'pat', chef: 'Mme. Fatima', nombre_employes: 45 },
              { nom: 'Service Contractuel', type: 'contractuel', chef: 'M. Omar', nombre_employes: 25 }
            ]
          },
          chef_service: {
            service_info: {
              nom: 'Service Enseignant',
              type: 'enseignant',
              description: 'Gestion du personnel enseignant'
            },
            statistiques: {
              total_employes: 80,
              absences_en_attente: 5,
              contrats_expirant_bientot: 1,
              repartition_employes: [
                { type_employe: 'enseignant', count: 80 }
              ]
            }
          },
          employe: {
            profil: {
              nom_complet: user?.full_name || user?.username || 'Utilisateur',
              fonction: 'Enseignant',
              service: 'Service Enseignant',
              type_employe: 'enseignant'
            },
            statistiques: {
              nombre_absences: 3,
              nombre_documents: 8
            },
            absences_recentes: [],
            paie_courante: null
          }
        };

        setDashboardData(mockData[dashboardType] || mockData.employe);
      } catch (err) {
        console.error('❌ Erreur lors du chargement du dashboard:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, getDashboardType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '1.5rem' }}>
      {/* Header du dashboard */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0
            }}>
              Tableau de bord
            </h1>
            <p style={{
              color: '#6b7280',
              marginTop: '0.25rem',
              margin: 0
            }}>
              Bonjour {user?.full_name || user?.username}, voici un aperçu de votre activité
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Rôle</p>
              <p style={{
                fontWeight: '500',
                color: '#111827',
                textTransform: 'capitalize',
                margin: 0
              }}>
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: '#2563eb',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu du dashboard selon le rôle */}
      {isAdminRH() && <AdminDashboard data={dashboardData} />}
      {isChefService() && <ChefDashboard data={dashboardData} />}
      {!isAdminRH() && !isChefService() && <EmployeDashboard data={dashboardData} />}
    </div>
  );
};

export default Dashboard;