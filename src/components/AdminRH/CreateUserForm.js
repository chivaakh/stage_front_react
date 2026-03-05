// Traduit automatiquement
// src/components/AdminRH/CreateUserForm.js - FORMULAIRE DE CRÉATION D'UTILISATEUR
import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';

const CreateUserForm = ({ services, onCancel, onSuccess }) => {
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    role: 'employe',
    phone: '',
    is_active: true
  });

  const [selectedService, setSelectedService] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.username || !formData.email) {
      setError('Le username et l\'email sont requis');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Si c'est un chef de service, vérifier qu'un service est sélectionné
    if (formData.role.startsWith('chef_') && !selectedService) {
      setError(t('common.veuillezSelectionnerEmploye') + ' un service pour le chef');
      return;
    }

    try {
      setLoading(true);
      
      const userData = {
        ...formData,
        confirm_password: formData.password
      };

      // Si c'est un chef de service, utiliser l'endpoint spécialisé
      if (formData.role.startsWith('chef_')) {
        await apiService.createChefService({
          ...userData,
          service: selectedService
        });
      } else {
        await apiService.createUser(userData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Erreur création utilisateur:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || Object.values(err.response?.data || {}).flat().join(', ') || t('common.erreurCreationPaie') + ' de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const getRoleOptions = () => {
    return [
      { value: 'admin_rh', label: 'Admin RH' },
      { value: 'chef_enseignant', label: 'Chef Service Enseignant' },
      { value: 'chef_pat', label: 'Chef Service PAT' },
      { value: 'chef_contractuel', label: 'Chef Service Contractuel' },
      { value: 'employe', label: t('common.employe') }
    ];
  };

  const getFilteredServices = () => {
    if (!formData.role.startsWith('chef_')) return [];
    
    const serviceTypeMap = {
      'chef_enseignant': 'enseignant',
      'chef_pat': 'pat',
      'chef_contractuel': 'contractuel'
    };
    
    const typeService = serviceTypeMap[formData.role];
    return services.filter(s => s.type_service === typeService);
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
              <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />{t('common.retour')}</button>
            
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#b91c1c',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ShieldCheckIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                Nouvel utilisateur
              </h1>
              <p style={{
                color: '#6b7280',
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem'
              }}>
                Créer un nouveau compte utilisateur
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
              <span>{'Utilisateur créé ' + t('common.succes') + ' !'}</span>
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
              {/* Username */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Username <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
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

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>{t('common.email')}<span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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

              {/* Prénom */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>{t('common.prenom')}</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
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

              {/* Nom */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>{t('common.nom')}</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
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

              {/* Téléphone */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>{t('common.telephone')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
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

              {/* Rôle */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>{t('common.role')}<span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
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
                  {getRoleOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service (si chef de service) */}
            {formData.role.startsWith('chef_') && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>{t('common.service')}<span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="">Sélectionner un service</option>
                  {getFilteredServices().map(service => (
                    <option key={service.id} value={service.id}>
                      {service.nom}
                    </option>
                  ))}
                </select>
                {getFilteredServices().length === 0 && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#b91c1c',
                    marginTop: '0.5rem'
                  }}>
                    Aucun service disponible pour ce type de chef
                  </p>
                )}
              </div>
            )}

            {/* Mots de passe */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1.5rem'
              }}>
                Mot de passe
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
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
                    Mot de passe <span style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
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
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: '0.25rem'
                  }}>
                    Minimum 6 caractères
                  </p>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Confirmer le mot de passe <span style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
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
              </div>
            </div>

            {/* Statut */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  style={{
                    width: '1rem',
                    height: '1rem',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Compte actif
                </span>
              </label>
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
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#d1d5db' : '#b91c1c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? 'Création...' : 'Créer l\'utilisateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;

