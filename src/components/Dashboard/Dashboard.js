/**
 * ARBORESCENCE DU FICHIER:
 * src/
 * └── components/
 *     └── Dashboard/
 *         └── Dashboard.js
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import AdminDashboard from './AdminDashboard';
import AdminRHDashboard from './AdminRH/AdminRHDashboard';
import ChefDashboard from './ChefDashboard';
import ChefEnseignantDashboard from './ChefEnseignant/ChefEnseignantDashboard';
import ChefContractuelDashboard from './ChefContractuel/ChefContractuelDashboard';
import EmployeDashboard from './EmployeDashboard';
import OnboardingEmploye from '../Employe/OnboardingEmploye';

const Dashboard = () => {
  const { user, isAdminRH, isChefService, getDashboardType } = useAuth();
  const { t, isArabic } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔍 Récupération dashboard pour utilisateur:', user);
        console.log('🎯 Type de dashboard:', getDashboardType());

        // 🔄 MODIFICATION : Utiliser la nouvelle API
        // Pour les employés, vérifier d'abord si le profil existe
        if (user?.role === 'employe') {
          try {
            // Vérifier si le profil existe
            await apiService.getMonProfil();
            // Si oui, charger les données du dashboard
            const response = await apiService.getDashboard('auto');
            console.log('📊 Données dashboard reçues:', response);
            setDashboardData(response);
          } catch (profilErr) {
            // Si le profil n'existe pas (404), rediriger vers l'onboarding
            if (profilErr.response?.status === 404 || profilErr.response?.data?.error?.includes('Profil')) {
              console.log('📝 Profil non trouvé, redirection vers onboarding');
              setNeedsOnboarding(true);
              setIsLoading(false);
              return;
            }
            // Sinon, essayer quand même de charger le dashboard
            try {
              const response = await apiService.getDashboard('auto');
              setDashboardData(response);
            } catch (dashboardErr) {
              throw dashboardErr;
            }
          }
        } else {
          const response = await apiService.getDashboard('auto');
          console.log('📊 Données dashboard reçues:', response);
          setDashboardData(response);
        }

      } catch (err) {
        console.error('❌ Erreur lors du chargement du dashboard:', err);
        console.error('❌ Détails de l\'erreur:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url,
          message: err.message
        });

        // Gestion spécifique des erreurs
        if (err.response?.status === 404) {
          // Si c'est un employé et que le profil n'existe pas, rediriger vers l'onboarding
          if (user?.role === 'employe' && err.response?.data?.error?.includes('Profil')) {
            setNeedsOnboarding(true);
            setIsLoading(false);
            return;
          }
          setError(err.response?.data?.message || err.response?.data?.error || 'Endpoint dashboard non trouvé. Veuillez vérifier que le serveur est démarré.');
        } else if (err.response?.status === 403) {
          setError('Vous n\'avez pas les permissions nécessaires pour accéder à ce dashboard');
        } else if (err.response?.status === 401) {
          setError('Session expirée, veuillez vous reconnecter');
        } else if (err.message === 'Token d\'authentification manquant') {
          setError('Authentification requise. Veuillez vous reconnecter.');
        } else {
          setError(err.response?.data?.detail || err.response?.data?.message || 'Erreur lors du chargement des données du dashboard');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, getDashboardType]);

  // 🔄 MODIFICATION : Logique de rendu corrigée
  const renderDashboard = () => {
    // Si l'employé a besoin d'onboarding, afficher le formulaire d'onboarding
    if (user?.role === 'employe' && needsOnboarding) {
      console.log('📝 Affichage OnboardingEmploye');
      return <OnboardingEmploye />;
    }

    if (!user || (!dashboardData && !needsOnboarding)) {
      return null;
    }

    console.log('🎨 Rendu dashboard pour rôle:', user.role);

    // ✅ CORRECTION : Condition spécifique pour chef_enseignant
    if (user.role === 'chef_enseignant') {
      console.log('🎓 Affichage ChefEnseignantDashboard');
      return <ChefEnseignantDashboard data={dashboardData} />;
    }

    // Autres rôles
    switch (user.role) {
      case 'admin_rh':
        console.log('👑 Affichage AdminRHDashboard');
        return <AdminRHDashboard />;

      case 'chef_pat':
        console.log('👥 Affichage ChefDashboard générique pour:', user.role);
        return <ChefDashboard data={dashboardData} />;

      case 'chef_contractuel':
        console.log('📋 Affichage ChefContractuelDashboard');
        return <ChefContractuelDashboard />;

      case 'employe':
      default:
        // Si l'employé n'a pas de profil, afficher l'onboarding
        if (needsOnboarding) {
          console.log('📝 Affichage OnboardingEmploye');
          return <OnboardingEmploye />;
        }
        console.log('👤 Affichage EmployeDashboard');
        return <EmployeDashboard data={dashboardData} />;
    }
  };

  // Fonction pour obtenir les couleurs du rôle
  const getRoleColors = (role) => {
    const roleColors = {
      admin_rh: {
        primary: '#dc2626',
        secondary: '#fecaca',
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        light: '#fef2f2'
      },
      chef_enseignant: {
        primary: '#059669',
        secondary: '#bbf7d0',
        background: 'linear-gradient(135deg, #059669 0%, #16a34a 100%)',
        light: '#f0fdf4'
      },
      chef_pat: {
        primary: '#d97706',
        secondary: '#fde047',
        background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        light: '#fefce8'
      },
      chef_contractuel: {
        primary: '#7c3aed',
        secondary: '#c4b5fd',
        background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
        light: '#faf5ff'
      },
      employe: {
        primary: '#374151',
        secondary: '#d1d5db',
        background: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
        light: '#f9fafb'
      }
    };
    return roleColors[role] || roleColors.employe;
  };

  const roleColors = getRoleColors(user?.role);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          padding: '4rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animation de fond */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            animation: 'pulse 2s ease-in-out infinite'
          }}></div>

          <div style={{
            width: '5rem',
            height: '5rem',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem',
            position: 'relative',
            zIndex: 1
          }}></div>

          <h3 style={{
            color: '#3b82f6',
            fontSize: '1.5rem',
            fontWeight: '800',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            Chargement du dashboard
          </h3>

          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '1.125rem',
            position: 'relative',
            zIndex: 1
          }}>
            Préparation de votre espace de travail personnalisé...
          </p>

          {/* Indicateur de progression */}
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#e5e7eb',
            borderRadius: '2px',
            marginTop: '2rem',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              borderRadius: '2px',
              animation: 'progress 2s ease-in-out infinite'
            }}></div>
          </div>

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes progress {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(300%); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '600px',
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          padding: '3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #fee2e2',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Motif d'erreur subtil */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)',
            opacity: 0.5
          }}></div>

          <div style={{
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            border: '3px solid #fca5a5',
            position: 'relative',
            zIndex: 1
          }}>
            <svg style={{ width: '2.5rem', height: '2.5rem', color: '#dc2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            Erreur de chargement
          </h2>

          <p style={{
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: '1.6',
            fontSize: '1.125rem',
            position: 'relative',
            zIndex: 1
          }}>
            {error}
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.4)';
              }}
            >
              🔄 Réessayer
            </button>

            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.color = '#374151';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#6b7280';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🏠 Accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header du dashboard - DESIGN PREMIUM */}
        <div style={{
          background: roleColors.background,
          borderRadius: '1.5rem',
          boxShadow: `0 25px 50px -12px ${roleColors.primary}40`,
          padding: '3rem',
          marginBottom: '2rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Motifs géométriques en arrière-plan */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            opacity: 0.3,
            transform: 'rotate(45deg)'
          }}></div>

          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.05), transparent)',
            animation: 'rotate 20s linear infinite'
          }}></div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '5rem',
                  height: '5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>
                    {user.role === 'admin_rh' && '👨‍💼'}
                    {user.role === 'chef_enseignant' && '🎓'}
                    {user.role === 'chef_pat' && '👥'}
                    {user.role === 'chef_contractuel' && '📋'}
                    {user.role === 'employe' && '👤'}
                  </span>
                </div>

                <div>
                  <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    margin: 0,
                    letterSpacing: '-0.025em'
                  }}>
                    {user.role === 'admin_rh' && t('dashboard.adminRH')}
                    {user.role === 'chef_enseignant' && t('dashboard.chefEnseignant')}
                    {user.role === 'chef_pat' && t('dashboard.chefPAT')}
                    {user.role === 'chef_contractuel' && t('dashboard.chefContractuel')}
                    {user.role === 'employe' && t('dashboard.employe')}
                  </h1>

                  <p style={{
                    fontSize: '1.25rem',
                    marginTop: '0.5rem',
                    margin: 0,
                    opacity: 0.9,
                    fontWeight: '500',
                    textAlign: isArabic ? 'right' : 'left',
                    direction: isArabic ? 'rtl' : 'ltr'
                  }}>
                    {t('dashboard.bonjourApercu', { name: user?.first_name || user?.username })} 👋
                  </p>
                </div>
              </div>

              {/* Informations de service */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '1rem',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      margin: '0 0 0.5rem 0',
                      opacity: 0.8
                    }}>
                      {t('dashboard.role')}
                    </p>
                    <p style={{
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      margin: 0,
                      fontSize: '1.125rem'
                    }}>
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      margin: '0 0 0.5rem 0',
                      opacity: 0.8
                    }}>
                      {t('dashboard.derniereConnexion')}
                    </p>
                    <p style={{
                      fontWeight: '700',
                      margin: 0,
                      fontSize: '1.125rem'
                    }}>
                      {new Date().toLocaleDateString(isArabic ? 'ar-MA' : 'fr-FR')}
                    </p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      margin: '0 0 0.5rem 0',
                      opacity: 0.8
                    }}>
                      {t('dashboard.statut')}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        width: '0.75rem',
                        height: '0.75rem',
                        backgroundColor: '#22c55e',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }}></div>
                      <p style={{
                        fontWeight: '700',
                        margin: 0,
                        fontSize: '1.125rem'
                      }}>
                        {t('dashboard.enLigne')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar et informations utilisateur - DESIGN AMÉLIORÉ */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginLeft: '2rem'
            }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: '0.875rem',
                  margin: '0 0 0.5rem 0',
                  opacity: 0.8
                }}>
                  {t('dashboard.utilisateurConnecte')}
                </p>
                <p style={{
                  fontWeight: '700',
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.25rem'
                }}>
                  {user?.first_name || user?.username}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  margin: 0,
                  opacity: 0.8
                }}>
                  {user?.email}
                </p>
              </div>

              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                position: 'relative'
              }}>
                <span style={{
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '1.5rem'
                }}>
                  {(user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U').toUpperCase()}
                </span>

                {/* Indicateur de statut en ligne amélioré */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.25rem',
                  right: '0.25rem',
                  width: '1rem',
                  height: '1rem',
                  backgroundColor: '#22c55e',
                  borderRadius: '50%',
                  border: '2px solid white',
                  animation: 'pulse 2s infinite'
                }}></div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.1); }
            }
          `}</style>
        </div>

        {/* Message de bienvenue personnalisé */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle, ${roleColors.primary}10 0%, transparent 70%)`,
            transform: 'translate(25%, -25%)'
          }}></div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: `linear-gradient(135deg, ${roleColors.primary} 0%, ${roleColors.primary}CC 100%)`,
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 14px 0 ${roleColors.primary}40`
            }}>
              <span style={{ fontSize: '2rem', color: 'white' }}>🚀</span>
            </div>

            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 0.5rem 0'
              }}>
                {t('dashboard.bienvenueEspaceTravail')}
              </h3>
              <p style={{
                color: '#6b7280',
                margin: 0,
                fontSize: '1rem',
                lineHeight: '1.5',
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}>
                {user.role === 'admin_rh' && t('dashboard.descriptionAdminRH')}
                {user.role === 'chef_enseignant' && t('dashboard.descriptionChefEnseignant')}
                {user.role === 'chef_pat' && t('dashboard.descriptionChefPAT')}
                {user.role === 'chef_contractuel' && t('dashboard.descriptionChefContractuel')}
                {user.role === 'employe' && t('dashboard.descriptionEmploye')}
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: roleColors.light,
              borderRadius: '0.75rem',
              border: `1px solid ${roleColors.secondary}`,
              textAlign: 'center',
              minWidth: '120px'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: roleColors.primary,
                marginBottom: '0.25rem'
              }}>
                {new Date().toLocaleTimeString(isArabic ? 'ar-MA' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {t('dashboard.heureActuelle')}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu du dashboard selon le rôle */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;