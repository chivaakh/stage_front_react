// src/components/Dashboard/AdminRH/AdminRHDashboard.js - DASHBOARD ADMIN RH COMPLET
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/api';

const AdminRHDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    enseignants: [],
    personnelPAT: [],
    contractuels: [],
    services: [],
    absencesEnAttente: [],
    statistiques: {}
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('👑 Chargement du dashboard Admin RH...');

      // Charger tous les enseignants
      try {
        const enseignantsResponse = await apiService.getEnseignants();
        const enseignantsData = enseignantsResponse.results || enseignantsResponse || [];
        setData(prev => ({ ...prev, enseignants: enseignantsData }));
      } catch (err) {
        console.error('❌ Erreur enseignants:', err);
      }

      // Charger tout le personnel PAT
      try {
        const patResponse = await apiService.getPersonnelPAT();
        const patData = patResponse.results || patResponse || [];
        setData(prev => ({ ...prev, personnelPAT: patData }));
      } catch (err) {
        console.error('❌ Erreur PAT:', err);
      }

      // Charger tous les contractuels
      try {
        const contractuelsResponse = await apiService.get('/contractuels/');
        const contractuelsData = contractuelsResponse.data.results || contractuelsResponse.data || [];
        setData(prev => ({ ...prev, contractuels: contractuelsData }));
      } catch (err) {
        console.error('❌ Erreur contractuels:', err);
      }

      // Charger tous les services
      try {
        const servicesResponse = await apiService.get('/services/');
        const servicesData = servicesResponse.data.results || servicesResponse.data || [];
        setData(prev => ({ ...prev, services: servicesData }));
      } catch (err) {
        console.error('❌ Erreur services:', err);
      }

      // Charger les absences en attente
      try {
        const absencesResponse = await apiService.getAbsences({ statut: 'EN_ATTENTE' });
        const absencesData = absencesResponse.results || absencesResponse || [];
        setData(prev => ({ ...prev, absencesEnAttente: absencesData }));
      } catch (err) {
        console.error('❌ Erreur absences:', err);
      }

      console.log('✅ Chargement du dashboard Admin RH terminé');

    } catch (err) {
      console.error('❌ Erreur générale dashboard:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Calcul des statistiques
  const totalEmployes = data.enseignants.length + data.personnelPAT.length + data.contractuels.length;
  const totalEnseignants = data.enseignants.length;
  const totalPAT = data.personnelPAT.length;
  const totalContractuels = data.contractuels.length;
  const totalServices = data.services.length;
  const absencesEnAttente = data.absencesEnAttente.length;

  // Actions
  const handleViewEnseignants = () => {
    window.location.href = '/admin-rh/enseignants';
  };

  const handleViewPAT = () => {
    window.location.href = '/admin-rh/personnel-pat';
  };

  const handleViewContractuels = () => {
    window.location.href = '/admin-rh/contractuels';
  };

  const handleViewServices = () => {
    window.location.href = '/admin-rh/services';
  };

  const handleViewAllServices = () => {
    window.location.href = '/admin-rh/services';
  };

  const handleCreateEnseignant = () => {
    window.location.href = '/admin-rh/enseignants?create=true';
  };

  const handleCreatePAT = () => {
    window.location.href = '/admin-rh/personnel-pat?create=true';
  };

  const handleCreateContractuel = () => {
    window.location.href = '/admin-rh/contractuels?create=true';
  };

  const handleCreateChefService = () => {
    window.location.href = '/admin-rh/users?create=chef';
  };

  const handleManageAbsences = () => {
    window.location.href = '/admin-rh/absences';
  };

  const handleManagePaies = () => {
    window.location.href = '/admin-rh/paies';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #1e3a8a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem'
          }}></div>
          <h3 style={{
            color: '#1e3a8a',
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Chargement du dashboard Admin RH
          </h3>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '1rem'
          }}>
            Préparation de votre espace de travail...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* En-tête Admin RH */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          borderRadius: '1rem',
          padding: '3rem',
          boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.3)',
          marginBottom: '2rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3
          }}></div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <span style={{ fontSize: '2.5rem' }}>👑</span>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.025em'
              }}>
                Dashboard Administrateur RH
              </h1>
              <p style={{
                fontSize: '1.25rem',
                margin: '0 0 1rem 0',
                opacity: 0.9,
                fontWeight: '500'
              }}>
                Bonjour {user?.first_name || user?.username} 👋
              </p>
              
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  margin: '0 0 0.5rem 0',
                  opacity: 0.8
                }}>
                  Vue globale - Tous les services
                </p>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: 0
                }}>
                  {totalServices} services • {totalEmployes} employés au total
                </p>
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                opacity: 0.8,
                marginBottom: '0.5rem'
              }}>
                Dernière mise à jour
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '700'
              }}>
                {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques principales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Total Employés */}
          <div 
            onClick={() => window.location.href = '/admin-rh/personnel'}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
              borderRadius: '50%',
              transform: 'translate(25%, -25%)'
            }}></div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Total Employés
                </p>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#111827',
                  margin: 0,
                  lineHeight: 1
                }}>
                  {totalEmployes}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#1e3a8a',
                  margin: '0.5rem 0 0 0',
                  fontWeight: '600'
                }}>
                  👥 Tous services confondus
                </p>
              </div>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>👥</span>
              </div>
            </div>
          </div>

          {/* Enseignants */}
          <div 
            onClick={handleViewEnseignants}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, transparent 100%)',
              borderRadius: '50%',
              transform: 'translate(25%, -25%)'
            }}></div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Enseignants
                </p>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#1e40af',
                  margin: 0,
                  lineHeight: 1
                }}>
                  {totalEnseignants}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#16a34a',
                  margin: '0.5rem 0 0 0',
                  fontWeight: '600'
                }}>
                  🎓 Corps enseignant
                </p>
              </div>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #1e40af 0%, #16a34a 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.4)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>🎓</span>
              </div>
            </div>
          </div>

          {/* Personnel PAT */}
          <div 
            onClick={handleViewPAT}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
              borderRadius: '50%',
              transform: 'translate(25%, -25%)'
            }}></div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Personnel PAT
                </p>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#1e3a8a',
                  margin: 0,
                  lineHeight: 1
                }}>
                  {totalPAT}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  margin: '0.5rem 0 0 0',
                  fontWeight: '600'
                }}>
                  🏢 Administratif & Technique
                </p>
              </div>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>🏢</span>
              </div>
            </div>
          </div>

          {/* Contractuels */}
          <div 
            onClick={handleViewContractuels}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, transparent 100%)',
              borderRadius: '50%',
              transform: 'translate(25%, -25%)'
            }}></div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Contractuels
                </p>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#7c3aed',
                  margin: 0,
                  lineHeight: 1
                }}>
                  {totalContractuels}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#8b5cf6',
                  margin: '0.5rem 0 0 0',
                  fontWeight: '600'
                }}>
                  📋 CDD / CDI / Consultants
                </p>
              </div>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.4)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>📋</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div 
            onClick={handleViewServices}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
              borderRadius: '50%',
              transform: 'translate(25%, -25%)'
            }}></div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Services
                </p>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#1e3a8a',
                  margin: 0,
                  lineHeight: 1
                }}>
                  {totalServices}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  margin: '0.5rem 0 0 0',
                  fontWeight: '600'
                }}>
                  🏛️ Tous les services
                </p>
              </div>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>🏛️</span>
              </div>
            </div>
          </div>

          {/* Absences en attente */}
          <div 
            onClick={handleManageAbsences}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)',
              borderRadius: '50%',
              transform: 'translate(25%, -25%)'
            }}></div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Absences en attente
                </p>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#475569',
                  margin: 0,
                  lineHeight: 1
                }}>
                  {absencesEnAttente}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: absencesEnAttente > 0 ? '#334155' : '#1e40af',
                  margin: '0.5rem 0 0 0',
                  fontWeight: '600'
                }}>
                  {absencesEnAttente > 0 ? '⏰ À traiter' : '✅ Tout traité'}
                </p>
              </div>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.4)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>⏰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⚡ Actions rapides
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <button 
              onClick={handleCreateEnseignant}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #1e40af 0%, #16a34a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.3)',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(5, 150, 105, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(5, 150, 105, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🎓</span>
              Créer Enseignant
            </button>

            <button 
              onClick={handleCreatePAT}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🏢</span>
              Créer Agent PAT
            </button>

            <button 
              onClick={handleCreateContractuel}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.3)',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(124, 58, 237, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(124, 58, 237, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📋</span>
              Créer Contractuel
            </button>

            <button 
              onClick={handleCreateChefService}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.3)',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(220, 38, 38, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>👔</span>
              Créer Chef de Service
            </button>

            <button 
              onClick={handleManagePaies}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.3)',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(245, 158, 11, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(245, 158, 11, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>💰</span>
              Gestion de la Paie
            </button>
          </div>
        </div>

        {/* Vue d'ensemble des services */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🏛️ Vue d'ensemble des Services
            </h3>
            <button
              onClick={handleViewServices}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px 0 rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px 0 rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px 0 rgba(16, 185, 129, 0.3)';
              }}
            >
              Voir Tous les Services →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {data.services.slice(0, 6).map((service, index) => {
              const serviceEnseignants = data.enseignants.filter(e => e.service?.id === service.id || e.service === service.id).length;
              const servicePAT = data.personnelPAT.filter(p => p.service?.id === service.id || p.service === service.id).length;
              const serviceContractuels = data.contractuels.filter(c => c.service?.id === service.id || c.service === service.id).length;
              const totalService = serviceEnseignants + servicePAT + serviceContractuels;

              return (
                <div
                  key={service.id || index}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    backgroundColor: '#fafbfc',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#1e3a8a';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafbfc';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => window.location.href = `/admin-rh/services/${service.id}`}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#111827',
                      margin: 0
                    }}>
                      {service.nom || 'Service'}
                    </h4>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      backgroundColor: '#e5e7eb',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      textTransform: 'capitalize'
                    }}>
                      {service.type_service || 'N/A'}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: '#1e40af'
                      }}>
                        {serviceEnseignants}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        🎓 Enseignants
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: '#1e3a8a'
                      }}>
                        {servicePAT}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        🏢 PAT
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: '#7c3aed'
                      }}>
                        {serviceContractuels}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        📋 Contractuels
                      </div>
                    </div>
                  </div>

                  <div style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Total employés
                      </div>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#111827'
                      }}>
                        {totalService}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      color: '#1e3a8a',
                      fontWeight: '700'
                    }}>
                      →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {data.services.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>
                🏛️
              </div>
              <h4 style={{
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: '#374151',
                fontSize: '1.125rem'
              }}>
                Aucun service trouvé
              </h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Commencez par créer un service
              </p>
            </div>
          )}
        </div>

        {/* Sections détaillées - Vue d'ensemble */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Liste des enseignants récents */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎓 Enseignants récents
              </h3>
              <button 
                onClick={handleViewEnseignants}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: 'linear-gradient(135deg, #1e40af 0%, #16a34a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px 0 rgba(5, 150, 105, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px 0 rgba(5, 150, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px 0 rgba(5, 150, 105, 0.3)';
                }}
              >
                Voir tous →
              </button>
            </div>

            <div>
              {data.enseignants.slice(0, 4).map((enseignant, index) => (
                <div 
                  key={enseignant.id || index} 
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #f3f4f6',
                    borderRadius: '0.75rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fafbfc'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                    e.currentTarget.style.borderColor = '#bbf7d0';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafbfc';
                    e.currentTarget.style.borderColor = '#f3f4f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => window.location.href = `/admin-rh/enseignants?view=${enseignant.id}`}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #bbf7d0',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#1e40af'
                      }}>
                        {enseignant.personne?.prenom?.charAt(0)}{enseignant.personne?.nom?.charAt(0)}
                      </div>
                      <div>
                        <p style={{
                          fontWeight: '700',
                          color: '#111827',
                          margin: '0 0 0.25rem 0',
                          fontSize: '1rem'
                        }}>
                          {enseignant.personne_nom_complet || 
                           `${enseignant.personne?.prenom || 'N/A'} ${enseignant.personne?.nom || 'N/A'}`}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: '0 0 0.5rem 0'
                        }}>
                          {enseignant.personne?.fonction || enseignant.corps || 'Fonction non définie'}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#1e40af',
                          color: 'white',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {enseignant.grade || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      color: '#1e40af',
                      fontWeight: '700'
                    }}>
                      →
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data.enseignants.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#6b7280'
              }}>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Aucun enseignant trouvé
                </p>
              </div>
            )}
          </div>

          {/* Liste du personnel PAT récent */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🏢 Personnel PAT récent
              </h3>
              <button 
                onClick={handleViewPAT}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px 0 rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px 0 rgba(59, 130, 246, 0.3)';
                }}
              >
                Voir tous →
              </button>
            </div>

            <div>
              {data.personnelPAT.slice(0, 4).map((agent, index) => (
                <div 
                  key={agent.id || index} 
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #f3f4f6',
                    borderRadius: '0.75rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fafbfc'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafbfc';
                    e.currentTarget.style.borderColor = '#f3f4f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => window.location.href = `/admin-rh/personnel-pat?view=${agent.id || agent.personne_id}`}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: '#eff6ff',
                        border: '2px solid #bfdbfe',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#1e3a8a'
                      }}>
                        {agent.personne?.prenom?.charAt(0)}{agent.personne?.nom?.charAt(0)}
                      </div>
                      <div>
                        <p style={{
                          fontWeight: '700',
                          color: '#111827',
                          margin: '0 0 0.25rem 0',
                          fontSize: '1rem'
                        }}>
                          {agent.personne_nom_complet || 
                           `${agent.personne?.prenom || 'N/A'} ${agent.personne?.nom || 'N/A'}`}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: '0 0 0.5rem 0'
                        }}>
                          {agent.personne?.fonction || agent.grade || 'Fonction non définie'}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#1e3a8a',
                          color: 'white',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {agent.poste || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      color: '#1e3a8a',
                      fontWeight: '700'
                    }}>
                      →
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data.personnelPAT.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#6b7280'
              }}>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Aucun agent PAT trouvé
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRHDashboard;

