// Traduit automatiquement
// src/components/AdminRH/CreateBulletinForm.js - FORMULAIRE DE CRÉATION DE BULLETIN DE SALAIRE
import React, { useState, useEffect } from 'react';
ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  PrinterIcon,
  cumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const CreateBulletinForm = ({ onCancel, onSuccess }) => {
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personnes, setPersonnes] = useState([]);
  const [loadingPersonnes, setLoadingPersonnes] = useState(true);
  
  // Informations de base
  const [formData, setFormData] = useState({
    personne: '',
    mois_annee: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    date_paiement: new Date().toISOString().split('T')[0],
    statut_paiement: 'EN_COURS',
    grade: '',
    echelon: '',
    indice: '',
    nb_enfants: 0,
    mode_reglement: 'Code 340',
    compte_bancaire: '',
    montant_imposable_mensuel: '',
    montant_imposable_progressif: ''
  });

  // Éléments de paie (gains et retenues)
  const [elements, setElements] = useState([]);

  useEffect(() => {
    loadPersonnes();
  }, []);

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
          type: 'Enseignant',
          grade: e.grade || '',
          echelon: e.echelon || '',
          indice: e.indice || '',
          nni: e.personne?.nni || ''
        })),
        ...pat.map(p => ({
          id: p.personne?.id || p.id,
          nom: p.personne?.nom || p.nom,
          prenom: p.personne?.prenom || p.prenom,
          service: p.personne?.service?.nom || p.service?.nom || 'N/A',
          type: 'PAT',
          grade: p.grade || '',
          echelon: p.echelon || '',
          indice: p.indice || '',
          nni: p.personne?.nni || ''
        })),
        ...contractuels.map(c => ({
          id: c.personne?.id || c.id,
          nom: c.personne?.nom || c.nom,
          prenom: c.personne?.prenom || c.prenom,
          service: c.personne?.service?.nom || c.service?.nom || 'N/A',
          type: 'Contractuel',
          nni: c.personne?.nni || ''
        }))
      ];
      
      setPersonnes(allPersonnes);
    } catch (err) {
      console.error('Erreur chargement personnes:', err);
      setError(t('common.erreurChargement') + ' des employés');
    } finally {
      setLoadingPersonnes(false);
    }
  };

  const handlePersonneChange = (e) => {
    const personneId = e.target.value;
    const personne = personnes.find(p => p.id == personneId);
    
    setFormData(prev => ({
      ...prev,
      personne: personneId,
      grade: personne?.grade || '',
      echelon: personne?.echelon || '',
      indice: personne?.indice || ''
    }));
  };

  // Calculer les montants imposables automatiquement
  useEffect(() => {
    const totals = calculateTotals();
    if (totals.total_gains > 0) {
      // Calcul simplifié des montants imposables
      const montantImposable = totals.total_gains - totals.total_retenues;
      setFormData(prev => ({
        ...prev,
        montant_imposable_mensuel: montantImposable > 0 ? montantImposable.toFixed(3) : '',
        montant_imposable_progressif: montantImposable > 0 ? montantImposable.toFixed(3) : ''
      }));
    }
  }, [elements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
  };

  const removeElement = (id) => {
    setElements(prev => prev.filter(el => el.id !== id));
  };

  const updateElement = (id, field, value) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, [field]: value } : el
    ));
  };

  const calculateTotals = () => {
    const gains = elements
      .filter(el => el.type_element === 'GAIN' && el.montant)
      .reduce((sum, el) => sum + parseFloat(el.montant || 0), 0);
    
    const retenues = elements
      .filter(el => el.type_element === 'RETENUE` && el.montant)
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

    if (!formData.personne) {
      setError(t('common.veuillezSelectionnerEmploye') + ' un employé');
      return;
    }

    if (elements.length === 0) {
      setError('Veuillez ajouter au moins un élément de paie');
      return;
    }

    const totals = calculateTotals();

    try {
      setLoading(true);
      
      // Créer la paie avec les éléments
      const paieData = {
        personne: formData.personne,
        mois_annee: formData.mois_annee,
        date_paiement: formData.date_paiement,
        statut_paiement: formData.statut_paiement,
        salaire_brut: totals.total_gains,
        salaire_net: totals.salaire_net,
        deductions: totals.total_retenues,
        nb_enfants: parseInt(formData.nb_enfants) || 0,
        allocations_familiales: 0,
        grade: formData.grade,
        echelon: formData.echelon,
        indice: formData.indice,
        mode_reglement: formData.mode_reglement,
        compte_bancaire: formData.compte_bancaire,
        montant_imposable_mensuel: formData.montant_imposable_mensuel ? parseFloat(formData.montant_imposable_mensuel) : null,
        montant_imposable_progressif: formData.montant_imposable_progressif ? parseFloat(formData.montant_imposable_progressif) : null,
        elements: elements.map((el, index) => ({
          code: el.code,
          libelle: el.libelle,
          type_element: el.type_element,
          taux: el.taux || null,
          montant: el.montant,
          date_debut: el.date_debut || null,
          date_fin: el.date_fin || null,
          ordre: index
        }))
      };

      const response = await apiService.createPaie(paieData);
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      console.error('Erreur création bulletin:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || `${t('common.erreurCreationPaie')} du bulletin`);
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* En-tête */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
                Créer un Bulletin de Salaire
              </h1>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Remplissez tous les champs pour générer le bulletin officiel
              </p>
            </div>
            <button
              onClick={onCancel}
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <ArrowLeftIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#b91c1c'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Informations de base */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Informations de Base
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Employé *
                </label>
                <select
                  name="personne"
                  value={formData.personne}
                  onChange={handlePersonneChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Sélectionner un employé</option>
                  {personnes.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.prenom} {p.nom} - {p.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Mois/Année *
                </label>
                <input
                  type="month"
                  name="mois_annee"
                  value={formData.mois_annee}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Date de paiement *
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
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
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
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
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
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
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
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Nombre d'enfants
                </label>
                <input
                  type="number"
                  name="nb_enfants"
                  value={formData.nb_enfants}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  NNI (Numéro National d'Identification)
                </label>
                <input
                  type="text"
                  name="nni"
                  value={personnes.find(p => p.id == formData.personne)?.nni || ''}
                  readOnly
                  placeholder="Rempli automatiquement"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Mode de règlement
                </label>
                <input
                  type="text"
                  name="mode_reglement"
                  value={formData.mode_reglement}
                  onChange={handleChange}
                  placeholder="Ex: Code 340"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Compte bancaire
                </label>
                <input
                  type="text"
                  name="compte_bancaire"
                  value={formData.compte_bancaire}
                  onChange={handleChange}
                  placeholder="Ex: Banque Maurit. Commer. Int. N° Compte 04619460101-9"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Éléments de paie */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                Éléments de Paie
              </h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
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
                    fontWeight: '600'
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
                    fontWeight: '600'
                  }}
                >
                  <PlusIcon style={{ width: '1rem', height: '1rem' }} />
                  Ajouter Retenue
                </button>
              </div>
            </div>

            {elements.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                Aucun élément ajouté. Cliquez sur "Ajouter Gain" ou "Ajouter Retenue" pour commencer.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    style={{
                      padding: '1.5rem',
                      border: `2px solid ${element.type_element === 'GAIN' ? '#1e3a8a' : '#b91c1c'}`,
                      borderRadius: '0.75rem',
                      backgroundColor: element.type_element === 'GAIN' ? '#f8fafc' : '#fef2f2'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: element.type_element === 'GAIN' ? '#1e3a8a' : '#b91c1c' }}>
                        {element.type_element === 'GAIN' ? 'Gain' : 'Retenue'} #{index + 1}
                      </h3>
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
                        <TrashIcon style={{ width: '1rem', height: '1rem', color: '#b91c1c' }} />
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
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
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '1rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          Libellé *
                        </label>
                        <input
                          type="text"
                          value={element.libelle}
                          onChange={(e) => updateElement(element.id, 'libelle', e.target.value)}
                          placeholder="Ex: Solde Mensuelle Indiciare Tit."
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '1rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
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
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '1rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
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
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '1rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          Date début
                        </label>
                        <input
                          type="date"
                          value={element.date_debut}
                          onChange={(e) => updateElement(element.id, 'date_debut', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '1rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          Date fin
                        </label>
                        <input
                          type="date"
                          value={element.date_fin}
                          onChange={(e) => updateElement(element.id, 'date_fin', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Totaux */}
            {elements.length > 0 && (
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Gains</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a' }}>
                      {totals.total_gains.toFixed(2)} MRU
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Retenues</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#b91c1c' }}>
                      {totals.total_retenues.toFixed(2)} MRU
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Net à percevoir</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a' }}>
                      {totals.salaire_net.toFixed(2)} MRU
                    </div>
                  </div>
                </div>
                {formData.montant_imposable_mensuel && (
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Montants Imposables (calculés automatiquement)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                      <div>
                        <span style={{ color: '#6b7280' }}>Mensuel: </span>
                        <span style={{ fontWeight: '600', color: '#374151' }}>{formData.montant_imposable_mensuel} MRU</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>Progressif: </span>
                        <span style={{ fontWeight: '600', color: '#374151' }}>{formData.montant_imposable_progressif} MRU</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >{t('common.annuler')}</button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: loading ? '#9ca3af' : '#1e3a8a',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
            >
              {loading ? 'Création...' : 'Créer le Bulletin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBulletinForm;

