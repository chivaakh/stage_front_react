// Traduit automatiquement
// src/components/Auth/RegisterEmploye.js - INSCRIPTION EMPLOYÉ
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
const RegisterEmploye = ({ onBack, onSuccess, onSwitchToLogin }) => {
  const { t, isArabic } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log('📝 Tentative d\'inscription employé:', data.username);

      // Créer le compte utilisateur avec le rôle employé via l'endpoint public
      const response = await apiService.post('/users/creer_employe/', {
        username: data.username,
        email: data.email,
        password: data.password,
        role: 'employe'
      });

      console.log(`✅ Compte créé ${t('common.succes')}:`, response.data);

      // Connecter automatiquement l'utilisateur
      const loginResponse = await apiService.post('/auth/login/', {
        username: data.username,
        password: data.password
      });

      const { access, refresh, user } = loginResponse.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('✅ Connexion automatique réussie');

      // Rediriger vers l'onboarding
      if (onSuccess) {
        onSuccess(user);
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      
      let errorMessage = error.response?.data?.error ||
                        error.response?.data?.detail ||
                        error.response?.data?.username?.[0] ||
                        error.response?.data?.email?.[0] ||
                        Object.values(error.response?.data || {}).flat().join(', ') ||
                        'Erreur lors de l\'inscription';
      
      // Si le compte existe déjà, suggérer de se connecter
      if (errorMessage.includes('existe déjà') || errorMessage.includes('déjà utilisé')) {
        errorMessage = 'Ce compte existe déjà. Veuillez vous connecter avec vos identifiants.';
      }
      
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* Motifs d'arrière-plan */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '100px',
        height: '100px',
        background: 'rgba(5, 150, 105, 0.1)',
        borderRadius: '50%'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        width: '80px',
        height: '80px',
        background: 'rgba(107, 114, 128, 0.1)',
        borderRadius: '50%'
      }}></div>

      {/* Formulaire d'inscription */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          {/* Header du formulaire */}
          <div style={{
            background: '#1e3a8a',
            padding: '1.5rem 1.25rem 1.25rem 1.25rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
              opacity: 0.5
            }}></div>
            
            <div style={{
              width: '50px',
              height: '50px',
              background: 'white',
              borderRadius: '50%',
              margin: '0 auto 0.75rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              position: 'relative',
              zIndex: 1
            }}>
              <UserPlusIcon style={{ width: '30px', height: '30px', color: '#1e3a8a' }} />
            </div>
            
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 0.5rem 0',
              position: 'relative',
              zIndex: 1
            }}>
              Inscription Employé
            </h2>
            
            <p style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              fontWeight: '500',
              position: 'relative',
              zIndex: 1
            }}>
              Créez votre compte pour accéder au système
            </p>
          </div>

          {/* Formulaire */}
          <div style={{ padding: '1.5rem 1.25rem' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Erreur générale */}
              {errors.root && (
                <div style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  padding: '0.625rem',
                  borderRadius: '0.375rem',
                  marginBottom: '1rem',
                  fontSize: '0.75rem',
                  textAlign: 'center',
                  border: '1px solid #fecaca'
                }}>
                  {errors.root.message}
                  {errors.root.message.includes('existe déjà') && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (onSwitchToLogin) {
                            onSwitchToLogin();
                          } else {
                            onBack();
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #dc2626',
                          color: '#dc2626',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Se connecter →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Nom d'utilisateur */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.375rem'
                }}>
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.username ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: errors.username ? '#fef2f2' : 'white',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  placeholder="Choisissez un nom d'utilisateur"
                  {...register('username', {
                    required: 'Le nom d\'utilisateur est requis',
                    minLength: {
                      value: 3,
                      message: 'Minimum 3 caractères requis',
                    },
                  })}
                />
                {errors.username && (
                  <p style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#dc2626',
                    fontWeight: '500'
                  }}>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.375rem'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: errors.email ? '#fef2f2' : 'white',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  placeholder="votre.email@example.com"
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                />
                {errors.email && (
                  <p style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#dc2626',
                    fontWeight: '500'
                  }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  Mot de passe *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      paddingRight: '2.75rem',
                      border: errors.password ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: errors.password ? '#fef2f2' : 'white',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      boxSizing: 'border-box',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                    placeholder="Minimum 6 caractères"
                    {...register('password', {
                      required: 'Le mot de passe est requis',
                      minLength: {
                        value: 6,
                        message: 'Minimum 6 caractères requis',
                      },
                    })}
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '1rem',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeSlashIcon style={{ width: '1.125rem', height: '1.125rem' }} />
                    ) : (
                      <EyeIcon style={{ width: '1.125rem', height: '1.125rem' }} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#dc2626',
                    fontWeight: '500'
                  }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  Confirmer le mot de passe *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      paddingRight: '2.75rem',
                      border: errors.confirmPassword ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: errors.confirmPassword ? '#fef2f2' : 'white',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      boxSizing: 'border-box',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                    placeholder="Répétez le mot de passe"
                    {...register('confirmPassword', {
                      required: 'Veuillez confirmer le mot de passe',
                      validate: value => value === password || 'Les mots de passe ne correspondent pas',
                    })}
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '1rem',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon style={{ width: '1.125rem', height: '1.125rem' }} />
                    ) : (
                      <EyeIcon style={{ width: '1.125rem', height: '1.125rem' }} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#dc2626',
                    fontWeight: '500'
                  }}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Boutons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <button
                  type="button"
                  onClick={onBack}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />{t('common.retour')}</button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    background: loading ? '#9ca3af' : '#1e3a8a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: loading ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.3)',
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Inscription...
                    </>
                  ) : (
                    <>
                      <UserPlusIcon style={{ width: '1rem', height: '1rem' }} />
                      S'inscrire
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer du formulaire */}
          <div style={{
            background: '#f8fafc',
            color: '#64748b',
            textAlign: 'center',
            padding: '1rem',
            borderTop: '1px solid #e2e8f0',
            fontSize: '0.75rem'
          }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              En vous inscrivant, vous acceptez les conditions d'utilisation du système MESRS
            </p>
            <p style={{ margin: 0 }}>
              Vous avez déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => {
                  if (onSwitchToLogin) {
                    onSwitchToLogin();
                  } else {
                    onBack();
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#1e3a8a',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.75rem'
                }}
              >
                Connectez-vous
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RegisterEmploye;

