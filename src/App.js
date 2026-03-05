// src/App.js - STYLE MAURITANIEN OFFICIEL ÉPURÉ
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Components existants
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import LoadingSpinner from './components/Common/LoadingSpinner';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Composants Chef Enseignant
import EnseignantsList from './components/ChefEnseignant/EnseignantsList';
import AbsencesManagement from './components/ChefEnseignant/AbsencesManagement';
import ReportsManagement from './components/ChefEnseignant/ReportsManagement';

// Composants Chef PAT (Personnel Administratif et Technique)
import PATList from './components/ChefPAT/PATList';
import AbsencesManagementPAT from './components/ChefPAT/AbsencesManagement';
import ReportsManagementPAT from './components/ChefPAT/ReportsManagement';
import ContractuelsList from './components/ChefContractuel/ContractuelsList';
import AbsencesManagementContractuel from './components/ChefContractuel/AbsencesManagement';

// Composants Admin RH
import EnseignantsListAdminRH from './components/AdminRH/EnseignantsList';
import PATListAdminRH from './components/AdminRH/PATList';
import ContractuelsListAdminRH from './components/AdminRH/ContractuelsList';
import ServicesList from './components/AdminRH/ServicesList';
import PaiesList from './components/AdminRH/PaiesList';
import AbsencesManagementAdminRH from './components/AdminRH/AbsencesManagementAdminRH';
import RapportsAnalyses from './components/AdminRH/RapportsAnalyses';
import UsersManagement from './components/AdminRH/UsersManagement';
import PersonnelManagement from './components/AdminRH/PersonnelManagement';
import MesAbsences from './components/Employe/MesAbsences';
import ProfilEmploye from './components/Employe/ProfilEmploye';
import MesDocuments from './components/Employe/MesDocuments';
import OnboardingEmploye from './components/Employe/OnboardingEmploye';

// Styles
import './App.css';

