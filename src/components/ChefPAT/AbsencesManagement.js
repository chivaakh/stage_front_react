// src/components/ChefPAT/AbsencesManagement.js - GESTION ABSENCES PAT
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const AbsencesManagement = () => {
  const [loading, setLoading] = useState(true);
  const [absences, setAbsences] = useState([]);
  const [filteredAbsences, setFilteredAbsences] = useState([]);
  const [error, setError] = useState(null);
  
  // Filtres
  const [filterStatut, setFilterStatut] = useState('EN_ATTENTE');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_debut');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadAbsences();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [absences, filterStatut, filterType, searchTerm, sortBy, sortOrder]);

  const loadAbsences = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📅 Chargement des absences PAT...');
      
      const response = await apiService.getAbsences();
      console.log('✅ Absences chargées:', response);
      
      const absencesData = response.results || response || [];
      setAbsences(absencesData);
      
    } catch (err) {
      console.error('❌ Erreur chargement absences:', err);
      setError('Erreur lors du chargement des absences');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...absences];

    // Filtre statut
    if (filterStatut) {
      result = result.filter(a => a.statut === filterStatut);
    }

    // Filtre type
    if (filterType) {
      result = result.filter(a => a.type_absence === filterType);
    }

    // Recherche
    if (searchTerm) {
      result = result.filter(a =>
        `${a.personne_prenom} ${a.personne_nom}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri
    result.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'date_debut':
          aVal = new Date(a.date_debut);
          bVal = new Date(b.date_debut);
          break;
        case 'date_demande':
          aVal = new Date(a.date_demande_absence);
          bVal = new Date(b.date_demande_absence);
          break;
        case 'duree':
          aVal = (new Date(a.date_fin) - new Date(a.date_debut)) / (1000 * 60 * 60 * 24);
          bVal = (new Date(b.date_fin) - new Date(b.date_debut)) / (1000 * 60 * 60 * 24);
          break;
        default:
          aVal = a.personne_nom || '';
          bVal = b.personne_nom || '';
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredAbsences(result);
  };

  const handleApprove = async (absenceId) => {
    if (!window.confirm('Approuver cette demande d\'absence ?')) return;

    try {
      console.log('✅ Approbation absence:', absenceId);
      await apiService.approuverAbsence(absenceId, 'Approuvé par le chef de service PAT');
      alert('Absence approuvée avec succès');
      await loadAbsences();
    } catch (err) {
      console.error('❌ Erreur approbation:', err);
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (absenceId) => {
    const motif = prompt('Motif du refus :');
    if (!motif) return;

    try {
      console.log('❌ Refus absence:', absenceId);
      await apiService.refuserAbsence(absenceId, motif);
      alert('Absence refusée');
      await loadAbsences();
    } catch (err) {
      console.error('❌ Erreur refus:', err);
      alert('Erreur lors du refus');
    }
  };

  const getTypeAbsenceLabel = (type) => {
    const labels = {
      'CONGÉ_ANNUEL': 'Congé annuel',
      'CONGÉ_MALADIE': 'Congé maladie',
      'CONGÉ_MATERNITÉ': 'Congé maternité',
      'DÉTACHEMENT': 'Détachement',
      'DISPONIBILITÉ': 'Disponibilité',
      'ANNÉE_SABBATIQUE': 'Année sabbatique'
    };
    return labels[type] || type;
  };

  const getTypeAbsenceColor = (type) => {
    const colors = {
      'CONGÉ_ANNUEL': '#3b82f6',
      'CONGÉ_MALADIE': '#ef4444',
      'CONGÉ_MATERNITÉ': '#ec4899',
      'DÉTACHEMENT': '#8b5cf6',
      'DISPONIBILITÉ': '#f59e0b',
      'ANNÉE_SABBATIQUE': '#06b6d4'
    };
    return colors[type] || '#6b7280';
  };

  const getStatutColor = (statut) => {
    const colors = {
      'EN_ATTENTE': '#f59e0b',
      'APPROUVÉ': '#22c55e',
      'REFUSÉ': '#ef4444',
      'ANNULÉ': '#6b7280'
    };
    return colors[statut] || '#6b7280';
  };

  const getStatutIcon = (statut) => {
    const icons = {
      'EN_ATTENTE': '⏰',
      'APPROUVÉ': '✅',
      'REFUSÉ': '❌',
      'ANNULÉ': '🚫'
    };
    return icons[statut] || '📋';
  };

  const calculateDuration = (dateDebut, dateFin) => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Statistiques
  const stats = {
    enAttente: absences.filter(a => a.statut === 'EN_ATTENTE').length,
    approuvees: absences.filter(a => a.statut === 'APPROUVÉ').length,
    refusees: absences.filter(a => a.statut === 'REFUSÉ').length,
    total: absences.length
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
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem'
          }}></div>
          <p style={{ color: '#6b7280', margin: 0 }}>Chargement des absences...</p>
        </div>
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
            gap: '1.5rem'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              fontSize: '2rem'
            }}>
              ⏰
            </div>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '800',
                margin: '0 0 0.5rem 0'
              }}>
                Gestion des Absences - Personnel PAT
              </h1>
              <p style={{
                fontSize: '1rem',
                margin: 0,
                opacity: 0.9
              }}>
                Approuvez ou refusez les demandes d'absence de votre équipe
              </p>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏰</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>
              {stats.enAttente}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>En attente</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#22c55e' }}>
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
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444' }}>
              {stats.refusees}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Refusées</div>
          </div>

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
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total</div>
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
            gridTemplateColumns: '2fr 1fr 1fr auto',
            gap: '1rem',
            alignItems: 'end'
          }}>
            {/* Recherche */}
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
                placeholder="Nom de l'agent..."
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

            {/* Filtre statut */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                📌 Statut
              </label>
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
                <option value="EN_ATTENTE">En attente</option>
                <option value="APPROUVÉ">Approuvé</option>
                <option value="REFUSÉ">Refusé</option>
                <option value="ANNULÉ">Annulé</option>
              </select>
            </div>

            {/* Filtre type */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                📋 Type
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
                <option value="DÉTACHEMENT">Détachement</option>
                <option value="DISPONIBILITÉ">Disponibilité</option>
              </select>
            </div>

            {/* Bouton réinitialiser */}
            <button
              onClick={() => {
                setFilterStatut('EN_ATTENTE');
                setFilterType('');
                setSearchTerm('');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🔄 Réinitialiser
            </button>
          </div>

          {/* Info résultats */}
          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            📋 {filteredAbsences.length} demande{filteredAbsences.length > 1 ? 's' : ''} trouvée{filteredAbsences.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Liste des absences */}
        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          {filteredAbsences.map((absence) => (
            <div
              key={absence.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.75rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#111827',
                      margin: 0
                    }}>
                      {absence.personne_prenom} {absence.personne_nom}
                    </h3>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: `${getStatutColor(absence.statut)}20`,
                      color: getStatutColor(absence.statut),
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {getStatutIcon(absence.statut)} {absence.statut?.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '2rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: `${getTypeAbsenceColor(absence.type_absence)}15`,
                        color: getTypeAbsenceColor(absence.type_absence),
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {getTypeAbsenceLabel(absence.type_absence)}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        📅 Date début
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {new Date(absence.date_debut).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        📅 Date fin
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {new Date(absence.date_fin).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        ⏱️ Durée
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {calculateDuration(absence.date_debut, absence.date_fin)} jour{calculateDuration(absence.date_debut, absence.date_fin) > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        📋 Demandé le
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {new Date(absence.date_demande_absence).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  {absence.motif_refus && (
                    <div style={{
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fca5a5',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      marginTop: '1rem'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#dc2626',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        Motif du refus
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#7f1d1d'
                      }}>
                        {absence.motif_refus}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {absence.statut === 'EN_ATTENTE' && (
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <button
                    onClick={() => handleApprove(absence.id)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>✓</span>
                    Approuver
                  </button>

                  <button
                    onClick={() => handleReject(absence.id)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>✗</span>
                    Refuser
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message si vide */}
        {filteredAbsences.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '4rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Aucune demande trouvée
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280'
            }}>
              {filterStatut === 'EN_ATTENTE' 
                ? 'Aucune demande en attente d\'approbation'
                : 'Essayez de modifier vos critères de recherche'}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AbsencesManagement;