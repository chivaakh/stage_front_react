// Traduit automatiquement
// src/components/AdminRH/PaieList.js - GESTION COMPLÈTE DE LA PAIE POUR ADMIN RH
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
  import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  FunnelIcon,
  CalendarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const PaieList = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  [paies, setPaies] = useState([]);
  const [filteredPaies, setFilteredPaies] = useState([]);
  const [error, setError] = useState(null);
  
  // États pour la navigation
  const [currentView, setCurrentView] = useState('list');
  const [selectedPaieId, setSelectedPaieId] = useState(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMoisAnnee, setFilterMoisAnnee] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPaies();
    
    // Vérifier les paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const editParam = urlParams.get('edit');
    const createParam = urlParams.get('create');
    
    if (viewParam) {
      setSelectedPaieId(viewParam);
      setCurrentView('detail');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (editParam) {
      setSelectedPaieId(editParam);
      setCurrentView('edit');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (createParam === 'true') {
      setCurrentView('create');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [paies, searchTerm, filterMoisAnnee, filterStatut]);

  const loadPaies = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('💰 Chargement des paies...');
      
      const response = await apiService.getPaies();
      const paiesData = response.results || response || [];
      setPaies(paiesData);
      setFilteredPaies(paiesData);
      
      console.log('✅ Paies chargées:', paiesData);
    } catch (err) {
      console.error('❌ Erreur chargement paies:', err);
      setError(t('common.erreurChargement') + ' des paies');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...paies];

    if (searchTerm) {
      result = result.filter(p =>
        p.personne_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.personne_prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.personne_service?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterMoisAnnee) {
      result = result.filter(p => p.mois_annee === filterMoisAnnee);
    }

    if (filterStatut) {
      result = result.filter(p => p.statut_paiement === filterStatut);
    }

    setFilteredPaies(result);
  };

  const handleViewPaie = (paieId) => {
    setSelectedPaieId(paieId);
    setCurrentView('detail');
  };

  const handleEditPaie = (paieId) => {
    setSelectedPaieId(paieId);
    setCurrentView('edit');
  };

  const handleCreatePaie = () => {
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPaieId(null);
    loadPaies();
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedPaieId(null);
    loadPaies();
  };

  const handleDeletePaie = async (paieId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche de paie ?')) {
      return;
    }

    try {
      await apiService.delete('/paies/${paieId}/');
      setPaies(prev => prev.filter(p => p.id !== paieId));
      setFilteredPaies(prev => prev.filter(p => p.id !== paieId));
      alert('Fiche de paie supprimée' + t('common.succes'));
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert(t('common.erreurSuppression'));
    }
  };

  const getStatutColor = (statut) => {
    const colors = {
      PAYÉ: '#1e3a8a',
      EN_COURS: '#f59e0b',
      SUSPENDU: '#b91c1c',
      ANNULÉ: '#6b7280'
    };
    return colors[statut] || '#6b7280';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      PAYÉ: 'Payé',
      EN_COURS: 'En cours',
      SUSPENDU: 'Suspendu',
      ANNULÉ: 'Annulé'
    };
    return labels[statut] || statut;
  };

  // Générer les mois disponibles
  const generateMoisOptions = () => {
    const mois = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const moisAnnee = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      mois.push({ value: moisAnnee, label });
    }
    return mois;
  };

  // Calcul des statistiques
  const stats = {
    total: paies.length,
    payees: paies.filter(p => p.statut_paiement === 'PAYÉ').length,
    enCours: paies.filter(p => p.statut_paiement === 'EN_COURS').length,
    suspendues: paies.filter(p => p.statut_paiement === 'SUSPENDU').length,
    totalBrut: paies.reduce((sum, p) => sum + parseFloat(p.salaire_brut || 0), 0),
    totalNet: paies.filter(p => p.statut_paiement === 'PAYÉ').reduce((sum, p) => sum + parseFloat(p.salaire_net || 0), 0),
    totalDeductions: paies.reduce((sum, p) => sum + parseFloat(p.deductions || 0), 0)
  };

  // Rendu conditionnel selon la vue
  if (currentView === 'detail' && selectedPaieId) {
    // Vérifier si on veut voir le bulletin complet
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('bulletin') === 'true') {
      return (
        <BulletinSalaire
          paieId={selectedPaieId}
          onBack={() => {
            window.history.replaceState({}, '', window.location.pathname);
            setCurrentView('detail');
          }}
        />
      );
    }
    return (
      <PaieDetail
        paieId={selectedPaieId}
        onBack={handleBackToList}
        onEdit={handleEditPaie}
      />
    );
  }

  if (currentView === 'create') {
    if (createBulletinMode) {
      return (
        <CreateBulletinForm
          onCancel={() => {
            setCreateBulletinMode(false);
            setCurrentView('list');
          }}
          onSuccess={(response) => {
            handleSuccess();
            // Rediriger vers le bulletin créé
            setSelectedPaieId(response.id);
            setCurrentView('detail');
            window.history.pushState({}, '', '?view=${response.id}&bulletin=true');
          }}
        />
      );
    }
    return (
      <CreatePaieForm
        onCancel={handleBackToList}
        onSuccess={handleSuccess}
      />
    );
  }

  if (currentView === 'edit' && selectedPaieId) {
    return (
      <EditPaieForm
        paieId={selectedPaieId}
        onCancel={handleBackToList}
        onSuccess={handleSuccess}
      />
    );
  }

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
          <p style={{ color: '#6b7280', margin: 0 }}>Chargement des fiches de paie...</p>
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
                  Gestion de la paie
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
                  <CurrencyDollarIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Fiches de Paie
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  {stats.total} fiche{stats.total > 1 ? 's' : ''} de paie
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleCreatePaie}
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
                Nouvelle fiche de paie
              </button>
              <button
                onClick={() => {
                  setCreateBulletinMode(true);
                  setCurrentView('create');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#1e3a8a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <DocumentArrowDownIcon style={{ width: '1rem', height: '1rem' }} />
                Créer Bulletin Complet
              </button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.payees}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Payées
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#f59e0b',
                marginBottom: '0.25rem'
              }}>
                {stats.enCours}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>{t('common.enCours')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#b91c1c',
                marginBottom: '0.25rem'
              }}>
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MRU' }).format(stats.totalNet)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Total net payé
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MRU' }).format(stats.totalBrut)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Total brut
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#7c3aed',
                marginBottom: '0.25rem'
              }}>
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MRU' }).format(stats.totalDeductions)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>{t('common.deductions')}</div>
            </div>
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
                placeholder="Rechercher par nom, prénom ou service..."
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

            {/* Filtre par mois */}
            <select
              value={filterMoisAnnee}
              onChange={(e) => setFilterMoisAnnee(e.target.value)}
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
                e.target.style.borderColor = '#b91c1c';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = '#fafbfc';
              }}
            >
              <option value="">Tous les mois</option>
              {generateMoisOptions().map((mois) => (
                <option key={mois.value} value={mois.value}>
                  {mois.label}
                </option>
              ))}
            </select>

            {/* Filtre par statut */}
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
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
                e.target.style.borderColor = '#b91c1c';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = '#fafbfc';
              }}
            >
              <option value="">Tous les statuts</option>
              <option value="PAYÉ">{t('common.paye')}</option>
              <option value="EN_COURS">{t('common.enCours')}</option>
              <option value="SUSPENDU">{t('common.suspendu')}</option>
              <option value="ANNULÉ">{t('common.annule')}</option>
            </select>

            {/* Bouton filtres */}
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
        </div>

        {/* Liste des paies */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {filteredPaies.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#6b7280'
            }}>
              <CurrencyDollarIcon style={{
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
                Aucune fiche de paie trouvée
              </h3>
              <p style={{
                fontSize: '1rem',
                margin: 0
              }}>
                {searchTerm || filterMoisAnnee || filterStatut
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par créer votre première fiche de paie'}
              </p>
            </div>
          ) : (
            <div>
              {/* En-tête du tableau */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1.5fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                <div>{t('common.employe')}</div>
                <div>Mois/Année</div>
                <div>{t('common.salaireBrut')}</div>
                <div>{t('common.salaireNet')}</div>
                <div>{t('common.deductions')}</div>
                <div>{t('common.statut')}</div>
                <div style={{ textAlign: 'center' }}>{t('common.actions')}</div>
              </div>

              {/* Lignes du tableau */}
              {filteredPaies.map((paie, index) => {
                const statutColor = getStatutColor(paie.statut_paiement);

                return (
                  <div
                    key={paie.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1.5fr',
                      gap: '1rem',
                      padding: '1rem 1.5rem',
                      borderBottom: index < filteredPaies.length - 1 ? '1px solid #f3f4f6' : 'none',
                      cursor: 'pointer',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafbfc';
                    }}
                    onClick={() => handleViewPaie(paie.id)}
                  >
                    {/* Employé */}
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#f8fafc',
                          border: '2px solid #cbd5e1',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1e3a8a'
                        }}>
                          {paie.personne_prenom?.charAt(0)}{paie.personne_nom?.charAt(0)}
                        </div>
                        <div>
                          <p style={{
                            fontWeight: '600',
                            color: '#374151',
                            margin: '0 0 0.25rem 0',
                            fontSize: '0.875rem'
                          }}>
                            {paie.personne_prenom} {paie.personne_nom}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            margin: 0
                          }}>
                            {paie.personne_service || 'Service non spécifié'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mois/Année */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <CalendarIcon style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      {paie.mois_annee ? (() => {
                        const [annee, mois] = paie.mois_annee.split('-');
                        const date = new Date(parseInt(annee), parseInt(mois) - 1, 1);
                        return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
                      })() : 'N/A'}
                    </div>

                    {/* Salaire brut */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#1e3a8a',
                      fontWeight: '600'
                    }}>
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MRU' }).format(paie.salaire_brut || 0)}
                    </div>

                    {/* Salaire net */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#1e3a8a',
                      fontWeight: '600'
                    }}>
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MRU' }).format(paie.salaire_net || 0)}
                    </div>

                    {/* Déductions */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#7c3aed',
                      fontWeight: '500'
                    }}>
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MRU' }).format(paie.deductions || 0)}
                    </div>

                    {/* Statut */}
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: `${statutColor}15`,
                        color: statutColor,
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: `1px solid ${statutColor}40`
                      }}>
                        {getStatutLabel(paie.statut_paiement)}
                      </span>
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
                          handleViewPaie(paie.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e0f2fe';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f8fafc';
                        }}
                        title="Voir les détails"
                      >
                        <EyeIcon style={{
                          width: '1rem',
                          height: '1rem',
                          color: '#1e3a8a'
                        }} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPaie(paie.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#dcfce7';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f8fafc';
                        }}
                        title={t('common.modifier')} >
                        <PencilIcon style={{
                          width: '1rem',
                          height: '1rem',
                          color: '#1e3a8a'
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

export default PaieList;
