// Traduit automatiquement
// src/components/AdminRH/EditPaieForm.js - FORMULAIRE DE MODIFICATION DE PAIE
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import {
  ArrowLeftIcon,
  CalculatorIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const EditPaieForm = ({ paieId, onCancel, onSuccess }) => {
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    personne: '',
    salaire_brut: '',
    nb_enfants: 0,
    mois_annee: '',
    date_paiement: '',
    statut_paiement: 'EN_COURS'
  });

  // États pour les résultats du calcul
  const [calculResult, setCalculResult] = useState(null);
  
  // États pour les listes déroulantes
  const [personnes, setPersonnes] = useState([]);
  const [loadingPersonnes, setLoadingPersonnes] = useState(true);

  useEffect(() => {
    loadPaie();
    loadPersonnes();
  }, [paieId]);

  useEffect(() => {
    if (formData.salaire_brut && formData.salaire_brut > 0) {
      handleCalculate();
    }
  }, [formData.salaire_brut, formData.nb_enfants]);

  const loadPaie = async () => {
    try {
      setLoading(true);
      const paie = await apiService.getPaie(paieId);
      
      setFormData({
        personne: paie.personne,
        salaire_brut: paie.salaire_brut,
        nb_enfants: paie.nb_enfants || 0,
        mois_annee: paie.mois_annee,
        date_paiement: paie.date_paiement,
        statut_paiement: paie.statut_paiement
      });

      // Pré-remplir le calcul avec les valeurs existantes
      setCalculResult({
        salaire_brut: parseFloat(paie.salaire_brut) || 0,
        salaire_net: parseFloat(paie.salaire_net) || 0,
        allocations_familiales: parseFloat(paie.allocations_familiales) || 0,
        deductions: parseFloat(paie.deductions) || 0
      });
    } catch (err) {
      console.error('Erreur chargement paie:', err);
      setError(t('common.erreurChargement') + ' de la paie');
    } finally {
      setLoading(false);
    }
  };

  const loadPersonnes = async () => {
    try {
      setLoadingPersonnes(true);
      
      const enseignantsResponse = await apiService.getEnseignants();
      const enseignants = enseignantsResponse.results || enseignantsResponse || [];
      
      const patResponse = await apiService.getPersonnelPAT();
      const pat = patResponse.results || patResponse || [];
      
      const contractuelsResponse = await apiService.getContractuels();
      const contractuels = contractuelsResponse.results || contractuelsResponse || [];
      
      const allPersonnes = [
        ...enseignants.map(e => ({
          id: e.personne?.id || e.id,
          nom: e.personne?.nom || e.nom,
          prenom: e.personne?.prenom || e.prenom,
          service: e.personne?.service?.nom || e.service?.nom || 'N/A',
          type: 'Enseignant'
        })),
        ...pat.map(p => ({
          id: p.personne?.id || p.id,
          nom: p.personne?.nom || p.nom,
          prenom: p.personne?.prenom || p.prenom,
          service: p.personne?.service?.nom || p.service?.nom || 'N/A',
          type: 'PAT'
        })),
        ...contractuels.map(c => ({
          id: c.personne?.id || c.id,
          nom: c.personne?.nom || c.nom,
          prenom: c.personne?.prenom || c.prenom,
          service: c.personne?.service?.nom || c.service?.nom || 'N/A',
          type: 'Contractuel'
        }))
      ];
      
      setPersonnes(allPersonnes);
    } catch (err) {
      console.error('Erreur chargement personnes:', err);
    } finally {
      setLoadingPersonnes(false);
    }
  };

  const handleCalculate = async () => {
    if (!formData.salaire_brut || formData.salaire_brut <= 0) {
      return;
    }

    try {
      setCalculating(true);
      const result = await apiService.calculerPaie({
        salaire_brut: formData.salaire_brut,
        nb_enfants: formData.nb_enfants || 0
      });
      setCalculResult(result);
    } catch (err) {
      // Calcul côté client
      const salaireBrut = parseFloat(formData.salaire_brut) || 0;
      const nbEnfants = parseInt(formData.nb_enfants) || 0;
      const allocationParEnfant = 5000;
      const allocationsFamiliales = nbEnfants * allocationParEnfant;
      const cotisationSociale = salaireBrut * 0.05;
      const retraite = salaireBrut * 0.03;
      
      let impot = 0;
      if (salaireBrut > 50000) {
        impot = (salaireBrut - 50000) * 0.20;
      } else if (salaireBrut > 30000) {
        impot = (salaireBrut - 30000) * 0.15;
      } else if (salaireBrut > 15000) {
        impot = (salaireBrut - 15000) * 0.10;
      }
      
      const deductions = cotisationSociale + retraite + impot;
      const salaireNet = salaireBrut + allocationsFamiliales - deductions;
      
      setCalculResult({
        salaire_brut: salaireBrut,
        salaire_net: Math.max(0, salaireNet),
        allocations_familiales: allocationsFamiliales,
        deductions: deductions,
        details_deductions: {
          cotisation_sociale: cotisationSociale,
          retraite: retraite,
          impot: impot
        }
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!calculResult) {
      setError('Veuillez calculer la paie avant de soumettre');
      return;
    }

    try {
      setSaving(true);
      
      const paieData = {
        personne: formData.personne,
        salaire_brut: calculResult.salaire_brut,
        salaire_net: calculResult.salaire_net,
        nb_enfants: parseInt(formData.nb_enfants) || 0,
        allocations_familiales: calculResult.allocations_familiales,
        deductions: calculResult.deductions,
        mois_annee: formData.mois_annee,
        date_paiement: formData.date_paiement,
        statut_paiement: formData.statut_paiement
      };

      await apiService.updatePaie(paieId, paieData);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Erreur modification paie:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Erreur lors de la modification de la paie');
    } finally {
      setSaving(false);
    }
  };

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
            Chargement de la paie
          </h3>
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
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
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={onCancel}
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
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#b91c1c',
                margin: 0
              }}>
                Modifier la paie
              </h1>
              <p style={{
                color: '#6b7280',
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem'
              }}>
                Modifier les informations de la fiche de paie
              </p>
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

          {success && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#1e3a8a'
            }}>
              <CheckCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Paie modifiée ${t('common.succes')} !</span>
            </div>
          )}
        </div>

        {/* Formulaire - même structure que CreatePaieForm */}
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1.5rem'
            }}>
              Informations de base
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              {/* Employé */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>{t('common.employe')}<span style={{ color: '#b91c1c' }}>*</span>
                </label>
                {loadingPersonnes ? (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }}>
                    Chargement des employés...
                  </div>
                ) : (
                  <select
                    name="personne"
                    value={formData.personne}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#fafbfc',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="">Sélectionner un employé</option>
                    {personnes.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.prenom} {p.nom} - {p.service} ({p.type})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Mois */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>{t('common.mois')}<span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <select
                  name="mois_annee"
                  value={formData.mois_annee}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: '#fafbfc',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {generateMoisOptions().map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Date de paiement */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Date de paiement <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <input
                  type="date"
                  name="date_paiement"
                  value={formData.date_paiement}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: '#fafbfc',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Statut */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>{t('common.statut')}<span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <select
                  name="statut_paiement"
                  value={formData.statut_paiement}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: '#fafbfc',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="EN_COURS">{t('common.enCours')}</option>
                  <option value="PAYÉ">{t('common.paye')}</option>
                  <option value="SUSPENDU">{t('common.suspendu')}</option>
                  <option value="ANNULÉ">{t('common.annule')}</option>
                </select>
              </div>
            </div>

            {/* Section calcul - même structure que CreatePaieForm */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1.5rem',
              marginTop: '1.5rem'
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
                <CalculatorIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                Calcul automatique (conforme aux lois mauritaniennes)
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Salaire brut (MRU) <span style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="salaire_brut"
                    value={formData.salaire_brut}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#fafbfc',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Nombre d'enfants
                  </label>
                  <input
                    type="number"
                    name="nb_enfants"
                    value={formData.nb_enfants}
                    onChange={handleChange}
                    min="0"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#fafbfc',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {calculating && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  color: '#1e3a8a',
                  fontSize: '0.875rem'
                }}>
                  Calcul en cours...
                </div>
              )}

              {calculResult && !calculating && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.75rem',
                  padding: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#1e3a8a',
                    marginBottom: '1rem'
                  }}>
                    Résultats du calcul
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Allocations familiales
                      </div>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#1e3a8a'
                      }}>
                        {calculResult.allocations_familiales.toLocaleString('fr-FR')} MRU
                      </div>
                    </div>

                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Total déductions
                      </div>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#b91c1c'
                      }}>
                        {calculResult.deductions.toLocaleString('fr-FR')} MRU
                      </div>
                    </div>
                  </div>

                  {calculResult.details_deductions && (
                    <div style={{
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      marginBottom: '1rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.75rem'
                      }}>
                        Détails des déductions :
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.75rem',
                        fontSize: '0.875rem'
                      }}>
                        <div>
                          <span style={{ color: '#6b7280' }}>Cotisation sociale (5%) : </span>
                          <span style={{ fontWeight: '600', color: '#374151' }}>
                            {calculResult.details_deductions.cotisation_sociale.toLocaleString('fr-FR')} MRU
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>Retraite (3%) : </span>
                          <span style={{ fontWeight: '600', color: '#374151' }}>
                            {calculResult.details_deductions.retraite.toLocaleString('fr-FR')} MRU
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }}>Impôt sur le revenu : </span>
                          <span style={{ fontWeight: '600', color: '#374151' }}>
                            {calculResult.details_deductions.impot.toLocaleString('fr-FR')} MRU
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{
                    backgroundColor: '#b91c1c',
                    color: 'white',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      marginBottom: '0.25rem',
                      opacity: 0.9
                    }}>
                      Salaire net à payer
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '700'
                    }}>
                      {calculResult.salaire_net.toLocaleString('fr-FR')} MRU
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onCancel}
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
              type="submit"
              disabled={saving || !calculResult}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: saving || !calculResult ? '#d1d5db' : '#b91c1c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: saving || !calculResult ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPaieForm;
