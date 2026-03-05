// Traduit automatiquement
// src/components/Employe/MesAbsences.js - MES ABSENCES POUR EMPLOYÉ
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  ClockIcon,
  CalendarDaysIcon,
  PlusIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import CreateAbsenceForm from '../Common/CreateAbsenceForm';

const PendingIcon = ClockIcon;
const MesAbsences = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [absences, setAbsences] = useState([]);
  const [filteredAbsences, setFilteredAbsences] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    loadAbsences();
    
    // Vérifier si on doit ouvrir le formulaire de création
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('create') === 'true') {
      setShowCreateForm(true);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [absences, searchTerm, filterStatut, filterType]);

  const loadAbsences = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📅 Chargement de mes absences...');
      
      const response = await apiService.getAbsences();
      const absencesData = response.results || response || [];
      
      // Filtrer pour l'employé connecté uniquement
      const mesAbsences = absencesData.filter(a => 
        a.personne?.user?.id === user?.id || 
        a.personne?.id === user?.personne_id
      );
      
      setAbsences(mesAbsences);
      
    } catch (err) {
      console.error('❌ Erreur chargement absences:', err);
      setError(t('common.erreurChargement') + ' de vos absences');
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
        a.type_absence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.motif?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAbsences(result);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadAbsences();
  };

  const getStatutColor = (statut) => {
    const colors = {
      'APPROUVÉ': '#059669',
      'APPROUVEE': '#059669',
      'REFUSÉ': '#dc2626',
      'REFUSEE': '#dc2626',
      'EN_ATTENTE': '#f59e0b',
      'ANNULÉ': '#6b7280',
      'ANNULEE': '#6b7280'
    };
    return colors[statut] || '#6b7280';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      'APPROUVÉ': 'Approuvée',
      'APPROUVEE': 'Approuvée',
      'REFUSÉ': 'Refusée',
      'REFUSEE': 'Refusée',
      'EN_ATTENTE': 'En attente',
      'ANNULÉ': 'Annulée',
      'ANNULEE': 'Annulée'
    };
    return labels[statut] || statut;
  };

  const getStatutIcon = (statut) => {
    if (statut === 'APPROUVÉ' || statut === 'APPROUVEE') {
      return <CheckCircleIcon style={{ width: '1rem', height: '1rem' }} />;
    }
    if (statut === 'REFUSÉ' || statut === 'REFUSEE') {
      return <XCircleIcon style={{ width: '1rem', height: '1rem' }} />;
    }
    return <PendingIcon style={{ width: '1rem', height: '1rem' }} />;
  };

  const getTypeAbsenceLabel = (type) => {
    const labels = {
      'CONGÉ_ANNUEL': 'Congé annuel',
      'CONGÉ_MALADIE': 'Congé maladie',
      'CONGÉ_MATERNITÉ': 'Congé maternité',
      'CONGÉ_PATERNITÉ': 'Congé paternité',
      'DÉTACHEMENT': 'Détachement',
      'DISPONIBILITÉ': 'Disponibilité',
      'ANNÉE_SABBATIQUE': 'Année sabbatique'
    };
    return labels[type] || type;
  };

  const calculateDuree = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 0;
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = fin - debut;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const isApproved = (absence) =>
    absence &&
    (absence.statut === 'APPROUVÉ' ||
      absence.statut === 'APPROUVEE');

  const isPastAbsence = (absence) => {
    if (!isApproved(absence) || !absence.date_fin) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fin = new Date(absence.date_fin);
    fin.setHours(0, 0, 0, 0);
    return fin < today;
  };

  const isOngoingAbsence = (absence) => {
    if (!isApproved(absence) || !absence.date_debut || !absence.date_fin) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const debut = new Date(absence.date_debut);
    const fin = new Date(absence.date_fin);
    debut.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    return debut <= today && today <= fin;
  };

  const getRemainingDays = (absence) => {
    if (!isOngoingAbsence(absence)) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fin = new Date(absence.date_fin);
    fin.setHours(0, 0, 0, 0);
    const diffTime = fin - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const stats = {
    total: absences.length,
    enAttente: absences.filter(a => a.statut === 'EN_ATTENTE').length,
    approuvees: absences.filter(a => a.statut === 'APPROUVÉ' || a.statut === 'APPROUVEE').length,
    refusees: absences.filter(a => a.statut === 'REFUSÉ' || a.statut === 'REFUSEE').length
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
            borderTop: '3px solid #f59e0b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}></div>
          <h3 style={{
            color: '#374151',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Chargement de vos absences
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
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
                  Mes Absences
                </h1>
                <p style={{
                  fontSize: '1rem',
                  margin: 0,
                  opacity: 0.9
                }}>
                  Gérez vos demandes d'absence
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
                color: '#f59e0b',
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
              Nouvelle demande
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏰</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>
              {stats.enAttente}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{t('common.enAttente')}</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669' }}>
              {stats.approuvees}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Approuvées</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#dc2626' }}>
              {stats.refusees}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Refusées</div>
          </div>
        </div>

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
                placeholder="Type, motif..."
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
                <option value="APPROUVÉ">Approuvée</option>
                <option value="APPROUVEE">Approuvée</option>
                <option value="REFUSÉ">Refusée</option>
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
                <option value="CONGÉ_ANNUEL">Congé annuel</option>
                <option value="CONGÉ_MALADIE">Congé maladie</option>
                <option value="CONGÉ_MATERNITÉ">Congé maternité</option>
                <option value="CONGÉ_PATERNITÉ">Congé paternité</option>
                <option value="DÉTACHEMENT">Détachement</option>
                <option value="DISPONIBILITÉ">Disponibilité</option>
                <option value="ANNÉE_SABBATIQUE">Année sabbatique</option>
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
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              {searchTerm || filterStatut || filterType
                ? 'Aucune absence ne correspond aux critères de recherche'
                : 'Vous n\'avez pas encore de demande d\'absence'}
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 auto'
              }}
            >
              <PlusIcon style={{ width: '1rem', height: '1rem' }} />
              Créer votre première demande
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
            {(() => {
              const ongoing = filteredAbsences.filter(isOngoingAbsence);
              const archived = filteredAbsences.filter(isPastAbsence);
              const others = filteredAbsences.filter(
                (a) => !isOngoingAbsence(a) && !isPastAbsence(a)
              );
              const ordered = [...ongoing, ...others, ...archived];

              return ordered.map((absence, index) => {
              const statutColor = getStatutColor(absence.statut);
              const duree = calculateDuree(absence.date_debut, absence.date_fin);
              const remaining = getRemainingDays(absence);

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
                          {getTypeAbsenceLabel(absence.type_absence)}
                        </h3>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: `${statutColor}15`,
                          color: statutColor,
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: `1px solid ${statutColor}40`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {getStatutIcon(absence.statut)}
                          {getStatutLabel(absence.statut)}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        gap: '2rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        flexWrap: 'wrap'
                      }}>
                        <span>
                          📅 Du {new Date(absence.date_debut).toLocaleDateString('fr-FR')} au {new Date(absence.date_fin).toLocaleDateString('fr-FR')}
                        </span>
                        <span>
                          ⏱️ {duree} jour{duree > 1 ? 's' : ''}
                        </span>
                        {isOngoingAbsence(absence) && (
                          <span>
                            ⌛ Il reste {remaining} jour{remaining > 1 ? 's' : ''}
                          </span>
                        )}
                        <span>
                          📆 Demandé le {new Date(absence.date_demande_absence).toLocaleDateString('fr-FR')}
                        </span>
                        {absence.motif && (
                          <span>
                            💬 {absence.motif}
                          </span>
                        )}
                      </div>

                      {absence.motif_refus && (
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.75rem',
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#dc2626'
                        }}>
                          <strong>Motif du refus :</strong> {absence.motif_refus}
                        </div>
                      )}

                      {absence.commentaire_approbateur && (
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.75rem',
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#059669'
                        }}>
                          <strong>Commentaire :</strong> {absence.commentaire_approbateur}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            });
            })()}
          </div>
        )}
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <CreateAbsenceForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default MesAbsences;

