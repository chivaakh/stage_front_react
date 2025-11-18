// src/components/ChefPAT/PATDetail.js - VUE DÉTAILLÉE PAT (VERSION FINALE CORRIGÉE)
import React from 'react';

const PATDetail = ({ pat, onClose, onEdit }) => {
  
  // Vérification de sécurité
  if (!pat) {
    console.error('❌ Aucune donnée PAT fournie à PATDetail');
    return null;
  }

  console.log('👁️ Affichage détails PAT:', pat);
  
  const getPosteLabel = (poste) => {
    const labels = {
      'sg': 'Secrétaire Général',
      'conseil': 'Conseil',
      'charge_mission': 'Chargé de Mission',
      'directeur': 'Directeur',
      'chef_service': 'Chef de Service',
      'chef_division': 'Chef de Division',
      'autre': 'Autre'
    };
    return labels[poste] || poste || 'Non défini';
  };

  const getPosteColor = (poste) => {
    const colors = {
      'sg': '#dc2626',
      'conseil': '#7c3aed',
      'charge_mission': '#2563eb',
      'directeur': '#059669',
      'chef_service': '#d97706',
      'chef_division': '#0891b2',
      'autre': '#6b7280'
    };
    return colors[poste] || '#6b7280';
  };

  const getPosteIcon = (poste) => {
    const icons = {
      'sg': '👔',
      'conseil': '⚖️',
      'charge_mission': '📋',
      'directeur': '🎯',
      'chef_service': '👨‍💼',
      'chef_division': '📊',
      'autre': '👤'
    };
    return icons[poste] || '👤';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erreur formatage date:', error);
      return 'Date invalide';
    }
  };

  // Extraire les données avec fallbacks
  const nomComplet = pat.personne_nom_complet || 
                     `${pat.personne_prenom || pat.personne?.prenom || ''} ${pat.personne_nom || pat.personne?.nom || ''}`.trim() ||
                     'Nom non disponible';
  
  const fonction = pat.personne?.fonction || pat.fonction || 'Fonction non définie';
  const poste = pat.poste || 'autre';

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
      zIndex: 1000,
      padding: '2rem',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* En-tête avec gradient */}
        <div style={{
          background: `linear-gradient(135deg, ${getPosteColor(poste)} 0%, ${getPosteColor(poste)}dd 100%)`,
          padding: '2rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Pattern de fond décoratif */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3
          }}></div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {/* Avatar avec icône de poste */}
              <div style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                fontSize: '2.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                {getPosteIcon(poste)}
              </div>
              
              <div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  margin: '0 0 0.5rem 0',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {nomComplet}
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    {getPosteLabel(poste)}
                  </span>
                  <span style={{
                    fontSize: '1rem',
                    opacity: 0.9
                  }}>
                    {fonction}
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton fermer */}
            <button
              onClick={onClose}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '1.25rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Corps du détail */}
        <div style={{ padding: '2rem' }}>
          
          {/* Section Informations Professionnelles */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              💼 Informations Professionnelles
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Poste
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {getPosteLabel(poste)}
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Grade
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {pat.grade || 'N/A'}
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Indice
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {pat.indice || '0'}
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  NBI MAC
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {pat.nbi_mac || '0'}
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Numéro Employé
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {pat.personne?.numero_employe || pat.numero_employe || 'N/A'}
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: '600'
                }}>
                  Date Embauche
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {formatDate(pat.personne?.date_embauche || pat.date_embauche)}
                </div>
              </div>
            </div>

            {/* Dates importantes */}
            <div style={{
              marginTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {pat.date_prise_service && (
                <div style={{
                  backgroundColor: '#f0f9ff',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #bae6fd',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#0284c7',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    📅 Date Prise Service
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#0c4a6e'
                  }}>
                    {formatDate(pat.date_prise_service)}
                  </div>
                </div>
              )}

              {pat.date_nomination && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #bbf7d0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#16a34a',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    📅 Date Nomination
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#14532d'
                  }}>
                    {formatDate(pat.date_nomination)}
                  </div>
                </div>
              )}

              {pat.anciennete_echelon && (
                <div style={{
                  backgroundColor: '#fefce8',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #fde047',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 179, 8, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#ca8a04',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    ⏱️ Ancienneté Échelon
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#713f12'
                  }}>
                    {pat.anciennete_echelon}
                  </div>
                </div>
              )}

              {pat.anciennete_grade && (
                <div style={{
                  backgroundColor: '#fdf2f8',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #f9a8d4',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#be185d',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    ⏱️ Ancienneté Grade
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#831843'
                  }}>
                    {pat.anciennete_grade}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section Informations Personnelles */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              👤 Informations Personnelles
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Date de naissance
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {formatDate(pat.personne?.date_naissance || pat.date_naissance)}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Lieu de naissance
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {pat.personne?.lieu_naissance || pat.lieu_naissance || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  NNI
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  fontFamily: 'monospace'
                }}>
                  {pat.personne?.nni || pat.nni || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Genre
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {pat.personne?.genre || pat.genre || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Nationalité
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {pat.personne?.nationalite || pat.nationalite || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Situation familiale
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {pat.personne?.situation_familiale || pat.situation_familiale || 'N/A'}
                </div>
              </div>
            </div>

            {/* Adresse */}
            {(pat.personne?.adresse || pat.adresse) && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  📍 Adresse
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: '#111827',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  lineHeight: '1.6'
                }}>
                  {pat.personne?.adresse || pat.adresse}
                </div>
              </div>
            )}
          </div>

          {/* Section Formation */}
          {(pat.personne?.dernier_diplome || pat.personne?.specialite_formation) && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎓 Formation
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}>
                {pat.personne?.dernier_diplome && (
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Dernier diplôme
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {pat.personne.dernier_diplome}
                    </div>
                  </div>
                )}

                {pat.personne?.specialite_formation && (
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Spécialité
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {pat.personne.specialite_formation}
                    </div>
                  </div>
                )}

                {pat.personne?.annee_obtention_diplome && (
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Année obtention
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {pat.personne.annee_obtention_diplome}
                    </div>
                  </div>
                )}

                {pat.personne?.pays_obtention_diplome && (
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Pays obtention
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {pat.personne.pays_obtention_diplome}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Fermer
            </button>

            {onEdit && (
              <button
                onClick={onEdit}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
                }}
              >
                <span>✏️</span>
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PATDetail;