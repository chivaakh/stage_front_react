import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const EditEnseignantForm = ({ enseignantId, onCancel, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // État du formulaire (conservé identique)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    nni: '',
    nationalite: 'Mauritanienne',
    genre: 'MASCULIN',
    situation_familiale: 'Célibataire',
    adresse: '',
    nom_pere: '',
    dernier_diplome: '',
    pays_obtention_diplome: 'Mauritanie',
    annee_obtention_diplome: new Date().getFullYear(),
    specialite_formation: '',
    fonction: '',
    numero_employe: '',
    date_embauche: '',
    corps: '',
    grade: 'assistant',
    echelon: '1',
    indice: 100,
    date_entree_service_publique: '',
    date_entree_enseignement_superieur: '',
    date_fin_service_obligatoire: ''
  });

  // Charger les données de l'enseignant à modifier (fonctionnalité conservée)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const servicesResponse = await apiService.get('/services/');
        setServices(servicesResponse.data.results || servicesResponse.data || []);

        const enseignantResponse = await apiService.get(`/enseignants/${enseignantId}/`);
        const enseignant = enseignantResponse.data;

        setFormData({
          nom: enseignant.personne?.nom || '',
          prenom: enseignant.personne?.prenom || '',
          date_naissance: enseignant.personne?.date_naissance || '',
          lieu_naissance: enseignant.personne?.lieu_naissance || '',
          nni: enseignant.personne?.nni || '',
          nationalite: enseignant.personne?.nationalite || 'Mauritanienne',
          genre: enseignant.personne?.genre || 'MASCULIN',
          situation_familiale: enseignant.personne?.situation_familiale || 'Célibataire',
          adresse: enseignant.personne?.adresse || '',
          nom_pere: enseignant.personne?.nom_pere || '',
          dernier_diplome: enseignant.personne?.dernier_diplome || '',
          pays_obtention_diplome: enseignant.personne?.pays_obtention_diplome || 'Mauritanie',
          annee_obtention_diplome: enseignant.personne?.annee_obtention_diplome || new Date().getFullYear(),
          specialite_formation: enseignant.personne?.specialite_formation || '',
          fonction: enseignant.personne?.fonction || '',
          numero_employe: enseignant.personne?.numero_employe || '',
          date_embauche: enseignant.personne?.date_embauche || '',
          corps: enseignant.corps || '',
          grade: enseignant.grade || 'assistant',
          echelon: enseignant.echelon || '1',
          indice: enseignant.indice || 100,
          date_entree_service_publique: enseignant.date_entree_service_publique || '',
          date_entree_enseignement_superieur: enseignant.date_entree_enseignement_superieur || '',
          date_fin_service_obligatoire: enseignant.date_fin_service_obligatoire || ''
        });

      } catch (err) {
        console.error('❌ Erreur chargement données:', err);
        setError(err.response?.data?.detail || 'Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    if (enseignantId) {
      fetchData();
    }
  }, [enseignantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validation des étapes
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.nom && formData.prenom && formData.nni;
      case 2:
        return formData.fonction && formData.numero_employe && formData.date_embauche;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Soumettre les modifications (fonctionnalité conservée)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (!formData.nom || !formData.prenom || !formData.nni) {
        throw new Error('Les champs Nom, Prénom et NNI sont obligatoires');
      }

      const personneData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        date_naissance: formData.date_naissance,
        lieu_naissance: formData.lieu_naissance || 'Non spécifié',
        nni: formData.nni.trim(),
        nationalite: formData.nationalite,
        genre: formData.genre,
        situation_familiale: formData.situation_familiale,
        adresse: formData.adresse || 'Non spécifiée',
        nom_pere: formData.nom_pere || 'Non spécifié',
        dernier_diplome: formData.dernier_diplome || 'Non spécifié',
        pays_obtention_diplome: formData.pays_obtention_diplome,
        annee_obtention_diplome: parseInt(formData.annee_obtention_diplome),
        specialite_formation: formData.specialite_formation || 'Non spécifiée',
        fonction: formData.fonction.trim() || 'Enseignant',
        numero_employe: formData.numero_employe.trim(),
        date_embauche: formData.date_embauche
      };

      const enseignantResponse = await apiService.get(`/enseignants/${enseignantId}/`);
      const personneId = enseignantResponse.data.personne;

      await apiService.put(`/personnes/${personneId}/`, personneData);

      const enseignantData = {
        corps: formData.corps.trim() || 'Enseignant-Chercheur',
        grade: formData.grade,
        echelon: formData.echelon || '1',
        indice: parseInt(formData.indice) || 100,
        date_entree_service_publique: formData.date_entree_service_publique || formData.date_embauche,
        date_entree_enseignement_superieur: formData.date_entree_enseignement_superieur || formData.date_embauche,
        date_fin_service_obligatoire: formData.date_fin_service_obligatoire || (() => {
          const dateNaissance = new Date(formData.date_naissance);
          const finService = new Date(dateNaissance);
          finService.setFullYear(dateNaissance.getFullYear() + 65);
          return finService.toISOString().split('T')[0];
        })()
      };

      await apiService.put(`/enseignants/${enseignantId}/`, enseignantData);

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('❌ Erreur modification enseignant:', err);
      
      let errorMessage = 'Erreur lors de la modification';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          const errors = [];
          for (const [field, messages] of Object.entries(err.response.data)) {
            if (Array.isArray(messages)) {
              errors.push(`${field}: ${messages.join(', ')}`);
            } else {
              errors.push(`${field}: ${messages}`);
            }
          }
          errorMessage = errors.join('\n');
        } else {
          errorMessage = err.response.data.detail || err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Indicateur de progression style mauritanien
  const ProgressIndicator = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {[1, 2, 3].map((step) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: '2px solid',
            ...(step <= currentStep
              ? {
                  backgroundColor: '#059669',
                  borderColor: '#059669',
                  color: 'white'
                }
              : {
                  backgroundColor: 'white',
                  borderColor: '#e5e7eb',
                  color: '#9ca3af'
                })
          }}>
            {step < currentStep ? (
              <CheckIcon style={{ width: '1rem', height: '1rem' }} />
            ) : (
              step
            )}
          </div>
          {step < 3 && (
            <div style={{
              width: '3rem',
              height: '2px',
              backgroundColor: step < currentStep ? '#059669' : '#e5e7eb'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  if (isLoading) {
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
        zIndex: 1000
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
            Chargement des données
          </h3>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Récupération des informations...
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
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '95vh',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        {/* En-tête style mauritanien */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <button
              onClick={onCancel}
              disabled={isSaving}
              style={{
                padding: '0.75rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                cursor: isSaving ? 'not-allowed' : 'pointer',
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
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#059669',
                margin: 0
              }}>
                Modifier l'Enseignant
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0.25rem 0 0 0'
              }}>
                Mettre à jour les informations de {formData.prenom} {formData.nom}
              </p>
            </div>
          </div>
          
          <ProgressIndicator />
        </div>

        {/* Contenu du formulaire */}
        <div style={{
          padding: '2rem',
          maxHeight: 'calc(95vh - 200px)',
          overflow: 'auto'
        }}>
          {error && (
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <ExclamationTriangleIcon style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: '#d97706'
                }} />
                <h4 style={{
                  color: '#d97706',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Erreur de validation
                </h4>
              </div>
              <pre style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#92400e',
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit'
              }}>
                {error}
              </pre>
            </div>
          )}

          {/* Configuration des étapes */}
          {(() => {
            const stepConfig = {
              1: {
                title: 'Informations Personnelles',
                subtitle: 'Données personnelles de l\'enseignant',
                icon: UserIcon,
                color: '#059669'
              },
              2: {
                title: 'Informations Professionnelles', 
                subtitle: 'Détails du poste et embauche',
                icon: BuildingOfficeIcon,
                color: '#059669'
              },
              3: {
                title: 'Formation et Grade',
                subtitle: 'Qualifications et statut académique',
                icon: AcademicCapIcon,
                color: '#059669'
              }
            };

            const currentStepConfig = stepConfig[currentStep];

            return (
              <div>
                {/* Header de l'étape courante */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    border: '1px solid #bbf7d0'
                  }}>
                    <currentStepConfig.icon style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      color: currentStepConfig.color
                    }} />
                    <div style={{ textAlign: 'left' }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: currentStepConfig.color,
                        margin: '0 0 0.25rem 0'
                      }}>
                        {currentStepConfig.title}
                      </h3>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        {currentStepConfig.subtitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulaire par étapes */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: '1px solid #f3f4f6'
                }}>
                  {/* Étape 1: Informations Personnelles */}
                  {currentStep === 1 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          required
                          disabled={isSaving}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          required
                          disabled={isSaving}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                          Date de naissance *
                        </label>
                        <input
                          type="date"
                          name="date_naissance"
                          value={formData.date_naissance}
                          onChange={handleInputChange}
                          required
                          disabled={isSaving}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                          NNI *
                        </label>
                        <input
                          type="text"
                          name="nni"
                          value={formData.nni}
                          onChange={handleInputChange}
                          required
                          disabled={isSaving}
                          placeholder="10 chiffres"
                          maxLength="10"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                          Genre *
                        </label>
                        <select
                          name="genre"
                          value={formData.genre}
                          onChange={handleInputChange}
                          required
                          disabled={isSaving}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        >
                          <option value="MASCULIN">Masculin</option>
                          <option value="FEMININ">Féminin</option>
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          Nationalité
                        </label>
                        <input
                          type="text"
                          name="nationalite"
                          value={formData.nationalite}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Informations Professionnelles */}
                  {currentStep === 2 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          Fonction *
                        </label>
                        <input
                          type="text"
                          name="fonction"
                          value={formData.fonction}
                          onChange={handleInputChange}
                          required
                          disabled={isSaving}
                          placeholder="Ex: Enseignant en Mathématiques"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                          Numéro employé *
                        </label>
                        <input
                          type="text"
                          name="numero_employe"
                          value={formData.numero_employe}
                          onChange={handleInputChange}
                          required
                          disabled={isSaving}
                          placeholder="Ex: ENS2024001"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                          Date d'embauche *
                        </label>
                        <input
                          type="date"
                          name="date_embauche"
                          value={formData.date_embauche}
                          onChange={handleInputChange}
                          required
                          disabled={isSaving}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                    </div>
                  )}

                  {/* Étape 3: Formation et Grade */}
                  {currentStep === 3 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          Corps
                        </label>
                        <input
                          type="text"
                          name="corps"
                          value={formData.corps}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          placeholder="Ex: Enseignant-Chercheur"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                          Grade *
                        </label>
                        <select
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          required
                          disabled={isSaving}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        >
                          <option value="assistant">Assistant</option>
                          <option value="maitre_assistant">Maître Assistant</option>
                          <option value="professeur">Professeur</option>
                          <option value="docteur">Docteur</option>
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.5rem'
                        }}>
                          Dernier diplôme
                        </label>
                        <input
                          type="text"
                          name="dernier_diplome"
                          value={formData.dernier_diplome}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          placeholder="Ex: Doctorat en Mathématiques"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                          Spécialité formation
                        </label>
                        <input
                          type="text"
                          name="specialite_formation"
                          value={formData.specialite_formation}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          placeholder="Ex: Mathématiques Appliquées"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            backgroundColor: isSaving ? '#f9fafb' : 'white',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#059669'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Boutons de navigation */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '2rem',
                  borderTop: '1px solid #e5e7eb',
                  marginTop: '2rem'
                }}>
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={isSaving}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: isSaving ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
                        Précédent
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      Étape {currentStep} sur {totalSteps}
                    </span>

                    {currentStep < totalSteps ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep(currentStep) || isSaving}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: validateStep(currentStep) && !isSaving ? '#059669' : '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: validateStep(currentStep) && !isSaving ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        Suivant
                        <ArrowLeftIcon style={{
                          width: '1rem',
                          height: '1rem',
                          transform: 'rotate(180deg)'
                        }} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        style={{
                          padding: '0.75rem 2rem',
                          backgroundColor: isSaving ? '#9ca3af' : '#059669',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: isSaving ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {isSaving ? (
                          <>
                            <div style={{
                              width: '1rem',
                              height: '1rem',
                              border: '2px solid transparent',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }} />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <CheckIcon style={{ width: '1rem', height: '1rem' }} />
                            Enregistrer les modifications
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
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

export default EditEnseignantForm;