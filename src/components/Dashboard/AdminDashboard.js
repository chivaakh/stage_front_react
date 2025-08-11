import React from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = ({ data }) => {
  const stats = data?.statistiques_generales || {};
  const services = data?.services || [];

  const statsCards = [
    {
      title: 'Total Employés',
      value: stats.total_employes || 0,
      icon: UserGroupIcon,
      color: 'blue',
      link: '/personnes'
    },
    {
      title: 'Services',
      value: stats.total_services || 0,
      icon: BuildingOfficeIcon,
      color: 'green',
      link: '/services'
    },
    {
      title: 'Absences en attente',
      value: stats.absences_en_attente || 0,
      icon: ClockIcon,
      color: 'yellow',
      link: '/absences'
    },
    {
      title: 'Contrats expirant',
      value: stats.contrats_expirant_bientot || 0,
      icon: ExclamationTriangleIcon,
      color: 'red',
      link: '/contractuels'
    }
  ];

  const getColorStyles = (color) => {
    const colors = {
      blue: { bg: '#dbeafe', text: '#1e40af', iconBg: '#3b82f6' },
      green: { bg: '#dcfce7', text: '#166534', iconBg: '#22c55e' },
      yellow: { bg: '#fef3c7', text: '#92400e', iconBg: '#f59e0b' },
      red: { bg: '#fee2e2', text: '#991b1b', iconBg: '#ef4444' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
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
                      fontSize: '2rem',
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

      {/* Section Services */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Services
          </h2>
          <Link to="/services" style={{
            fontSize: '0.875rem',
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Voir tous →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {services.map((service, index) => (
            <div key={index} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {service.nom}
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  backgroundColor: '#e5e7eb',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  textTransform: 'capitalize'
                }}>
                  {service.type}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                <strong>Chef:</strong> {service.chef || 'Non assigné'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Employés:</strong> {service.nombre_employes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
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
          <Link to="/users" style={{ textDecoration: 'none' }}>
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
              Gérer les utilisateurs
            </button>
          </Link>

          <Link to="/personnes" style={{ textDecoration: 'none' }}>
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
              Ajouter un employé
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

          <Link to="/config" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}>
              Configuration
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;