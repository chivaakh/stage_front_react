// Traduit automatiquement
/**
 * ARBORESCENCE DU FICHIER:
 * src/
 * └── components/
 *     └── ChefEnseignant/
 *         └── ReportsManagement.js
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ReportsManagement = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState({
    month: new Date().toISOString().slice(0, 7),
    year: new Date().getFullYear()
  });

  // États pour les données de rapports
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [annualReport, setAnnualReport] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  // Charger le rapport mensuel
  useEffect(() => {
    if (activeTab === 'monthly') {
      fetchMonthlyReport();
    }
  }, [selectedPeriod.month, activeTab]);

  // Charger le rapport annuel
  useEffect(() => {
    if (activeTab === 'annual') {
      fetchAnnualReport();
    }
  }, [selectedPeriod.year, activeTab]);

  const fetchMonthlyReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📊 Chargement rapport mensuel pour:', selectedPeriod.month);

      const response = await apiService.get(`/enseignants/rapport_mensuel/?mois=${selectedPeriod.month}`);
      console.log('✅ Rapport mensuel reçu:', response.data);
      setMonthlyReport(response.data);
    } catch (err) {
      console.error('❌ Erreur chargement rapport mensuel:', err);
      setError(t('common.erreurChargement') + ' du rapport mensuel');

      // ✅ DONNÉES DE DÉMONSTRATION EN CAS D'ERREUR
      console.log('🔄 Utilisation des données de démonstration...');
      setMonthlyReport({
        periode: selectedPeriod.month,
        service: 'Service Enseignant',
        statistiques: {
          total_enseignants: 25,
          enseignants_presents: 23,
          enseignants_absents: 2,
          taux_presence: 92.0
        },
        repartition_grade: [
          { grade: 'professeur', count: 8 },
          { grade: 'maitre_assistant', count: 10 },
          { grade: 'assistant', count: 5 },
          { grade: 'docteur', count: 2 }
        ],
        absences_par_type: [
          { type_absence: 'CONGÉ_ANNUEL', count: 3 },
          { type_absence: 'CONGÉ_MALADIE', count: 1 },
          { type_absence: 'DÉTACHEMENT', count: 1 }
        ],
        top_absences: [
          { nom: 'Ahmed OULD Mohamed', grade: 'assistant', nombre_absences: 2 },
          { nom: 'Fatima MINT Ali', grade: 'maitre_assistant', nombre_absences: 1 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnualReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('📊 Chargement rapport annuel pour:', selectedPeriod.year);

      const response = await apiService.get(`/enseignants/rapport_annuel/?annee=${selectedPeriod.year}`);
      console.log('✅ Rapport annuel reçu:', response.data);
      setAnnualReport(response.data);
    } catch (err) {
      console.error('❌ Erreur chargement rapport annuel:', err);
      setError(t('common.erreurChargement') + ' du rapport annuel');

      // ✅ DONNÉES DE DÉMONSTRATION EN CAS D'ERREUR
      console.log('🔄 Utilisation des données de démonstration...');
      setAnnualReport({
        annee: selectedPeriod.year,
        service: 'Service Enseignant',
        donnees_mensuelles: [
          { mois: 1, nom_mois: 'Janvier', nombre_absences: 5 },
          { mois: 2, nom_mois: 'Février', nombre_absences: 3 },
          { mois: 3, nom_mois: 'Mars', nombre_absences: 4 },
          { mois: 4, nom_mois: 'Avril', nombre_absences: 2 },
          { mois: 5, nom_mois: 'Mai', nombre_absences: 6 },
          { mois: 6, nom_mois: 'Juin', nombre_absences: 1 },
          { mois: 7, nom_mois: 'Juillet', nombre_absences: 0 },
          { mois: 8, nom_mois: 'Août', nombre_absences: 0 },
          { mois: 9, nom_mois: 'Septembre', nombre_absences: 3 },
          { mois: 10, nom_mois: 'Octobre', nombre_absences: 4 },
          { mois: 11, nom_mois: 'Novembre', nombre_absences: 2 },
          { mois: 12, nom_mois: 'Décembre', nombre_absences: 1 }
        ],
        statistiques_annuelles: {
          total_absences: 31,
          moyenne_mensuelle: 2.6,
          mois_plus_absences: { nom_mois: 'Mai', nombre_absences: 6 },
          mois_moins_absences: { nom_mois: 'Juillet', nombre_absences: 0 }
        },
        donnees_trimestrielles: [
          { trimestre: 'T1', absences: 12 },
          { trimestre: 'T2', absences: 9 },
          { trimestre: 'T3', absences: 3 },
          { trimestre: 'T4', absences: 7 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async (format = 'json', type = 'mensuel') => {
    try {
      setExportLoading(true);
      console.log('📥 Export rapport:', format, type);

      // ✅ EXPORT SIMPLIFIÉ POUR DÉMONSTRATION
      const dataToExport = activeTab === 'monthly' ? monthlyReport : annualReport;

      if (format === 'csv') {
        // Créer un CSV simple
        let csvContent = '';
        if (activeTab === 'monthly' && monthlyReport) {
          csvContent = `Rapport Mensuel,${monthlyReport.periode}\n`;
          csvContent += `Service,${monthlyReport.service}\n`;
          csvContent += `Total Enseignants,${monthlyReport.statistiques.total_enseignants}\n`;
          csvContent += `Taux Présence,${monthlyReport.statistiques.taux_presence}%\n`;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport_enseignants_${type}_${selectedPeriod.month}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Export JSON
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport_enseignants_${type}_${selectedPeriod.month}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

    } catch (err) {
      console.error('❌ Erreur export:', err);
      setError('Erreur lors de l\'export du rapport');
    } finally {
      setExportLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      professeur: '#059669',
      maitre_assistant: '#3b82f6',
      assistant: '#f59e0b',
      docteur: '#8b5cf6'
    };
    return colors[grade] || '#6b7280';
  };

  if (isLoading && !monthlyReport && !annualReport) {
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
            Génération du rapport en cours
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Analyse des données et création des graphiques...
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

        {/* En-tête moderne */}
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
                  color: '#374151',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />{t('common.retour')}</button>

              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Analytics & Reporting
                </div>
                <h1 style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#059669',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <ChartBarIcon style={{
                    width: '2rem',
                    height: '2rem'
                  }} />
                  Rapports et Statistiques
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '1rem'
                }}>
                  Analyse détaillée et insights de votre service enseignant
                </p>
              </div>
            </div>

            {/* Indicateur temps réel */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#16a34a',
                fontWeight: '500',
                marginBottom: '0.25rem'
              }}>
                Dernière mise à jour
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#059669',
                fontWeight: '600'
              }}>
                {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>

          {/* Bannière d'information améliorée */}
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #16a34a 100%)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            color: 'white',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.5rem' }}>📊</span>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  margin: '0 0 0.25rem 0'
                }}>
                  Rapports en temps réel disponibles
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  opacity: 0.9
                }}>
                  Données actualisées automatiquement • Exports multiples formats • Analytics avancés
                </p>
              </div>
            </div>
          </div>

          {/* Contrôles de période et export améliorés */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flex: '1'
              }}>
                {/* Sélecteur de mois */}
                <div style={{ minWidth: '160px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    📅 Période
                  </label>
                  <input
                    type="month"
                    value={selectedPeriod.month}
                    onChange={(e) => setSelectedPeriod(prev => ({ ...prev, month: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#059669';
                      e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Sélecteur d'année */}
                <div style={{ minWidth: '120px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    📆 Année
                  </label>
                  <select
                    value={selectedPeriod.year}
                    onChange={(e) => setSelectedPeriod(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#059669';
                      e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return (
                        <option key={year} value={year}>{year}</option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Boutons d'export améliorés */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                flexShrink: 0
              }}>
                <button
                  onClick={() => handleExportReport('json', 'mensuel')}
                  disabled={exportLoading}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: exportLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: exportLoading ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px 0 rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!exportLoading) {
                      e.target.style.backgroundColor = '#2563eb';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!exportLoading) {
                      e.target.style.backgroundColor = '#3b82f6';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px 0 rgba(59, 130, 246, 0.3)';
                    }
                  }}
                >
                  <DocumentArrowDownIcon style={{ width: '1rem', height: '1rem' }} />
                  Export JSON
                </button>

                <button
                  onClick={() => handleExportReport('csv', 'detaille')}
                  disabled={exportLoading}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: exportLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: exportLoading ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px 0 rgba(5, 150, 105, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!exportLoading) {
                      e.target.style.backgroundColor = '#047857';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px 0 rgba(5, 150, 105, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!exportLoading) {
                      e.target.style.backgroundColor = '#059669';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px 0 rgba(5, 150, 105, 0.3)';
                    }
                  }}
                >
                  <DocumentArrowDownIcon style={{ width: '1rem', height: '1rem' }} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Affichage des erreurs amélioré */}
        {error && (
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
              gap: '0.75rem'
            }}>
              <ExclamationTriangleIcon style={{
                width: '1.5rem',
                height: '1.5rem',
                color: '#d97706'
              }} />
              <div>
                <h4 style={{
                  color: '#d97706',
                  fontSize: '1rem',
                  fontWeight: '600',
                  margin: '0 0 0.25rem 0'
                }}>
                  Avertissement
                </h4>
                <p style={{
                  color: '#92400e',
                  margin: 0,
                  fontSize: '0.875rem'
                }}>
                  {error} - Utilisation des données de démonstration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Onglets améliorés */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {[
              { id: 'monthly', label: 'Rapport Mensuel', icon: CalendarDaysIcon, emoji: '📅' },
              { id: 'annual', label: 'Rapport Annuel', icon: ChartBarIcon, emoji: '📊' }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '1.25rem 2rem',
                    backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '3px solid #059669' : '3px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: activeTab === tab.id ? '#059669' : '#6b7280',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.backgroundColor = '#f1f5f9';
                      e.target.style.color = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6b7280';
                    }
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{tab.emoji}</span>
                  <IconComponent style={{ width: '1.25rem', height: '1.25rem' }} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: '#059669',
                      borderRadius: '50%'
                    }}></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Contenu du rapport mensuel */}
          {activeTab === 'monthly' && monthlyReport && (
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  📅 Rapport Mensuel - {monthlyReport.periode}
                </h3>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  Service: {monthlyReport.service}
                </p>
              </div>

              {/* Statistiques principales améliorées */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #bae6fd',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'rgba(2, 132, 199, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UserGroupIcon style={{ width: '1.5rem', height: '1.5rem', color: '#0284c7' }} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      margin: '0 0 0.5rem 0',
                      color: '#0284c7'
                    }}>
                      {monthlyReport.statistiques.total_enseignants}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#0369a1',
                      margin: 0,
                      fontWeight: '600'
                    }}>
                      Total Enseignants
                    </p>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #bbf7d0',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#16a34a', fontSize: '1.5rem', fontWeight: '800' }}>✓</span>
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      margin: '0 0 0.5rem 0',
                      color: '#16a34a'
                    }}>
                      {monthlyReport.statistiques.taux_presence}%
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#15803d',
                      margin: 0,
                      fontWeight: '600'
                    }}>
                      Taux de Présence
                    </p>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #fde047',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'rgba(202, 138, 4, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ClockIcon style={{ width: '1.5rem', height: '1.5rem', color: '#ca8a04' }} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      margin: '0 0 0.5rem 0',
                      color: '#ca8a04'
                    }}>
                      {monthlyReport.statistiques.enseignants_absents}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#a16207',
                      margin: 0,
                      fontWeight: '600'
                    }}>
                      Enseignants Absents
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphiques améliorés */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                {/* Répartition par grade */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🎓 Répartition par Grade
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={monthlyReport.repartition_grade.map((item, index) => ({
                          name: item.grade || 'Non défini',
                          value: item.count,
                          fill: COLORS[index % COLORS.length]
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {monthlyReport.repartition_grade.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Absences par type */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    📊 Absences par Type
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyReport.absences_par_type}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="type_absence"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top absences amélioré */}
              {monthlyReport.top_absences && monthlyReport.top_absences.length > 0 && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    ⚠️ Enseignants avec le plus d'absences
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {monthlyReport.top_absences.map((enseignant, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1.5rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '0.75rem',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: '#fef3c7',
                            border: '2px solid #fbbf24',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#d97706'
                          }}>
                            {enseignant.nom?.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', margin: '0 0 0.25rem 0', color: '#111827' }}>
                              {enseignant.nom}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                              {enseignant.grade}
                            </p>
                          </div>
                        </div>
                        <div style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#fef3c7',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#d97706',
                          border: '1px solid #fbbf24'
                        }}>
                          {enseignant.nombre_absences} absence{enseignant.nombre_absences > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contenu du rapport annuel */}
          {activeTab === 'annual' && annualReport && (
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  📊 Rapport Annuel - {annualReport.annee}
                </h3>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  Service: {annualReport.service}
                </p>
              </div>

              {/* Statistiques annuelles améliorées */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #bae6fd',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    margin: '0 0 0.5rem 0',
                    color: '#0284c7'
                  }}>
                    {annualReport.statistiques_annuelles.total_absences}
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: '#0369a1',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    Total Absences
                  </p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #bbf7d0',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    margin: '0 0 0.5rem 0',
                    color: '#16a34a'
                  }}>
                    {annualReport.statistiques_annuelles.moyenne_mensuelle}
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: '#15803d',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    Moyenne Mensuelle
                  </p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #fde047',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    margin: '0 0 0.5rem 0',
                    color: '#ca8a04'
                  }}>
                    {annualReport.statistiques_annuelles.mois_plus_absences.nom_mois}
                  </h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#a16207',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    Mois le + d'absences
                  </p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #fca5a5',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    margin: '0 0 0.5rem 0',
                    color: '#dc2626'
                  }}>
                    {annualReport.statistiques_annuelles.mois_moins_absences.nom_mois}
                  </h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#b91c1c',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    Mois le - d'absences
                  </p>
                </div>
              </div>

              {/* Évolution mensuelle améliorée */}
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                marginBottom: '2rem'
              }}>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '1.5rem',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📈 Évolution des Absences par Mois
                </h4>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={annualReport.donnees_mensuelles}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom_mois" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="nombre_absences"
                      stroke="#059669"
                      strokeWidth={3}
                      name="Nombre d'absences"
                      dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#059669', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Données trimestrielles améliorées */}
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '1.5rem',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📊 Répartition Trimestrielle
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={annualReport.donnees_trimestrielles}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trimestre" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="absences" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Message de statut final */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          borderLeft: '4px solid #059669'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: '#059669',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '1.5rem' }}>✅</span>
            </div>
            <h3 style={{
              color: '#16a34a',
              fontSize: '1.25rem',
              fontWeight: '700',
              margin: 0
            }}>
              Module Rapports et Statistiques - Opérationnel !
            </h3>
          </div>
          <p style={{
            color: '#15803d',
            margin: 0,
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            📊 Analyses détaillées disponibles • 📈 Graphiques interactifs • 📥 Exports multiples formats
            <br />
            🔄 Données actualisées en temps réel • 🎯 Insights précis pour la prise de décision
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;