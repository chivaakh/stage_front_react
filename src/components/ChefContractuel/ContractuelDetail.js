// Traduit automatiquement
// src/components/ChefContractuel/ContractuelDetail.js - VUE DÉTAILLÉE CONTRACTUEL
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
const ContractuelDetail = ({ contractuel, onClose, onEdit }) => {
  const { t, isArabic } = useLanguage();
  if (!contractuel) {
    return null;
  }

  const getTypeContratColor = (type) => {
    const colors = {
      'CDD': '#f59e0b',
      'CDI': '#059669',
      'CONSULTANT': '#7c3aed',
      'STAGE': '#3b82f6',
      'autre': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeContratLabel = (type) => {
    const labels = {
      'CDD': 'CDD',
      'CDI': 'CDI',
      'CONSULTANT': 'Consultant',
      'STAGE': 'Stage',
      'autre': 'Autre'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const calculateJoursRestants = (dateFin) => {
    if (!dateFin) return null;
    const today = new Date();
    const fin = new Date(dateFin);
    const diffTime = fin - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const personne = contractuel.personne || {};
  const nomComplet = `${personne.prenom || contractuel.personne_prenom || ''} ${personne.nom || contractuel.personne_nom || ''}`.trim();
  const typeColor = getTypeContratColor(contractuel.type_contrat);
  const joursRestants = calculateJoursRestants(contractuel.date_fin_contrat);

  return (
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
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* En-tête */}
        <div style={{
          background: `linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%)`,
          padding: '2rem',
          color: 'white',
          borderRadius: '1rem 1rem 0 0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                margin: '0 0 0.5rem 0'
              }}>
                {nomComplet}
              </h2>
              <p style={{
                fontSize: '1rem',
                margin: 0,
                opacity: 0.9
              }}>
                {personne.fonction || 'Contractuel'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '1.25rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div style={{ padding: '2rem' }}>
          {/* Informations du contrat */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: `2px solid ${typeColor}40`
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📋 Informations du Contrat
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Type de contrat
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: typeColor
                }}>
                  {getTypeContratLabel(contractuel.type_contrat)}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Durée du contrat
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {contractuel.duree_contrat || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Date de début
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {formatDate(contractuel.date_debut_contrat)}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Date de fin
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: contractuel.date_fin_contrat && joursRestants !== null && joursRestants <= 30 ? '#dc2626' : '#374151'
                }}>
                  {contractuel.date_fin_contrat ? formatDate(contractuel.date_fin_contrat) : 'Indéterminé'}
                  {joursRestants !== null && joursRestants > 0 && (
                    <span style={{
                      fontSize: '0.875rem',
                      color: joursRestants <= 30 ? '#dc2626' : '#059669',
                      marginLeft: '0.5rem',
                      fontWeight: '600'
                    }}>
                      ({joursRestants} jour{joursRestants > 1 ? 's' : ''} restant{joursRestants > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>

              {contractuel.salaire_mensuel && (
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Salaire mensuel
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#059669'
                  }}>
                    {parseFloat(contractuel.salaire_mensuel).toLocaleString('fr-FR')} MRU
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations personnelles */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              👤 Informations Personnelles
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{t('common.nom')}</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>{personne.nom || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{t('common.prenom')}</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>{personne.prenom || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>NNI</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>{personne.nni || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Genre</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>{personne.genre || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Date de naissance</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>{formatDate(personne.date_naissance)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{t('common.service')}</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                  {personne.service?.nom || contractuel.personne_service || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >{t('common.fermer')}</button>
            {onEdit && (
              <button
                onClick={() => onEdit(contractuel)}
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
              >{t('common.modifier')}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractuelDetail;

