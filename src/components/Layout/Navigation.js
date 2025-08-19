/**
 * ARBORESCENCE DU FICHIER:
 * src/
 * └── Layout/
 *     └── Navigation.js
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  AcademicCapIcon,
  ClockIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Navigation = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      window.location.href = '/login';
    }
  };

  // Définir les éléments de navigation selon le rôle
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
        roles: ['admin_rh', 'chef_enseignant', 'chef_pat', 'chef_contractuel', 'employe']
      }
    ];

    const roleSpecificItems = {
      admin_rh: [
        { name: 'Tous les Services', href: '/admin/services', icon: BuildingOfficeIcon },
        { name: 'Utilisateurs', href: '/admin/users', icon: UsersIcon },
        { name: 'Rapports Globaux', href: '/admin/reports', icon: ChartBarIcon },
        { name: 'Configuration', href: '/admin/settings', icon: Cog6ToothIcon }
      ],
      chef_enseignant: [
        { name: 'Mes Enseignants', href: '/chef-enseignant/enseignants', icon: AcademicCapIcon },
        { name: 'Gestion Absences', href: '/chef-enseignant/absences', icon: ClockIcon },
        { name: 'Rapports Service', href: '/chef-enseignant/reports', icon: DocumentTextIcon }
      ],
      chef_pat: [
        { name: 'Personnel PAT', href: '/chef-pat/personnel', icon: UsersIcon },
        { name: 'Gestion Absences', href: '/chef-pat/absences', icon: ClockIcon },
        { name: 'Rapports Service', href: '/chef-pat/reports', icon: DocumentTextIcon }
      ],
      chef_contractuel: [
        { name: 'Contractuels', href: '/chef-contractuel/personnel', icon: UsersIcon },
        { name: 'Gestion Contrats', href: '/chef-contractuel/contrats', icon: DocumentTextIcon },
        { name: 'Gestion Absences', href: '/chef-contractuel/absences', icon: ClockIcon }
      ],
      employe: [
        { name: 'Mon Profil', href: '/employe/profil', icon: UserIcon },
        { name: 'Mes Absences', href: '/employe/absences', icon: ClockIcon },
        { name: 'Mes Documents', href: '/employe/documents', icon: DocumentTextIcon }
      ]
    };

    return [
      ...baseItems,
      ...(roleSpecificItems[user?.role] || [])
    ];
  };

  const navigationItems = getNavigationItems();
  const currentPath = window.location.pathname;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            display: 'block'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : '-100%',
          width: '16rem',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          transition: 'left 0.3s ease-in-out',
          '@media (min-width: 768px)': {
            position: 'static',
            left: 0,
            transition: 'none'
          }
        }}
        className="sidebar"
      >
        {/* Header du Sidebar */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                MESRS
              </h2>
              <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0 0', opacity: 0.9 }}>
                Gestion RH
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '0.375rem',
                color: 'white',
                cursor: 'pointer',
                display: 'block'
              }}
              className="md:hidden"
            >
              <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>
        </div>

        {/* Profil utilisateur */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: user?.role === 'admin_rh' ? '#dbeafe' : 
                             user?.role === 'chef_enseignant' ? '#dcfce7' :
                             user?.role === 'chef_pat' ? '#fef3c7' :
                             user?.role === 'chef_contractuel' ? '#ede9fe' : '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: user?.role === 'admin_rh' ? '#2563eb' : 
                       user?.role === 'chef_enseignant' ? '#16a34a' :
                       user?.role === 'chef_pat' ? '#d97706' :
                       user?.role === 'chef_contractuel' ? '#7c3aed' : '#6b7280',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {(user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U').toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.first_name || user?.username}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0,
                textTransform: 'capitalize'
              }}>
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1rem 0', flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPath === item.href;
              
              return (
                <li key={item.name} style={{ margin: '0 0 0.25rem 0' }}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      // Fermer le sidebar mobile après clic
                      setSidebarOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      margin: '0 0.5rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      color: isActive ? '#3b82f6' : '#6b7280',
                      backgroundColor: isActive ? '#dbeafe' : 'transparent',
                      fontWeight: isActive ? '600' : '500',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = '#f3f4f6';
                        e.target.style.color = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#6b7280';
                      }
                    }}
                  >
                    <IconComponent style={{ 
                      width: '1.25rem', 
                      height: '1.25rem',
                      color: isActive ? '#3b82f6' : '#6b7280'
                    }} />
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bouton de déconnexion */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#dc2626',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <ArrowRightOnRectangleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{ flex: 1, marginLeft: '0', '@media (min-width: 768px)': { marginLeft: '16rem' } }} className="main-content">
        {/* Header mobile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '@media (min-width: 768px)': { display: 'none' }
          }}
          className="md:hidden"
        >
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            MESRS
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              padding: '0.5rem',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            <Bars3Icon style={{ width: '1.5rem', height: '1.5rem', color: '#374151' }} />
          </button>
        </div>

        {/* Contenu */}
        <main style={{ minHeight: 'calc(100vh - 5rem)' }}>
          {children}
        </main>
      </div>

      {/* Styles CSS pour responsive */}
      <style jsx>{`
        @media (min-width: 768px) {
          .sidebar {
            position: static !important;
            left: 0 !important;
            transition: none !important;
          }
          .main-content {
            margin-left: 16rem !important;
          }
          .md\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Navigation;