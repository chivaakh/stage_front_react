// Traduit automatiquement
// src/components/AdminRH/AbsencesManagementAdminRH.js - GESTION GLOBALE DES ABSENCES POUR ADMIN RH
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
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
  FunnelIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
const AbsencesManagementAdminRH = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [absences, setAbsences] = useState([]);
  const [filteredAbsences, setFilteredAbsences] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [motifRefus, setMotifRefus] = useState('');
  const [statistiques, setStatistiques] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Chargement initial
  useEffect(() => {
    loadServices();
    loadAbsences();
    loadStatistiques();
  }, []);

  // Rechargement quand les filtres changent
  useEffect(() => {
    loadAbsences();
  }, [searchTerm, selectedStatut, selectedType, selectedService]);

  // Filtrage local
  useEffect(() => {
    let filtered = [...absences];

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.personne_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.personne_prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.personne_service?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAbsences(filtered);
  }, [absences, searchTerm]);

  const loadServices = async () => {
    try {
      const response = await apiService.get('/services/');
      const servicesData = response.data?.results || response.data || [];
      setServices(servicesData);
    } catch (err) {
      console.error('Erreur chargement services:', err);
    }
  };

  const loadAbsences = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {};
      if (selectedStatut) params.statut = selectedStatut;
      if (selectedType) params.type_absence = selectedType;
      if (selectedService) params.personne__service = selectedService;
      if (searchTerm) params.search = searchTerm;

      console.log('📅 Chargement des absences (Admin RH) avec params:', params);
      const response = await apiService.getAbsences(params);
      const absencesData = response.results || response || [];
      
      setAbsences(absencesData);
      setFilteredAbsences(absencesData);

      console.log('✅ Absences chargées:', absencesData.length);
    } catch (err) {
      console.error('❌ Erreur chargement des absences:', err);
      setError(err.response?.data?.detail || err.message || 'Erreur de chargement des absences');
      setAbsences([]);
      setFilteredAbsences([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistiques = async () => {
    try {
      const response = await apiService.get('/absences/statistiques/');
      setStatistiques(response.data || response);
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
    }
  };

  const handleApproveAbsence = async () => {
    if (!selectedAbsence) return;

    try {
      await apiService.approuverAbsence(selectedAbsence.id, commentaire || 'Approuvé par Admin RH');

      setAbsences(prev => prev.map(a => 
        a.id === selectedAbsence.id 
          ? { ...a, statut: 'APPROUVÉ', approuve_par_nom: user.username, commentaire_approbateur: commentaire }
          : a
      ));
      
      setFilteredAbsences(prev => prev.map(a => 
        a.id === selectedAbsence.id 
          ? { ...a, statut: 'APPROUVÉ', approuve_par_nom: user.username, commentaire_approbateur: commentaire }
          : a
      ));

      setShowModal(false);
      setSelectedAbsence(null);
      setCommentaire('');
      loadStatistiques();
      
      alert('Absence approuvée' + t('common.succes'));
    } catch (err) {
      console.error('❌ Erreur lors de l\'approbation:', err);
      setError('Erreur lors de l\'approbation de l\'absence');
    }
  };

  const handleRejectAbsence = async () => {
    if (!selectedAbsence || !motifRefus.trim()) {
      alert('Veuillez indiquer un motif de refus');
      return;
    }

    try {
      await apiService.refuserAbsence(selectedAbsence.id, motifRefus);

      setAbsences(prev => prev.map(a => 
        a.id === selectedAbsence.id 
          ? { ...a, statut: 'REFUSÉ', approuve_par_nom: user.username, motif_refus: motifRefus }
          : a
      ));

      setFilteredAbsences(prev => prev.map(a => 
        a.id === selectedAbsence.id 
          ? { ...a, statut: 'REFUSÉ', approuve_par_nom: user.username, motif_refus: motifRefus }
          : a
      ));

      setShowModal(false);
      setSelectedAbsence(null);
      setMotifRefus('');
      loadStatistiques();
      
      alert('Absence refusée');
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
      'APPROUVÉ': '#1e3a8a',
      'REFUSÉ': '#b91c1c',
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

  const getTypeLabel = (type) => {
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

  const calculateDuree = (dateDebut, dateFin) => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const isApproved = (absence) =>
    absence && absence.statut === 'APPROUVÉ';

  const isPastAbsence = (absence) => {
    if (!isApproved(absence) || !absence.date_fin) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fin = new Date(absence.date_fin);
    fin.setHours(0, 0, 0, 0);
    return fin < today;
  };

  const isOngoingAbsence = (absence) => {
    if (!isApproved(absence) || !absence.date_debut || !absence.date_fin) return false;
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

  // Calcul des statistiques locales
  const stats = {
    total: absences.length,
    enAttente: absences.filter(a => a.statut === 'EN_ATTENTE').length,
    approuvees: absences.filter(a => a.statut === 'APPROUVÉ').length,
    refusees: absences.filter(a => a.statut === 'REFUSÉ').length,
    annulees: absences.filter(a => a.statut === 'ANNULÉ').length
  };

  if (isLoading && absences.length === 0) {
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
                  Gestion globale des absences
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
                  <ClockIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Toutes les absences
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  Vue globale sur toutes les absences de tous les services
                </p>
              </div>

            </div>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#b91c1c'
            }}>
              <ExclamationTriangleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Statistiques */}
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
                Total absences
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#f59e0b',
                marginBottom: '0.25rem'
              }}>
                {stats.enAttente}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>{t('common.enAttente')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.approuvees}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Approuvées
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#b91c1c',
                marginBottom: '0.25rem'
              }}>
                {stats.refusees}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Refusées
              </div>
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
                outline: 'none',
                minWidth: '200px'
              }}
            >
              <option value="">Tous les services</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>

            {/* Filtre par type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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
              <option value="">Tous les types</option>
              <option value="CONGÉ_ANNUEL">Congé annuel</option>
              <option value="CONGÉ_MALADIE">Congé maladie</option>
              <option value="CONGÉ_MATERNITÉ">Congé maternité</option>
              <option value="DÉTACHEMENT">Détachement</option>
              <option value="DISPONIBILITÉ">Disponibilité</option>
              <option value="ANNÉE_SABBATIQUE">Année sabbatique</option>
            </select>

            {/* Filtre par statut */}
            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
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
              <option value="">Tous les statuts</option>
              <option value="EN_ATTENTE">{t('common.enAttente')}</option>
              <option value="APPROUVÉ">{t('common.approuve')}</option>
              <option value="REFUSÉ">{t('common.refuse')}</option>
              <option value="ANNULÉ">{t('common.annule')}</option>
            </select>
          </div>
        </div>

        {/* Liste des absences */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {filteredAbsences.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#6b7280'
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
                margin: 0
              }}>
                {searchTerm || selectedService || selectedType || selectedStatut
                  ? 'Aucune absence ne correspond aux critères de recherche'
                  : 'Aucune absence enregistrée'}
              </p>
            </div>
          ) : (
            <div>
              {/* En-tête du tableau */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1.5fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                <div>{t('common.employe')}</div>
                <div>Type / Dates</div>
                <div>Durée</div>
                <div>{t('common.service')}</div>
                <div>{t('common.statut')}</div>
                <div style={{ textAlign: 'center' }}>{t('common.actions')}</div>
              </div>

              {/* Lignes du tableau */}
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
                    key={absence.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1.5fr',
                      gap: '1rem',
                      padding: '1rem 1.5rem',
                      borderBottom: index < filteredAbsences.length - 1 ? '1px solid #f3f4f6' : 'none',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafbfc';
                    }}
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
                          {absence.personne_prenom?.charAt(0)}{absence.personne_nom?.charAt(0)}
                        </div>
                        <div>
                          <p style={{
                            fontWeight: '600',
                            color: '#374151',
                            margin: '0 0 0.25rem 0',
                            fontSize: '0.875rem'
                          }}>
                            {absence.personne_prenom} {absence.personne_nom}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            margin: 0
                          }}>
                            {absence.date_demande_absence 
                              ? new Date(absence.date_demande_absence).toLocaleDateString('fr-FR')
                              : 'Date non spécifiée'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Type / Dates */}
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}>
                        {getTypeLabel(absence.type_absence)}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        {new Date(absence.date_debut).toLocaleDateString('fr-FR')} - {new Date(absence.date_fin).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {/* Durée */}
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#1e3a8a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      <span>
                        {duree} jour{duree > 1 ? 's' : ''}
                      </span>
                      {isOngoingAbsence(absence) && (
                        <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                          Il reste {remaining} jour{remaining > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Service */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <BuildingOfficeIcon style={{ width: '0.875rem', height: '0.875rem', color: '#6b7280' }} />
                      {absence.personne_service || 'N/A'}
                    </div>

                    {/* Statut */}
                    <div>
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
                        {getStatutLabel(absence.statut)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => openModal(absence, 'view')}
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
                      
                      {absence.statut === 'EN_ATTENTE' && (
                        <>
                          <button
                            onClick={() => openModal(absence, 'approve')}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              borderRadius: '0.5rem',
                              cursor: 'pointer'
                            }}
                            title="Approuver"
                          >
                            <CheckIcon style={{
                              width: '1rem',
                              height: '1rem',
                              color: '#1e3a8a'
                            }} />
                          </button>
                          
                          <button
                            onClick={() => openModal(absence, 'reject')}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#fef2f2',
                              border: '1px solid #cbd5e1',
                              borderRadius: '0.5rem',
                              cursor: 'pointer'
                            }}
                            title="Refuser"
                          >
                            <XMarkIcon style={{
                              width: '1rem',
                              height: '1rem',
                              color: '#b91c1c'
                            }} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
                });
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedAbsence && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
        onClick={closeModal}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {modalType === 'view' && (
              <>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '1.5rem'
                }}>
                  Détails de l'absence
                </h2>
                
                <div style={{
                  display: 'grid',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>{t('common.employe')}</div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {selectedAbsence.personne_prenom} {selectedAbsence.personne_nom}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>{t('common.service')}</div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {selectedAbsence.personne_service || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      Type d'absence
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {getTypeLabel(selectedAbsence.type_absence)}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Date de début
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {new Date(selectedAbsence.date_debut).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Date de fin
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {new Date(selectedAbsence.date_fin).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      Durée
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e3a8a'
                    }}>
                      {calculateDuree(selectedAbsence.date_debut, selectedAbsence.date_fin)} jours
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>{t('common.statut')}</div>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      backgroundColor: `${getStatutColor(selectedAbsence.statut)}15`,
                      color: getStatutColor(selectedAbsence.statut),
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      border: `1px solid ${getStatutColor(selectedAbsence.statut)}40`
                    }}>
                      {getStatutLabel(selectedAbsence.statut)}
                    </span>
                  </div>

                  {selectedAbsence.commentaire_approbateur && (
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Commentaire d'approbation
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        padding: '0.75rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1'
                      }}>
                        {selectedAbsence.commentaire_approbateur}
                      </div>
                    </div>
                  )}

                  {selectedAbsence.motif_refus && (
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Motif de refus
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        padding: '0.75rem',
                        backgroundColor: '#fef2f2',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1'
                      }}>
                        {selectedAbsence.motif_refus}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >{t('common.fermer')}</button>
                </div>
              </>
            )}

            {modalType === 'approve' && (
              <>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '1.5rem'
                }}>
                  Approuver l'absence
                </h2>
                
                <div style={{
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Employé : <strong>{selectedAbsence.personne_prenom} {selectedAbsence.personne_nom}</strong>
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    marginBottom: '1rem'
                  }}>
                    Type : <strong>{getTypeLabel(selectedAbsence.type_absence)}</strong> - 
                    Du {new Date(selectedAbsence.date_debut).toLocaleDateString('fr-FR')} au {new Date(selectedAbsence.date_fin).toLocaleDateString('fr-FR')}
                  </div>

                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Commentaire (optionnel)
                  </label>
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >{t('common.annuler')}</button>
                  <button
                    onClick={handleApproveAbsence}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#1e3a8a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <CheckCircleIcon style={{ width: '1rem', height: '1rem' }} />
                    Approuver
                  </button>
                </div>
              </>
            )}

            {modalType === 'reject' && (
              <>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '1.5rem'
                }}>
                  Refuser l'absence
                </h2>
                
                <div style={{
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Employé : <strong>{selectedAbsence.personne_prenom} {selectedAbsence.personne_nom}</strong>
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    marginBottom: '1rem'
                  }}>
                    Type : <strong>{getTypeLabel(selectedAbsence.type_absence)}</strong> - 
                    Du {new Date(selectedAbsence.date_debut).toLocaleDateString('fr-FR')} au {new Date(selectedAbsence.date_fin).toLocaleDateString('fr-FR')}
                  </div>

                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Motif de refus <span style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <textarea
                    value={motifRefus}
                    onChange={(e) => setMotifRefus(e.target.value)}
                    placeholder="Indiquer le motif de refus..."
                    rows="4"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >{t('common.annuler')}</button>
                  <button
                    onClick={handleRejectAbsence}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#b91c1c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <XMarkIcon style={{ width: '1rem', height: '1rem' }} />
                    Refuser
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AbsencesManagementAdminRH;

