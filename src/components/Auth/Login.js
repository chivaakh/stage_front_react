import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const onSubmit = async (data) => {
    try {
      console.log('🔐 Tentative de connexion avec:', data.username);
      
      const result = await login({
        username: data.username,
        password: data.password,
      });

      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError('root', {
          type: 'manual',
          message: result.error || 'Erreur de connexion',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('root', {
        type: 'manual',
        message: 'Une erreur est survenue lors de la connexion',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-mauritanian" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: '#6c757d' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 30%, #FFC107 50%, #4CAF50 70%, #2E7D32 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        border: '3px solid #FFC107'
      }}>
        {/* Header avec logo */}
        <div style={{
          textAlign: 'center',
          padding: '3rem 2.5rem 2rem 2.5rem',
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          borderBottom: '4px solid #FFC107'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <img 
              src="/images/logo-rim.png" 
              alt="République Islamique de Mauritanie" 
              style={{
                width: '90px',
                height: '90px',
                objectFit: 'contain',
                margin: '0 auto',
                display: 'block',
                border: '4px solid #FFC107',
                borderRadius: '50%',
                background: 'white',
                padding: '8px'
              }}
            />
          </div>
          
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 0.5rem 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            MESRS
          </h1>
          
          <p style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#FFC107',
            margin: '0 0 0.5rem 0'
          }}>
            République Islamique de Mauritanie
          </p>
          
          <p style={{
            fontSize: '0.875rem',
            color: '#E8F5E8',
            margin: 0
          }}>
            Système de Gestion des Ressources Humaines
          </p>
        </div>

        {/* Titre Connexion */}
        <div style={{
          textAlign: 'center',
          padding: '0 2.5rem 1.5rem 2.5rem',
          background: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <LockClosedIcon style={{ width: '1.5rem', height: '1.5rem', color: '#2E7D32' }} />
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: '600',
              color: '#2E7D32',
              margin: 0
            }}>
              Connexion Sécurisée
            </h2>
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#6c757d',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Honneur - Fraternité - Justice
          </p>
        </div>

        {/* Formulaire */}
        <div style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Erreur générale */}
            {errors.root && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                textAlign: 'center',
                border: '1px solid #f5c6cb'
              }}>
                {errors.root.message}
              </div>
            )}

            {/* Nom d'utilisateur */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#2E7D32',
                marginBottom: '0.5rem'
              }}>
                Nom d'utilisateur
              </label>
              <input
                type="text"
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '1.1rem 1.2rem',
                  border: errors.username ? '2px solid #dc3545' : '2px solid #e9ecef',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  backgroundColor: errors.username ? '#f8d7da' : '#f8f9fa',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                placeholder="Entrez votre nom d'utilisateur"
                onFocus={(e) => {
                  e.target.style.borderColor = '#4CAF50';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.username ? '#dc3545' : '#e9ecef';
                  e.target.style.backgroundColor = errors.username ? '#f8d7da' : '#f8f9fa';
                  e.target.style.boxShadow = 'none';
                }}
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
                  color: '#dc3545'
                }}>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#2E7D32',
                marginBottom: '0.5rem'
              }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.2rem',
                    paddingRight: '3.5rem',
                    border: errors.password ? '2px solid #dc3545' : '2px solid #e9ecef',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    backgroundColor: errors.password ? '#f8d7da' : '#f8f9fa',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="Entrez votre mot de passe"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4CAF50';
                    e.target.style.backgroundColor = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#dc3545' : '#e9ecef';
                    e.target.style.backgroundColor = errors.password ? '#f8d7da' : '#f8f9fa';
                    e.target.style.boxShadow = 'none';
                  }}
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
                    right: '1.2rem',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6c757d',
                    padding: '0.25rem'
                  }}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeSlashIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  ) : (
                    <EyeIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#dc3545'
                }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '1.2rem',
                background: isSubmitting 
                  ? 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)' 
                  : 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                color: 'white',
                border: isSubmitting ? 'none' : '2px solid #FFC107',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                transform: isSubmitting ? 'none' : 'translateY(0)',
                boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(76, 175, 80, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 25px rgba(76, 175, 80, 0.5)';
                  e.target.style.background = 'linear-gradient(135deg, #66BB6A 0%, #388E3C 100%)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
                }
              }}
            >
              {isSubmitting ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <div className="spinner-mauritanian" style={{ 
                    width: '1rem', 
                    height: '1rem',
                    borderColor: '#ffffff40',
                    borderTopColor: '#ffffff'
                  }}></div>
                  Connexion...
                </div>
              ) : (
                '🔐 Se Connecter'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '2rem 2.5rem',
          fontSize: '0.85rem',
          lineHeight: '1.5',
          borderTop: '4px solid #FFC107'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
            © 2024 République Islamique de Mauritanie
          </p>
          <p style={{ margin: 0, opacity: 0.95, fontSize: '0.8rem' }}>
            Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;