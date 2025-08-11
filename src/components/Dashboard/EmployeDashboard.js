import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

const EmployeDashboard = ({ data }) => {
  const profil = data?.profil || {};
  const stats = data?.statistiques || {};
  const absencesRecentes = data?.absences_recentes || [];
  const paieCourante = data?.paie_courante;

  const statsCards = [
    {
      title: 'Mes absences',
      value: stats.nombre_absences || 0,
      icon: ClockIcon,
      color: 'yellow',
      link: '/mes-absences'
    },
    {
      title: 'Mes documents',
      value: stats.nombre_documents || 0,
      icon: DocumentTextIcon,
      color: 'blue',
      link: '/mes-documents'
    },
    {
      title: 'Mon service',
      value: profil.service || 'N/A',
      icon: BuildingOfficeIcon,
      color: 'green',
      link: '/profil',
      isText: true
    },
    {
      title: 'Ma fonction',
      value: profil.fonction || 'N/A',
      icon: UserCircleIcon,
      color: 'purple',
      link: '/profil',
      isText: true
    }
  ];

  const getColorStyles = (color) => {
    const colors = {
      blue: { bg: '#dbeafe', iconBg: '#3b82f6' },
      green: { bg: '#dcfce7', iconBg: '#22c55e' },
      yellow: { bg: '#fef3c7', iconBg: '#f59e0b' },
      purple: { bg: '#ede9fe', iconBg: '#8b5cf6' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      {/* Informations du profil */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          Mon profil
        </h2>
        
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserCircleIcon style={{ width: '2rem', height: '2rem', color: 'white' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                {profil.nom_complet || 'Utilisateur'}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                {profil.fonction || 'Fonction non définie'}
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Service:
              </span>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                {profil.service || 'Non assigné'}
              </p>
            </div>
            <div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Type d'employé:
              </span>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                textTransform: 'capitalize'
              }}>
                {profil.type_employe || 'Non défini'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statsCards.map((card, index) => {
          const colorStyles = getColorStyles(card.color);
          const IconComponent = card.icon;
          
          return (
            <Link key={index} to={card.link} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#6b7280',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {card.title}
                    </p>
                    <p style={{
                      fontSize: card.isText ? '1rem' : '2rem',
                      fontWeight: '700',
                      color: '#111827',
                      margin: 0
                    }}>
                      {card.value}
                    </p>
                  </div>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: colorStyles.iconBg,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Section Paie courante */}
      {paieCourante && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Ma paie du mois
          </h2>
          
          <div style={{
            backgroundColor: '#f0f9ff',
            borderRadius: '0.5rem',
            padding: '1rem',
            border: '1px solid #bae6fd'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#0369a1',
                  fontWeight: '500'
                }}>
                  Salaire net:
                </span>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {paieCourante.salaire_net} UM
                </p>
              </div>
              <div>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#0369a1',
                  fontWeight: '500'
                }}>
                  Mois:
                </span>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {paieCourante.mois_annee}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides pour employé */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1.5rem'
        }}>
          Actions rapides
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link to="/mes-absences" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}>
              Demander une absence
            </button>
          </Link>

          <Link to="/profil" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}>
              Voir mon profil
            </button>
          </Link>

          <Link to="/mes-documents" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b45309'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#d97706'}>
              Mes documents
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeDashboard;