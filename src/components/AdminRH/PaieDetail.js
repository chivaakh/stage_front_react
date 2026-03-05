// Traduit automatiquement
// src/components/AdminRH/PaieDetail.js - VUE DÉTAILLÉE D'UNE PAIE
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import {
  ArrowLeftIcon,
  PencilIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const PaieDetail = ({ paieId, onBack, onEdit }) => {
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [paie, setPaie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPaie();
  }, [paieId]);

  const loadPaie = async () => {
    try {
      setLoading(true);
      setError(null);
      const paieData = await apiService.getPaie(paieId);
      setPaie(paieData);
    } catch (err) {
      console.error('Erreur chargement paie:', err);
      setError(t('common.erreurChargement') + ' de la paie');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatutColor = (statut) => {
    const colors = {
      'EN_COURS': '#f59e0b',
      'PAYÉ': '#1e3a8a',
      'SUSPENDU': '#b91c1c',
      'ANNULÉ': '#6b7280'
    };
    return colors[statut] || '#6b7280';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      'EN_COURS': t('common.enCours'),
      'PAYÉ': t('common.paye'),
      'SUSPENDU': t('common.suspendu'),
      'ANNULÉ': t('common.annule') };
    return labels[statut] || statut;
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
            Chargement de la paie
          </h3>
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

  if (error || !paie) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          maxWidth: '500px'
        }}>
          <h3 style={{
            color: '#b91c1c',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>{t('common.erreur')}</h3>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            {error || 'Paie introuvable'}
          </p>
          <button
            onClick={onBack}
            style={{
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
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const salaireBrut = parseFloat(paie.salaire_brut) || 0;
  const salaireNet = parseFloat(paie.salaire_net) || 0;
  const deductions = parseFloat(paie.deductions) || 0;
  const allocations = parseFloat(paie.allocations_familiales) || 0;
  const statutColor = getStatutColor(paie.statut_paiement);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
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
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#b91c1c',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CurrencyDollarIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Fiche de paie
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  {paie.mois_annee 
                    ? new Date(paie.mois_annee + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                    : 'Mois non spécifié'}
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                onClick={handlePrint}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <PrinterIcon style={{ width: '1rem', height: '1rem' }} />{t('common.imprimer')}</button>
              
              <button
                onClick={() => onEdit && onEdit(paie.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#b91c1c',
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

          {/* Statut */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              Statut :
            </span>
            <span style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: `${statutColor}15`,
              color: statutColor,
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: `1px solid ${statutColor}40`
            }}>
              {getStatutLabel(paie.statut_paiement)}
            </span>
          </div>
        </div>

        {/* Informations de l'employé */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <UserIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            Informations de l'employé
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
                fontWeight: '500'
              }}>
                Nom complet
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                {paie.personne_prenom} {paie.personne_nom}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <BuildingOfficeIcon style={{ width: '0.875rem', height: '0.875rem' }} />{t('common.service')}</div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                {paie.personne_service || 'Service non spécifié'}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <CalendarIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                Date de paiement
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                {paie.date_paiement 
                  ? new Date(paie.date_paiement).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })
                  : 'Non spécifiée'}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
                fontWeight: '500'
              }}>
                Nombre d'enfants
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                {paie.nb_enfants || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Détails de la paie */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CurrencyDollarIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            Détails de la paie
          </h2>

          {/* Salaire brut */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #cbd5e1'
          }}>
            <div>
              <div style={{
                fontSize: '0.875rem',
                color: '#1e3a8a',
                fontWeight: '500',
                marginBottom: '0.25rem'
              }}>{t('common.salaireBrut')}</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a'
              }}>
                {salaireBrut.toLocaleString('fr-FR')} MRU
              </div>
            </div>
          </div>

          {/* Allocations familiales */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #cbd5e1'
          }}>
            <div>
              <div style={{
                fontSize: '0.875rem',
                color: '#1e3a8a',
                fontWeight: '500',
                marginBottom: '0.25rem'
              }}>
                Allocations familiales ({paie.nb_enfants || 0} enfant{paie.nb_enfants > 1 ? 's' : ''})
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1e3a8a'
              }}>
                + {allocations.toLocaleString('fr-FR')} MRU
              </div>
            </div>
          </div>

          {/* Déductions */}
          <div style={{
            backgroundColor: '#fef2f2',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#b91c1c',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}>{t('common.deductions')}</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '0.75rem'
            }}>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Cotisation sociale (5%)
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {(salaireBrut * 0.05).toLocaleString('fr-FR')} MRU
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Retraite (3%)
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {(salaireBrut * 0.03).toLocaleString('fr-FR')} MRU
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Impôt sur le revenu
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {(deductions - (salaireBrut * 0.05) - (salaireBrut * 0.03)).toLocaleString('fr-FR')} MRU
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.75rem',
              borderTop: '1px solid #cbd5e1'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#b91c1c',
                fontWeight: '600'
              }}>
                Total déductions
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#b91c1c'
              }}>
                - {deductions.toLocaleString('fr-FR')} MRU
              </div>
            </div>
          </div>

          {/* Salaire net */}
          <div style={{
            backgroundColor: '#b91c1c',
            color: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              opacity: 0.9
            }}>
              Salaire net à payer
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '700'
            }}>
              {salaireNet.toLocaleString('fr-FR')} MRU
            </div>
          </div>
        </div>

        {/* Informations de traitement */}
        {paie.traite_par_nom && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Traité par : <span style={{ fontWeight: '600', color: '#374151' }}>{paie.traite_par_nom}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaieDetail;
