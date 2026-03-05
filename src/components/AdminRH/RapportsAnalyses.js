// Traduit automatiquement
// src/components/AdminRH/RapportsAnalyses.js - RAPPORTS ET ANALYSES COMPLETS POUR ADMIN RH
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  ChartBarIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  UsersIcon,
  ArrowPathIcon,
  ClockIcon,
  OfficeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const RapportsAnalyses = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('effectif');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Données des rapports
  const [rapportEffectif, setRapportEffectif] = useState(null);
  const [rapportTurnover, setRapportTurnover] = useState(null);
  const [rapportAbsences, setRapportAbsences] = useState(null);

  useEffect(() => {
    loadAllReports();
  }, []);

  const loadAllReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const [effectif, turnover, absences] = await Promise.all([
        apiService.getRapportEffectif(),
        apiService.getRapportTurnover(),
        apiService.getRapportAbsences()
      ]);

      setRapportEffectif(effectif);
      setRapportTurnover(turnover);
      setRapportAbsences(absences);
    } catch (err) {
      console.error('Erreur chargement rapports:', err);
      setError(t('common.erreurChargement') + ' des rapports');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export des données en JSON
    const data = {
      effectif: rapportEffectif,
      turnover: rapportTurnover,
      absences: rapportAbsences,
      date_generation: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapports_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
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
            Chargement des rapports
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
                  Rapports et Analyses
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
                  <ChartBarIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Rapports et Analyses Globaux
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  Effectif, Turnover et Absences - Vue globale
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                onClick={handleExport}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <DocumentArrowDownIcon style={{ width: '1rem', height: '1rem' }} />{t('common.exporter')}</button>
              
              <button
                onClick={handlePrint}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#b91c1c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >{t('common.imprimer')}</button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              color: '#b91c1c',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Onglets */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            {[
              { id: 'effectif', label: 'Effectif', icon: UsersIcon },
              { id: 'turnover', label: 'Turnover', icon: ArrowPathIcon },
              { id: 'absences', label: 'Absences', icon: ClockIcon }
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

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'effectif' && rapportEffectif && (
          <RapportEffectif data={rapportEffectif} />
        )}

        {activeTab === 'turnover' && rapportTurnover && (
          <RapportTurnover data={rapportTurnover} />
        )}

        {activeTab === 'absences' && rapportAbsences && (
          <RapportAbsences data={rapportAbsences} />
        )}
      </div>
    </div>
  );
};

