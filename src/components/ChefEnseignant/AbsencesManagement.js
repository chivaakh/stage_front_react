// src/components/ChefEnseignant/AbsencesManagement.js - VERSION STYLE MODERNE
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  ClockIcon,
  CalendarDaysIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const AbsencesManagement = () => {
  const { user } = useAuth();
  const [absences, setAbsences] = useState([]);
  const [filteredAbsences, setFilteredAbsences] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [motifRefus, setMotifRefus] = useState('');

  // Chargement des absences (fonctionnalité conservée)
  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedStatut) params.statut = selectedStatut;
        if (selectedType) params.type_absence = selectedType;

        const response = await apiService.getAbsences(params);
        const absencesData = response.results || response || [];
        
        setAbsences(absencesData);
        setFilteredAbsences(absencesData);

      } catch (err) {
        console.error('❌ Erreur lors du chargement des absences:', err);
        setError(err.response?.data?.detail || err.message || 'Erreur lors du chargement des absences');
        setAbsences([]);
        setFilteredAbsences([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'chef_enseignant') {
      fetchAbsences();
    }
  }, [user, searchTerm, selectedStatut, selectedType]);

  useEffect(() => {
    setFilteredAbsences(absences);
  }, [absences]);

  // Fonctions existantes conservées
  const handleApproveAbsence = async (absenceId, commentaireApprobation) => {
    try {
      await apiService.approuverAbsence(absenceId, commentaireApprobation || 'Approuvé par le chef de service enseignant');

      setAbsences(prev => prev.map(a => 
        a.id === absenceId 
          ? { ...a, statut: 'APPROUVÉ', approuve_par_nom: user.username, commentaire_approbateur: commentaireApprobation }
          : a
      ));
      
      setFilteredAbsences(prev => prev.map(a => 
        a.id === absenceId 
          ? { ...a, statut: 'APPROUVÉ', approuve_par_nom: user.username, commentaire_approbateur: commentaireApprobation }
          : a
      ));

      setShowModal(false);
      setSelectedAbsence(null);
      setCommentaire('');
      
    } catch (err) {
      console.error('❌ Erreur lors de l\'approbation:', err);
      setError('Erreur lors de l\'approbation de l\'absence');
    }
  };

  const handleRejectAbsence = async (absenceId, motifRefusAbsence) => {
    try {
      await apiService.refuserAbsence(absenceId, motifRefusAbsence || 'Refusé par le chef de service enseignant');

      setAbsences(prev => prev.map(a => 
        a.id === absenceId 
          ? { ...a, statut: 'REFUSÉ', approuve_par_nom: user.username, motif_refus: motifRefusAbsence }
          : a
      ));

      setFilteredAbsences(prev => prev.map(a => 
        a.id === absenceId 
          ? { ...a, statut: 'REFUSÉ', approuve_par_nom: user.username, motif_refus: motifRefusAbsence }
          : a
      ));

      setShowModal(false);
      setSelectedAbsence(null);
      setMotifRefus('');
      
    } catch (err) {
      console.error('❌ Erreur lors du refus:', err);
      setError('Erreur lors du refus de l\'absence');
    }
  };

  const openModal = (absence, type) => {
    setSelectedAbsence(absence);
    setModalType(type);
    setShowModal(true);
    setCommentaire('');
    setMotifRefus('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAbsence(null);
    setModalType('');
    setCommentaire('');
    setMotifRefus('');
  };

  const getStatutColor = (statut) => {
    const colors = {
      'EN_ATTENTE': '#f59e0b',
      'APPROUVÉ': '#10b981',
      'REFUSÉ': '#ef4444',
      'ANNULÉ': '#6b7280'
    };
    return colors[statut] || '#6b7280';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      'EN_ATTENTE': 'En attente',
      'APPROUVÉ': 'Approuvé',
      'REFUSÉ': 'Refusé',
      'ANNULÉ': 'Annulé'
    };
    return labels[statut] || statut;
  };

  const getTypeColor = (type) => {
    const colors = {
      'CONGÉ_ANNUEL': '#3b82f6',
      'CONGÉ_MALADIE': '#ef4444',
      'CONGÉ_MATERNITÉ': '#ec4899',
      'DÉTACHEMENT': '#8b5cf6',
      'DISPONIBILITÉ': '#f59e0b',
      'ANNÉE_SABBATIQUE': '#10b981'
    };
    return colors[type] || '#6b7280';
  };

  const formatDuree = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 'N/A';
    
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  const statsAbsences = {
    total: filteredAbsences.length,
    enAttente: filteredAbsences.filter(a => a.statut === 'EN_ATTENTE').length,
    approuvees: filteredAbsences.filter(a => a.statut === 'APPROUVÉ').length,
    refusees: filteredAbsences.filter(a => a.statut === 'REFUSÉ').length
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem'
          }}></div>
          <h3 style={{
            color: '#1e293b',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            Chargement des absences
          </h3>
          <p style={{ color: '#64748b', margin: 0 }}>
            Récupération des données en cours...
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

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #fee2e2'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <ExclamationTriangleIcon style={{
              width: '3rem',
              height: '3rem',
              color: '#dc2626'
            }} />
            <div>
              <h3 style={{
                color: '#dc2626',
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: 0
              }}>
                Erreur de chargement
              </h3>
              <p style={{ color: '#dc2626', margin: '0.5rem 0 0 0' }}>
                {error}
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 15px -3px rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(220, 38, 38, 0.3)';
              }}
            >
              Réessayer
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              style={{
                background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(100, 116, 139, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 15px -3px rgba(100, 116, 139, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(100, 116, 139, 0.3)';
              }}
            >
              Retour Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header moderne */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Motif décoratif */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(50px, -50px)'
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
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <ArrowLeftIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
              
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  <ClockIcon style={{
                    width: '2rem',
                    height: '2rem',
                    color: '#fbbf24'
                  }} />
                  <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: 'white',
                    margin: 0,
                    letterSpacing: '-0.025em'
                  }}>
                    Gestion des Absences
                  </h1>
                </div>
                <p style={{
                  color: '#cbd5e1',
                  margin: 0,
                  fontSize: '1.125rem',
                  fontWeight: '500'
                }}>
                  Gérez les demandes d'absence de vos enseignants
                </p>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(251, 191, 36, 0.2)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '16px',
              padding: '1rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: '#fbbf24',
                margin: 0
              }}>
                {statsAbsences.total}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#cbd5e1',
                fontWeight: '600'
              }}>
                Total absences
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques en cartes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { 
              count: statsAbsences.enAttente, 
              label: 'En attente', 
              color: '#f59e0b',
              bgColor: '#fef3c7',
              icon: ClockIcon
            },
            { 
              count: statsAbsences.approuvees, 
              label: 'Approuvées', 
              color: '#10b981',
              bgColor: '#d1fae5',
              icon: CheckIcon
            },
            { 
              count: statsAbsences.refusees, 
              label: 'Refusées', 
              color: '#ef4444',
              bgColor: '#fee2e2',
              icon: XMarkIcon
            }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  background: stat.bgColor,
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    color: stat.color
                  }} />
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: stat.color,
                  lineHeight: 1
                }}>
                  {stat.count}
                </div>
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                {stat.label}
              </h3>
            </div>
          ))}
        </div>

        {/* Filtres modernes */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <FunnelIcon style={{
              width: '1.5rem',
              height: '1.5rem',
              color: '#64748b'
            }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0
            }}>
              Filtres et recherche
            </h3>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 2fr) 1fr 1fr',
            gap: '1.5rem',
            alignItems: 'end'
          }}>
            {/* Barre de recherche */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Rechercher un enseignant
              </label>
              <div style={{ position: 'relative' }}>
                <MagnifyingGlassIcon style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Rechercher par nom d'enseignant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: '#fafbfc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#fafbfc';
                  }}
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Statut
              </label>
              <select
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: '#fafbfc',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#fafbfc';
                }}
              >
                <option value="">Tous les statuts</option>
                <option value="EN_ATTENTE">En attente</option>
                <option value="APPROUVÉ">Approuvé</option>
                <option value="REFUSÉ">Refusé</option>
                <option value="ANNULÉ">Annulé</option>
              </select>
            </div>

            {/* Filtre par type */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Type d'absence
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  background: '#fafbfc',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#fafbfc';
                }}
              >
                <option value="">Tous les types</option>
                <option value="CONGÉ_ANNUEL">Congé annuel</option>
                <option value="CONGÉ_MALADIE">Congé maladie</option>
                <option value="CONGÉ_MATERNITÉ">Congé maternité</option>
                <option value="DÉTACHEMENT">Détachement</option>
                <option value="DISPONIBILITÉ">Disponibilité</option>
                <option value="ANNÉE_SABBATIQUE">Année sabbatique</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des absences moderne */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
          overflow: 'hidden'
        }}>
          {filteredAbsences.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#64748b'
            }}>
              <ClockIcon style={{
                width: '4rem',
                height: '4rem',
                margin: '0 auto 2rem',
                color: '#e2e8f0'
              }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1rem'
              }}>
                Aucune absence trouvée
              </h3>
              <p style={{
                fontSize: '1.125rem',
                margin: 0
              }}>
                Aucune demande d'absence ne correspond à vos critères de recherche
              </p>
            </div>
          ) : (
            <div>
              {/* En-tête du tableau moderne */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 0.8fr 1fr 1fr',
                gap: '1rem',
                padding: '1.5rem 2rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderBottom: '2px solid #e2e8f0',
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#1e293b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <div>Enseignant</div>
                <div>Type d'absence</div>
                <div>Période</div>
                <div>Durée</div>
                <div>Statut</div>
                <div style={{ textAlign: 'center' }}>Actions</div>
              </div>

              {/* Lignes du tableau */}
              {filteredAbsences.map((absence, index) => (
                <div
                  key={absence.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 0.8fr 1fr 1fr',
                    gap: '1rem',
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'all 0.2s',
                    background: index % 2 === 0 ? 'white' : '#fafbfc'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* Informations enseignant */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.125rem'
                    }}>
                      {absence.personne_prenom?.charAt(0)}{absence.personne_nom?.charAt(0)}
                    </div>
                    <div>
                      <p style={{
                        fontWeight: '600',
                        color: '#1e293b',
                        margin: '0 0 0.25rem 0',
                        fontSize: '0.875rem'
                      }}>
                        {absence.personne_prenom} {absence.personne_nom}
                      </p>
                      {absence.personne_service && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          margin: 0
                        }}>
                          {absence.personne_service}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Type d'absence */}
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      background: `${getTypeColor(absence.type_absence)}20`,
                      color: getTypeColor(absence.type_absence),
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: `1px solid ${getTypeColor(absence.type_absence)}40`
                    }}>
                      {absence.type_absence?.replace('_', ' ') || 'Non défini'}
                    </span>
                  </div>

                  {/* Période */}
                  <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                    <div style={{ fontWeight: '600' }}>{absence.date_debut}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      au {absence.date_fin}
                    </div>
                  </div>

                  {/* Durée */}
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    fontWeight: '600'
                  }}>
                    {formatDuree(absence.date_debut, absence.date_fin)}
                  </div>

                  {/* Statut */}
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      background: `${getStatutColor(absence.statut)}20`,
                      color: getStatutColor(absence.statut),
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: `1px solid ${getStatutColor(absence.statut)}40`
                    }}>
                      {getStatutLabel(absence.statut)}
                    </span>
                    {absence.date_demande_absence && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginTop: '0.5rem'
                      }}>
                        Demandé le {absence.date_demande_absence}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={() => openModal(absence, 'view')}
                      style={{
                        padding: '0.5rem',
                        background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'all 0.2s'
                      }}
                      title="Voir détails"
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(100, 116, 139, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <EyeIcon style={{ width: '1rem', height: '1rem' }} />
                    </button>

                    {absence.statut === 'EN_ATTENTE' && (
                      <>
                        <button
                          onClick={() => openModal(absence, 'approve')}
                          style={{
                            padding: '0.5rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.2s'
                          }}
                          title="Approuver"
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <CheckIcon style={{ width: '1rem', height: '1rem' }} />
                        </button>

                        <button
                          onClick={() => openModal(absence, 'reject')}
                          style={{
                            padding: '0.5rem',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.2s'
                          }}
                          title="Refuser"
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <XMarkIcon style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </>
                    )}

                    {absence.document_justificatif && (
                      <button
                        onClick={() => console.log('Voir document', absence.id)}
                        style={{
                          padding: '0.5rem',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: 'white',
                          transition: 'all 0.2s'
                        }}
                        title="Voir document"
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <DocumentTextIcon style={{ width: '1rem', height: '1rem' }} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal moderne (conserve toute la fonctionnalité existante) */}
        {showModal && selectedAbsence && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '2.5rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0'
            }}>
              {/* En-tête du modal */}
              <div style={{
                marginBottom: '2rem',
                paddingBottom: '1.5rem',
                borderBottom: '2px solid #f1f5f9'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 0.5rem 0'
                }}>
                  {modalType === 'view' && 'Détails de la demande'}
                  {modalType === 'approve' && 'Approuver la demande'}
                  {modalType === 'reject' && 'Refuser la demande'}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {selectedAbsence.personne_prenom} {selectedAbsence.personne_nom}
                </p>
              </div>

              {/* Détails de l'absence */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.5rem'
                }}>
                  <div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      margin: '0 0 0.5rem 0',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    }}>
                      Type d'absence
                    </p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: 0
                    }}>
                      {selectedAbsence.type_absence?.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      margin: '0 0 0.5rem 0',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    }}>
                      Durée
                    </p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: 0
                    }}>
                      {formatDuree(selectedAbsence.date_debut, selectedAbsence.date_fin)}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      margin: '0 0 0.5rem 0',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    }}>
                      Date de début
                    </p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: 0
                    }}>
                      {selectedAbsence.date_debut}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      margin: '0 0 0.5rem 0',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    }}>
                      Date de fin
                    </p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: 0
                    }}>
                      {selectedAbsence.date_fin}
                    </p>
                  </div>
                </div>
                
                {selectedAbsence.motif_demande && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      margin: '0 0 0.5rem 0',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    }}>
                      Motif de la demande
                    </p>
                    <p style={{
                      fontSize: '1rem',
                      color: '#1e293b',
                      margin: 0,
                      lineHeight: 1.6
                    }}>
                      {selectedAbsence.motif_demande}
                    </p>
                  </div>
                )}
              </div>

              {/* Formulaire selon le type de modal */}
              {modalType === 'approve' && (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Commentaire d'approbation (optionnel)
                  </label>
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ajoutez un commentaire sur cette approbation..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: '#fafbfc'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#fafbfc';
                    }}
                  />
                </div>
              )}

              {modalType === 'reject' && (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Motif du refus (requis)
                  </label>
                  <textarea
                    value={motifRefus}
                    onChange={(e) => setMotifRefus(e.target.value)}
                    placeholder="Expliquez les raisons du refus..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: '#fafbfc'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#fafbfc';
                    }}
                    required
                  />
                </div>
              )}

              {/* Affichage des informations de traitement si déjà traité */}
              {modalType === 'view' && selectedAbsence.statut !== 'EN_ATTENTE' && (
                <div style={{
                  background: selectedAbsence.statut === 'APPROUVÉ' 
                    ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                    : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  border: selectedAbsence.statut === 'APPROUVÉ' 
                    ? '1px solid #10b981'
                    : '1px solid #ef4444'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    {selectedAbsence.statut === 'APPROUVÉ' ? (
                      <CheckIcon style={{ width: '1.5rem', height: '1.5rem', color: '#059669' }} />
                    ) : (
                      <XMarkIcon style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626' }} />
                    )}
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: selectedAbsence.statut === 'APPROUVÉ' ? '#059669' : '#dc2626',
                      margin: 0
                    }}>
                      Demande {selectedAbsence.statut.toLowerCase()}e
                    </p>
                  </div>
                  
                  {selectedAbsence.approuve_par_nom && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#64748b',
                      margin: '0 0 0.5rem 0',
                      fontWeight: '500'
                    }}>
                      Par: {selectedAbsence.approuve_par_nom}
                    </p>
                  )}
                  
                  {selectedAbsence.commentaire_approbateur && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      margin: 0,
                      lineHeight: 1.6
                    }}>
                      <strong>Commentaire:</strong> {selectedAbsence.commentaire_approbateur}
                    </p>
                  )}
                  
                  {selectedAbsence.motif_refus && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      margin: 0,
                      lineHeight: 1.6
                    }}>
                      <strong>Motif du refus:</strong> {selectedAbsence.motif_refus}
                    </p>
                  )}
                </div>
              )}

              {/* Boutons d'action */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                paddingTop: '1.5rem',
                borderTop: '2px solid #f1f5f9'
              }}>
                <button
                  onClick={closeModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 6px -1px rgba(100, 116, 139, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 15px -3px rgba(100, 116, 139, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(100, 116, 139, 0.3)';
                  }}
                >
                  {modalType === 'view' ? 'Fermer' : 'Annuler'}
                </button>

                {modalType === 'approve' && (
                  <button
                    onClick={() => handleApproveAbsence(selectedAbsence.id, commentaire)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 15px -3px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <CheckIcon style={{ width: '1rem', height: '1rem' }} />
                    Approuver
                  </button>
                )}

                {modalType === 'reject' && (
                  <button
                    onClick={() => {
                      if (motifRefus.trim()) {
                        handleRejectAbsence(selectedAbsence.id, motifRefus);
                      } else {
                        alert('Veuillez saisir un motif de refus');
                      }
                    }}
                    disabled={!motifRefus.trim()}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: !motifRefus.trim() 
                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: !motifRefus.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      boxShadow: !motifRefus.trim() 
                        ? '0 4px 6px -1px rgba(156, 163, 175, 0.3)'
                        : '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      if (motifRefus.trim()) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 15px -3px rgba(239, 68, 68, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (motifRefus.trim()) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px -1px rgba(239, 68, 68, 0.3)';
                      }
                    }}
                  >
                    <XMarkIcon style={{ width: '1rem', height: '1rem' }} />
                    Refuser
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message de statut final */}
        <div style={{
          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
          border: '2px solid #22c55e',
          borderRadius: '20px',
          padding: '2rem',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <CheckIcon style={{
              width: '2rem',
              height: '2rem',
              color: '#16a34a'
            }} />
            <h3 style={{
              color: '#16a34a',
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '700'
            }}>
              Gestion des Absences - Opérationnelle !
            </h3>
          </div>
          <p style={{
            color: '#16a34a',
            margin: 0,
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            📊 {statsAbsences.total} absences trouvées • {statsAbsences.enAttente} en attente d'approbation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AbsencesManagement;