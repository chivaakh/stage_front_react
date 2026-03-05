// Traduit automatiquement
// src/components/AdminRH/ServiceDetail.js - VUE DÉTAILLÉE D'UN SERVICE
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import {
  ArrowLeftIcon,
  PencilIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const ServiceDetail = ({ serviceId, onBack, onEdit }) => {
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [service, setService] = useState(null);
  const [chefsDisponibles, setChefsDisponibles] = useState([]);
  const [showAssignChef, setShowAssignChef] = useState(false);
  const [selectedChefId, setSelectedChefId] = useState('');

  useEffect(() => {
    loadService();
    loadChefsDisponibles();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getService(serviceId);
      const serviceData = response.data || response;
      setService(serviceData);
      setSelectedChefId(serviceData.chef_service || '');
    } catch (err) {
      console.error('Erreur chargement service:', err);
      setError(t('common.erreurChargement') + ' du service');
    } finally {
      setLoading(false);
    }
  };

  const loadChefsDisponibles = async () => {
    try {
      const response = await apiService.getUsers({ role__startswith: 'chef_' });
      const chefsData = response.results || response || [];
      setChefsDisponibles(chefsData);
    } catch (err) {
      console.error('Erreur chargement chefs:', err);
    }
  };

  const handleAssignChef = async () => {
    if (!selectedChefId) {
      alert('Veuillez sélectionner un chef de service');
      return;
    }

    try {
      await apiService.assignerChefService(serviceId, selectedChefId);
      alert('Chef de service assigné avec succès');
      setShowAssignChef(false);
      loadService();
    } catch (err) {
      console.error('Erreur assignation chef:', err);
      alert('Erreur lors de l\'assignation du chef de service');
    }
  };

  const getTypeServiceColor = (type) => {
    const colors = {
      enseignant: '#059669',
      pat: '#3b82f6',
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

  const getTypeServOfficeIcon = (type) => {
    const icons = {
      enseignant: '🎓',
      pat: '🏢',
      contractuel: '📋'
    };
    return icons[type] || '🏛️';
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
            borderTop: '3px solid #dc2626',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}></div>
          <p style={{ color: '#6b7280', margin: 0 }}>Chargement...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #fee2e2'
        }}>
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '0.5rem',
            padding: '1rem',
            color: '#dc2626'
          }}>
            ⚠️ {error || 'Service non trouvé'}
          </div>
          <button
            onClick={onBack}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const typeColor = getTypeServiceColor(service.type_service);
  const repartition = service.repartition_employes || {};
  const totalEmployes = service.nombre_employes || 0;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
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
                onClick={onBack}
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
                  Détails du service
                </div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>{getTypeServOfficeIcon(service.type_service)}</span>
                  {service.nom}
                </h1>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => setShowAssignChef(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: service.chef_service ? '#f0fdf4' : '#fef3c7',
                  color: service.chef_service ? '#059669' : '#d97706',
                  border: `1px solid ${service.chef_service ? '#bbf7d0' : '#fbbf24'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <UserPlusIcon style={{ width: '1rem', height: '1rem' }} />
                {service.chef_service ? 'Changer le chef' : 'Assigner un chef'}
              </button>
              
              <button
                onClick={onEdit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <PencilIcon style={{ width: '1rem', height: '1rem' }} />{t('common.modifier')}</button>
            </div>
          </div>

          {/* Badge type */}
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: `${typeColor}15`,
            color: typeColor,
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: `1px solid ${typeColor}40`,
            marginBottom: '1rem'
          }}>
            {getTypeServiceLabel(service.type_service)}
          </div>

          {/* Description */}
          {service.description && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.75rem',
              marginTop: '1rem'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#374151',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {service.description}
              </p>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Total employés */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '0.5rem'
            }}>
              👥
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '0.25rem'
            }}>
              {totalEmployes}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Total employés
            </div>
          </div>

          {/* Enseignants */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '0.5rem'
            }}>
              🎓
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#059669',
              marginBottom: '0.25rem'
            }}>
              {repartition.enseignant || 0}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Enseignants
            </div>
          </div>

          {/* PAT */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '0.5rem'
            }}>
              🏢
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#3b82f6',
              marginBottom: '0.25rem'
            }}>
              {repartition.pat || 0}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Personnel PAT
            </div>
          </div>

          {/* Contractuels */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '0.5rem'
            }}>
              📋
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#7c3aed',
              marginBottom: '0.25rem'
            }}>
              {repartition.contractuel || 0}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Contractuels
            </div>
          </div>
        </div>

        {/* Chef de service */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <UserPlusIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            Chef de service
          </h3>

          {service.chef_service ? (
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#059669',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.25rem'
              }}>
                👔
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.25rem'
                }}>
                  {service.chef_service_name || 'Chef de service'}
                </div>
                {service.chef_service_email && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {service.chef_service_email}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              padding: '2rem',
              backgroundColor: '#fffbeb',
              border: '1px solid #fbbf24',
              borderRadius: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                ⚠️
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#92400e',
                marginBottom: '1rem'
              }}>
                Aucun chef de service assigné
              </p>
              <button
                onClick={() => setShowAssignChef(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Assigner un chef de service
              </button>
            </div>
          )}
        </div>

        {/* Informations générales */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <BuildingOfficeIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            Informations générales
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Date de création
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#111827',
                fontWeight: '600'
              }}>
                {service.created_at 
                  ? new Date(service.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Non spécifiée'}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Type de service
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#111827',
                fontWeight: '600'
              }}>
                {getTypeServiceLabel(service.type_service)}
              </div>
            </div>
          </div>
        </div>

        {/* Modal assignation chef */}
        {showAssignChef && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1.5rem'
              }}>
                Assigner un chef de service
              </h3>

              <select
                value={selectedChefId}
                onChange={(e) => setSelectedChefId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="">Sélectionner un chef</option>
                {chefsDisponibles.map((chef) => (
                  <option key={chef.id} value={chef.id}>
                    {chef.get_full_name || `${chef.first_name || ''} ${chef.last_name || ''}`.trim() || chef.username} ({chef.role})
                  </option>
                ))}
              </select>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowAssignChef(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >{t('common.annuler')}</button>
                <button
                  onClick={handleAssignChef}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Assigner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;

