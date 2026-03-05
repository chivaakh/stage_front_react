// src/components/AdminRH/CreatePaieForm.js - FORMULAIRE DE CRÉATION DE PAIE AVEC CALCUL AUTOMATIQUE
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import {
  ArrowLeftIcon,
  CalculatorIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const CreatePaieForm = ({ onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    personne: '',
    salaire_brut: '',
    nb_enfants: 0,
    mois_annee: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    date_paiement: new Date().toISOString().split('T')[0],
    statut_paiement: 'EN_COURS',
    grade: '',
    echelon: '',
    indice: '',
    mode_reglement: 'Code 340',
    compte_bancaire: '',
    montant_imposable_mensuel: '',
    montant_imposable_progressif: ''
  });

  // États pour les résultats du calcul
  const [calculResult, setCalculResult] = useState(null);
  
  // États pour les listes déroulantes
  const [personnes, setPersonnes] = useState([]);
  const [loadingPersonnes, setLoadingPersonnes] = useState(true);
  
  // États pour les éléments de paie détaillés
  const [elements, setElements] = useState([]);
  const [useElements, setUseElements] = useState(false); // Toggle entre calcul auto et éléments manuels

  useEffect(() => {
    loadPersonnes();
  }, []);

  useEffect(() => {
    if (formData.salaire_brut && formData.salaire_brut > 0) {
      handleCalculate();
    }
  }, [formData.salaire_brut, formData.nb_enfants]);

  const loadPersonnes = async () => {
    try {
      setLoadingPersonnes(true);
      
      // Charger tous les enseignants
      const enseignantsResponse = await apiService.getEnseignants();
      const enseignants = enseignantsResponse.results || enseignantsResponse || [];
      
      // Charger tout le personnel PAT
      const patResponse = await apiService.getPersonnelPAT();
      const pat = patResponse.results || patResponse || [];
      
      // Charger tous les contractuels
      const contractuelsResponse = await apiService.getContractuels();
      const contractuels = contractuelsResponse.results || contractuelsResponse || [];
      
      // Combiner toutes les personnes et éliminer les doublons
      const personnesMap = new Map();
      
      // Ajouter les enseignants
      enseignants.forEach(e => {
        const personneId = e.personne?.id || e.id;
        if (personneId && !personnesMap.has(personneId)) {
          personnesMap.set(personneId, {
            id: personneId,
            nom: e.personne?.nom || e.nom,
            prenom: e.personne?.prenom || e.prenom,
            service: e.personne?.service?.nom || e.service?.nom || 'N/A',
            type: 'Enseignant',
            nni: e.personne?.nni || ''
          });
        }
      });
      
      // Ajouter les PAT
      pat.forEach(p => {
        const personneId = p.personne?.id || p.id;
        if (personneId && !personnesMap.has(personneId)) {
          personnesMap.set(personneId, {
            id: personneId,
            nom: p.personne?.nom || p.nom,
            prenom: p.personne?.prenom || p.prenom,
            service: p.personne?.service?.nom || p.service?.nom || 'N/A',
            type: 'PAT',
            nni: p.personne?.nni || '',
            grade: p.grade || '',
            echelon: p.echelon || '',
            indice: p.indice || ''
          });
        }
      });
      
      // Ajouter les contractuels
      contractuels.forEach(c => {
        const personneId = c.personne?.id || c.id;
        if (personneId && !personnesMap.has(personneId)) {
          personnesMap.set(personneId, {
            id: personneId,
            nom: c.personne?.nom || c.nom,
            prenom: c.personne?.prenom || c.prenom,
            service: c.personne?.service?.nom || c.service?.nom || 'N/A',
            type: 'Contractuel',
            nni: c.personne?.nni || '',
            grade: c.grade || '',
            echelon: c.echelon || '',
            indice: c.indice || ''
          });
        }
      });
      
      const allPersonnes = Array.from(personnesMap.values());
      setPersonnes(allPersonnes);
    } catch (err) {
      console.error('Erreur chargement personnes:', err);
      setError('Erreur de chargement des employés');
    } finally {
      setLoadingPersonnes(false);
    }
  };

  const handleCalculate = async () => {
    if (!formData.salaire_brut || formData.salaire_brut <= 0) {
      setCalculResult(null);
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
      console.error('Erreur calcul:', err);
      // Calcul côté client si l'API échoue
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

  // Fonctions pour gérer les éléments de paie
  const addElement = (type) => {
    setElements(prev => [...prev, {
      id: Date.now(),
      code: '',
      libelle: '',
      type_element: type,
      taux: '',
      montant: '',
      date_debut: '',
      date_fin: '',
      ordre: prev.length
    }]);
    setUseElements(true);
  };

  const removeElement = (id) => {
    setElements(prev => prev.filter(el => el.id !== id));
  };

  const updateElement = (id, field, value) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, [field]: value } : el
    ));
  };

  const calculateTotalsFromElements = () => {
    const gains = elements
      .filter(el => el.type_element === 'GAIN' && el.montant)
      .reduce((sum, el) => sum + parseFloat(el.montant || 0), 0);
    
    const retenues = elements
      .filter(el => el.type_element === 'RETENUE' && el.montant)
      .reduce((sum, el) => sum + parseFloat(el.montant || 0), 0);
    
    return {
      total_gains: gains,
      total_retenues: retenues,
      salaire_net: gains - retenues
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.personne) {
      setError('Veuillez sélectionner un employé');
      return;
    }

    // Vérifier si on utilise les éléments détaillés ou le calcul automatique
    if (useElements && elements.length === 0) {
      setError('Veuillez ajouter un élément de paie');
      return;
    }

    if (!useElements) {
      if (!formData.salaire_brut || formData.salaire_brut <= 0) {
        setError('Le salaire brut doit être supérieur à 0');
        return;
      }

      if (!calculResult) {
        setError('Veuillez calculer la paie');
        return;
      }
    } else {
      // Vérifier que tous les éléments ont les champs requis
      const invalidElements = elements.filter(el => !el.code || !el.libelle || !el.montant);
      if (invalidElements.length > 0) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }

    try {
      setLoading(true);
      
      // Vérifier que tous les champs requis sont présents
      if (!formData.personne) {
        setError('Veuillez sélectionner un employé');
        return;
      }
      
      if (!calculResult || !calculResult.salaire_brut || calculResult.salaire_brut <= 0) {
        setError('Veuillez calculer une paie valide');
        return;
      }
      
      let paieData;
      
      if (useElements && elements.length > 0) {
        // Utiliser les éléments détaillés
        const totals = calculateTotalsFromElements();
        paieData = {
          personne: parseInt(formData.personne),
          salaire_brut: totals.total_gains,
          salaire_net: totals.salaire_net,
          nb_enfants: parseInt(formData.nb_enfants) || 0,
          allocations_familiales: 0,
          deductions: totals.total_retenues,
          mois_annee: formData.mois_annee,
          date_paiement: formData.date_paiement,
          statut_paiement: formData.statut_paiement,
          grade: formData.grade || '',
          echelon: formData.echelon || '',
          indice: formData.indice || '',
          mode_reglement: formData.mode_reglement || '',
          compte_bancaire: formData.compte_bancaire || '',
          montant_imposable_mensuel: formData.montant_imposable_mensuel ? parseFloat(formData.montant_imposable_mensuel) : null,
          montant_imposable_progressif: formData.montant_imposable_progressif ? parseFloat(formData.montant_imposable_progressif) : null,
          elements: elements.map((el, index) => ({
            code: el.code,
            libelle: el.libelle,
            type_element: el.type_element,
            taux: el.taux || null,
            montant: parseFloat(el.montant),
            date_debut: el.date_debut || null,
            date_fin: el.date_fin || null,
            ordre: index
          }))
        };
      } else {
        // Utiliser le calcul automatique
        paieData = {
          personne: parseInt(formData.personne),
          salaire_brut: parseFloat(calculResult.salaire_brut).toFixed(2),
          salaire_net: parseFloat(calculResult.salaire_net).toFixed(2),
          nb_enfants: parseInt(formData.nb_enfants) || 0,
          allocations_familiales: parseFloat(calculResult.allocations_familiales || 0).toFixed(2),
          deductions: parseFloat(calculResult.deductions || 0).toFixed(2),
          mois_annee: formData.mois_annee,
          date_paiement: formData.date_paiement,
          statut_paiement: formData.statut_paiement,
          grade: formData.grade || '',
          echelon: formData.echelon || '',
          indice: formData.indice || '',
          mode_reglement: formData.mode_reglement || '',
          compte_bancaire: formData.compte_bancaire || '',
          elements: []
        };
      }
      
      console.log('Données envoyées au backend:', paieData);

      await apiService.createPaie(paieData);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Erreur création paie:', err);
      console.error('Détails de l\'erreur:', err.response?.data);
      
      // Afficher les erreurs de validation détaillées
      if (err.response?.data) {
        const errorData = err.response.data;
        let errorMessage = '';
        
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'object') {
          // Afficher les erreurs de validation par champ
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          errorMessage = fieldErrors || 'Erreur de validation';
        } else {
          errorMessage = 'Erreur lors de la création de la paie';
        }
        
        setError(errorMessage);
      } else {
        setError('Erreur de création de la paie. Vérifiez votre connexion.');
      }
    } finally {
      setLoading(false);
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
              <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
              Retour
            </button>
            
            <div style={{ textAlign: 'left', direction: 'ltr' }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#b91c1c',
                margin: 0
              }}>
                Nouvelle paie
              </h1>
              <p style={{
                color: '#6b7280',
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem'
              }}>
                Créer une nouvelle paie
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
              <span>Paie créée</span>
            </div>
          )}
        </div>

        {/* Formulaire */}
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
                }}>
                  Employé <span style={{ color: '#b91c1c' }}>*</span>
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
                    onChange={(e) => {
                      const personneId = e.target.value;
                      const personne = personnes.find(p => p.id == personneId);
                      setFormData(prev => ({
                        ...prev,
                        personne: personneId,
                        grade: personne?.grade || '',
                        echelon: personne?.echelon || '',
                        indice: personne?.indice || ''
                      }));
                    }}
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
                    onFocus={(e) => {
                      e.target.style.borderColor = '#b91c1c';
                      e.target.style.backgroundColor = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.backgroundColor = '#fafbfc';
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
                }}>
                  Mois <span style={{ color: '#b91c1c' }}>*</span>
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
                }}>
                  Statut <span style={{ color: '#b91c1c' }}>*</span>
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
                  <option value="EN_COURS">En cours</option>
                  <option value="PAYÉ">Payé</option>
                  <option value="SUSPENDU">Suspendu</option>
                  <option value="ANNULÉ">Annulé</option>
                </select>
              </div>
            </div>

            {/* Section calcul */}
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
                {/* Salaire brut */}
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
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#fafbfc',
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
                  />
                </div>

                {/* Nombre d'enfants */}
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

              {/* Informations supplémentaires pour le bulletin */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                {/* Grade */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Grade
                  </label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    placeholder="Ex: INGÉNIEUR DE TRAV DENIE CIVIL ET TECHN E4 G2 3EM"
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

                {/* Échelon */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Échelon
                  </label>
                  <input
                    type="text"
                    name="echelon"
                    value={formData.echelon}
                    onChange={handleChange}
                    placeholder="Ex: 03"
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

                {/* Indice */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Indice
                  </label>
                  <input
                    type="text"
                    name="indice"
                    value={formData.indice}
                    onChange={handleChange}
                    placeholder="Ex: 267"
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

                {/* Compte bancaire */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Compte bancaire
                  </label>
                  <input
                    type="text"
                    name="compte_bancaire"
                    value={formData.compte_bancaire}
                    onChange={handleChange}
                    placeholder="Ex: 04619460101-9"
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

              {/* Résultats du calcul */}
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

                  {/* Détails des déductions */}
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

                  {/* Salaire net */}
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

            {/* Option pour utiliser des éléments détaillés */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Ou créer des éléments de paie détaillés
                  </h3>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Ajoutez manuellement les codes, éléments, taux, retenues et gains
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUseElements(!useElements);
                    if (!useElements) {
                      setCalculResult(null);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: useElements ? '#b91c1c' : '#f3f4f6',
                    color: useElements ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  {useElements ? 'Utiliser calcul auto' : 'Utiliser éléments détaillés'}
                </button>
              </div>

              {useElements && (
                <div>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <button
                      type="button"
                      onClick={() => addElement('GAIN')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#1e3a8a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}
                    >
                      <PlusIcon style={{ width: '1rem', height: '1rem' }} />
                      Ajouter Gain
                    </button>
                    <button
                      type="button"
                      onClick={() => addElement('RETENUE')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#b91c1c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}
                    >
                      <PlusIcon style={{ width: '1rem', height: '1rem' }} />
                      Ajouter Retenue
                    </button>
                  </div>

                  {elements.length === 0 ? (
                    <p style={{
                      color: '#6b7280',
                      textAlign: 'center',
                      padding: '2rem',
                      fontSize: '0.875rem'
                    }}>
                      Aucun élément ajouté. Cliquez sur "Ajouter Gain" ou "Ajouter Retenue" pour commencer.
                    </p>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      {elements.map((element, index) => (
                        <div
                          key={element.id}
                          style={{
                            padding: '1rem',
                            border: `2px solid ${element.type_element === 'GAIN' ? '#1e3a8a' : '#b91c1c'}`,
                            borderRadius: '0.5rem',
                            backgroundColor: element.type_element === 'GAIN' ? '#f8fafc' : '#fef2f2'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.75rem'
                          }}>
                            <h4 style={{
                              fontSize: '0.875rem',
                              fontWeight: '700',
                              color: element.type_element === 'GAIN' ? '#1e3a8a' : '#b91c1c'
                            }}>
                              {element.type_element === 'GAIN' ? 'Gain' : 'Retenue'} #{index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeElement(element.id)}
                              style={{
                                padding: '0.5rem',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                borderRadius: '0.5rem',
                                cursor: 'pointer'
                              }}
                            >
                              <TrashIcon style={{ width: '0.875rem', height: '0.875rem', color: '#b91c1c' }} />
                            </button>
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '0.75rem'
                          }}>
                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginBottom: '0.25rem'
                              }}>
                                Code *
                              </label>
                              <input
                                type="text"
                                value={element.code}
                                onChange={(e) => updateElement(element.id, 'code', e.target.value)}
                                placeholder="Ex: 210"
                                required
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem'
                                }}
                              />
                            </div>

                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginBottom: '0.25rem'
                              }}>
                                Libellé *
                              </label>
                              <input
                                type="text"
                                value={element.libelle}
                                onChange={(e) => updateElement(element.id, 'libelle', e.target.value)}
                                placeholder="Ex: Solde Mensuelle"
                                required
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem'
                                }}
                              />
                            </div>

                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginBottom: '0.25rem'
                              }}>
                                Taux (%)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={element.taux}
                                onChange={(e) => updateElement(element.id, 'taux', e.target.value)}
                                placeholder="Ex: 6.00"
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem'
                                }}
                              />
                            </div>

                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginBottom: '0.25rem'
                              }}>
                                Montant *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={element.montant}
                                onChange={(e) => updateElement(element.id, 'montant', e.target.value)}
                                placeholder="Ex: 2670.0"
                                required
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem'
                                }}
                              />
                            </div>

                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginBottom: '0.25rem'
                              }}>
                                Date début
                              </label>
                              <input
                                type="date"
                                value={element.date_debut}
                                onChange={(e) => updateElement(element.id, 'date_debut', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem'
                                }}
                              />
                            </div>

                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginBottom: '0.25rem'
                              }}>
                                Date fin
                              </label>
                              <input
                                type="date"
                                value={element.date_fin}
                                onChange={(e) => updateElement(element.id, 'date_fin', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Totaux des éléments */}
                  {elements.length > 0 && (() => {
                    const totals = calculateTotalsFromElements();
                    return (
                      <div style={{
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '1rem',
                          fontSize: '0.875rem'
                        }}>
                          <div>
                            <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Total Gains</div>
                            <div style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '1.125rem' }}>
                              {totals.total_gains.toFixed(2)} MRU
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Total Retenues</div>
                            <div style={{ fontWeight: '700', color: '#b91c1c', fontSize: '1.125rem' }}>
                              {totals.total_retenues.toFixed(2)} MRU
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Net à percevoir</div>
                            <div style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '1.125rem' }}>
                              {totals.salaire_net.toFixed(2)} MRU
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
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
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={loading || (!useElements && !calculResult) || (useElements && elements.length === 0)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading || (!useElements && !calculResult) || (useElements && elements.length === 0) ? '#d1d5db' : '#b91c1c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: loading || (!useElements && !calculResult) || (useElements && elements.length === 0) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? 'Création...' : 'Créer la paie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaieForm;
