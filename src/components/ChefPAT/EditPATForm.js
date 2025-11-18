// src/components/ChefPAT/EditPATForm.js - FORMULAIRE ÉDITION PAT (VERSION FINALE CORRIGÉE)
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const EditPATForm = ({ pat, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Données Personne
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    nni: '',
    nationalite: 'Mauritanienne',
    genre: 'MASCULIN',
    situation_familiale: '',
    adresse: '',
    nom_pere: '',
    dernier_diplome: '',
    pays_obtention_diplome: 'Mauritanie',
    annee_obtention_diplome: new Date().getFullYear(),
    specialite_formation: '',
    fonction: '',
    numero_employe: '',
    date_embauche: '',
    // Données PAT
    grade: '',
    poste: 'autre',
    nbi_mac: 0,
    indice: 0,
    anciennete_echelon: '',
    date_changement: '',
    anciennete_grade: '',
    date_nomination: '',
    date_prise_service: ''
  });

  useEffect(() => {
    if (pat) {
      console.log('📝 Chargement des données PAT pour édition:', pat);
      setFormData({
        // Données Personne
        nom: pat.personne?.nom || pat.personne_nom || '',
        prenom: pat.personne?.prenom || pat.personne_prenom || '',
        date_naissance: pat.personne?.date_naissance || '',
        lieu_naissance: pat.personne?.lieu_naissance || '',
        nni: pat.personne?.nni || '',
        nationalite: pat.personne?.nationalite || 'Mauritanienne',
        genre: pat.personne?.genre || 'MASCULIN',
        situation_familiale: pat.personne?.situation_familiale || '',
        adresse: pat.personne?.adresse || '',
        nom_pere: pat.personne?.nom_pere || '',
        dernier_diplome: pat.personne?.dernier_diplome || '',
        pays_obtention_diplome: pat.personne?.pays_obtention_diplome || 'Mauritanie',
        annee_obtention_diplome: pat.personne?.annee_obtention_diplome || new Date().getFullYear(),
        specialite_formation: pat.personne?.specialite_formation || '',
        fonction: pat.personne?.fonction || '',
        numero_employe: pat.personne?.numero_employe || '',
        date_embauche: pat.personne?.date_embauche || '',
        // Données PAT
        grade: pat.grade || '',
        poste: pat.poste || 'autre',
        nbi_mac: pat.nbi_mac || 0,
        indice: pat.indice || 0,
        anciennete_echelon: pat.anciennete_echelon || '',
        date_changement: pat.date_changement || '',
        anciennete_grade: pat.anciennete_grade || '',
        date_nomination: pat.date_nomination || '',
        date_prise_service: pat.date_prise_service || ''
      });
    }
  }, [pat]);

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

      console.log('✏️ Modification agent PAT:', formData);

      // ✅ CORRECTION: Récupération de l'ID correcte
      const patId = pat.id || pat.personne_id || pat.personne?.id;
      
      if (!patId) {
        throw new Error('ID de l\'agent PAT introuvable');
      }

      console.log('🔑 ID de l\'agent PAT:', patId);

      // Structure des données pour l'API
      const patData = {
        personne: {
          nom: formData.nom,
          prenom: formData.prenom,
          date_naissance: formData.date_naissance,
          lieu_naissance: formData.lieu_naissance,
          nni: formData.nni,
          nationalite: formData.nationalite,
          genre: formData.genre,
          situation_familiale: formData.situation_familiale,
          adresse: formData.adresse,
          nom_pere: formData.nom_pere,
          dernier_diplome: formData.dernier_diplome,
          pays_obtention_diplome: formData.pays_obtention_diplome,
          annee_obtention_diplome: parseInt(formData.annee_obtention_diplome) || new Date().getFullYear(),
          specialite_formation: formData.specialite_formation,
          fonction: formData.fonction,
          type_employe: 'pat',
          numero_employe: formData.numero_employe,
          date_embauche: formData.date_embauche
        },
        grade: formData.grade,
        poste: formData.poste,
        nbi_mac: parseInt(formData.nbi_mac) || 0,
        indice: parseInt(formData.indice) || 0,
        anciennete_echelon: formData.anciennete_echelon,
        date_changement: formData.date_changement || null,
        anciennete_grade: formData.anciennete_grade,
        date_nomination: formData.date_nomination || null,
        date_prise_service: formData.date_prise_service
      };

      console.log('📤 Données envoyées à l\'API:', patData);

      // ✅ CORRECTION: Utilisation de la méthode updatePersonnelPAT
      const response = await apiService.updatePersonnelPAT(patId, patData);
      console.log('✅ Agent PAT modifié:', response);

      alert('Agent PAT modifié avec succès');
      onSuccess();
      
    } catch (err) {
      console.error('❌ Erreur modification:', err);
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.message
        || err.message
        || 'Erreur lors de la modification';
      setError(errorMessage);
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
      padding: '2rem',
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* En-tête */}
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
              Modifier Agent PAT
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Section Identité */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #3b82f6'
            }}>
              👤 Informations Personnelles
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
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
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
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
                  Date de naissance *
                </label>
                <input
                  type="date"
                  name="date_naissance"
                  value={formData.date_naissance}
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
                  Lieu de naissance *
                </label>
                <input
                  type="text"
                  name="lieu_naissance"
                  value={formData.lieu_naissance}
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
                  NNI *
                </label>
                <input
                  type="text"
                  name="nni"
                  value={formData.nni}
                  onChange={handleChange}
                  required
                  maxLength="10"
                  pattern="[0-9]{10}"
                  placeholder="10 chiffres"
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
                  Genre *
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="MASCULIN">Masculin</option>
                  <option value="FEMININ">Féminin</option>
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
                  Nationalité
                </label>
                <input
                  type="text"
                  name="nationalite"
                  value={formData.nationalite}
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
                  Situation familiale
                </label>
                <input
                  type="text"
                  name="situation_familiale"
                  value={formData.situation_familiale}
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
                  Nom du père
                </label>
                <input
                  type="text"
                  name="nom_pere"
                  value={formData.nom_pere}
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
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Adresse
              </label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                rows="2"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Section Professionnelle */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #3b82f6'
            }}>
              💼 Informations Professionnelles
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Poste *
                </label>
                <select
                  name="poste"
                  value={formData.poste}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="sg">Secrétaire Général</option>
                  <option value="conseil">Conseil</option>
                  <option value="charge_mission">Chargé de Mission</option>
                  <option value="directeur">Directeur</option>
                  <option value="chef_service">Chef de Service</option>
                  <option value="chef_division">Chef de Division</option>
                  <option value="autre">Autre</option>
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
                  Grade *
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Administrateur Principal"
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
                  Fonction *
                </label>
                <input
                  type="text"
                  name="fonction"
                  value={formData.fonction}
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
                  Numéro employé *
                </label>
                <input
                  type="text"
                  name="numero_employe"
                  value={formData.numero_employe}
                  onChange={handleChange}
                  required
                  placeholder="Ex: PAT2024001"
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
                  Indice *
                </label>
                <input
                  type="number"
                  name="indice"
                  value={formData.indice}
                  onChange={handleChange}
                  required
                  min="0"
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
                  NBI MAC *
                </label>
                <input
                  type="number"
                  name="nbi_mac"
                  value={formData.nbi_mac}
                  onChange={handleChange}
                  required
                  min="0"
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
                  Date embauche *
                </label>
                <input
                  type="date"
                  name="date_embauche"
                  value={formData.date_embauche}
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
                  Date prise service *
                </label>
                <input
                  type="date"
                  name="date_prise_service"
                  value={formData.date_prise_service}
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
                  Date nomination
                </label>
                <input
                  type="date"
                  name="date_nomination"
                  value={formData.date_nomination}
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
                  Ancienneté échelon
                </label>
                <input
                  type="text"
                  name="anciennete_echelon"
                  value={formData.anciennete_echelon}
                  onChange={handleChange}
                  placeholder="Ex: 5 ans"
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
                  Ancienneté grade
                </label>
                <input
                  type="text"
                  name="anciennete_grade"
                  value={formData.anciennete_grade}
                  onChange={handleChange}
                  placeholder="Ex: 10 ans"
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
                  Date changement
                </label>
                <input
                  type="date"
                  name="date_changement"
                  value={formData.date_changement}
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
            </div>
          </div>

          {/* Section Formation */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #3b82f6'
            }}>
              🎓 Formation
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Dernier diplôme
                </label>
                <input
                  type="text"
                  name="dernier_diplome"
                  value={formData.dernier_diplome}
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
                  Spécialité
                </label>
                <input
                  type="text"
                  name="specialite_formation"
                  value={formData.specialite_formation}
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
                  Année obtention
                </label>
                <input
                  type="number"
                  name="annee_obtention_diplome"
                  value={formData.annee_obtention_diplome}
                  onChange={handleChange}
                  min="1950"
                  max={new Date().getFullYear()}
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
                  Pays obtention
                </label>
                <input
                  type="text"
                  name="pays_obtention_diplome"
                  value={formData.pays_obtention_diplome}
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
            </div>
          </div>

          {/* Boutons d'action */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                  Modification en cours...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EditPATForm;