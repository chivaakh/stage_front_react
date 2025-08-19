// src/components/Common/MauritanianWrapper.js - WRAPPER POUR INTÉGRATION
import React from 'react';

/**
 * Wrapper pour adapter nos nouveaux composants au design mauritanien existant
 * Ce composant applique les styles mauritaniens à nos nouveaux modules
 */
const MauritanianWrapper = ({ 
  children, 
  title, 
  subtitle, 
  icon = '🏛️',
  showBackButton = true,
  backUrl = '/dashboard'
}) => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      backgroundColor: '#f8fffe'
    }}>
      {/* En-tête mauritanien pour les modules */}
      <div style={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white',
        border: '4px solid #FFC107',
        boxShadow: '0 8px 32px rgba(46, 125, 50, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {showBackButton && (
            <button
              onClick={() => window.location.href = backUrl}
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid #FFC107',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ← Dashboard
            </button>
          )}
          
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#FFC107',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{
              fontSize: '2.5rem',
              color: '#1B5E20'
            }}>
              {icon}
            </span>
          </div>
          
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0 0 0.5rem 0'
            }}>
              {title}
            </h1>
            
            {subtitle && (
              <p style={{
                fontSize: '1.125rem',
                margin: 0,
                opacity: 0.9,
                fontWeight: '400'
              }}>
                {subtitle}
              </p>
            )}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <img 
                src="/images/logo-rim.png" 
                alt="RIM" 
                style={{ 
                  width: '1.5rem', 
                  height: '1.5rem', 
                  objectFit: 'contain' 
                }}
              />
              <span style={{
                fontSize: '0.875rem',
                color: '#FFC107',
                fontWeight: '600'
              }}>
                MESRS - République Islamique de Mauritanie
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal avec styles mauritaniens */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '2px solid #FFC107',
        boxShadow: '0 10px 40px rgba(46, 125, 50, 0.1)',
        overflow: 'hidden'
      }}>
        {children}
      </div>

      {/* Barre de statut mauritanienne */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e8f5e8',
        borderRadius: '12px',
        border: '2px solid #4CAF50',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <img 
            src="/images/logo-rim.png" 
            alt="RIM" 
            style={{ 
              width: '2rem', 
              height: '2rem', 
              objectFit: 'contain' 
            }}
          />
          <div>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#2E7D32',
              fontWeight: '600'
            }}>
              Système de Gestion des Ressources Humaines
            </p>
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: '#4CAF50',
              fontStyle: 'italic'
            }}>
              Honneur - Fraternité - Justice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MauritanianWrapper;