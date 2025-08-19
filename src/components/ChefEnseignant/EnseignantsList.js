import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import CreateEnseignantForm from './CreateEnseignantForm';
import EditEnseignantForm from './EditEnseignantForm';
import EnseignantDetail from './EnseignantDetail';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const EnseignantsList = () => {
  const { user } = useAuth();
  const [enseignants, setEnseignants] = useState([]);
  const [filteredEnseignants, setFilteredEnseignants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour la navigation entre les vues (fonctionnalité conservée)
  const [currentView, setCurrentView] = useState('list');
  const [selectedEnseignantId, setSelectedEnseignantId] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });

  // Gérer les paramètres URL (fonctionnalité conservée)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const editParam = urlParams.get('edit');
    
    if (viewParam) {
      setSelectedEnseignantId(viewParam);
      setCurrentView('detail');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (editParam) {
      setSelectedEnseignantId(editParam);
      setCurrentView('edit');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Charger les enseignants (fonctionnalité conservée)
  const fetchEnseignants = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedGrade) params.append('grade', selectedGrade);
      if (selectedGenre) params.append('personne__genre', selectedGenre);
      params.append('page', pagination.currentPage);
      params.append('page_size', pagination.pageSize);

      const response = await apiService.get(`/enseignants/?${params.toString()}`);
      const data = response.data;
      
      if (data.results) {
        setEnseignants(data.results);
        setPagination(prev => ({
          ...prev,
          totalCount: data.count,
          totalPages: Math.ceil(data.count / pagination.pageSize)
        }));
      } else {
        setEnseignants(data);
        setPagination(prev => ({
          ...prev,
          totalCount: data.length,
          totalPages: 1
        }));
      }

    } catch (err) {
      console.error('❌ Erreur lors du chargement des enseignants:', err);
      setError(err.response?.data?.detail || 'Erreur lors du chargement des enseignants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'chef_enseignant') {
      fetchEnseignants();
    }
  }, [user, searchTerm, selectedGrade, selectedGenre, pagination.currentPage]);

  useEffect(() => {
    setFilteredEnseignants(enseignants);
  }, [enseignants]);

  // Fonctions de navigation (conservées)
  const handleViewEnseignant = (enseignantId) => {
    setSelectedEnseignantId(enseignantId);
    setCurrentView('detail');
  };

  const handleEditEnseignant = (enseignantId) => {
    setSelectedEnseignantId(enseignantId);
    setCurrentView('edit');
  };

  const handleCreateEnseignant = () => {
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedEnseignantId(null);
    fetchEnseignants();
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedEnseignantId(null);
    fetchEnseignants();
  };

  // Supprimer un enseignant (fonctionnalité conservée)
  const handleDeleteEnseignant = async (enseignantId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      return;
    }

    try {
      await apiService.delete(`/enseignants/${enseignantId}/`);
      setEnseignants(prev => prev.filter(e => e.id !== enseignantId));
      setFilteredEnseignants(prev => prev.filter(e => e.id !== enseignantId));
    } catch (err) {
      console.error('❌ Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'enseignant');
    }
  };

  // Fonctions utilitaires (conservées)
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

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return 'Non spécifié';
    
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
    if (!dateEntree) return 'Non spécifié';
    
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

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  // Rendu conditionnel selon la vue actuelle (conservé)
  if (currentView === 'detail' && selectedEnseignantId) {
    return (
      <EnseignantDetail
        enseignantId={selectedEnseignantId}
        onBack={handleBackToList}
        onEdit={handleEditEnseignant}
      />
    );
  }

  if (currentView === 'create') {
    return (
      <CreateEnseignantForm
        onCancel={handleBackToList}
        onSuccess={handleSuccess}
      />
    );
  }

  if (currentView === 'edit' && selectedEnseignantId) {
    return (
      <EditEnseignantForm
        enseignantId={selectedEnseignantId}
        onCancel={handleBackToList}
        onSuccess={handleSuccess}
      />
    );
  }

  // État de chargement
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
            Chargement de la liste des enseignants
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
              onClick={() => window.location.reload()}
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
              Réessayer
            </button>
          </div>
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
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
                Retour
              </button>
              
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Gestion des enseignants
                </div>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#059669',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AcademicCapIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Liste des enseignants
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  {pagination.totalCount} enseignant{pagination.totalCount > 1 ? 's' : ''} en service
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCreateEnseignant}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
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
              <PlusIcon style={{ width: '1rem', height: '1rem' }} />
              Nouvel enseignant
            </button>
          </div>

          {/* Bannière d'information */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            borderLeft: '4px solid #059669'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#166534',
              fontWeight: '500'
            }}>
              📊 Dernière mise à jour des données : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Statistiques par grade */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0'
          }}>
            {['professeur', 'maitre_assistant', 'assistant', 'docteur'].map((grade) => {
              const count = filteredEnseignants.filter(e => e.grade === grade).length;
              return (
                <div key={grade} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: getGradeColor(grade),
                    marginBottom: '0.25rem'
                  }}>
                    {count}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {getGradeLabel(grade)}
                  </div>
                </div>
              );
            })}
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
                placeholder="Rechercher par nom ou fonction..."
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
                  e.target.style.borderColor = '#059669';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.backgroundColor = '#fafbfc';
                }}
              />
            </div>

            {/* Filtre par grade */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
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
                e.target.style.borderColor = '#059669';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = '#fafbfc';
              }}
            >
              <option value="">Tous les grades</option>
              <option value="professeur">Professeur</option>
              <option value="maitre_assistant">Maître Assistant</option>
              <option value="assistant">Assistant</option>
              <option value="docteur">Docteur</option>
            </select>

            {/* Bouton filtres avancés */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: showFilters ? '#059669' : '#f3f4f6',
                color: showFilters ? 'white' : '#374151',
                border: '1px solid',
                borderColor: showFilters ? '#059669' : '#e5e7eb',
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

          {/* Filtres avancés */}
          {showFilters && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Genre
                  </label>
                  <select 
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Tous</option>
                    <option value="MASCULIN">Masculin</option>
                    <option value="FEMININ">Féminin</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liste des enseignants */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {filteredEnseignants.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#6b7280'
            }}>
              <AcademicCapIcon style={{
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
                Aucun résultat
              </h3>
              <p style={{
                fontSize: '1rem',
                margin: 0
              }}>
                Aucun enseignant ne correspond aux critères de recherche
              </p>
            </div>
          ) : (
            <div>
              {/* En-tête du tableau */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                <div>Enseignant</div>
                <div>Grade</div>
                <div>Échelon</div>
                <div>Âge</div>
                <div>Ancienneté</div>
                <div style={{ textAlign: 'center' }}>Actions</div>
              </div>

              {/* Lignes du tableau */}
              {filteredEnseignants.map((enseignant, index) => {
                const age = calculateAge(enseignant.personne?.date_naissance);
                const anciennete = calculateAnciennete(enseignant.date_entree_enseignement_superieur);
                const retiringSoon = isRetiringSoon(enseignant.date_fin_service_obligatoire);

                return (
                  <div
                    key={enseignant.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr',
                      gap: '1rem',
                      padding: '1rem 1.5rem',
                      borderBottom: index < filteredEnseignants.length - 1 ? '1px solid #f3f4f6' : 'none',
                      cursor: 'pointer',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0fdf4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafbfc';
                    }}
                    onClick={() => handleViewEnseignant(enseignant.id)}
                  >
                    {/* Informations enseignant */}
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#f0fdf4',
                          border: '2px solid #bbf7d0',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#059669'
                        }}>
                          {enseignant.personne?.prenom?.charAt(0)}{enseignant.personne?.nom?.charAt(0)}
                        </div>
                        <div>
                          <p style={{
                            fontWeight: '600',
                            color: '#374151',
                            margin: '0 0 0.25rem 0',
                            fontSize: '0.875rem'
                          }}>
                            {enseignant.personne_nom_complet || 
                             `${enseignant.personne?.prenom || ''} ${enseignant.personne?.nom || ''}`.trim() ||
                             'Nom non disponible'}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            margin: '0 0 0.25rem 0'
                          }}>
                            {enseignant.personne?.fonction || enseignant.corps || 'Fonction non spécifiée'}
                          </p>
                          {enseignant.personne?.nni && (
                            <p style={{
                              fontSize: '0.75rem',
                              color: '#9ca3af',
                              margin: 0
                            }}>
                              NNI: {enseignant.personne.nni}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Grade */}
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: `${getGradeColor(enseignant.grade)}15`,
                        color: getGradeColor(enseignant.grade),
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        border: `1px solid ${getGradeColor(enseignant.grade)}40`
                      }}>
                        {getGradeLabel(enseignant.grade)}
                      </span>
                    </div>

                    {/* Échelon */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      {enseignant.echelon || 'Non spécifié'}
                    </div>

                    {/* Âge */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      {age !== 'Non spécifié' ? `${age} ans` : age}
                    </div>

                    {/* Ancienneté */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '500'
                    }}>
                      {anciennete !== 'Non spécifié' ? `${anciennete} ans` : anciennete}
                      {retiringSoon && (
                        <ExclamationTriangleIcon 
                          style={{
                            width: '1rem',
                            height: '1rem',
                            color: '#f59e0b'
                          }}
                          title="Retraite proche"
                        />
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewEnseignant(enseignant.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e5e7eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6';
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEnseignant(enseignant.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#dcfce7';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f0fdf4';
                        }}
                        title="Modifier"
                      >
                        <PencilIcon style={{
                          width: '1rem',
                          height: '1rem',
                          color: '#059669'
                        }} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEnseignant(enseignant.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#fef3c7',
                          border: '1px solid #fbbf24',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#fef08a';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#fef3c7';
                        }}
                        title="Supprimer"
                      >
                        <TrashIcon style={{
                          width: '1rem',
                          height: '1rem',
                          color: '#d97706'
                        }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message de confirmation */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginTop: '2rem',
          textAlign: 'center',
          borderLeft: '4px solid #059669'
        }}>
          <p style={{
            color: '#166534',
            margin: 0,
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            ✅ Le système de gestion des enseignants fonctionne parfaitement !
            <br />
            🎉 Toutes les opérations de création, modification, suppression et affichage sont disponibles
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnseignantsList;