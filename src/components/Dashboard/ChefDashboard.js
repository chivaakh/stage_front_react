import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const ChefDashboard = ({ data }) => {
  const serviceInfo = data?.service_info || {};
  const stats = data?.statistiques || {};

  const statsCards = [
    {
      title: 'Employés dans mon service',
      value: stats.total_employes || 0,
      icon: UserGroupIcon,
      color: 'blue',
      link: '/mon-equipe'
    },
    {
      title: 'Absences en attente',
      value: stats.absences_en_attente || 0,
      icon: ClockIcon,
      color: 'yellow',
      link: '/absences'
    },
    {
      title: 'Contrats à renouveler',
      value: stats.contrats_expirant_bientot || 0,
      icon: ExclamationCircleIcon,
      color: 'red',
      link: '/contractuels'
    },
    {
      title: 'Mon Service',
      value: serviceInfo.nom || 'N/A',
      icon: BuildingOfficeIcon,
      color: 'green',
      link: '/mon-service',
      isText: true
    }
  ];

  const getColorStyles = (color) => {
    const colors = {
      blue: { bg: '#dbeafe', iconBg: '#3b82f6' },
      green: { bg: '#dcfce7', iconBg: '#22c55e' },
      yellow: { bg: '#fef3c7', iconBg: '#f59e0b' },
      red: { bg: '#fee2e2', iconBg: '#ef4444' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      {/* Informations du service */}
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
          Mon Service
        </h2>
        
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          padding: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: '#3b82f6',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BuildingOfficeIcon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                {serviceInfo.nom || 'Service non défini'}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                textTransform: 'capitalize'
              }}>
                Type: {serviceInfo.type || 'N/A'}
              </p>
            </div>
          </div>
          
          {serviceInfo.description && (
            <p style={{
              fontSize: '0.875rem',
              color: '#4b5563',
              margin: 0,
              fontStyle: 'italic'
            }}>
              {serviceInfo.description}
            </p>
          )}
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

      {/* Répartition des employés */}
      {stats.repartition_employes && (
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
            marginBottom: '1.5rem'
          }}>
            Répartition des employés
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {stats.repartition_employes.map((item, index) => (
              <div key={index} style={{
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#3b82f6',
                  marginBottom: '0.25rem'
                }}>
                  {item.count}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  textTransform: 'capitalize'
                }}>
                  {item.type_employe}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides pour chef */}
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
          <Link to="/mon-equipe" style={{ textDecoration: 'none' }}>
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
              Gérer mon équipe
            </button>
          </Link>

          <Link to="/absences" style={{ textDecoration: 'none' }}>
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
              Approuver absences
            </button>
          </Link>

          <Link to="/documents" style={{ textDecoration: 'none' }}>
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
              Gérer documents
            </button>
          </Link>

          <Link to="/mon-service" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#6d28d9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#7c3aed'}>
              Infos service
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;