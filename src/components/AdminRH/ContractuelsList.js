// Traduit automatiquement
// src/components/AdminRH/ContractuelsList.js - LISTE GLOBALE DES CONTRACTUELS POUR ADMIN RH
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
const ContractuelsList = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contractuels, setContractuels] = useState([]);
  const [filteredContractuels, setFilteredContractuels] = useState([]);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypeContrat, setFilterTypeContrat] = useState('');
  const [filterService, setFilterService] = useState('');

  useEffect(() => {
    loadContractuels();
    loadServices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contractuels, searchTerm, filterTypeContrat, filterService]);

  const loadServices = async () => {
    try {
      const response = await apiService.get('/services/');
      setServices(response.data.results || response.data || []);
    } catch (err) {
      console.error('Erreur chargement services:', err);
    }
  };

  const loadContractuels = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Chargement des contractuels (Admin RH)...');
      
      const response = await apiService.getContractuels();
      const contractuelsData = response.results || response || [];
      setContractuels(contractuelsData);
      setFilteredContractuels(contractuelsData);
      
    } catch (err) {
      console.error('❌ Erreur chargement contractuels:', err);
      setError(t('common.erreurChargement') + ' des contractuels');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...contractuels];

    if (searchTerm) {
      result = result.filter(c =>
        c.personne_nom_complet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.personne?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.personne?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type_contrat?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTypeContrat) {
      result = result.filter(c => c.type_contrat === filterTypeContrat);
    }

    if (filterService) {
      result = result.filter(c => 
        c.personne?.service?.id === parseInt(filterService) || 
        c.personne?.service === parseInt(filterService)
      );
    }

    setFilteredContractuels(result);
  };

  const getTypeContratColor = (type) => {
    const colors = {
      'CDD': '#f59e0b',
      'CDI': '#1e3a8a',
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

  const calculateJoursRestants = (dateFin) => {
    if (!dateFin) return null;
    const today = new Date();
    const fin = new Date(dateFin);
    const diffTime = fin - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: contractuels.length,
    cdd: contractuels.filter(c => c.type_contrat === 'CDD').length,
    cdi: contractuels.filter(c => c.type_contrat === 'CDI').length,
    consultants: contractuels.filter(c => c.type_contrat === 'consultant').length,
    expiresBientot: contractuels.filter(c => {
      const jours = calculateJoursRestants(c.date_fin_contrat);
      return jours !== null && jours > 0 && jours <= 30;
    }).length
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
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #7c3aed',
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
            Chargement des contractuels
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Chargement des données en cours...
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
          background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3
          }}></div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'white'
                }}
              >
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />{t('common.retour')}</button>
              
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <span style={{ fontSize: '2rem' }}>📋</span>
              </div>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  marginBottom: '0.25rem',
                  opacity: 0.9
                }}>
                  👑 Admin RH - Gestion globale
                </div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  margin: '0 0 0.5rem 0'
                }}>
                  Contractuels
                </h1>
                <p style={{
                  fontSize: '1rem',
                  margin: 0,
                  opacity: 0.9
                }}>
                  {stats.total} contractuel{stats.total > 1 ? 's' : ''} dans tous les services
                </p>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/admin-rh/contractuels?create=true'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#7c3aed',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <PlusIcon style={{ width: '1rem', height: '1rem' }} />
              Ajouter Contractuel
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Contractuels</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>
              {stats.cdd}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>CDD</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📑</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e3a8a' }}>
              {stats.cdi}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>CDI</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💼</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#7c3aed' }}>
              {stats.consultants}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Consultants</div>
          </div>

          {stats.expiresBientot > 0 && (
            <div style={{
              backgroundColor: '#fef3c7',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #fbbf24'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#d97706' }}>
                {stats.expiresBientot}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#92400e' }}>Expirent bientôt</div>
            </div>
          )}
        </div>

        {/* Barre de recherche et filtres */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                🔍 Rechercher
              </label>
              <input
                type="text"
                placeholder="Nom, prénom, type de contrat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                📋 Type de contrat
              </label>
              <select
                value={filterTypeContrat}
                onChange={(e) => setFilterTypeContrat(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Tous les types</option>
                <option value="CDD">CDD</option>
                <option value="CDI">CDI</option>
                <option value="consultant">Consultant</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                🏛️ Service
              </label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Tous les services</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            📋 {filteredContractuels.length} contractuel{filteredContractuels.length > 1 ? 's' : ''} trouvé{filteredContractuels.length > 1 ? 's' : ''}
            {filteredContractuels.length !== contractuels.length && ` sur ${contractuels.length} total`}
          </div>
        </div>

        {/* Liste des contractuels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredContractuels.map((contractuel) => {
            const serviceNom = contractuel.personne?.service?.nom || services.find(s => s.id === contractuel.personne?.service)?.nom || 'Non assigné';
            const joursRestants = calculateJoursRestants(contractuel.date_fin_contrat);
            const expireBientot = joursRestants !== null && joursRestants > 0 && joursRestants <= 30;

            return (
              <div
                key={contractuel.id || contractuel.personne_id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  border: expireBientot ? '2px solid #fbbf24' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                }}
              >
                {expireBientot && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#fef3c7',
                    color: '#d97706',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    border: '1px solid #fbbf24'
                  }}>
                    ⚠️ Expire bientôt
                  </div>
                )}

                {/* En-tête carte */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    background: `linear-gradient(135deg, ${getTypeContratColor(contractuel.type_contrat)}20 0%, ${getTypeContratColor(contractuel.type_contrat)}10 100%)`,
                    border: `2px solid ${getTypeContratColor(contractuel.type_contrat)}40`,
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem'
                  }}>
                    📋
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#111827',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {contractuel.personne_nom_complet || 
                       `${contractuel.personne?.prenom || 'N/A'} ${contractuel.personne?.nom || 'N/A'}`}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {contractuel.personne?.fonction || 'Fonction non définie'}
                    </p>
                  </div>
                </div>

                {/* Badge type contrat */}
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    backgroundColor: getTypeContratColor(contractuel.type_contrat),
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {getTypeContratLabel(contractuel.type_contrat)}
                  </span>
                </div>

                {/* Service */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.5rem'
                }}>
                  <BuildingOfficeIcon style={{
                    width: '1rem',
                    height: '1rem',
                    color: '#6b7280'
                  }} />
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {serviceNom}
                  </span>
                </div>

                {/* Informations */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      Date début
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {contractuel.date_debut_contrat ? new Date(contractuel.date_debut_contrat).toLocaleDateString('fr-FR') : 'N/A'}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      Date fin
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {contractuel.date_fin_contrat ? new Date(contractuel.date_fin_contrat).toLocaleDateString('fr-FR') : 'Indéterminé'}
                    </div>
                  </div>

                  {joursRestants !== null && (
                    <div style={{
                      gridColumn: '1 / -1',
                      padding: '0.75rem',
                      backgroundColor: expireBientot ? '#fef3c7' : '#f8fafc',
                      borderRadius: '0.5rem',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: expireBientot ? '#92400e' : '#166534',
                        marginBottom: '0.25rem'
                      }}>
                        Jours restants
                      </div>
                      <div style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        color: expireBientot ? '#d97706' : '#1e3a8a'
                      }}>
                        {joursRestants > 0 ? '${joursRestants} jours' : 'Expiré'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Salaire */}
                {contractuel.salaire_mensuel && (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      Salaire mensuel
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#111827'
                    }}>
                      {contractuel.salaire_mensuel.toLocaleString('fr-FR')} MRU
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Message si vide */}
        {filteredContractuels.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '4rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem'
            }}>
              📋
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Aucun contractuel trouvé
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              {searchTerm || filterTypeContrat || filterService
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre premier contractuel'}
            </p>
            {!contractuels.length && (
              <button
                onClick={() => window.location.href = '/admin-rh/contractuels?create=true'}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ➕ Ajouter Premier Contractuel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractuelsList;

