// Traduit automatiquement
// src/components/ChefContractuel/ContractuelsList.js - LISTE DES CONTRACTUELS POUR CHEF CONTRACTUEL
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import CreateContractuelForm from './CreateContractuelForm';
import EditContractuelForm from './EditContractuelForm';
import ContractuelDetail from './ContractuelDetail';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const ContractuelsList = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contractuels, setContractuels] = useState([]);
  const [filteredContractuels, setFilteredContractuels] = useState([]);
  const [error, setError] = useState(null);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedContractuel, setSelectedContractuel] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypeContrat, setFilterTypeContrat] = useState('');

  useEffect(() => {
    loadContractuels();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('create') === 'true') {
      setShowCreateForm(true);
    }
    if (urlParams.get('view')) {
      const contractuelId = urlParams.get('view');
      viewContractuel(contractuelId);
    }
    if (urlParams.get('edit')) {
      const contractuelId = urlParams.get('edit');
      editContractuel(contractuelId);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contractuels, searchTerm, filterTypeContrat]);

  const loadContractuels = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Chargement des contractuels (Chef Contractuel)...');
      
      const response = await apiService.getContractuels();
      const contractuelsData = response.results || response || [];
      
      // Filtrer par service du chef si nécessaire
      const filtered = contractuelsData.filter(c => {
        const serviceId = c.personne?.service?.id || c.service?.id;
        return !user?.service?.id || serviceId === user.service.id;
      });
      
      setContractuels(filtered);
      setFilteredContractuels(filtered);
      
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

    setFilteredContractuels(result);
  };

  const viewContractuel = async (contractuelId) => {
    try {
      const contractuel = contractuels.find(c => c.id === contractuelId || c.personne_id === contractuelId);
      if (contractuel) {
        setSelectedContractuel(contractuel);
        setShowDetail(true);
      }
    } catch (err) {
      console.error('❌ Erreur affichage détail:', err);
    }
  };

  const editContractuel = async (contractuelId) => {
    try {
      const contractuel = contractuels.find(c => c.id === contractuelId || c.personne_id === contractuelId);
      if (contractuel) {
        setSelectedContractuel(contractuel);
        setShowEditForm(true);
      }
    } catch (err) {
      console.error('❌ Erreur édition:', err);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadContractuels();
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setSelectedContractuel(null);
    loadContractuels();
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
                  📝 Chef Service Contractuel
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
                  {stats.total} contractuel{stats.total > 1 ? 's' : ''} dans votre service
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
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

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#dc2626'
          }}>
            ⚠️ {error}
          </div>
        )}

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
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{t('common.total')}</div>
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
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669' }}>
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
            gridTemplateColumns: '2fr 1fr',
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
          </div>

          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            📋 {filteredContractuels.length} contractuel{filteredContractuels.length > 1 ? 's' : ''} trouvé{filteredContractuels.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Liste des contractuels */}
        {filteredContractuels.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <DocumentTextIcon style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto 2rem',
              color: '#e5e7eb'
            }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Aucun contractuel trouvé
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              {searchTerm || filterTypeContrat
                ? 'Aucun contractuel ne correspond aux critères de recherche'
                : 'Aucun contractuel enregistré dans votre service'}
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ➕ Ajouter le premier contractuel
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            {filteredContractuels.map((contractuel, index) => {
              const typeColor = getTypeContratColor(contractuel.type_contrat);
              const nomComplet = contractuel.personne?.nom && contractuel.personne?.prenom
                ? `${contractuel.personne.prenom} ${contractuel.personne.nom}`
                : contractuel.personne_nom_complet || 'N/A';
              const joursRestants = calculateJoursRestants(contractuel.date_fin_contrat);

              return (
                <div
                  key={contractuel.id || index}
                  style={{
                    padding: '1.5rem',
                    borderBottom: index < filteredContractuels.length - 1 ? '1px solid #f3f4f6' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafbfc';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flex: 1
                  }}>
                    <div style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      backgroundColor: `${typeColor}15`,
                      border: `2px solid ${typeColor}40`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: typeColor
                    }}>
                      {nomComplet.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '0.5rem'
                      }}>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#374151',
                          margin: 0
                        }}>
                          {nomComplet}
                        </h3>
                        <span style={{
                          padding: '0.25rem 0.75rem',
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
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        <span>
                          📅 Début: {contractuel.date_debut_contrat 
                            ? new Date(contractuel.date_debut_contrat).toLocaleDateString('fr-FR')
                            : 'N/A'}
                        </span>
                        {contractuel.date_fin_contrat && (
                          <span>
                            📅 Fin: {new Date(contractuel.date_fin_contrat).toLocaleDateString('fr-FR')}
                            {joursRestants !== null && joursRestants > 0 && (
                              <span style={{
                                color: joursRestants <= 30 ? '#dc2626' : '#059669',
                                fontWeight: '600',
                                marginLeft: '0.5rem'
                              }}>
                                ({joursRestants} jour{joursRestants > 1 ? 's' : ''} restant{joursRestants > 1 ? 's' : ''})
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => {
                        setSelectedContractuel(contractuel);
                        setShowDetail(true);
                      }}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                      title="Voir les détails"
                    >
                      <EyeIcon style={{
                        width: '1rem',
                        height: '1rem',
                        color: '#6b7280'
                      }} />
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedContractuel(contractuel);
                        setShowEditForm(true);
                      }}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                      title={t('common.modifier')}>
                      <PencilIcon style={{
                        width: '1rem',
                        height: '1rem',
                        color: '#059669'
                      }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modales */}
      {showCreateForm && (
        <CreateContractuelForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditForm && selectedContractuel && (
        <EditContractuelForm
          contractuel={selectedContractuel}
          onClose={() => {
            setShowEditForm(false);
            setSelectedContractuel(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {showDetail && selectedContractuel && (
        <ContractuelDetail
          contractuel={selectedContractuel}
          onClose={() => {
            setShowDetail(false);
            setSelectedContractuel(null);
          }}
        />
      )}
    </div>
  );
};

export default ContractuelsList;

