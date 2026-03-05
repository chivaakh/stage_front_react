// src/components/AdminRH/PaiesList.js - GESTION COMPLÈTE DE LA PAIE POUR ADMIN RH
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import CreatePaieForm from './CreatePaieForm';
import EditPaieForm from './EditPaieForm';
import PaieDetail from './PaieDetail';
import BulletinSalaire from './BulletinSalaire';
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  CalendarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const PaiesList = () => {
  const { user } = useAuth();
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [paies, setPaies] = useState([]);
  const [filteredPaies, setFilteredPaies] = useState([]);
  const [error, setError] = useState(null);
  const [resumeMensuel, setResumeMensuel] = useState(null);
  
  // États pour la navigation
  const [currentView, setCurrentView] = useState('list');
  const [selectedPaieId, setSelectedPaieId] = useState(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMois, setFilterMois] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [moisSelectionne, setMoisSelectionne] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  );

  useEffect(() => {
    loadPaies();
    loadResumeMensuel();
    
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
  }, [paies, searchTerm, filterMois, filterStatut]);

  useEffect(() => {
    if (moisSelectionne) {
      loadResumeMensuel();
    }
  }, [moisSelectionne]);

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
      setError(t('common.erreurChargement'));
    } finally {
      setLoading(false);
    }
  };

  const loadResumeMensuel = async () => {
    try {
      const response = await apiService.getResumeMensuelPaie(moisSelectionne);
      setResumeMensuel(response.data || response);
    } catch (err) {
      console.error('Erreur chargement résumé mensuel:', err);
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

    if (filterMois) {
      result = result.filter(p => p.mois_annee === filterMois);
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
    loadResumeMensuel();
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedPaieId(null);
    loadPaies();
    loadResumeMensuel();
  };

  const handleDeletePaie = async (paieId) => {
    if (!window.confirm(t('common.supprimerPaie'))) {
      return;
    }

    try {
      await apiService.deletePaie(paieId);
      setPaies(prev => prev.filter(p => p.id !== paieId));
      setFilteredPaies(prev => prev.filter(p => p.id !== paieId));
      alert(t('common.paieSupprimee'));
      loadResumeMensuel();
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert(t('common.erreurSuppression'));
    }
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
      'ANNULÉ': t('common.annule')
    };
    return labels[statut] || statut;
  };

  // Générer liste des mois disponibles
  const generateMoisOptions = () => {
    const mois = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const moisStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const moisLabel = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      mois.push({ value: moisStr, label: moisLabel });
    }
    return mois;
  };

  // Calcul des statistiques
  const stats = {
    total: paies.length,
    enCours: paies.filter(p => p.statut_paiement === 'EN_COURS').length,
    payees: paies.filter(p => p.statut_paiement === 'PAYÉ').length,
    suspendues: paies.filter(p => p.statut_paiement === 'SUSPENDU').length,
    totalBrut: paies.reduce((sum, p) => sum + (parseFloat(p.salaire_brut) || 0), 0),
    totalNet: paies.reduce((sum, p) => sum + (parseFloat(p.salaire_net) || 0), 0),
    totalDeductions: paies.reduce((sum, p) => sum + (parseFloat(p.deductions) || 0), 0)
  };

  // Rendu conditionnel selon la vue
  if (currentView === 'detail' && selectedPaieId) {
    return (
      <BulletinSalaire
        paieId={selectedPaieId}
        onBack={handleBackToList}
        onEdit={handleEditPaie}
      />
    );
  }

  if (currentView === 'create') {
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
          <h3 style={{
            color: '#374151',
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            Chargement des paies
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
                {t('common.retour')}
              </button>
              
              <div style={{ textAlign: isArabic ? 'right' : 'left', direction: isArabic ? 'rtl' : 'ltr' }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  {t('pages.gestionPaie')}
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
                  {t('pages.listePaies')}
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  {stats.total} {stats.total > 1 ? t('common.paiesEnregistrees') : t('common.paieEnregistree')}
                </p>
              </div>
            </div>
            
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
              {t('pages.nouvellePaie')}
            </button>
          </div>

          {/* Statistiques rapides */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#b91c1c',
                marginBottom: '0.25rem'
              }}>
                {stats.total}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Total paies
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
              }}>
                En cours
              </div>
            </div>
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
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.totalBrut.toLocaleString(isArabic ? 'ar-MA' : 'fr-FR')} MRU
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {t('common.total')} brut
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#16a34a',
                marginBottom: '0.25rem'
              }}>
                {stats.totalNet.toLocaleString(isArabic ? 'ar-MA' : 'fr-FR')} MRU
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {t('common.total')} net
              </div>
            </div>
          </div>

          {/* Résumé mensuel */}
          {resumeMensuel && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#0369a1'
                }}>
                  📊 Résumé du mois : {new Date(moisSelectionne + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </div>
                <select
                  value={moisSelectionne}
                  onChange={(e) => setMoisSelectionne(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {generateMoisOptions().map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <span style={{ color: '#6b7280' }}>{t('common.employe')} : </span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{resumeMensuel.nombre_employes || 0}</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>{t('common.total')} brut : </span>
                  <span style={{ fontWeight: '600', color: '#1e3a8a' }}>{parseFloat(resumeMensuel.total_brut || 0).toLocaleString('fr-FR')} MRU</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Total net : </span>
                  <span style={{ fontWeight: '600', color: '#16a34a' }}>{parseFloat(resumeMensuel.total_net || 0).toLocaleString('fr-FR')} MRU</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>{t('common.deductions')} : </span>
                  <span style={{ fontWeight: '600', color: '#b91c1c' }}>{parseFloat(resumeMensuel.total_deductions || 0).toLocaleString(isArabic ? 'ar-MA' : 'fr-FR')} MRU</span>
                </div>
              </div>
            </div>
          )}
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
                placeholder={t('common.rechercherPar')}
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
              value={filterMois}
              onChange={(e) => setFilterMois(e.target.value)}
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
              <option value="">{t('common.tousMois')}</option>
              {generateMoisOptions().map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
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
            >
              <option value="">{t('common.tousStatuts')}</option>
              <option value="EN_COURS">{t('common.enCours')}</option>
              <option value="PAYÉ">{t('common.paye')}</option>
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
              {t('common.filtres')}
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
                {t('common.aucunePaie')}
              </h3>
              <p style={{
                fontSize: '1rem',
                margin: 0,
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}>
                {searchTerm || filterMois || filterStatut
                  ? t('common.aucunePaieCritere')
                  : t('common.creerPremierePaie')}
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
                <div>{t('common.mois')}</div>
                <div>{t('common.salaireBrut')}</div>
                <div>{t('common.deductions')}</div>
                <div>{t('common.allocations')}</div>
                <div>{t('common.salaireNet')}</div>
                <div style={{ textAlign: 'center' }}>{t('common.statut')} / {t('common.actions')}</div>
              </div>

              {/* Lignes du tableau */}
              {filteredPaies.map((paie, index) => {
                const statutColor = getStatutColor(paie.statut_paiement);
                const salaireBrut = parseFloat(paie.salaire_brut) || 0;
                const salaireNet = parseFloat(paie.salaire_net) || 0;
                const deductions = parseFloat(paie.deductions) || 0;
                const allocations = parseFloat(paie.allocations_familiales) || 0;

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

                    {/* Mois */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {paie.mois_annee 
                        ? new Date(paie.mois_annee + '-01').toLocaleDateString(isArabic ? 'ar-MA' : 'fr-FR', { month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </div>

                    {/* Salaire brut */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#1e3a8a',
                      fontWeight: '600'
                    }}>
                      {salaireBrut.toLocaleString(isArabic ? 'ar-MA' : 'fr-FR')} MRU
                    </div>

                    {/* Déductions */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#b91c1c',
                      fontWeight: '600'
                    }}>
                      {deductions.toLocaleString(isArabic ? 'ar-MA' : 'fr-FR')} MRU
                    </div>

                    {/* Allocations */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#1e3a8a',
                      fontWeight: '600'
                    }}>
                      {allocations.toLocaleString(isArabic ? 'ar-MA' : 'fr-FR')} MRU
                    </div>

                    {/* Salaire net */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#16a34a',
                      fontWeight: '700'
                    }}>
                      {salaireNet.toLocaleString(isArabic ? 'ar-MA' : 'fr-FR')} MRU
                    </div>

                    {/* Statut et Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: `${statutColor}15`,
                        color: statutColor,
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: `1px solid ${statutColor}40`
                      }}>
                        {getStatutLabel(paie.statut_paiement)}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPaie(paie.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        title={t('common.details')}
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
                          handleEditPaie(paie.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        title={t('common.modifier')}
                      >
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

export default PaiesList;

