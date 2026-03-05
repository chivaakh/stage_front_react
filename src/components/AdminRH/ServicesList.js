// Traduit automatiquement
// src/components/AdminRH/ServicesList.js - GESTION COMPLÈTE DES SERVICES POUR ADMIN RH
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import CreateServiceForm from './CreateServiceForm';
import EditServiceForm from './EditServiceForm';
import ServiceDetail from './ServiceDetail';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const ServicesList = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [error, setError] = useState(null);
  
  // États pour la navigation
  const [currentView, setCurrentView] = useState('list');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypeService, setFilterTypeService] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadServices();
    
    // Vérifier les paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const editParam = urlParams.get('edit');
    const createParam = urlParams.get('create');
    
    if (viewParam) {
      setSelectedServiceId(viewParam);
      setCurrentView('detail');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (editParam) {
      setSelectedServiceId(editParam);
      setCurrentView('edit');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (createParam === 'true') {
      setCurrentView('create');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [services, searchTerm, filterTypeService]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🏛️ Chargement des services...');
      
      const response = await apiService.getServices();
      const servicesData = response.results || response || [];
      setServices(servicesData);
      setFilteredServices(servicesData);
      
      console.log('✅ Services chargés:', servicesData);
    } catch (err) {
      console.error('❌ Erreur chargement services:', err);
      setError('Erreur de chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...services];

    if (searchTerm) {
      result = result.filter(s =>
        s.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.chef_service_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTypeService) {
      result = result.filter(s => s.type_service === filterTypeService);
    }

    setFilteredServices(result);
  };

  const handleViewService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setCurrentView('detail');
  };

  const handleEditService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setCurrentView('edit');
  };

  const handleCreateService = () => {
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedServiceId(null);
    loadServices();
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedServiceId(null);
    loadServices();
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.')) {
      return;
    }

    try {
      await apiService.deleteService(serviceId);
      setServices(prev => prev.filter(s => s.id !== serviceId));
      setFilteredServices(prev => prev.filter(s => s.id !== serviceId));
      alert('Service supprimé avec succès');
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression du service');
    }
  };

  const getTypeServiceColor = (type) => {
    const colors = {
      enseignant: '#1e3a8a',
      pat: '#1e3a8a',
      contractuel: '#7c3aed'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeServiceLabel = (type) => {
    const labels = {
      enseignant: 'Service Enseignant',
      pat: 'Service PAT',
      contractuel: 'Service Contractuel'
    };
    return labels[type] || type;
  };

  const getTypeServiceIcon = (type) => {
    const icons = {
      enseignant: '🎓',
      pat: '🏢',
      contractuel: '📋'
    };
    return icons[type] || '🏛️';
  };

  // Calcul des statistiques
  const stats = {
    total: services.length,
    enseignants: services.filter(s => s.type_service === 'enseignant').length,
    pat: services.filter(s => s.type_service === 'pat').length,
    contractuels: services.filter(s => s.type_service === 'contractuel').length,
    avecChef: services.filter(s => s.chef_service).length,
    sansChef: services.filter(s => !s.chef_service).length
  };

  // Rendu conditionnel selon la vue
  if (currentView === 'detail' && selectedServiceId) {
    return (
      <ServiceDetail
        serviceId={selectedServiceId}
        onBack={handleBackToList}
        onEdit={handleEditService}
      />
    );
  }

  if (currentView === 'create') {
    return (
      <CreateServiceForm
        onCancel={handleBackToList}
        onSuccess={handleSuccess}
      />
    );
  }

  if (currentView === 'edit' && selectedServiceId) {
    return (
      <EditServiceForm
        serviceId={selectedServiceId}
        onCancel={handleBackToList}
        onSuccess={handleSuccess}
      />
    );
  }

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
            borderTop: '3px solid #b91c1c',
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
            Chargement des services
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
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}
              >
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />{t('common.retour')}</button>
              
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Gestion des services
                </div>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#b91c1c',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <BuildingOfficeIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Liste des services
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  {stats.total} service{stats.total > 1 ? 's' : ''} au total
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCreateService}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#b91c1c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <PlusIcon style={{ width: '1rem', height: '1rem' }} />
              Nouveau service
            </button>
          </div>

          {/* Statistiques rapides */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#b91c1c',
                marginBottom: '0.25rem'
              }}>
                {stats.total}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>{t('common.total')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.enseignants}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Enseignants
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.pat}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                PAT
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#7c3aed',
                marginBottom: '0.25rem'
              }}>
                {stats.contractuels}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Contractuels
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: stats.sansChef > 0 ? '#f59e0b' : '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.sansChef}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Sans chef
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Barre de recherche */}
            <div style={{
              position: 'relative',
              flex: '1',
              minWidth: '300px'
            }}>
              <MagnifyingGlassIcon style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="Rechercher par nom, description ou chef..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: '#fafbfc'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#b91c1c';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.backgroundColor = '#fafbfc';
                }}
              />
            </div>

            {/* Filtre par type */}
            <select
              value={filterTypeService}
              onChange={(e) => setFilterTypeService(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: '#fafbfc',
                cursor: 'pointer',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#b91c1c';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = '#fafbfc';
              }}
            >
              <option value="">Tous les types</option>
              <option value="enseignant">Service Enseignant</option>
              <option value="pat">Service PAT</option>
              <option value="contractuel">Service Contractuel</option>
            </select>

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: showFilters ? '#b91c1c' : '#f3f4f6',
                color: showFilters ? 'white' : '#374151',
                border: '1px solid',
                borderColor: showFilters ? '#b91c1c' : '#e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <FunnelIcon style={{ width: '1rem', height: '1rem' }} />
              Filtres
            </button>
          </div>
        </div>

        {/* Liste des services */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredServices.map((service) => {
            const typeColor = getTypeServiceColor(service.type_service);
            const repartition = service.repartition_employes || {};
            const totalEmployes = service.nombre_employes || 0;

            return (
              <div
                key={service.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = typeColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                onClick={() => handleViewService(service.id)}
              >
                {/* Badge type service */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    backgroundColor: `${typeColor}15`,
                    color: typeColor,
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    border: `1px solid ${typeColor}40`
                  }}>
                    {getTypeServiceIcon(service.type_service)} {getTypeServiceLabel(service.type_service)}
                  </span>
                </div>

                {/* En-tête */}
                <div style={{
                  marginBottom: '1rem',
                  paddingRight: '8rem'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#111827',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {service.nom}
                  </h3>
                  {service.description && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {service.description.length > 100 
                        ? `${service.description.substring(0, 100)}...` 
                        : service.description}
                    </p>
                  )}
                </div>

                {/* Chef de service */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: service.chef_service ? '#f8fafc' : '#fef3c7',
                  border: `1px solid ${service.chef_service ? '#cbd5e1' : '#fbbf24'}`,
                  borderRadius: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: service.chef_service ? '#1e3a8a' : '#f59e0b',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.875rem'
                    }}>
                      {service.chef_service ? '👔' : '⚠️'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Chef de service
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {service.chef_service_name || 'Non assigné'}
                      </div>
                      {service.chef_service_email && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          {service.chef_service_email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistiques employés */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: '#1e3a8a',
                      marginBottom: '0.25rem'
                    }}>
                      {repartition.enseignant || 0}
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
                      color: '#1e3a8a',
                      marginBottom: '0.25rem'
                    }}>
                      {repartition.pat || 0}
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
                      color: '#7c3aed',
                      marginBottom: '0.25rem'
                    }}>
                      {repartition.contractuel || 0}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      📋 Contractuels
                    </div>
                  </div>
                </div>

                {/* Total employés */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.75rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#0369a1',
                    marginBottom: '0.25rem'
                  }}>
                    Total employés
                  </div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#1e3a8a'
                  }}>
                    {totalEmployes}
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewService(service.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      color: '#1e3a8a',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e0f2fe';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f8fafc';
                    }}
                  >
                    <EyeIcon style={{ width: '1rem', height: '1rem' }} />{t('common.voir')}</button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditService(service.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      color: '#16a34a',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#dcfce7';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f8fafc';
                    }}
                  >
                    <PencilIcon style={{ width: '1rem', height: '1rem' }} />{t('common.modifier')}</button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteService(service.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#fef2f2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#fef2f2';
                    }}
                  >
                    <TrashIcon style={{ width: '1rem', height: '1rem' }} />{t('common.supprimer')}</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message si vide */}
        {filteredServices.length === 0 && (
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
              🏛️
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Aucun service trouvé
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              {searchTerm || filterTypeService
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre premier service'}
            </p>
            {!services.length && (
              <button
                onClick={handleCreateService}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #b91c1c 0%, #b91c1c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ➕ Créer Premier Service
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesList;

