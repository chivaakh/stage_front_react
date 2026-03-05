// Traduit automatiquement
// src/components/Employe/OnboardingEmploye.js - FORMULAIRE D'ONBOARDING POUR EMPLOYÉ
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarDaysIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const OnboardingEmploye = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

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
    telephone: '',
    
    // Informations académiques
    dernier_diplome: '',
    pays_obtention_diplome: 'Mauritanie',
    annee_obtention_diplome: new Date().getFullYear(),
    specialite_formation: '',
    
    // Informations professionnelles
    fonction: '',
    type_employe: 'pat',
    numero_employe: '',
    date_embauche: '',
    service: '',
    
    // Informations de connexion
    email: user?.email || ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      // Utiliser l'endpoint spécifique pour l'onboarding
      const response = await apiService.get('/services/pour_onboarding/');
      const servicesData = response.data.results || response.data || [];
      setServices(servicesData);
      console.log('✅ Services chargés pour onboarding:', servicesData);
    } catch (err) {
      console.error('❌ Erreur chargement services:', err);
      // En cas d'erreur, essayer l'endpoint standard
      try {
        const response = await apiService.getServices();
        const servicesData = response.results || response || [];
        setServices(servicesData);
      } catch (err2) {
        console.error('❌ Erreur chargement services (fallback):', err2);
        setError('Impossible de charger la liste des services. Veuillez contacter l\'administrateur.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (stepNum) => {
    const errors = [];
    
    if (stepNum === 1) {
      if (!formData.nom) errors.push('Le nom est requis');
      if (!formData.prenom) errors.push('Le prénom est requis');
      if (!formData.date_naissance) errors.push('La date de naissance est requise');
      if (!formData.lieu_naissance) errors.push('Le lieu de naissance est requis');
      if (!formData.nni || formData.nni.length !== 10) errors.push('Le NNI doit contenir 10 chiffres');
      if (!formData.adresse) errors.push('L\'adresse est requise');
      if (!formData.nom_pere) errors.push('Le nom du père est requis');
    } else if (stepNum === 2) {
      if (!formData.dernier_diplome) errors.push('Le dernier diplôme est requis');
      if (!formData.annee_obtention_diplome) errors.push('L\'année d\'obtention est requise');
      if (!formData.specialite_formation) errors.push('La spécialité de formation est requise');
    } else if (stepNum === 3) {
      if (!formData.fonction) errors.push('La fonction est requise');
      if (!formData.type_employe) errors.push('Le type d\'employé est requis');
      if (!formData.numero_employe) errors.push('Le numéro d\'employé est requis');
      if (!formData.date_embauche) errors.push('La date d\'embauche est requise');
      if (!formData.service) errors.push('Le service est requis');
    }
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(step);
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    setError(null);
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const errors = validateStep(step);
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Créer le profil Personne
      const personneData = {
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
        annee_obtention_diplome: parseInt(formData.annee_obtention_diplome),
        specialite_formation: formData.specialite_formation,
        fonction: formData.fonction,
        type_employe: formData.type_employe,
        numero_employe: formData.numero_employe,
        date_embauche: formData.date_embauche,
        service: formData.service,
        telephone: formData.telephone || ''
      };

      // Créer la personne via l'endpoint spécifique pour l'onboarding
      const response = await apiService.post('/personnes/creer_mon_profil/', personneData);
      const personne = response.data;
      
      console.log('✅ Profil créé avec succès:', personne);
      
      // Mettre à jour l'email de l'utilisateur si fourni
      if (formData.email && formData.email !== user?.email) {
        try {
          await apiService.patch(`/users/${user.id}/`, { email: formData.email });
        } catch (err) {
          console.error('Erreur mise à jour email:', err);
        }
      }
      
      // Rediriger vers le dashboard
      alert('Profil créé ' + t('common.succes') + ' ! Redirection vers votre dashboard...');
      // Recharger les données utilisateur pour avoir le personne_id
      window.location.href = '/dashboard';
      
    } catch (err) {
      console.error('❌ Erreur création profil:', err);
      const errorMessage = err.response?.data?.detail || 
                          Object.values(err.response?.data || {}).flat().join(', ') ||
                          'Erreur lors de la création du profil';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Informations Personnelles';
      case 2: return 'Informations Académiques';
      case 3: return 'Informations Professionnelles';
      default: return '';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        {/* En-tête */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: '1rem 1rem 0 0',
          padding: '2rem',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            margin: '0 0 0.5rem 0'
          }}>
            Bienvenue dans le système MESRS
          </h1>
          <p style={{
            fontSize: '1rem',
            margin: 0,
            opacity: 0.9
          }}>
            Veuillez compléter votre profil pour continuer
          </p>
        </div>

        {/* Indicateur de progression */}
        <div style={{
          padding: '2rem 2rem 1rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: s <= step ? '#3b82f6' : '#e5e7eb',
                  color: s <= step ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  {s < step ? '✓' : s}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: s <= step ? '#3b82f6' : '#9ca3af',
                  fontWeight: s === step ? '600' : '400'
                }}>
                  Étape {s}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            height: '2px',
            backgroundColor: '#e5e7eb',
            position: 'relative',
            marginTop: '-1.5rem',
            marginLeft: '2.5rem',
            marginRight: '2.5rem',
            zIndex: 0
          }}>
            <div style={{
              height: '100%',
              width: `${((step - 1) / (totalSteps - 1)) * 100}%`,
              backgroundColor: '#3b82f6',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Formulaire */}
        <div style={{ padding: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {step === 1 && <UserCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />}
            {step === 2 && <AcademicCapIcon style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />}
            {step === 3 && <BuildingOfficeIcon style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />}
            {getStepTitle()}
          </h2>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Étape 1: Informations personnelles */}
          {step === 1 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                  onChange={handleChange}
                  required
                  placeholder="Entrez votre nom"
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
                  placeholder="Entrez votre prénom"
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
                  max={new Date().toISOString().split('T')[0]}
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
                  placeholder="Ex: Nouakchott"
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
                  NNI (10 chiffres) *
                </label>
                <input
                  type="text"
                  name="nni"
                  value={formData.nni}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="1234567890"
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
                  Nationalité *
                </label>
                <input
                  type="text"
                  name="nationalite"
                  value={formData.nationalite}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Mauritanienne"
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
                    backgroundColor: 'white'
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
                  Situation familiale *
                </label>
                <select
                  name="situation_familiale"
                  value={formData.situation_familiale}
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
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf(ve)">Veuf(ve)</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Adresse *
                </label>
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Entrez votre adresse complète"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
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
                  Nom du père *
                </label>
                <input
                  type="text"
                  name="nom_pere"
                  value={formData.nom_pere}
                  onChange={handleChange}
                  required
                  placeholder="Entrez le nom de votre père"
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
                }}>{t('common.telephone')}</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Ex: +222 12 34 56 78"
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
                }}>{t('common.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre.email@example.com"
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
          )}

          {/* Étape 2: Informations académiques */}
          {step === 2 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Dernier diplôme obtenu *
                </label>
                <input
                  type="text"
                  name="dernier_diplome"
                  value={formData.dernier_diplome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Baccalauréat, Licence, Master..."
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
                  Pays d'obtention *
                </label>
                <input
                  type="text"
                  name="pays_obtention_diplome"
                  value={formData.pays_obtention_diplome}
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
                  Année d'obtention *
                </label>
                <input
                  type="number"
                  name="annee_obtention_diplome"
                  value={formData.annee_obtention_diplome}
                  onChange={handleChange}
                  required
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

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Spécialité de formation *
                </label>
                <input
                  type="text"
                  name="specialite_formation"
                  value={formData.specialite_formation}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Informatique, Gestion, Droit..."
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
          )}

          {/* Étape 3: Informations professionnelles */}
          {step === 3 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                  onChange={handleChange}
                  required
                  placeholder="Ex: Secrétaire, Comptable..."
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
                  Type d'employé *
                </label>
                <select
                  name="type_employe"
                  value={formData.type_employe}
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
                  <option value="enseignant">Personnel Enseignant</option>
                  <option value="pat">Personnel PAT</option>
                  <option value="contractuel">Personnel Contractuel</option>
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
                  Numéro d'employé *
                </label>
                <input
                  type="text"
                  name="numero_employe"
                  value={formData.numero_employe}
                  onChange={handleChange}
                  required
                  placeholder="Ex: EMP001"
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
                  Date d'embauche *
                </label>
                <input
                  type="date"
                  name="date_embauche"
                  value={formData.date_embauche}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Service *
                </label>
                <select
                  name="service"
                  value={formData.service}
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
                  <option value="">Sélectionner un service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.nom} ({service.type_service})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'space-between',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              onClick={handlePrevious}
              disabled={step === 1 || loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: step === 1 ? '#f3f4f6' : '#6b7280',
                color: step === 1 ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: step === 1 ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
            >
              ← Précédent
            </button>

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  marginLeft: 'auto'
                }}
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }}></div>
                    Création...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon style={{ width: '1rem', height: '1rem' }} />
                    Finaliser mon profil
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OnboardingEmploye;

