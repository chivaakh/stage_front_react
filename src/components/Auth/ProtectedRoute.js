// src/components/Auth/ProtectedRoute.js - VERSION AMÉLIORÉE COMPATIBLE
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  allowedRoles = [], // Support pour plusieurs rôles
  requiredPermission, 
  fallback = '/login' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification avec design mauritanien
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #FFC107',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}></div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0 0 0.5rem 0'
          }}>
            Vérification des permissions
          </h2>
          <p style={{
            fontSize: '1rem',
            opacity: 0.9,
            margin: 0
          }}>
            Contrôle d'accès en cours...
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

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  // Vérifier les rôles - Support pour un seul rôle OU plusieurs rôles
  const hasRequiredRole = () => {
    // Si requiredRole est spécifié (ancien comportement)
    if (requiredRole) {
      return user?.role === requiredRole;
    }
    
    // Si allowedRoles est spécifié (nouveau comportement)
    if (allowedRoles.length > 0) {
      return allowedRoles.includes(user?.role);
    }
    
    // Si aucun rôle spécifié, autoriser l'accès
    return true;
  };

  if (!hasRequiredRole()) {
    const rolesText = requiredRole 
      ? requiredRole 
      : allowedRoles.join(', ');

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '4px solid #FFC107'
        }}>
          {/* Header avec logo */}
          <div style={{
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              border: '3px solid #dc2626'
            }}>
              <span style={{
                fontSize: '2rem',
                color: '#dc2626'
              }}>
                🚫
              </span>
            </div>
            
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 0.5rem 0'
            }}>
              Accès Refusé
            </h2>
            
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              margin: 0
            }}>
              Vous n'avez pas les permissions nécessaires pour accéder à cette section du système MESRS.
            </p>
          </div>

          {/* Informations de rôle avec style mauritanien */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '2px solid #e2e8f0'
          }}>
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: '0 0 0.25rem 0',
                  fontWeight: '500'
                }}>
                  Votre rôle actuel :
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2E7D32',
                  margin: 0,
                  textTransform: 'capitalize'
                }}>
                  {user?.role?.replace('_', ' ') || 'Non défini'}
                </p>
              </div>
              
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: '0 0 0.25rem 0',
                  fontWeight: '500'
                }}>
                  Rôle(s) requis :
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  margin: 0,
                  textTransform: 'capitalize'
                }}>
                  {rolesText.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action avec style mauritanien */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4b5563';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#6b7280';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ← Retour
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2E7D32',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1B5E20';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2E7D32';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📊 Dashboard
            </button>
          </div>

          {/* Footer informatif */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              margin: 0
            }}>
              Pour demander l'accès à cette section, contactez votre administrateur RH.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Rendre le composant enfant si toutes les vérifications passent
  return children;
};

export default ProtectedRoute;