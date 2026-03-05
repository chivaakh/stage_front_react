// Traduit automatiquement
// src/components/AdminRH/PersonnelManagement.js - GESTION UNIFIÉE DU PERSONNEL POUR ADMIN RH
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const PersonnelManagement = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Données du personnel
  const [enseignants, setEnseignants] = useState([]);
  const [personnelPAT, setPersonnelPAT] = useState([]);
  const [contractuels, setContractuels] = useState([]);
  const [services, setServices] = useState([]);
  
  // Personnel unifié pour l'affichage
  const [personnelUnifie, setPersonnelUnifie] = useState([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterService, setFilterService] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, enseignants, pat, contractuels

  useEffect(() => {
    loadAllPersonnel();
    loadServices();
  }, []);

  useEffect(() => {
    unifyPersonnel();
  }, [enseignants, personnelPAT, contractuels]);

  useEffect(() => {
    applyFilters();
  }, [personnelUnifie, searchTerm, filterType, filterService, activeTab]);

  const loadAllPersonnel = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('👥 Chargement de tout le personnel...');
      
      const [enseignantsRes, patRes, contractuelsRes] = await Promise.all([
        apiService.getEnseignants(),
        apiService.getPersonnelPAT(),
        apiService.getContractuels()
      ]);

      const enseignantsData = enseignantsRes.results || enseignantsRes || [];
      const patData = patRes.results || patRes || [];
      const contractuelsData = contractuelsRes.results || contractuelsRes || [];

      setEnseignants(enseignantsData);
      setPersonnelPAT(patData);
      setContractuels(contractuelsData);
      
      console.log('✅ Personnel chargé:', {
        enseignants: enseignantsData.length,
        pat: patData.length,
        contractuels: contractuelsData.length
      });
    } catch (err) {
      console.error('❌ Erreur chargement personnel:', err);
      setError(t('common.erreurChargement') + ' du personnel');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await apiService.get('/services/');
      const servicesData = response.data?.results || response.data || [];
      setServices(servicesData);
    } catch (err) {
      console.error('Erreur chargement services:', err);
    }
  };

  const unifyPersonnel = () => {
    const unified = [
      ...enseignants.map(e => ({
        id: e.id,
        personne_id: e.personne?.id || e.personne_id,
        nom: e.personne?.nom || e.nom,
        prenom: e.personne?.prenom || e.prenom,
        email: e.personne?.email || e.email,
        telephone: e.personne?.telephone || e.telephone,
        service: e.personne?.service?.nom || e.service?.nom || 'N/A',
        service_id: e.personne?.service?.id || e.service?.id,
        type: 'enseignant',
        typeLabel: 'Enseignant',
        grade: e.grade || 'N/A',
        specialite: e.specialite || 'N/A',
        date_embauche: e.personne?.date_embauche || e.date_embauche,
        genre: e.personne?.genre || e.genre
      })),
      ...personnelPAT.map(p => ({
        id: p.id,
        personne_id: p.personne?.id || p.personne_id,
        nom: p.personne?.nom || p.nom,
        prenom: p.personne?.prenom || p.prenom,
        email: p.personne?.email || p.email,
        telephone: p.personne?.telephone || p.telephone,
        service: p.personne?.service?.nom || p.service?.nom || 'N/A',
        service_id: p.personne?.service?.id || p.service?.id,
        type: 'pat',
        typeLabel: 'PAT',
        poste: p.poste || 'N/A',
        date_embauche: p.personne?.date_embauche || p.date_embauche,
        genre: p.personne?.genre || p.genre
      })),
      ...contractuels.map(c => ({
        id: c.id,
        personne_id: c.personne?.id || c.personne_id,
        nom: c.personne?.nom || c.nom,
        prenom: c.personne?.prenom || c.prenom,
        email: c.personne?.email || c.email,
        telephone: c.personne?.telephone || c.telephone,
        service: c.personne?.service?.nom || c.service?.nom || 'N/A',
        service_id: c.personne?.service?.id || c.service?.id,
        type: 'contractuel',
        typeLabel: 'Contractuel',
        type_contrat: c.type_contrat || 'N/A',
        date_debut_contrat: c.date_debut_contrat,
        date_fin_contrat: c.date_fin_contrat,
        date_embauche: c.personne?.date_embauche || c.date_debut_contrat,
        genre: c.personne?.genre || c.genre
      }))
    ];

    setPersonnelUnifie(unified);
  };

  const applyFilters = () => {
    let result = [...personnelUnifie];

    // Filtre par onglet
    if (activeTab !== 'all') {
      result = result.filter(p => p.type === activeTab);
    }

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(p =>
        p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.service?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par service
    if (filterService) {
      result = result.filter(p => p.service_id == filterService);
    }

    setFilteredPersonnel(result);
  };

  const handleViewPersonnel = (personnel) => {
    // Rediriger vers la page appropriée selon le type
    if (personnel.type === 'enseignant') {
      window.location.href = '/admin-rh/enseignants?view=${personnel.id}';
    } else if (personnel.type === 'pat') {
      window.location.href = '/admin-rh/personnel-pat?view=${personnel.id}';
    } else if (personnel.type === 'contractuel') {
      window.location.href = '/admin-rh/contractuels?view=${personnel.id}';
    }
  };

  const handleEditPersonnel = (personnel) => {
    // Rediriger vers la page d'édition appropriée
    if (personnel.type === 'enseignant') {
      window.location.href = '/admin-rh/enseignants?edit=${personnel.id}';
    } else if (personnel.type === 'pat') {
      window.location.href = '/admin-rh/personnel-pat?edit=${personnel.id}';
    } else if (personnel.type === 'contractuel') {
      window.location.href = '/admin-rh/contractuels?edit=${personnel.id}';
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'enseignant': '#1e3a8a',
      'pat': '#1e3a8a',
      'contractuel': '#7c3aed'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'enseignant': '🎓',
      'pat': '🏢',
      'contractuel': '📋'
    };
    return icons[type] || '👤';
  };

  // Calcul des statistiques
  const stats = {
    total: personnelUnifie.length,
    enseignants: enseignants.length,
    pat: personnelPAT.length,
    contractuels: contractuels.length,
    parService: services.map(s => ({
      service: s.nom,
      total: personnelUnifie.filter(p => p.service_id === s.id).length
    }))
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
            Chargement du personnel
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
                  Gestion du personnel
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
                  <UserGroupIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Vue globale du personnel
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  {stats.total} employé{stats.total > 1 ? 's' : ''} au total
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
              color: '#b91c1c',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

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
              }}>{t('common.total')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.enseignants}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Enseignants
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.pat}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                PAT
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#7c3aed',
                marginBottom: '0.25rem'
              }}>
                {stats.contractuels}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Contractuels
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            {[
              { id: 'all', label: 'Tous', icon: UserGroupIcon },
              { id: 'enseignant', label: 'Enseignants', icon: AcademicCapIcon },
              { id: 'pat', label: 'PAT', icon: BriefcaseIcon },
              { id: 'contractuel', label: 'Contractuels', icon: DocumentTextIcon }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #b91c1c' : '2px solid transparent',
                    color: isActive ? '#b91c1c' : '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    marginBottom: '-2px'
                  }}
                >
                  <Icon style={{ width: '1rem', height: '1rem' }} />
                  {tab.label}
                </button>
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
                placeholder="Rechercher par nom, prénom, email ou service..."
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
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
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
          </div>
        </div>

        {/* Liste du personnel */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {filteredPersonnel.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#6b7280'
            }}>
              <UserGroupIcon style={{
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
                Aucun employé trouvé
              </h3>
              <p style={{
                fontSize: '1rem',
                margin: 0
              }}>
                {searchTerm || filterService
                  ? 'Aucun employé ne correspond aux critères de recherche'
                  : 'Aucun employé enregistré'}
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
                <div>{t('common.employe')}</div>
                <div>Type</div>
                <div>{t('common.service')}</div>
                <div>{t('common.details')}</div>
                <div>Contact</div>
                <div style={{ textAlign: 'center' }}>{t('common.actions')}</div>
              </div>

              {/* Lignes du tableau */}
              {filteredPersonnel.map((personnel, index) => {
                const typeColor = getTypeColor(personnel.type);

                return (
                  <div
                    key={`${personnel.type}-${personnel.id}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr',
                      gap: '1rem',
                      padding: '1rem 1.5rem',
                      borderBottom: index < filteredPersonnel.length - 1 ? '1px solid #f3f4f6' : 'none',
                      cursor: 'pointer',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafbfc';
                    }}
                    onClick={() => handleViewPersonnel(personnel)}
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
                          backgroundColor: `${typeColor}15`,
                          border: `2px solid ${typeColor}40`,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: typeColor
                        }}>
                          {personnel.prenom?.charAt(0)}{personnel.nom?.charAt(0)}
                        </div>
                        <div>
                          <p style={{
                            fontWeight: '600',
                            color: '#374151',
                            margin: '0 0 0.25rem 0',
                            fontSize: '0.875rem'
                          }}>
                            {personnel.prenom} {personnel.nom}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            margin: 0
                          }}>
                            {personnel.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: `${typeColor}15`,
                        color: typeColor,
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: `1px solid ${typeColor}40`
                      }}>
                        {getTypeIcon(personnel.type)} {personnel.typeLabel}
                      </span>
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
                      {personnel.service}
                    </div>

                    {/* Détails */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      {personnel.type === 'enseignant' && (
                        <div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>Grade: {personnel.grade}</div>
                          {personnel.specialite && (
                            <div style={{ fontSize: '0.75rem' }}>Spécialité: {personnel.specialite}</div>
                          )}
                        </div>
                      )}
                      {personnel.type === 'pat' && (
                        <div style={{ fontWeight: '600', color: '#374151' }}>
                          Poste: {personnel.poste}
                        </div>
                      )}
                      {personnel.type === 'contractuel' && (
                        <div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>{personnel.type_contrat}</div>
                          {personnel.date_fin_contrat && (
                            <div style={{ fontSize: '0.75rem' }}>
                              Expire: {new Date(personnel.date_fin_contrat).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Contact */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      {personnel.telephone || 'N/A'}
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPersonnel(personnel);
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
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPersonnel(personnel);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        title={t('common.modifier')}>
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

        {/* Répartition par service */}
        {stats.parService.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            marginTop: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <ChartBarIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              Répartition par service
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {stats.parService.map((stat, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.service}
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#b91c1c'
                  }}>
                    {stat.total} employé{stat.total > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonnelManagement;

