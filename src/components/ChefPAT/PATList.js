// src/components/ChefPAT/PATList.js - VERSION COMPLÈTE ET STYLÉE
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import CreatePATForm from './CreatePATForm';
import EditPATForm from './EditPATForm';
import PATDetail from './PATDetail';

const PATList = () => {
  const [loading, setLoading] = useState(true);
  const [personnelPAT, setPersonnelPAT] = useState([]);
  const [filteredPAT, setFilteredPAT] = useState([]);
  const [error, setError] = useState(null);
  
  // États pour les modales
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPAT, setSelectedPAT] = useState(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPoste, setFilterPoste] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadPersonnelPAT();
    
    // Vérifier si on doit ouvrir le formulaire de création
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('create') === 'true') {
      setShowCreateForm(true);
    }
    if (urlParams.get('view')) {
      const patId = urlParams.get('view');
      viewPAT(patId);
    }
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [personnelPAT, searchTerm, filterPoste, filterGrade, sortBy, sortOrder]);

  const loadPersonnelPAT = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🏢 Chargement du personnel PAT...');
      
      const response = await apiService.getPersonnelPAT();
      console.log('✅ Personnel PAT chargé:', response);
      
      const patData = response.results || response || [];
      setPersonnelPAT(patData);
      setFilteredPAT(patData);
      
    } catch (err) {
      console.error('❌ Erreur chargement PAT:', err);
      setError('Erreur lors du chargement du personnel PAT');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...personnelPAT];

    // Recherche
   if (searchTerm) {
  result = result.filter(pat =>
    pat.personne_nom_complet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pat.personne_fonction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pat.poste?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  }

    // Filtre par poste
    if (filterPoste) {
      result = result.filter(pat => pat.poste === filterPoste);
    }

    // Filtre par grade
    if (filterGrade) {
      result = result.filter(pat => pat.grade?.toLowerCase().includes(filterGrade.toLowerCase()));
    }

    // Tri
    result.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'nom':
          aVal = `${a.personne_prenom} ${a.personne_nom}`.toLowerCase();
          bVal = `${b.personne_prenom} ${b.personne_nom}`.toLowerCase();
          break;
        case 'poste':
          aVal = a.poste || '';
          bVal = b.poste || '';
          break;
        case 'grade':
          aVal = a.grade || '';
          bVal = b.grade || '';
          break;
        case 'indice':
          aVal = a.indice || 0;
          bVal = b.indice || 0;
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

    setFilteredPAT(result);
  };

  const viewPAT = async (patId) => {
    try {
      console.log('👁️ Affichage détail PAT:', patId);
      const pat = personnelPAT.find(p => p.id === patId || p.personne_id === patId);
      if (pat) {
        setSelectedPAT(pat);
        setShowDetail(true);
      }
    } catch (err) {
      console.error('❌ Erreur affichage détail:', err);
      alert('Erreur lors de l\'affichage des détails');
    }
  };

  const handleEdit = (pat) => {
    console.log('✏️ Édition PAT:', pat);
    setSelectedPAT(pat);
    setShowEditForm(true);
  };

  const handleDelete = async (pat) => {
    if (!window.confirm(`Supprimer ${pat.personne_prenom} ${pat.personne_nom} ?`)) {
      return;
    }

    try {
      console.log('🗑️ Suppression PAT:', pat);
      await apiService.delete(`/personnel-pat/${pat.id || pat.personne_id}/`);
      await loadPersonnelPAT();
      alert('Agent PAT supprimé avec succès');
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadPersonnelPAT();
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setSelectedPAT(null);
    loadPersonnelPAT();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterPoste('');
    setFilterGrade('');
    setSortBy('nom');
    setSortOrder('asc');
  };

  const getPosteLabel = (poste) => {
    const labels = {
      'sg': 'Secrétaire Général',
      'conseil': 'Conseil',
      'charge_mission': 'Chargé de Mission',
      'directeur': 'Directeur',
      'chef_service': 'Chef de Service',
      'chef_division': 'Chef de Division',
      'autre': 'Autre'
    };
    return labels[poste] || poste;
  };

  const getPosteColor = (poste) => {
    const colors = {
      'sg': '#dc2626',
      'conseil': '#7c3aed',
      'charge_mission': '#2563eb',
      'directeur': '#059669',
      'chef_service': '#d97706',
      'chef_division': '#0891b2',
      'autre': '#6b7280'
    };
    return colors[poste] || '#6b7280';
  };

  const getPosteIcon = (poste) => {
    const icons = {
      'sg': '👔',
      'conseil': '⚖️',
      'charge_mission': '📋',
      'directeur': '🎯',
      'chef_service': '👨‍💼',
      'chef_division': '📊',
      'autre': '👤'
    };
    return icons[poste] || '👤';
  };

  // Statistiques
  const stats = {
    total: personnelPAT.length,
    sg: personnelPAT.filter(p => p.poste === 'sg').length,
    directeurs: personnelPAT.filter(p => p.poste === 'directeur').length,
    chefsService: personnelPAT.filter(p => p.poste === 'chef_service').length,
    chefsDivision: personnelPAT.filter(p => p.poste === 'chef_division').length
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
        <LoadingSpinner />
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
        
        {/* En-tête avec style premium */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3
          }}></div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <span style={{ fontSize: '2rem' }}>🏢</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  margin: '0 0 0.5rem 0'
                }}>
                  Personnel Administratif et Technique
                </h1>
                <p style={{
                  fontSize: '1rem',
                  margin: 0,
                  opacity: 0.9
                }}>
                  Gestion complète de votre équipe PAT
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
                color: '#2563eb',
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
              <span style={{ fontSize: '1.25rem' }}>➕</span>
              Ajouter Agent PAT
            </button>
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

        {/* Statistiques rapides */}
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
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Agents</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👔</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#dc2626' }}>
              {stats.sg}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Secrétaires Généraux</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669' }}>
              {stats.directeurs}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Directeurs</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍💼</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#d97706' }}>
              {stats.chefsService}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Chefs de Service</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0891b2' }}>
              {stats.chefsDivision}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Chefs de Division</div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
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
                placeholder="Nom, fonction, poste..."
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

            {/* Filtre poste */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                💼 Poste
              </label>
              <select
                value={filterPoste}
                onChange={(e) => setFilterPoste(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Tous les postes</option>
                <option value="sg">Secrétaire Général</option>
                <option value="conseil">Conseil</option>
                <option value="charge_mission">Chargé de Mission</option>
                <option value="directeur">Directeur</option>
                <option value="chef_service">Chef de Service</option>
                <option value="chef_division">Chef de Division</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Tri */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                ⬍ Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="nom">Nom</option>
                <option value="poste">Poste</option>
                <option value="grade">Grade</option>
                <option value="indice">Indice</option>
              </select>
            </div>

            {/* Bouton réinitialiser */}
            <button
              onClick={resetFilters}
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
            📋 {filteredPAT.length} agent{filteredPAT.length > 1 ? 's' : ''} trouvé{filteredPAT.length > 1 ? 's' : ''}
            {filteredPAT.length !== personnelPAT.length && ` sur ${personnelPAT.length} total`}
          </div>
        </div>

        {/* Liste du personnel PAT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredPAT.map((pat) => (
            <div
              key={pat.id || pat.personne_id}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
              onClick={() => viewPAT(pat.id || pat.personne_id)}
            >
              {/* En-tête carte */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  background: `linear-gradient(135deg, ${getPosteColor(pat.poste)}20 0%, ${getPosteColor(pat.poste)}10 100%)`,
                  border: `2px solid ${getPosteColor(pat.poste)}40`,
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem'
                }}>
                  {getPosteIcon(pat.poste)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: '#111827',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {pat.personne_nom_complet || 
                     `${pat.personne_prenom || 'N/A'} ${pat.personne_nom || 'N/A'}`}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {pat.personne?.fonction || 'Fonction non définie'}
                  </p>
                </div>
              </div>

                        {/* Badge poste */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: getPosteColor(pat.poste),
                color: 'white',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {pat.poste_label || getPosteLabel(pat.poste)}  {/* ✅ Utiliser poste_label de l'API */}
              </span>
            </div>

              {/* Informations */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Grade
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    {pat.grade || 'N/A'}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Indice
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    {pat.indice || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    viewPAT(pat.id || pat.personne_id);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#f0f9ff',
                    color: '#0284c7',
                    border: '1px solid #bae6fd',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e0f2fe';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f0f9ff';
                  }}
                >
                  👁️ Voir
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(pat);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dcfce7';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f0fdf4';
                  }}
                >
                  ✏️ Modifier
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pat);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fca5a5',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#fee2e2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#fef2f2';
                  }}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message si vide */}
        {filteredPAT.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '4rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem'
            }}>
              🔍
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Aucun agent PAT trouvé
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              {searchTerm || filterPoste || filterGrade
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre premier agent'}
            </p>
            {!personnelPAT.length && (
              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ➕ Ajouter Premier Agent
              </button>
            )}
          </div>
        )}

        {/* Modales */}
        {showCreateForm && (
          <CreatePATForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={handleCreateSuccess}
          />
        )}

        {showEditForm && selectedPAT && (
          <EditPATForm
            pat={selectedPAT}  // Assurez-vous que selectedPAT a bien un 'id'
            onClose={() => {
              setShowEditForm(false);
              setSelectedPAT(null);
            }}
            onSuccess={handleEditSuccess}
          />
        )}

        {showDetail && selectedPAT && (
          <PATDetail
            pat={selectedPAT}
            onClose={() => {
              setShowDetail(false);
              setSelectedPAT(null);
            }}
            onEdit={() => {
              setShowDetail(false);
              setShowEditForm(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PATList;