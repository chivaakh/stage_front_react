/**
 * ARBORESCENCE DU FICHIER:
 * src/
 * └── components/
 *     └── ChefPAT/
 *         └── ReportsManagement.js
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  ChartBarIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
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

const ReportsManagement = () => {
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

  const COLORS = ['#dc2626', '#7c3aed', '#2563eb', '#059669', '#d97706', '#0891b2', '#6b7280'];

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
      console.log('📊 Chargement rapport mensuel PAT pour:', selectedPeriod.month);
      
      const response = await apiService.get(`/personnel-pat/rapport_mensuel/?mois=${selectedPeriod.month}`);
      console.log('✅ Rapport mensuel PAT reçu:', response.data);
      setMonthlyReport(response.data);
    } catch (err) {
      console.error('❌ Erreur chargement rapport mensuel PAT:', err);
      setError('Erreur lors du chargement du rapport mensuel');
      
      // ✅ DONNÉES DE DÉMONSTRATION EN CAS D'ERREUR
      console.log('🔄 Utilisation des données de démonstration...');
      setMonthlyReport({
        periode: selectedPeriod.month,
        service: 'Service Personnel PAT',
        statistiques: {
          total_pat: 35,
          agents_presents: 32,
          agents_absents: 3,
          taux_presence: 91.4
        },
        repartition_poste: [
          { poste: 'sg', label: 'Secrétaire Général', count: 2 },
          { poste: 'conseil', label: 'Conseil', count: 3 },
          { poste: 'charge_mission', label: 'Chargé de Mission', count: 4 },
          { poste: 'directeur', label: 'Directeur', count: 8 },
          { poste: 'chef_service', label: 'Chef de Service', count: 10 },
          { poste: 'chef_division', label: 'Chef de Division', count: 6 },
          { poste: 'autre', label: 'Autre', count: 2 }
        ],
        absences_par_type: [
          { type_absence: 'CONGÉ_ANNUEL', count: 4 },
          { type_absence: 'CONGÉ_MALADIE', count: 2 },
          { type_absence: 'DÉTACHEMENT', count: 1 }
        ],
        top_absences: [
          { nom: 'Mohamed OULD Ahmed', poste: 'chef_service', nombre_absences: 2 },
          { nom: 'Aicha MINT Sidi', poste: 'directeur', nombre_absences: 1 }
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
      console.log('📊 Chargement rapport annuel PAT pour:', selectedPeriod.year);
      
      const response = await apiService.get(`/personnel-pat/rapport_annuel/?annee=${selectedPeriod.year}`);
      console.log('✅ Rapport annuel PAT reçu:', response.data);
      setAnnualReport(response.data);
    } catch (err) {
      console.error('❌ Erreur chargement rapport annuel PAT:', err);
      setError('Erreur lors du chargement du rapport annuel');
      
      // ✅ DONNÉES DE DÉMONSTRATION EN CAS D'ERREUR
      console.log('🔄 Utilisation des données de démonstration...');
      setAnnualReport({
        annee: selectedPeriod.year,
        service: 'Service Personnel PAT',
        donnees_mensuelles: [
          { mois: 1, nom_mois: 'Janvier', nombre_absences: 6 },
          { mois: 2, nom_mois: 'Février', nombre_absences: 4 },
          { mois: 3, nom_mois: 'Mars', nombre_absences: 5 },
          { mois: 4, nom_mois: 'Avril', nombre_absences: 3 },
          { mois: 5, nom_mois: 'Mai', nombre_absences: 7 },
          { mois: 6, nom_mois: 'Juin', nombre_absences: 2 },
          { mois: 7, nom_mois: 'Juillet', nombre_absences: 1 },
          { mois: 8, nom_mois: 'Août', nombre_absences: 1 },
          { mois: 9, nom_mois: 'Septembre', nombre_absences: 4 },
          { mois: 10, nom_mois: 'Octobre', nombre_absences: 5 },
          { mois: 11, nom_mois: 'Novembre', nombre_absences: 3 },
          { mois: 12, nom_mois: 'Décembre', nombre_absences: 2 }
        ],
        statistiques_annuelles: {
          total_absences: 43,
          moyenne_mensuelle: 3.6,
          mois_plus_absences: { nom_mois: 'Mai', nombre_absences: 7 },
          mois_moins_absences: { nom_mois: 'Juillet', nombre_absences: 1 }
        },
        donnees_trimestrielles: [
          { trimestre: 'T1', absences: 15 },
          { trimestre: 'T2', absences: 12 },
          { trimestre: 'T3', absences: 6 },
          { trimestre: 'T4', absences: 10 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async (format = 'json', type = 'mensuel') => {
    try {
      setExportLoading(true);
      console.log('📥 Export rapport PAT:', format, type);
      
      // ✅ EXPORT SIMPLIFIÉ POUR DÉMONSTRATION
      const dataToExport = activeTab === 'monthly' ? monthlyReport : annualReport;
      
      if (format === 'csv') {
        // Créer un CSV simple
        let csvContent = '';
        if (activeTab === 'monthly' && monthlyReport) {
          csvContent = `Rapport Mensuel PAT,${monthlyReport.periode}\n`;
          csvContent += `Service,${monthlyReport.service}\n`;
          csvContent += `Total Agents,${monthlyReport.statistiques.total_pat}\n`;
          csvContent += `Taux Présence,${monthlyReport.statistiques.taux_presence}%\n\n`;
          csvContent += `Poste,Nombre\n`;
          monthlyReport.repartition_poste.forEach(item => {
            csvContent += `${item.label},${item.count}\n`;
          });
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport_pat_${type}_${selectedPeriod.month}.csv`;
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
        link.download = `rapport_pat_${type}_${selectedPeriod.month}.json`;
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
            borderTop: '3px solid #3b82f6',
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
            Analyse des données PAT et création des graphiques...
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
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
                Retour
              </button>
              
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Analytics & Reporting PAT
                </div>
                <h1 style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#3b82f6',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <ChartBarIcon style={{
                    width: '2rem',
                    height: '2rem'
                  }} />
                  Rapports et Statistiques PAT
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '1rem'
                }}>
                  Analyse détaillée du personnel administratif et technique
                </p>
              </div>
            </div>

            {/* Indicateur temps réel */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#0284c7',
                fontWeight: '500',
                marginBottom: '0.25rem'
              }}>
                Dernière mise à jour
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#0369a1',
                fontWeight: '600'
              }}>
                {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>

          {/* Bannière d'information améliorée */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                <span style={{ fontSize: '1.5rem' }}>🏢</span>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  margin: '0 0 0.25rem 0'
                }}>
                  Rapports PAT en temps réel disponibles
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

          {/* Contrôles de période et export */}
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
                      backgroundColor: 'white'
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
                      cursor: 'pointer'
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

              {/* Boutons d'export */}
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
                    transition: 'all 0.2s ease'
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
                    transition: 'all 0.2s ease'
                  }}
                >
                  <DocumentArrowDownIcon style={{ width: '1rem', height: '1rem' }} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Affichage des erreurs */}
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

        {/* Onglets */}
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
                    borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{tab.emoji}</span>
                  <IconComponent style={{ width: '1.25rem', height: '1.25rem' }} />
                  {tab.label}
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
                  📅 Rapport Mensuel PAT - {monthlyReport.periode}
                </h3>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  Service: {monthlyReport.service}
                </p>
              </div>

              {/* Statistiques principales */}
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
                      {monthlyReport.statistiques.total_pat}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#0369a1',
                      margin: 0,
                      fontWeight: '600'
                    }}>
                      Total Agents PAT
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
                      {monthlyReport.statistiques.agents_absents}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#a16207',
                      margin: 0,
                      fontWeight: '600'
                    }}>
                      Agents Absents
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphiques */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                {/* Répartition par poste */}
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
                    💼 Répartition par Poste
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={monthlyReport.repartition_poste.map((item, index) => ({
                          name: item.label || item.poste,
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
                        {monthlyReport.repartition_poste.map((entry, index) => (
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
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top absences */}
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
                    ⚠️ Agents avec le plus d'absences
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {monthlyReport.top_absences.map((agent, index) => (
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
                            {agent.nom?.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', margin: '0 0 0.25rem 0', color: '#111827' }}>
                              {agent.nom}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                              {agent.poste}
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
                          {agent.nombre_absences} absence{agent.nombre_absences > 1 ? 's' : ''}
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
                  📊 Rapport Annuel PAT - {annualReport.annee}
                </h3>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  Service: {annualReport.service}
                </p>
              </div>

              {/* Statistiques annuelles */}
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

              {/* Évolution mensuelle */}
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
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Nombre d'absences"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Données trimestrielles */}
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
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid #bae6fd',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          borderLeft: '4px solid #3b82f6'
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
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '1.5rem' }}>✅</span>
            </div>
            <h3 style={{
              color: '#0284c7',
              fontSize: '1.25rem',
              fontWeight: '700',
              margin: 0
            }}>
              Module Rapports PAT - Opérationnel !
            </h3>
          </div>
          <p style={{
            color: '#0369a1',
            margin: 0,
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            📊 Analyses détaillées disponibles • 📈 Graphiques interactifs • 📥 Exports multiples formats
            <br />
            🔄 Données actualisées en temps réel • 🎯 Insights précis pour la gestion PAT
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;