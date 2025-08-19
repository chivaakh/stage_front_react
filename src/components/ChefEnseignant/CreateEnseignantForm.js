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
  ExclamationTriangleIcon,
  SparklesIcon,
  IdentificationIcon,
  GlobeAltIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const CreateEnseignantForm = ({ onCancel, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // État du formulaire (conservé identique)
  const [formData, setFormData] = useState({
    // Informations personnelles
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
    
    // Formation
    dernier_diplome: '',
    pays_obtention_diplome: 'Mauritanie',
    annee_obtention_diplome: new Date().getFullYear(),
    specialite_formation: '',
    
    // Informations professionnelles
    fonction: '',
    numero_employe: '',
    date_embauche: '',
    
    // Informations spécifiques enseignant
    corps: '',
    grade: 'assistant',
    echelon: '1',
    indice: 100,
    date_entree_service_publique: '',
    date_entree_enseignement_superieur: '',
    date_fin_service_obligatoire: ''
  });

  // Charger les services (fonctionnalité conservée)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiService.get('/services/');
        setServices(response.data.results || response.data || []);
      } catch (err) {
        console.error('Erreur chargement services:', err);
      }
    };
    fetchServices();
  }, []);

  // Obtenir le service du chef connecté (conservé)
  const getChefService = () => {
    if (user?.service?.id) {
      return user.service.id;
    }
    
    const serviceEnseignant = services.find(s => s.type_service === 'enseignant');
    if (serviceEnseignant) {
      return serviceEnseignant.id;
    }
    
    return services.length > 0 ? services[0].id : null;
  };

  // Gérer les changements de formulaire (conservé)
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
        return formData.nom && formData.prenom && formData.nni && formData.date_naissance;
      case 2:
        return formData.fonction && formData.numero_employe && formData.date_embauche;
      case 3:
        return true; // Étape formation/enseignant (optionnelle)
      default:
        return false;
    }
  };

  // Navigation entre étapes
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

  // Soumettre le formulaire (fonctionnalité conservée)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Vérifier les champs obligatoires
      if (!formData.nom || !formData.prenom || !formData.nni) {
        throw new Error('Les champs Nom, Prénom et NNI sont obligatoires');
      }

      const serviceId = getChefService();
      if (!serviceId) {
        throw new Error('Aucun service trouvé. Contactez l\'administrateur.');
      }

      // 1. Créer d'abord la personne
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
        type_employe: 'enseignant',
        numero_employe: formData.numero_employe.trim(),
        date_embauche: formData.date_embauche,
        service: serviceId,
        statut_actif: true
      };

      const personneResponse = await apiService.post('/personnes/', personneData);

      // 2. Créer l'enseignant lié à cette personne
      const enseignantData = {
        personne_id: personneResponse.data.id,
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

      await apiService.post('/enseignants/', enseignantData);

      // Succès !
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('❌ Erreur création enseignant:', err);
      
      let errorMessage = 'Erreur lors de la création';
      
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
      setIsLoading(false);
    }
  };

  // Indicateur de progression
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
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: '700',
            transition: 'all 0.3s',
            ...(step <= currentStep
              ? {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                }
              : {
                  background: '#e2e8f0',
                  color: '#64748b'
                })
          }}>
            {step < currentStep ? (
              <CheckIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            ) : (
              step
            )}
          </div>
          {step < 3 && (
            <div style={{
              width: '3rem',
              height: '2px',
              background: step < currentStep
                ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                : '#e2e8f0',
              transition: 'all 0.3s'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  // Configuration des étapes
  const stepConfig = {
    1: {
      title: 'Informations Personnelles',
      subtitle: 'Données personnelles de l\'enseignant',
      icon: UserIcon,
      color: '#3b82f6'
    },
    2: {
      title: 'Informations Professionnelles',
      subtitle: 'Détails du poste et de l\'embauche',
      icon: BriefcaseIcon,
      color: '#059669'
    },
    3: {
      title: 'Formation et Grade',
      subtitle: 'Qualifications et statut académique',
      icon: AcademicCapIcon,
      color: '#7c3aed'
    }
  };

  const currentStepConfig = stepConfig[currentStep];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '95vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        {/* En-tête moderne */}
        <div style={{
          background: `linear-gradient(135deg, ${currentStepConfig.color} 0%, ${currentStepConfig.color}dd 100%)`,
          color: 'white',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Motif décoratif */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(50px, -50px)'
          }}></div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <button
              onClick={onCancel}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '0.75rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <ArrowLeftIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
            
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.5rem'
              }}>
                <currentStepConfig.icon style={{
                  width: '2rem',
                  height: '2rem',
                  color: 'white'
                }} />
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  margin: 0,
                  letterSpacing: '-0.025em'
                }}>
                  Créer un Nouvel Enseignant
                </h2>
              </div>
              <p style={{
                margin: 0,
                opacity: 0.9,
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Service: {user?.service?.nom || services.find(s => s.type_service === 'enseignant')?.nom || 'Service Enseignant'}
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '1rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '0.25rem'
              }}>
                {currentStep}/{totalSteps}
              </div>
              <div style={{
                fontSize: '0.75rem',
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Étapes
              </div>
            </div>
          </div>
        </div>

        {/* Contenu du formulaire */}
        <div style={{
          padding: '2rem',
          maxHeight: 'calc(95vh - 200px)',
          overflow: 'auto'
        }}>
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              color: '#dc2626',
              padding: '1.5rem',
              borderRadius: '16px',
              marginBottom: '2rem',
              border: '1px solid #f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <ExclamationTriangleIcon style={{
                width: '1.5rem',
                height: '1.5rem',
                flexShrink: 0
              }} />
              <div>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  fontWeight: '600'
                }}>
                  Erreur de validation
                </h4>
                <pre style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit'
                }}>
                  {error}
                </pre>
              </div>
            </div>
          )}

          <ProgressIndicator />

          {/* Header de l'étape courante */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: `${currentStepConfig.color}15`,
              borderRadius: '16px',
              padding: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
              border: `1px solid ${currentStepConfig.color}30`
            }}>
              <currentStepConfig.icon style={{
                width: '1.5rem',
                height: '1.5rem',
                color: currentStepConfig.color
              }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: currentStepConfig.color,
                margin: 0
              }}>
                {currentStepConfig.title}
              </h3>
            </div>
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              margin: 0
            }}>
              {currentStepConfig.subtitle}
            </p>
          </div>

          {/* Formulaire par étapes */}
          <div style={{
            background: '#fafbfc',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid #e2e8f0'
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
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    Lieu de naissance
                  </label>
                  <input
                    type="text"
                    name="lieu_naissance"
                    value={formData.lieu_naissance}
                    onChange={handleInputChange}
                    placeholder="Ville de naissance"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    onChange={handleInputChange}
                    required
                    placeholder="10 chiffres"
                    maxLength="10"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                  <select
                    name="situation_familiale"
                    value={formData.situation_familiale}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="Célibataire">Célibataire</option>
                    <option value="Marié(e)">Marié(e)</option>
                    <option value="Divorcé(e)">Divorcé(e)</option>
                    <option value="Veuf(ve)">Veuf(ve)</option>
                  </select>
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
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Enseignant en Mathématiques"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#059669';
                      e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: ENS2024001"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#059669';
                      e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    Date d'embauche *
                  </label>
                  <input
                    type="date"
                    name="date_embauche"
                    value={formData.date_embauche}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#059669';
                      e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    placeholder="Adresse complète"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#059669';
                      e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    onChange={handleInputChange}
                    placeholder="Nom complet du père"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#059669';
                      e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
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
                    fontWeight: '600',
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
                    placeholder="Ex: Enseignant-Chercheur"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    Grade *
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
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
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Échelon
                  </label>
                  <input
                    type="number"
                    name="echelon"
                    value={formData.echelon}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    Indice
                  </label>
                  <input
                    type="number"
                    name="indice"
                    value={formData.indice}
                    onChange={handleInputChange}
                    min="100"
                    max="1000"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    Dernier diplôme
                  </label>
                  <input
                    type="text"
                    name="dernier_diplome"
                    value={formData.dernier_diplome}
                    onChange={handleInputChange}
                    placeholder="Ex: Doctorat en Mathématiques"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    Spécialité formation
                  </label>
                  <input
                    type="text"
                    name="specialite_formation"
                    value={formData.specialite_formation}
                    onChange={handleInputChange}
                    placeholder="Ex: Mathématiques Appliquées"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    Date entrée enseignement supérieur
                  </label>
                  <input
                    type="date"
                    name="date_entree_enseignement_superieur"
                    value={formData.date_entree_enseignement_superieur}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
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
                    Année obtention diplôme
                  </label>
                  <input
                    type="number"
                    name="annee_obtention_diplome"
                    value={formData.annee_obtention_diplome}
                    onChange={handleInputChange}
                    min="1950"
                    max={new Date().getFullYear()}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
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
            borderTop: '2px solid #f1f5f9',
            marginTop: '2rem'
          }}>
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(100, 116, 139, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 15px -3px rgba(100, 116, 139, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(100, 116, 139, 0.3)';
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
                color: '#64748b',
                fontWeight: '500'
              }}>
                Étape {currentStep} sur {totalSteps}
              </span>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: validateStep(currentStep)
                      ? `linear-gradient(135deg, ${currentStepConfig.color} 0%, ${currentStepConfig.color}dd 100%)`
                      : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: validateStep(currentStep) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: validateStep(currentStep)
                      ? `0 4px 6px -1px ${currentStepConfig.color}40`
                      : '0 4px 6px -1px rgba(156, 163, 175, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (validateStep(currentStep)) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 8px 15px -3px ${currentStepConfig.color}60`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (validateStep(currentStep)) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = `0 4px 6px -1px ${currentStepConfig.color}40`;
                    }
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
                  disabled={isLoading}
                  style={{
                    padding: '0.75rem 2rem',
                    background: isLoading
                      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                      : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: isLoading
                      ? '0 4px 6px -1px rgba(156, 163, 175, 0.3)'
                      : '0 4px 6px -1px rgba(5, 150, 105, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 15px -3px rgba(5, 150, 105, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(5, 150, 105, 0.3)';
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Création...
                    </>
                  ) : (
                    <>
                      <SparklesIcon style={{ width: '1rem', height: '1rem' }} />
                      Créer Enseignant
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
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

export default CreateEnseignantForm;