// Traduit automatiquement
// src/components/ChefContractuel/AbsencesManagement.js - GESTION ABSENCES CONTRACTUELS
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import CreateAbsenceForm from '../Common/CreateAbsenceForm';
import {
  ClockIcon,
  CalendarDaysIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
const AbsencesManagement = () => {
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [absences, setAbsences] = useState([]);
  const [filteredAbsences, setFilteredAbsences] = useState([]);
  const [error, setError] = useState(null);
  
  const [filterStatut, setFilterStatut] = useState('EN_ATTENTE');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadAbsences();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [absences, filterStatut, filterType, searchTerm]);

  const loadAbsences = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📅 Chargement des absences contractuels...');
      
      const response = await apiService.getAbsences();
      const absencesData = response.results || response || [];
      
      // Filtrer pour les contractuels uniquement
      const contractuelsAbsences = absencesData.filter(a => 
        a.personne?.type_employe === 'contractuel' || 
        a.type_employe === 'contractuel'
      );
      
      setAbsences(contractuelsAbsences);
      
    } catch (err) {
      console.error('❌ Erreur chargement absences:', err);
      setError(t('common.erreurChargement') + ' des absences');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...absences];

    if (filterStatut) {
      result = result.filter(a => a.statut === filterStatut);
    }

    if (filterType) {
      result = result.filter(a => a.type_absence === filterType);
    }

    if (searchTerm) {
      result = result.filter(a =>
        `${a.personne?.prenom || ''} ${a.personne?.nom || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAbsences(result);
  };

  const handleApprove = async (absenceId) => {
    if (!window.confirm('Approuver cette demande d\'absence ?')) return;

    try {
      await apiService.approuverAbsence(absenceId, 'Approuvé par le chef de service contractuel');
      alert('Absence approuvée' + t('common.succes'));
      loadAbsences();
    } catch (err) {
      console.error('❌ Erreur approbation:', err);
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (absenceId) => {
    const motif = prompt('Motif du refus :');
    if (!motif) return;

    try {
      await apiService.refuserAbsence(absenceId, motif);
      alert('Absence refusée');
      loadAbsences();
    } catch (err) {
      console.error('❌ Erreur refus:', err);
      alert('Erreur lors du refus');
    }
  };

  const getStatutColor = (statut) => {
    const colors = {
      'APPROUVEE': '#059669',
      'REFUSEE': '#dc2626',
      'EN_ATTENTE': '#f59e0b'
    };
    return colors[statut] || '#6b7280';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      'APPROUVEE': 'Approuvée',
      'REFUSEE': 'Refusée',
      'EN_ATTENTE': 'En attente'
    };
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
            borderTop: '3px solid #7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}></div>
          <h3 style={{
            color: '#374151',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Chargement des absences
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
          boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
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
                
                <div>
                  <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    margin: '0 0 0.5rem 0'
                  }}>
                    Gestion des Absences
                  </h1>
                  <p style={{
                    fontSize: '1rem',
                    margin: 0,
                    opacity: 0.9
                  }}>
                    {filteredAbsences.length} demande{filteredAbsences.length > 1 ? 's' : ''} d'absence
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
                Créer une absence
              </button>
            </div>
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

        {/* Filtres */}
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
            gap: '1rem'
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
                placeholder="Nom, prénom..."
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
              }}>{t('common.statut')}</label>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Tous</option>
                <option value="EN_ATTENTE">{t('common.enAttente')}</option>
                <option value="APPROUVEE">Approuvée</option>
                <option value="REFUSEE">Refusée</option>
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
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Tous</option>
                <option value="CONGE_ANNUEL">Congé annuel</option>
                <option value="CONGE_MALADIE">Congé maladie</option>
                <option value="CONGE_MATERNITE">Congé maternité</option>
                <option value="CONGE_PATERNITE">Congé paternité</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des absences */}
        {filteredAbsences.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <ClockIcon style={{
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
              Aucune absence trouvée
            </h3>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            {filteredAbsences.map((absence, index) => {
              const statutColor = getStatutColor(absence.statut);
              const personne = absence.personne || {};
              const nomComplet = `${personne.prenom || ''} ${personne.nom || ''}`.trim();

              return (
                <div
                  key={absence.id || index}
                  style={{
                    padding: '1.5rem',
                    borderBottom: index < filteredAbsences.length - 1 ? '1px solid #f3f4f6' : 'none',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '0.75rem'
                      }}>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#374151',
                          margin: 0
                        }}>
                          {nomComplet || 'N/A'}
                        </h3>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: `${statutColor}15`,
                          color: statutColor,
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: `1px solid ${statutColor}40`
                        }}>
                          {getStatutLabel(absence.statut)}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        gap: '2rem',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        <span>
                          📅 {absence.type_absence || 'N/A'}
                        </span>
                        <span>
                          Du {new Date(absence.date_debut).toLocaleDateString('fr-FR')} au {new Date(absence.date_fin).toLocaleDateString('fr-FR')}
                        </span>
                        {absence.motif && (
                          <span>
                            💬 {absence.motif}
                          </span>
                        )}
                      </div>
                    </div>

                    {absence.statut === 'EN_ATTENTE' && (
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem'
                      }}>
                        <button
                          onClick={() => handleApprove(absence.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#059669',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <CheckIcon style={{ width: '1rem', height: '1rem' }} />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject(absence.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <XMarkIcon style={{ width: '1rem', height: '1rem' }} />
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Formulaire de création d'absence */}
      {showCreateForm && (
        <CreateAbsenceForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadAbsences();
          }}
        />
      )}
    </div>
  );
};

export default AbsencesManagement;