// Composant Rapport Effectif
const RapportEffectif = ({ data }) => {
  const maxEffectif = Math.max(...data.par_service.map(s => s.total), 1);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <UsersIcon style={{ width: '1.5rem', height: '1.5rem', color: '#b91c1c' }} />
        Rapport Effectif
      </h2>

      {/* Statistiques générales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.75rem',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#1e3a8a',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Total Employés
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e3a8a'
          }}>
            {data.total_employes}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.75rem',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#1e3a8a',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Enseignants
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e3a8a'
          }}>
            {data.par_type.enseignants}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fef3c7',
          borderRadius: '0.75rem',
          border: '1px solid #fde68a'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#d97706',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Personnel PAT
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#d97706'
          }}>
            {data.par_type.pat}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fce7f3',
          borderRadius: '0.75rem',
          border: '1px solid #fbcfe8'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#be185d',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Contractuels
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#be185d'
          }}>
            {data.par_type.contractuels}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Services
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#374151'
          }}>
            {data.services}
          </div>
        </div>
      </div>

      {/* Répartition par service */}
      <div style={{
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '1rem'
        }}>
          Répartition par Service
        </h3>
        
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {data.par_service.map((service, index) => (
            <div key={index} style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    {service.service}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Type: {service.type}
                  </div>
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#b91c1c'
                }}>
                  {service.total} employé{service.total > 1 ? 's' : ''}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div style={{
                height: '0.5rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '9999px',
                overflow: 'hidden',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(service.total / maxEffectif) * 100}%`,
                  backgroundColor: '#b91c1c',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Détails */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#6b7280'
              }}>
                <div>Enseignants: <strong style={{ color: '#374151' }}>{service.enseignants}</strong></div>
                <div>PAT: <strong style={{ color: '#374151' }}>{service.pat}</strong></div>
                <div>Contractuels: <strong style={{ color: '#374151' }}>{service.contractuels}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Composant Rapport Turnover
const RapportTurnover = ({ data }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <ArrowPathIcon style={{ width: '1.5rem', height: '1.5rem', color: '#b91c1c' }} />
        Rapport Turnover
      </h2>

      {/* Période */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        Période d'analyse : {new Date(data.periode.debut).toLocaleDateString('fr-FR')} - {new Date(data.periode.fin).toLocaleDateString('fr-FR')}
      </div>

      {/* Statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.75rem',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#1e3a8a',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Effectif Actuel
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e3a8a'
          }}>
            {data.effectif_actuel}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fef2f2',
          borderRadius: '0.75rem',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#b91c1c',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Départs
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#b91c1c'
          }}>
            {data.departs}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.75rem',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#1e3a8a',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Arrivées
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e3a8a'
          }}>
            {data.arrivees}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: data.taux_turnover > 10 ? '#fef2f2' : '#fef3c7',
          borderRadius: '0.75rem',
          border: `1px solid ${data.taux_turnover > 10 ? '#cbd5e1' : '#fde68a'}`
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: data.taux_turnover > 10 ? '#b91c1c' : '#d97706',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Taux de Turnover
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: data.taux_turnover > 10 ? '#b91c1c' : '#d97706'
          }}>
            {data.taux_turnover}%
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Contrats Expirant Bientôt
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#374151'
          }}>
            {data.contrats_expirant_bientot}
          </div>
        </div>
      </div>

      {/* Évolution */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: data.evolution >= 0 ? '#f8fafc' : '#fef2f2',
        borderRadius: '0.75rem',
        border: `1px solid ${data.evolution >= 0 ? '#cbd5e1' : '#cbd5e1'}`
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: '#374151',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          Évolution nette
        </div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: data.evolution >= 0 ? '#1e3a8a' : '#b91c1c'
        }}>
          {data.evolution >= 0 ? '+' : ''}{data.evolution} employé{Math.abs(data.evolution) > 1 ? 's' : ''}
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: '#6b7280',
          marginTop: '0.5rem'
        }}>
          {data.evolution >= 0 ? 'Augmentation' : 'Diminution'} de l'effectif sur la période
        </div>
      </div>
    </div>
  );
};

// Composant Rapport Absences
const RapportAbsences = ({ data }) => {
  const maxAbsences = Math.max(...data.par_mois.map(m => m.nombre), 1);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <ClockIcon style={{ width: '1.5rem', height: '1.5rem', color: '#b91c1c' }} />
        Rapport Absences
      </h2>

      {/* Statistiques générales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.75rem',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#1e3a8a',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Total Absences
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e3a8a'
          }}>
            {data.total}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.75rem',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#1e3a8a',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Total Jours
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e3a8a'
          }}>
            {data.total_jours}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fef3c7',
          borderRadius: '0.75rem',
          border: '1px solid #fde68a'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#d97706',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Moyenne Jours/Absence
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#d97706'
          }}>
            {data.moyenne_jours_par_absence}
          </div>
        </div>
      </div>

      {/* Absences par mois */}
      <div style={{
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '1rem'
        }}>
          Évolution sur 6 mois
        </h3>
        
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {data.par_mois.map((mois, index) => (
            <div key={index} style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {mois.nom_mois}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {mois.nombre} absence{mois.nombre > 1 ? 's' : ''} - {mois.jours} jour{mois.jours > 1 ? 's' : ''}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div style={{
                height: '0.5rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(mois.nombre / maxAbsences) * 100}%`,
                  backgroundColor: '#b91c1c',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Répartition par type */}
      <div style={{
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '1rem'
        }}>
          Répartition par Type
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {Object.entries(data.par_type).map(([type, count]) => (
            <div key={type} style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                {type.replace(/_/g, ' ')}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#b91c1c'
              }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Répartition par statut */}
      <div>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '1rem'
        }}>
          Répartition par Statut
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {Object.entries(data.par_statut).map(([statut, count]) => {
            const colors = {
              'EN_ATTENTE': '#f59e0b',
              'APPROUVÉ': '#1e3a8a',
              'REFUSÉ': '#b91c1c',
              'ANNULÉ': '#6b7280'
            };
            const color = colors[statut] || '#6b7280';
            
            return (
              <div key={statut} style={{
                padding: '1rem',
                backgroundColor: `${color}15`,
                borderRadius: '0.5rem',
                border: `1px solid ${color}40`,
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: color,
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  {statut.replace(/_/g, ' ')}
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: color
                }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RapportsAnalyses;

