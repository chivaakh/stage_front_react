import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
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
            color: '#059669',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            Initialisation du système
          </h3>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '0.95rem'
          }}>
            Chargement de l'interface sécurisée...
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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Motifs d'arrière-plan simples */}
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

      {/* Header moderne */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '1.5rem 0',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e2e8f0'
            }}>
              <img 
                src="/images/logo-rim.png" 
                alt="Logo République Islamique de Mauritanie" 
                style={{
                  width: '45px',
                  height: '45px',
                  objectFit: 'contain'
                }}
              />
            </div>
            
            <div>
              <h1 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 0.25rem 0',
                letterSpacing: '-0.025em'
              }}>
                RÉPUBLIQUE ISLAMIQUE DE MAURITANIE
              </h1>
              <p style={{
                fontSize: '0.85rem',
                color: '#64748b',
                margin: '0 0 0.25rem 0',
                fontWeight: '500'
              }}>
                Honneur - Fraternité - Justice
              </p>
              <p style={{
                fontSize: '0.95rem',
                color: '#059669',
                margin: 0,
                fontWeight: '600'
              }}>
                Système de Gestion des Ressources Humaines
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              padding: '0.75rem 1.5rem',
              background: '#f0fdf4',
              borderRadius: '50px',
              color: '#059669',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: '1px solid #bbf7d0'
            }}>
              Ministère de l'Enseignement Supérieur
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal centré */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: '0.75rem',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          maxWidth: '800px',
          width: '100%'
        }}>
          
          {/* Section de bienvenue */}
          <div style={{
            flex: 1,
            maxWidth: '380px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Motif décoratif */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '80px',
                background: '#f0fdf4',
                borderRadius: '50%',
                transform: 'translate(50%, -50%)'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    background: '#059669',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(5, 150, 105, 0.2)'
                  }}>
                    <UserGroupIcon style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                  </div>
                  
                  <div>
                    <h2 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: '0 0 0.125rem 0',
                      letterSpacing: '-0.025em'
                    }}>
                      MESRS
                    </h2>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#059669',
                      margin: 0,
                      fontWeight: '600'
                    }}>
                      Ministère de l'Enseignement Supérieur
                    </p>
                  </div>
                </div>
                
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.3'
                }}>
                  Plateforme Intégrée de Gestion RH
                </h3>
                
                <div style={{
                  marginBottom: '0.75rem'
                }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#4b5563',
                    lineHeight: '1.3',
                    margin: '0 0 0.375rem 0',
                    textAlign: 'left'
                  }}>
                    <strong style={{ color: '#1f2937' }}>🇫🇷 Français :</strong><br />
                    Système moderne et sécurisé pour la gestion des ressources humaines du personnel enseignant, administratif et contractuel
                  </p>
                  
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#4b5563',
                    lineHeight: '1.3',
                    margin: 0,
                    textAlign: 'right',
                    direction: 'rtl',
                    fontFamily: 'Arial, "Traditional Arabic", serif'
                  }}>
                    <strong style={{ color: '#1f2937' }}>🇲🇷 العربية :</strong><br />
                    نظام حديث وآمن لإدارة الموارد البشرية للموظفين التعليميين والإداريين والمتعاقدين
                  </p>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.375rem'
                }}>
                  {[
                    { icon: '🎓', label: 'Enseignants', color: '#059669' },
                    { icon: '👥', label: 'Personnel', color: '#6b7280' },
                    { icon: '📋', label: 'Contractuels', color: '#7c3aed' }
                  ].map((item, index) => (
                    <div key={index} style={{
                      padding: '0.375rem',
                      background: '#f8fafc',
                      borderRadius: '0.375rem',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{
                        fontSize: '0.875rem',
                        marginBottom: '0.125rem'
                      }}>
                        {item.icon}
                      </div>
                      <p style={{
                        fontSize: '0.625rem',
                        fontWeight: '600',
                        color: item.color,
                        margin: 0
                      }}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de connexion */}
          <div style={{
            width: '300px',
            flexShrink: 0
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
                background: '#059669',
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
                  <img 
                    src="/images/logo-rim.png" 
                    alt="Logo" 
                    style={{
                      width: '30px',
                      height: '30px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'white',
                  margin: '0 0 0.5rem 0',
                  position: 'relative',
                  zIndex: 1
                }}>
                  Connexion Sécurisée
                </h2>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <LockClosedIcon style={{ width: '0.875rem', height: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }} />
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    Accès aux données RH du ministère
                  </p>
                </div>
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
                      Nom d'utilisateur
                    </label>
                    <div style={{ position: 'relative' }}>
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
                        placeholder="Entrez votre nom d'utilisateur"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#059669';
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.username ? '#dc2626' : '#d1d5db';
                          e.target.style.backgroundColor = errors.username ? '#fef2f2' : 'white';
                          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                        {...register('username', {
                          required: 'Le nom d\'utilisateur est requis',
                          minLength: {
                            value: 3,
                            message: 'Minimum 3 caractères requis',
                          },
                        })}
                      />
                    </div>
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

                  {/* Mot de passe */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#1f2937',
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
                        placeholder="Entrez votre mot de passe"
                        onFocus={(e) => {
                          e.target.style.borderColor = '#059669';
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.password ? '#dc2626' : '#d1d5db';
                          e.target.style.backgroundColor = errors.password ? '#fef2f2' : 'white';
                          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
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
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6';
                          e.target.style.color = '#374151';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6b7280';
                        }}
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

                  {/* Bouton de connexion */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: isSubmitting 
                        ? '#9ca3af' 
                        : '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: isSubmitting 
                        ? 'none' 
                        : '0 4px 12px rgba(5, 150, 105, 0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.target.style.background = '#047857';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.target.style.background = '#059669';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div                         style={{ 
                          width: '1rem', 
                          height: '1rem',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid #ffffff',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Connexion...
                      </>
                    ) : (
                      <>
                        <LockClosedIcon style={{ width: '1rem', height: '1rem' }} />
                        SE CONNECTER
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Footer du formulaire */}
              <div style={{
                background: '#f8fafc',
                color: '#64748b',
                textAlign: 'center',
                padding: '1rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <p style={{ 
                  margin: '0 0 0.125rem 0', 
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  color: '#374151'
                }}>
                  © 2024 République Islamique de Mauritanie
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.7rem',
                  fontWeight: '400'
                }}>
                  Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
                </p>
              </div>
            </div>
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

export default Login;