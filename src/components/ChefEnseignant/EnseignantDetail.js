import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  StarIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const EnseignantDetail = ({ enseignantId, onBack, onEdit }) => {
  const { user } = useAuth();
  const [enseignant, setEnseignant] = useState(null);
  const [absences, setAbsences] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profil');

  // Charger les données de l'enseignant (fonctionnalité conservée)
  useEffect(() => {
    const fetchEnseignantData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const enseignantResponse = await apiService.get(`/enseignants/${enseignantId}/`);
        setEnseignant(enseignantResponse.data);

        try {
          const absencesResponse = await apiService.get(`/absences/?personne=${enseignantResponse.data.personne}`);
          setAbsences(absencesResponse.data.results || absencesResponse.data || []);
        } catch (err) {
          setAbsences([]);
        }

        try {
          const documentsResponse = await apiService.get(`/documents/?proprietaire=${enseignantResponse.data.personne}`);
          setDocuments(documentsResponse.data.results || documentsResponse.data || []);
        } catch (err) {
          setDocuments([]);
        }

      } catch (err) {
        console.error('❌ Erreur chargement enseignant:', err);
        setError(err.response?.data?.detail || 'Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    if (enseignantId) {
      fetchEnseignantData();
    }
  }, [enseignantId]);

  // Supprimer l'enseignant (fonctionnalité conservée)
  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action ne peut pas être annulée.')) {
      return;
    }

    try {
      await apiService.delete(`/enseignants/${enseignantId}/`);
      onBack();
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('❌ Erreur lors de la suppression');
    }
  };

  // Approuver une absence (fonctionnalité conservée)
  const handleApproveAbsence = async (absenceId) => {
    try {
      await apiService.post(`/absences/${absenceId}/approuver/`, {
        commentaire: 'Approuvé par le chef de service enseignant'
      });
      
      setAbsences(prev => prev.map(a => 
        a.id === absenceId 
          ? { ...a, statut: 'APPROUVÉ', approuve_par_nom: user.username }
          : a
      ));
      
    } catch (err) {
      console.error('❌ Erreur approbation:', err);
    }
  };

  // Refuser une absence (fonctionnalité conservée)
  const handleRejectAbsence = async (absenceId) => {
    const motif = prompt('Motif du refus:');
    if (!motif) return;

    try {
      await apiService.post(`/absences/${absenceId}/refuser/`, {
        motif_refus: motif
      });
      
      setAbsences(prev => prev.map(a => 
        a.id === absenceId 
          ? { ...a, statut: 'REFUSÉ', motif_refus: motif }
          : a
      ));
      
    } catch (err) {
      console.error('❌ Erreur refus:', err);
    }
  };

  // Fonctions utilitaires conservées
  const getGradeColor = (grade) => {
    const colors = {
      professeur: '#059669',
      maitre_assistant: '#3b82f6',
      assistant: '#f59e0b',
      docteur: '#8b5cf6'
    };
    return colors[grade] || '#6b7280';
  };

  const getGradeLabel = (grade) => {
    const labels = {
      professeur: 'Professeur',
      maitre_assistant: 'Maître Assistant',
      assistant: 'Assistant',
      docteur: 'Docteur'
    };
    return labels[grade] || grade;
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

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return 'Non défini';
    
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateAnciennete = (dateEntree) => {
    if (!dateEntree) return 'Non défini';
    
    const today = new Date();
    const entreeDate = new Date(dateEntree);
    return today.getFullYear() - entreeDate.getFullYear();
  };

  const isRetiringSoon = (dateFinService) => {
    if (!dateFinService) return false;
    
    const today = new Date();
    const finService = new Date(dateFinService);
    const diffTime = finService - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 365 && diffDays > 0;
  };

  if (isLoading) {
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
            borderTop: '3px solid #059669',
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
            Chargement des données
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Récupération des informations de l'enseignant...
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
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '0.5rem',
            padding: '1rem',
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <ExclamationTriangleIcon style={{
                width: '1.5rem',
                height: '1.5rem',
                color: '#d97706'
              }} />
              <h3 style={{
                color: '#d97706',
                fontSize: '1.125rem',
                fontWeight: '600',
                margin: 0
              }}>
                Erreur de chargement
              </h3>
            </div>
            <p style={{
              color: '#92400e',
              margin: '0 0 1rem 0'
            }}>
              {error}
            </p>
            <button 
              onClick={onBack}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#059669',
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
      </div>
    );
  }

  if (!enseignant) {
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
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Enseignant non trouvé
          </p>
          <button
            onClick={onBack}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Retour
          </button>
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* En-tête style mauritanien */}
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
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
                Retour
              </button>
              
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Profil de l'enseignant
                </div>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#059669',
                  margin: 0
                }}>
                  {enseignant.personne_nom_complet || `${enseignant.personne?.prenom} ${enseignant.personne?.nom}`}
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  {enseignant.personne?.fonction || enseignant.corps}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => onEdit && onEdit(enseignantId)}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <PencilIcon style={{ width: '1rem', height: '1rem' }} />
                Modifier
              </button>
              
              <button
                onClick={handleDelete}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                Supprimer
              </button>
            </div>
          </div>

          {/* Bannière d'information style mauritanien */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: '1rem',
            borderLeft: '4px solid #059669'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#166534',
              fontWeight: '500'
            }}>
              📊 Informations mises à jour le {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Informations rapides en cartes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            {
              title: 'Grade',
              value: getGradeLabel(enseignant.grade),
              color: getGradeColor(enseignant.grade),
              icon: AcademicCapIcon
            },
            {
              title: 'Âge',
              value: `${calculateAge(enseignant.personne?.date_naissance)} ans`,
              color: '#3b82f6',
              icon: CalendarDaysIcon
            },
            {
              title: 'Ancienneté',
              value: `${calculateAnciennete(enseignant.date_entree_enseignement_superieur)} ans`,
              color: '#059669',
              icon: StarIcon
            },
            {
              title: 'Absences',
              value: `${absences.length} demande${absences.length > 1 ? 's' : ''}`,
              color: '#f59e0b',
              icon: ClockIcon
            }
          ].map((card, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: `${card.color}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <card.icon style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: card.color
                }} />
              </div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 0.25rem 0'
              }}>
                {card.title}
              </h3>
              <p style={{
                color: card.color,
                fontWeight: '600',
                margin: 0
              }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Alerte retraite proche */}
        {isRetiringSoon(enseignant.date_fin_service_obligatoire) && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <ExclamationTriangleIcon style={{
                width: '2rem',
                height: '2rem',
                color: '#d97706'
              }} />
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#d97706',
                  margin: '0 0 0.5rem 0'
                }}>
                  Attention: Retraite proche
                </h3>
                <p style={{
                  color: '#92400e',
                  margin: 0,
                  fontSize: '0.875rem'
                }}>
                  Fin de service obligatoire prévue le {enseignant.date_fin_service_obligatoire}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Onglets style mauritanien */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {/* Navigation des onglets */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f8fafc'
          }}>
            {[
              { id: 'profil', label: 'Profil', icon: UserIcon },
              { id: 'absences', label: 'Absences', icon: ClockIcon },
              { id: 'documents', label: 'Documents', icon: DocumentTextIcon }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: isActive ? 'white' : 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #059669' : '2px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: isActive ? '#059669' : '#6b7280',
                    minWidth: '120px'
                  }}
                >
                  <IconComponent style={{ width: '1.25rem', height: '1.25rem' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Contenu des onglets */}
          <div style={{ padding: '2rem' }}>
            {/* Onglet Profil */}
            {activeTab === 'profil' && (
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '2rem'
                }}>
                  Informations détaillées
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem'
                }}>
                  {/* Informations personnelles */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <UserIcon style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} />
                      Informations personnelles
                    </h4>
                    
                    {[
                      { label: 'Nom complet', value: `${enseignant.personne?.prenom} ${enseignant.personne?.nom}` },
                      { label: 'Date de naissance', value: enseignant.personne?.date_naissance },
                      { label: 'Lieu de naissance', value: enseignant.personne?.lieu_naissance },
                      { label: 'NNI', value: enseignant.personne?.nni },
                      { label: 'Genre', value: enseignant.personne?.genre },
                      { label: 'Nationalité', value: enseignant.personne?.nationalite }
                    ].map((info, index) => (
                      <div key={index} style={{ marginBottom: '1rem' }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '0.25rem',
                          fontWeight: '500'
                        }}>
                          {info.label}
                        </div>
                        <p style={{
                          fontWeight: '500',
                          color: '#374151',
                          margin: 0
                        }}>
                          {info.value || 'Non renseigné'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Informations professionnelles */}
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #bbf7d0'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <BriefcaseIcon style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} />
                      Informations professionnelles
                    </h4>
                    
                    {[
                      { label: 'Corps', value: enseignant.corps },
                      { label: 'Grade', value: getGradeLabel(enseignant.grade) },
                      { label: 'Échelon', value: enseignant.echelon },
                      { label: 'Indice', value: enseignant.indice },
                      { label: 'Date embauche', value: enseignant.personne?.date_embauche },
                      { label: 'Entrée ens. supérieur', value: enseignant.date_entree_enseignement_superieur }
                    ].map((info, index) => (
                      <div key={index} style={{ marginBottom: '1rem' }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '0.25rem',
                          fontWeight: '500'
                        }}>
                          {info.label}
                        </div>
                        <p style={{
                          fontWeight: '500',
                          color: '#374151',
                          margin: 0
                        }}>
                          {info.value || 'Non renseigné'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Formation */}
                  <div style={{
                    backgroundColor: '#f0f9ff',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #bae6fd'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <AcademicCapIcon style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} />
                      Formation
                    </h4>
                    
                    {[
                      { label: 'Dernier diplôme', value: enseignant.personne?.dernier_diplome },
                      { label: 'Pays obtention', value: enseignant.personne?.pays_obtention_diplome },
                      { label: 'Année obtention', value: enseignant.personne?.annee_obtention_diplome },
                      { label: 'Spécialité', value: enseignant.personne?.specialite_formation }
                    ].map((info, index) => (
                      <div key={index} style={{ marginBottom: '1rem' }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '0.25rem',
                          fontWeight: '500'
                        }}>
                          {info.label}
                        </div>
                        <p style={{
                          fontWeight: '500',
                          color: '#374151',
                          margin: 0
                        }}>
                          {info.value || 'Non renseigné'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Absences */}
            {activeTab === 'absences' && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0
                  }}>
                    Historique des absences
                  </h3>
                  <span style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {absences.length} absence{absences.length > 1 ? 's' : ''}
                  </span>
                </div>

                {absences.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#6b7280'
                  }}>
                    <ClockIcon style={{
                      width: '4rem',
                      height: '4rem',
                      margin: '0 auto 1.5rem',
                      color: '#e5e7eb'
                    }} />
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Aucune absence enregistrée
                    </h4>
                    <p style={{ margin: 0 }}>
                      Cet enseignant n'a pas encore de demandes d'absence
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {absences.map((absence) => (
                      <div
                        key={absence.id}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.75rem',
                          padding: '1.5rem',
                          backgroundColor: '#fafafa'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '1rem'
                        }}>
                          <div>
                            <h4 style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              margin: '0 0 0.25rem 0',
                              color: '#374151'
                            }}>
                              {absence.type_absence?.replace('_', ' ') || 'Type non défini'}
                            </h4>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#6b7280',
                              margin: 0
                            }}>
                              Du {absence.date_debut} au {absence.date_fin}
                            </p>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}>
                            <span style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: `${getStatutColor(absence.statut)}15`,
                              color: getStatutColor(absence.statut),
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              border: `1px solid ${getStatutColor(absence.statut)}40`
                            }}>
                              {getStatutLabel(absence.statut)}
                            </span>
                            
                            {absence.statut === 'EN_ATTENTE' && (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  onClick={() => handleApproveAbsence(absence.id)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <CheckCircleIcon style={{ width: '1rem', height: '1rem' }} />
                                  Approuver
                                </button>
                                <button
                                  onClick={() => handleRejectAbsence(absence.id)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <XCircleIcon style={{ width: '1rem', height: '1rem' }} />
                                  Refuser
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {absence.motif_demande && (
                          <div style={{
                            backgroundColor: '#f8fafc',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            marginBottom: '1rem'
                          }}>
                            <span style={{
                              fontSize: '0.875rem',
                              color: '#6b7280',
                              fontWeight: '500'
                            }}>
                              Motif:
                            </span>
                            <p style={{
                              margin: '0.25rem 0 0 0',
                              color: '#374151'
                            }}>
                              {absence.motif_demande}
                            </p>
                          </div>
                        )}

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          <span>Demandé le: {absence.date_demande_absence}</span>
                          {absence.approuve_par_nom && (
                            <span>Traité par: {absence.approuve_par_nom}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Onglet Documents */}
            {activeTab === 'documents' && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0
                  }}>
                    Documents
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <span style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      {documents.length} document{documents.length > 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => alert('Fonctionnalité d\'ajout de documents à développer')}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '500'
                      }}
                    >
                      <PlusIcon style={{ width: '1rem', height: '1rem' }} />
                      Ajouter document
                    </button>
                  </div>
                </div>

                {documents.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#6b7280'
                  }}>
                    <DocumentTextIcon style={{
                      width: '4rem',
                      height: '4rem',
                      margin: '0 auto 1.5rem',
                      color: '#e5e7eb'
                    }} />
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Aucun document
                    </h4>
                    <p style={{ margin: 0 }}>
                      Aucun document n'a été ajouté pour cet enseignant
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1rem'
                  }}>
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.75rem',
                          padding: '1.5rem',
                          backgroundColor: '#fafafa',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fafafa';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={() => window.open(document.chemin_fichier, '_blank')}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: '#059669',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <DocumentTextIcon style={{
                              width: '1.5rem',
                              height: '1.5rem',
                              color: 'white'
                            }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              margin: '0 0 0.25rem 0',
                              color: '#374151'
                            }}>
                              {document.nom}
                            </h4>
                            <p style={{
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              margin: 0
                            }}>
                              {document.type_document}
                            </p>
                          </div>
                        </div>
                        
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '1rem'
                        }}>
                          <p style={{ margin: '0 0 0.25rem 0' }}>
                            Taille: {Math.round(document.taille_fichier / 1024)} KB
                          </p>
                          <p style={{ margin: 0 }}>
                            Ajouté le: {new Date(document.date_upload).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(document.chemin_fichier, '_blank');
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#f3f4f6',
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              color: '#374151',
                              fontWeight: '500'
                            }}
                          >
                            <EyeIcon style={{ width: '1rem', height: '1rem' }} />
                            Voir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnseignantDetail;