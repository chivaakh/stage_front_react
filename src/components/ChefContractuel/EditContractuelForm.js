// Traduit automatiquement
// src/components/ChefContractuel/EditContractuelForm.js - FORMULAIRE ÉDITION CONTRACTUEL
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
const EditContractuelForm = ({ contractuel, 
onClose, onSuccess }) => {
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    fonction: '',
    type_contrat: 'CDD',
    duree_contrat: '',
    date_debut_contrat: '',
    date_fin_contrat: '',
    salaire_mensuel: ''
  });

  useEffect(() => {
    if (contractuel) {
      console.log('📝 Chargement des données contractuel pour édition:', contractuel);
      const personne = contractuel.personne || {};
      setFormData({
        nom: personne.nom || contractuel.personne_nom || '',
        prenom: personne.prenom || contractuel.personne_prenom || '',
        fonction: personne.fonction || '',
        type_contrat: contractuel.type_contrat || 'CDD',
        duree_contrat: contractuel.duree_contrat || '',
        date_debut_contrat: contractuel.date_debut_contrat || '',
        date_fin_contrat: contractuel.date_fin_contrat || '',
        salaire_mensuel: contractuel.salaire_mensuel || ''
      });
    }
}, [contractuel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const contractuelId = contractuel.id || contractuel.personne_id || contractuel.personne?.id;
      
      if (!contractuelId) {
        throw new Error('ID du contractuel introuvable');
      }

      const updateData = {
        type_contrat: formData.type_contrat,
        duree_contrat: formData.duree_contrat,
        date_debut_contrat: formData.date_debut_contrat,
        date_fin_contrat: formData.date_fin_contrat || null,
        salaire_mensuel: formData.salaire_mensuel ? parseFloat(formData.salaire_mensuel) : null
      };

      await apiService.updateContractuel(contractuelId, updateData);
      console.log('✅ Contractuel modifié');

      alert('Contractuel modifié' + t('common.succes'));
      onSuccess();
      
    } catch (err) {
      console.error('❌ Erreur modification:', err);
      setError(err.response?.data?.detail || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  return (
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
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '2rem',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '2rem' }}>✏️</span>
              Modifier Contractuel
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                fontSize: '1.25rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: '0 0 1rem 0'
            }}>
              Modification de : <strong>{formData.prenom} {formData.nom}</strong>
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Type de contrat *
              </label>
              <select
                name="type_contrat"
                value={formData.type_contrat}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="CDD">CDD</option>
                <option value="CDI">CDI</option>
                <option value="CONSULTANT">Consultant</option>
                <option value="STAGE">Stage</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Durée du contrat
              </label>
              <input
                type="text"
                name="duree_contrat"
                value={formData.duree_contrat}
                onChange={handleChange}
                placeholder="Ex: 6 mois, 1 an"
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
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Date de début *
              </label>
              <input
                type="date"
                name="date_debut_contrat"
                value={formData.date_debut_contrat}
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
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Date de fin
              </label>
              <input
                type="date"
                name="date_fin_contrat"
                value={formData.date_fin_contrat}
                onChange={handleChange}
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
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Salaire mensuel (MRU)
              </label>
              <input
                type="number"
                name="salaire_mensuel"
                value={formData.salaire_mensuel}
                onChange={handleChange}
                min="0"
                step="0.01"
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

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
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
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#9ca3af' : '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
            >
              {loading ? 'Modification...' : t('common.enregistrer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContractuelForm;