// Configuration de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Header mauritanien officiel épuré
const MauritanianHeader = ({ user, userName, userRole, onLogout }) => {
  const { isArabic, t, language, toggleLanguage } = useLanguage();
  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo et titre officiel */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <img 
            src="/images/logo-rim.png" 
            alt="République Islamique de Mauritanie" 
            style={{
              width: '3rem',
              height: '3rem',
              objectFit: 'contain'
            }}
          />
          <div style={{ textAlign: isArabic ? 'right' : 'left', direction: isArabic ? 'rtl' : 'ltr' }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#374151',
              fontWeight: '600'
            }}>
              {t('bulletin.republique')}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              {t('header.devise')}
            </div>
          </div>
        </div>

        {/* Titre central */}
        <div style={{
          textAlign: 'center',
          flex: 1,
          maxWidth: '600px'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#059669',
            margin: 0,
            letterSpacing: '-0.025em'
          }}>
            {t('header.systemeGestionRH')}
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0.25rem 0 0 0',
            fontWeight: '500'
          }}>
            {t('header.ministere')}
          </p>
        </div>

        {/* Menu utilisateur épuré */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            textAlign: 'right',
            fontSize: '0.875rem'
          }}>
            <div style={{
              fontWeight: '600',
              color: '#374151'
            }}>
              {userName}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textTransform: 'capitalize'
            }}>
              {userRole?.replace('_', ' ')}
            </div>
          </div>
          
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #e5e7eb'
          }}>
            <span style={{
              color: '#374151',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>

          {/* Bouton de traduction */}
          <button
            onClick={toggleLanguage}
            style={{
              backgroundColor: language === 'ar' ? '#3b82f6' : '#f3f4f6',
              color: language === 'ar' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '3rem'
            }}
            onMouseEnter={(e) => {
              if (language === 'fr') {
                e.target.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (language === 'fr') {
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            {language === 'fr' ? 'Ar' : 'Fr'}
          </button>

          <button
            onClick={onLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444';
            }}
          >
           {t('nav.deconnexion')}
          </button>
        </div>
      </div>
    </header>
  );
};

// Navigation horizontale épurée
const Navigation = ({ user }) => {
  const { language, isArabic, t } = useLanguage();
  
  const navItems = [
    { href: '/dashboard', labelFr: 'Accueil', labelAr: 'الرئيسية', active: true },
  ];

  // Ajouter items selon le rôle
  if (user?.role === 'admin_rh') {
    navItems.push(
      { href: '/users', labelFr: 'Utilisateurs', labelAr: 'المستخدمون' },
      { href: '/services', labelFr: 'Services', labelAr: 'الخدمات' },
      { href: '/personnes', labelFr: 'Personnel', labelAr: 'الموظفون' },
      { href: '/admin-rh/absences', labelFr: 'Absences', labelAr: 'إدارة الغياب' },
      { href: '/admin-rh/paies', labelFr: 'Paies', labelAr: 'الرواتب' }
    );
  }

  if (user?.role === 'chef_enseignant') {
    navItems.push(
      { href: '/chef-enseignant/enseignants', labelFr: 'Mes Enseignants', labelAr: 'المدرسون' },
      { href: '/chef-enseignant/absences', labelFr: 'Gestion Absences', labelAr: 'إدارة الغياب' },
      { href: '/chef-enseignant/rapports', labelFr: 'Rapports', labelAr: 'التقارير' }
    );
  }

  if (user?.role === 'chef_pat') {
    navItems.push(
      { href: '/chef-pat/personnel', labelFr: 'Mon Personnel PAT', labelAr: 'الموظفون الإداريون' },
      { href: '/chef-pat/absences', labelFr: 'Gestion Absences', labelAr: 'إدارة الغياب' },
      { href: '/chef-pat/rapports', labelFr: 'Rapports', labelAr: 'التقارير' }
    );
  }

  if (user?.role === 'chef_contractuel') {
    navItems.push(
      { href: '/chef-contractuel/personnel', labelFr: 'Mes Contractuels', labelAr: 'المتعاقدون' },
      { href: '/chef-contractuel/absences', labelFr: 'Gestion Absences', labelAr: 'إدارة الغياب' }
    );
  }

  if (user?.role?.startsWith('chef_') && user?.role !== 'chef_enseignant' && user?.role !== 'chef_pat' && user?.role !== 'chef_contractuel') {
    navItems.push(
      { href: '/mon-equipe', labelFr: 'Mon Équipe', labelAr: 'فريقي' }
    );
  }

  if (user?.role === 'employe') {
    navItems.push(
      { href: '/profil', labelFr: 'Mon Profil', labelAr: 'ملفي' },
      { href: '/mes-absences', labelFr: 'Mes Absences', labelAr: 'غياباتي' },
      { href: '/mes-documents', labelFr: 'Mes Documents', labelAr: 'وثائقي' }
    );
  }

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 2rem',
      direction: isArabic ? 'rtl' : 'ltr'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        gap: '2rem'
      }}>
        {navItems.map((item, index) => {
          const isActive = window.location.pathname === item.href || 
                          window.location.pathname.startsWith(item.href + '/');
          
          return (
            <a
              key={index}
              href={item.href}
              style={{
                padding: '1rem 0',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #059669' : '2px solid transparent',
                transition: 'all 0.2s',
                color: isActive ? '#059669' : '#6b7280',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.color = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.color = '#6b7280';
                }
              }}
            >
              {isArabic ? item.labelAr : item.labelFr}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

// Layout principal épuré
const MainLayout = () => {
  const { logout, user, userName, userRole } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      <MauritanianHeader 
        user={user}
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <Navigation user={user} />

      {/* Main Content épuré */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <Routes>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Routes Chef Enseignant */}
          <Route
            path="/chef-enseignant/enseignants"
            element={
              <ProtectedRoute requiredRole="chef_enseignant">
                <EnseignantsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chef-enseignant/absences"
            element={
              <ProtectedRoute requiredRole="chef_enseignant">
                <AbsencesManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chef-enseignant/rapports"
            element={
              <ProtectedRoute requiredRole="chef_enseignant">
                <ReportsManagement />
              </ProtectedRoute>
            }
          />

          {/* Routes Chef PAT (Personnel Administratif et Technique) */}
          <Route
            path="/chef-pat/personnel"
            element={
              <ProtectedRoute requiredRole="chef_pat">
                <PATList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chef-pat/absences"
            element={
              <ProtectedRoute requiredRole="chef_pat">
                <AbsencesManagementPAT />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chef-pat/rapports"
            element={
              <ProtectedRoute requiredRole="chef_pat">
                <ReportsManagementPAT />
              </ProtectedRoute>
            }
          />

          {/* Routes Chef Contractuel */}
          <Route
            path="/chef-contractuel/personnel"
            element={
              <ProtectedRoute requiredRole="chef_contractuel">
                <ContractuelsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chef-contractuel/absences"
            element={
              <ProtectedRoute requiredRole="chef_contractuel">
                <AbsencesManagementContractuel />
              </ProtectedRoute>
            }
          />

          {/* Routes Admin RH */}
          <Route
            path="/admin-rh/enseignants"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <EnseignantsListAdminRH />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-rh/personnel-pat"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <PATListAdminRH />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-rh/contractuels"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <ContractuelsListAdminRH />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-rh/services"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <ServicesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-rh/users"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <UsersManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-rh/absences"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <AbsencesManagementAdminRH />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-rh/paies"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <PaiesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-rh/rapports"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <RapportsAnalyses />
              </ProtectedRoute>
            }
          />

          {/* Routes Admin RH - Anciennes routes pour compatibilité */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <UsersManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <ServicesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/personnes"
            element={
              <ProtectedRoute requiredRole="admin_rh">
                <PersonnelManagement />
              </ProtectedRoute>
            }
          />

          {/* Routes Chef de Service */}
          <Route
            path="/mon-equipe"
            element={
              <OfficialModuleCard
                titleAr="فريقي"
                titleFr="Mon Équipe"
                description="Ce module permettra de gérer votre équipe."
                icon="👨‍💼"
                color="#f59e0b"
                count="15"
                unit="membres"
              />
            }
          />

          {/* Routes communes */}
          <Route
            path="/absences"
            element={
              <div>
                {user?.role === 'chef_enseignant' ? (
                  <OfficialSuccessCard
                    titleAr="إدارة الغياب متاحة!"
                    titleFr="Module disponible !"
                    description="Votre module de gestion des absences est fonctionnel."
                    actionText="الوصول إلى إدارة الغياب"
                    actionTextFr="Accéder à la Gestion des Absences"
                    actionLink="/chef-enseignant/absences"
                    color="#10b981"
                  />
                ) : user?.role === 'chef_pat' ? (
                  <OfficialSuccessCard
                    titleAr="إدارة الغياب متاحة!"
                    titleFr="Module disponible !"
                    description="Votre module de gestion des absences PAT est fonctionnel."
                    actionText="الوصول إلى إدارة الغياب"
                    actionTextFr="Accéder à la Gestion des Absences"
                    actionLink="/chef-pat/absences"
                    color="#10b981"
                  />
                ) : (
                  <OfficialModuleCard
                    titleAr="إدارة الغياب"
                    titleFr="Gestion des Absences"
                    description="Ce module permettra de gérer les demandes d'absence."
                    icon="📅"
                    color="#ef4444"
                    count="23"
                    unit="demandes"
                  />
                )}
              </div>
            }
          />

          <Route
            path="/mes-absences"
            element={
              <ProtectedRoute>
                <MesAbsences />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <ProfilEmploye />
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents"
            element={
              <OfficialModuleCard
                titleAr="إدارة الوثائق"
                titleFr="Gestion des Documents"
                description="Ce module permettra de gérer les documents administratifs."
                icon="📁"
                color="#84cc16"
                count="156"
                unit="documents"
              />
            }
          />

          <Route
            path="/mes-documents"
            element={
              <ProtectedRoute>
                <MesDocuments />
              </ProtectedRoute>
            }
          />

          {/* Route onboarding employé */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute requiredRole="employe">
                <OnboardingEmploye />
              </ProtectedRoute>
            }
          />

          {/* Route par défaut */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Footer officiel épuré */}
      <footer style={{
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '2rem',
        marginTop: '4rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
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
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '2rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <div>
              <div>📧 mesrs@mesrs.gov.mr</div>
              <div>🌐 www.mesrs.gov.mr</div>
            </div>
            <div style={{
              textAlign: 'right'
            }}>
              <div>© 2024 MESRS - جميع الحقوق محفوظة</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Go to Settings to activate Windows
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Composant de carte officielle style mauritanien
const OfficialModuleCard = ({ titleAr, titleFr, description, icon, color, count, unit }) => {
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto'
    }}>
      {/* Bannière d'information */}
      <div style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '2rem',
        borderLeft: '4px solid #f59e0b'
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: '#92400e'
        }}>
          📅 La date limite était le 15 août 2025 à 23h59
        </p>
      </div>

      {/* Cartes statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Carte principale */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.5rem'
          }}>
            {icon}
          </div>
          
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: color,
            margin: '0 0 0.5rem 0'
          }}>
            {titleFr}
          </h3>
          
          <div style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#374151',
            margin: '1rem 0'
          }}>
            {count}
          </div>
          
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            {unit} disponibles
          </div>
        </div>

        {/* Carte d'état */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 1rem 0',
            textAlign: 'center'
          }}>
            État du Module
          </h4>
          
          <div style={{
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              🚧
            </div>
            
            <div style={{
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              padding: '1rem',
              border: '1px solid #fbbf24'
            }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#92400e',
                marginBottom: '0.5rem'
              }}>
                Module en développement
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#92400e'
              }}>
                {description}
              </div>
            </div>
          </div>
        </div>

        {/* Carte d'action */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '1rem'
          }}>
            ✨
          </div>
          
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 1rem 0'
          }}>
            Soumettre vos choix
          </h4>
          
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Bientôt disponible
          </p>
          
          <button
            disabled
            style={{
              backgroundColor: '#f3f4f6',
              color: '#9ca3af',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 2rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'not-allowed'
            }}
          >
            Accéder →
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant de succès officiel
const OfficialSuccessCard = ({ titleAr, titleFr, description, actionText, actionTextFr, actionLink, color }) => {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '3rem',
      textAlign: 'center',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: `2px solid ${color}30`
    }}>
      <div style={{
        width: '5rem',
        height: '5rem',
        backgroundColor: `${color}15`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 2rem',
        fontSize: '2rem'
      }}>
        ✅
      </div>
      
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: color,
        margin: '0 0 0.5rem 0'
      }}>
        {titleFr}
      </h2>
      
      <p style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '2rem'
      }}>
        {description}
      </p>
      
      <button
        onClick={() => window.location.href = actionLink}
        style={{
          backgroundColor: color,
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.75rem 2rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '1';
        }}
      >
        {actionTextFr}
      </button>
    </div>
  );
};

// Composant principal avec gestion des routes d'authentification
function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
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
            color: '#374151',
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            تحميل النظام
          </h3>
          <p style={{
            color: '#6b7280',
            margin: 0
          }}>
            Chargement du système MESRS...
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
    <Routes>
      {/* Route publique */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      
      {/* Routes protégées */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />

      {/* Redirection par défaut */}
      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        } 
      />
    </Routes>
  );
}

// Composant App principal
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <div className="App">
              <AppContent />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                },
                success: {
                  style: {
                    border: '1px solid #10b981',
                    color: '#059669'
                  },
                },
                error: {
                  style: {
                    border: '1px solid #ef4444',
                    color: '#dc2626'
                  },
                },
              }}
            />
          </div>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;