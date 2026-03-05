// src/components/Dashboard/ChefContractuel/ChefContractuelDashboard.js - DASHBOARD CHEF CONTRACTUEL
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { apiService } from '../../../services/api';

const ChefContractuelDashboard = () => {
  const { user } = useAuth();
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    contractuels: [],
    absencesEnAttente: [],
    contractuelsExpirant: [],
    statistiques: {}
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📋 Chargement du dashboard chef contractuel...');

      // 1. Charger les contractuels
      try {
        const contractuelsResponse = await apiService.getContractuels();
        const contractuelsData = contractuelsResponse.results || contractuelsResponse || [];
        setData(prev => ({ ...prev, contractuels: contractuelsData }));
      } catch (err) {
        console.error('❌ Erreur contractuels:', err);
        setData(prev => ({ ...prev, contractuels: [] }));
      }

      // 2. Charger les absences en attente (uniquement pour les contractuels)
      try {
        const absencesResponse = await apiService.getAbsences({ statut: 'EN_ATTENTE' });
        const absencesData = absencesResponse.results || absencesResponse || [];
        // Filtrer pour les contractuels uniquement
        const contractuelsAbsences = absencesData.filter(a => 
          a.personne?.type_employe === 'contractuel' || 
          a.type_employe === 'contractuel'
        );
        setData(prev => ({ ...prev, absencesEnAttente: contractuelsAbsences }));
      } catch (err) {
        console.error('❌ Erreur absences:', err);
        setData(prev => ({ ...prev, absencesEnAttente: [] }));
      }

      // 3. Charger les contractuels expirant bientôt
      try {
        const expirantResponse = await apiService.getContractuelsExpirantBientot();
        const expirantData = expirantResponse.results || expirantResponse || [];
        setData(prev => ({ ...prev, contractuelsExpirant: expirantData }));
      } catch (err) {
        console.error('❌ Erreur contractuels expirant:', err);
        setData(prev => ({ ...prev, contractuelsExpirant: [] }));
      }

    } catch (err) {
      console.error('❌ Erreur générale dashboard:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContractuel = () => {
    window.location.href = '/chef-contractuel/personnel?create=true';
  };

  const handleViewAllContractuels = () => {
    window.location.href = '/chef-contractuel/personnel';
  };

  const handleManageAbsences = () => {
    window.location.href = '/chef-contractuel/absences';
  };

  const handleViewContractuel = (contractuel) => {
    const contractuelId = contractuel.id || contractuel.personne_id;
    window.location.href = `/chef-contractuel/personnel?view=${contractuelId}`;
  };

  const getTypeContratColor = (type) => {
    const colors = {
      'CDD': '#f59e0b',
      'CDI': '#059669',
      'consultant': '#7c3aed',
      'autre': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeContratLabel = (type) => {
    const labels = {
      'CDD': 'CDD',
      'CDI': 'CDI',
      'consultant': 'Consultant',
      'autre': 'Autre'
    };
    return labels[type] || type;
  };

  const contractuels = data.contractuels;
  const absencesEnAttente = data.absencesEnAttente.length;
  const contractuelsExpirant = data.contractuelsExpirant.length;
  const totalContractuels = contractuels.length;

  // Filtrer les contractuels par type
  const cddCount = contractuels.filter(c => c.type_contrat === 'CDD').length;
  const cdiCount = contractuels.filter(c => c.type_contrat === 'CDI').length;
  const consultantCount = contractuels.filter(c => c.type_contrat === 'consultant').length;

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
            borderTop: '4px solid #7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}></div>
          <h3 style={{
            color: '#374151',
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            Chargement du dashboard
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Veuillez patienter...
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
        
        {/* En-tête */}
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
            marginBottom: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#7c3aed',
                margin: '0 0 0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '2.5rem' }}>📋</span>
                {t('dashboard.chefContractuel')}
              </h1>
              <p style={{
                color: '#6b7280',
                fontSize: '1rem',
                margin: 0,
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}>
                {t('dashboard.bienvenue')}, {user?.first_name || user?.username}
              </p>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              marginTop: '1rem',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Cartes statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Total contractuels */}
          <div 
            onClick={handleViewAllContractuels}
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
                  {t('dashboard.totalContractuels')}
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
                  {t('dashboard.absencesEnAttente')}
                </p>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#f59e0b',
                  margin: 0,
                  lineHeight: 1
                }}>
                  {absencesEnAttente}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: absencesEnAttente > 0 ? '#d97706' : '#059669',
                  margin: '0.5rem 0 0 0',
                  fontWeight: '600'
                }}>
                  {absencesEnAttente > 0 ? `⏰ ${t('dashboard.aTraiter')}` : `✅ ${t('dashboard.toutTraite')}`}
                </p>
              </div>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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

          {/* Contrats expirant */}
          <div 
            onClick={handleViewAllContractuels}
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
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%)',
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
                  {t('dashboard.contratsExpirant')}
                </p>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#ef4444',
                  margin: 0,
                  lineHeight: 1
                }}>
                  {contractuelsExpirant}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: contractuelsExpirant > 0 ? '#dc2626' : '#059669',
                  margin: '0.5rem 0 0 0',
                  fontWeight: '600'
                }}>
                  {contractuelsExpirant > 0 ? `⚠️ ${t('dashboard.aRenouveler')}` : `✅ ${t('dashboard.aucun')}`}
                </p>
              </div>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.4)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>⚠️</span>
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
            ⚡ {t('dashboard.actionsRapides')}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
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
              <span style={{ fontSize: '1.5rem' }}>➕</span>
              {t('dashboard.creerContractuel')}
            </button>

            <button 
              onClick={handleViewAllContractuels}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
              <span style={{ fontSize: '1.5rem' }}>📋</span>
              {t('dashboard.voirTousContractuels')}
            </button>

            <button 
              onClick={handleManageAbsences}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
              <span style={{ fontSize: '1.5rem' }}>⏰</span>
              {t('dashboard.gererAbsences')}
            </button>
          </div>
        </div>

        {/* Répartition par type */}
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
            marginBottom: '2rem'
          }}>
            📊 {t('dashboard.repartitionTypeContrat')}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.75rem',
              border: '2px solid #f59e0b'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#92400e',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                CDD
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#f59e0b'
              }}>
                {cddCount}
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#d1fae5',
              borderRadius: '0.75rem',
              border: '2px solid #059669'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#065f46',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                CDI
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#059669'
              }}>
                {cdiCount}
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#ede9fe',
              borderRadius: '0.75rem',
              border: '2px solid #7c3aed'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#5b21b6',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Consultant
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#7c3aed'
              }}>
                {consultantCount}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des contractuels récents */}
        {contractuels.length > 0 && (
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
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                👥 Contractuels récents
              </h3>
              <button
                onClick={handleViewAllContractuels}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Voir tout →
              </button>
            </div>

            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {contractuels.slice(0, 5).map((contractuel, index) => {
                const typeColor = getTypeContratColor(contractuel.type_contrat);
                const nomComplet = contractuel.personne?.nom && contractuel.personne?.prenom
                  ? `${contractuel.personne.prenom} ${contractuel.personne.nom}`
                  : contractuel.personne_nom_complet || 'N/A';

                return (
                  <div
                    key={contractuel.id || index}
                    onClick={() => handleViewContractuel(contractuel)}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.75rem',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.borderColor = typeColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: `${typeColor}15`,
                        border: `2px solid ${typeColor}40`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: typeColor
                      }}>
                        {nomComplet.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p style={{
                          fontWeight: '600',
                          color: '#374151',
                          margin: '0 0 0.25rem 0',
                          fontSize: '0.875rem'
                        }}>
                          {nomComplet}
                        </p>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {contractuel.personne?.service?.nom || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: `${typeColor}15`,
                      color: typeColor,
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: `1px solid ${typeColor}40`
                    }}>
                      {getTypeContratLabel(contractuel.type_contrat)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefContractuelDashboard;

