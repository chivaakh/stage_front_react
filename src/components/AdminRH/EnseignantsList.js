// Traduit automatiquement
// src/components/AdminRH/EnseignantsList.js - LISTE GLOBALE DES ENSEIGNANTS POUR ADMIN RH
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import CreateEnseignantForm from '../ChefEnseignant/CreateEnseignantForm';
import EnseignantDetail from '../ChefEnseignant/EnseignantDetail';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const EnseignantsList = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [enseignants, setEnseignants] = useState([]);
  const [filteredEnseignants, setFilteredEnseignants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [services, setServices] = useState([]);
  
  const [currentView, setCurrentView] = useState('list');
  const [selectedEnseignantId, setSelectedEnseignantId] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const editParam = urlParams.get('edit');
    const createParam = urlParams.get('create');
    
    if (viewParam) {
      setSelectedEnseignantId(viewParam);
      setCurrentView('detail');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (createParam === 'true') {
      setCurrentView('create');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Charger les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiService.get('/services/');
        setServices(response.data.results || response.data || []);
      } catch (err) {
        console.error('Erreur chargement services:', err);
      }
    };
    fetchServices();
  }, []);

  // Charger les enseignants (TOUS les enseignants pour Admin RH)
  const fetchEnseignants = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedGrade) params.append('grade', selectedGrade);
      if (selectedService) params.append('service', selectedService);
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
      console.error('❌ Erreur chargement des enseignants:', err);
      setError(err.response?.data?.detail || 'Erreur de chargement des enseignants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin_rh') {
      fetchEnseignants();
    }
  }, [user, searchTerm, selectedGrade, selectedService, selectedGenre, pagination.currentPage]);

  useEffect(() => {
    setFilteredEnseignants(enseignants);
  }, [enseignants]);

  const handleViewEnseignant = (enseignantId) => {
    setSelectedEnseignantId(enseignantId);
    setCurrentView('detail');
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

  const handleDeleteEnseignant = async (enseignantId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      return;
    }

    try {
      await apiService.delete(`/enseignants/${enseignantId}/`);
      setEnseignants(prev => prev.filter(e => e.id !== enseignantId));
      setFilteredEnseignants(prev => prev.filter(e => e.id !== enseignantId));
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      setError('Erreur lors de la suppression de l\'enseignant');
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      professeur: '#1e3a8a',
      maitre_assistant: '#1e3a8a',
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

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  // Rendu conditionnel selon la vue actuelle
  if (currentView === 'detail' && selectedEnseignantId) {
    return (
      <EnseignantDetail
        enseignantId={selectedEnseignantId}
        onBack={handleBackToList}
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
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '0.5rem',
            padding: '1rem',
            borderLeft: '4px solid #f59e0b'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#92400e',
              fontWeight: '500'
            }}>
              ⚠️ {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#b91c1c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '1rem'
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
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />{t('common.retour')}</button>
              
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  👑 Admin RH - Gestion globale
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
                  <AcademicCapIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Liste Globale des Enseignants
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  {pagination.totalCount} enseignant{pagination.totalCount > 1 ? 's' : ''} dans tous les services
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
              Nouvel enseignant
            </button>
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
                  e.target.style.borderColor = '#b91c1c';
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
            >
              <option value="">Tous les grades</option>
              <option value="professeur">Professeur</option>
              <option value="maitre_assistant">Maître Assistant</option>
              <option value="assistant">Assistant</option>
              <option value="docteur">Docteur</option>
            </select>

            {/* Filtre par service */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: '#fafbfc',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="">Tous les services</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.nom}
                </option>
              ))}
            </select>

            {/* Bouton filtres avancés */}
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
                <div>{t('common.service')}</div>
                <div>Grade</div>
                <div>Échelon</div>
                <div>Âge</div>
                <div style={{ textAlign: 'center' }}>{t('common.actions')}</div>
              </div>

              {/* Lignes du tableau */}
              {filteredEnseignants.map((enseignant, index) => {
                const age = calculateAge(enseignant.personne?.date_naissance);
                const serviceNom = enseignant.service?.nom || services.find(s => s.id === enseignant.service)?.nom || 'Non assigné';

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
                      e.currentTarget.style.backgroundColor = '#fef2f2';
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
                          backgroundColor: '#f1f5f9',
                          border: '2px solid #cbd5e1',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#b91c1c'
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
                            margin: 0
                          }}>
                            {enseignant.personne?.fonction || enseignant.corps || 'Fonction non spécifiée'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Service */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <BuildingOfficeIcon style={{
                        width: '1rem',
                        height: '1rem',
                        color: '#6b7280'
                      }} />
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontWeight: '500'
                      }}>
                        {serviceNom}
                      </span>
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
                        title="Voir les détails"
                      >
                        <EyeIcon style={{
                          width: '1rem',
                          height: '1rem',
                          color: '#6b7280'
                        }} />
                      </button>
                      
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnseignantsList;

