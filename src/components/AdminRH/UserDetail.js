// Traduit automatiquement
// src/components/AdminRH/UserDetail.js - VUE DÉTAILLÉE D'UN UTILISATEUR
import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  PencilIcon,
  UserIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

const UserDetail = ({ userId, onBack, onEdit }) => {
  const { t, isArabic } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await apiService.getUser(userId);
      setUser(userData);
    } catch (err) {
      console.error('Erreur chargement utilisateur:', err);
      setError(t('common.erreurChargement') + ' de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin_rh': '#b91c1c',
      'chef_enseignant': '#1e3a8a',
      'chef_pat': '#1e3a8a',
      'chef_contractuel': '#f59e0b',
      'employe': '#6b7280'
    };
    return colors[role] || '#6b7280';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'admin_rh': 'Admin RH',
      'chef_enseignant': 'Chef Service Enseignant',
      'chef_pat': 'Chef Service PAT',
      'chef_contractuel': 'Chef Service Contractuel',
      'employe': t('common.employe')
    };
    return labels[role] || role;
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
            Chargement de l'utilisateur
          </h3>
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

  if (error || !user) {
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
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          maxWidth: '500px'
        }}>
          <h3 style={{
            color: '#b91c1c',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>{t('common.erreur')}</h3>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            {error || 'Utilisateur introuvable'}
          </p>
          <button
            onClick={onBack}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#b91c1c',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const roleColor = getRoleColor(user.role);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
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
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={onBack}
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
                  <UserIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Détails de l'utilisateur
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  Informations complètes du compte
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEdit && onEdit(user.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#b91c1c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <PencilIcon style={{ width: '1rem', height: '1rem' }} />{t('common.modifier')}</button>
          </div>

          {/* Avatar et nom */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              backgroundColor: `${roleColor}15`,
              border: `3px solid ${roleColor}40`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '600',
              color: roleColor
            }}>
              {user.first_name?.charAt(0) || user.username?.charAt(0)}
              {user.last_name?.charAt(0) || ''}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#374151',
                margin: '0 0 0.5rem 0'
              }}>
                {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: '0 0 0.5rem 0'
              }}>
                @{user.username}
              </p>
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: `${roleColor}15`,
                  color: roleColor,
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: `1px solid ${roleColor}40`
                }}>
                  {getRoleLabel(user.role)}
                </span>
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: user.is_active ? '#f8fafc' : '#fef2f2',
                  color: user.is_active ? '#1e3a8a' : '#b91c1c',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: '1px solid #cbd5e1'
                }}>
                  {user.is_active ? t('common.actif') : t('common.inactif')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informations détaillées */}
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
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <ShieldCheckIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            Informations du compte
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <EnvelopeIcon style={{ width: '0.875rem', height: '0.875rem' }} />{t('common.email')}</div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                {user.email || 'N/A'}
              </div>
            </div>

            {user.phone && (
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <PhoneIcon style={{ width: '0.875rem', height: '0.875rem' }} />{t('common.telephone')}</div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {user.phone}
                </div>
              </div>
            )}

            {user.service_info && (
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <BuildingOfficeIcon style={{ width: '0.875rem', height: '0.875rem' }} />{t('common.service')}</div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {user.service_info.nom}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: '0.25rem'
                }}>
                  Type: {user.service_info.type_service}
                </div>
              </div>
            )}

            <div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <CalendarIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                Date d'inscription
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                {user.date_joined 
                  ? new Date(user.date_joined).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

