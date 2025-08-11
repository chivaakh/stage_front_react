import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuth, AuthProvider } from './contexts/AuthContext';

// Components
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import LoadingSpinner from './components/Common/LoadingSpinner';
import ErrorBoundary from './components/Common/ErrorBoundary';

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

// Composant Header mauritanien
const MauritanianHeader = ({ user, userName, userRole, onLogout }) => {
  return (
    <header className="header-mauritanian">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo et titre */}
        <div className="logo-container">
          <img 
            src="/images/logo-rim.png" 
            alt="République Islamique de Mauritanie" 
            className="logo-rim"
          />
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: 0,
              color: 'white'
            }}>
              MESRS
            </h1>
            <p style={{
              fontSize: '0.875rem',
              margin: 0,
              color: '#FFC107',
              fontWeight: '500'
            }}>
              République Islamique de Mauritanie
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-mauritanian">
          <a href="/dashboard" className="nav-link">
            📊 Dashboard
          </a>
          
          {user?.role === 'admin_rh' && (
            <>
              <a href="/users" className="nav-link">
                👥 Utilisateurs
              </a>
              <a href="/services" className="nav-link">
                🏢 Services
              </a>
              <a href="/personnes" className="nav-link">
                👤 Personnel
              </a>
            </>
          )}

          {user?.role?.startsWith('chef_') && (
            <a href="/mon-equipe" className="nav-link">
              👨‍💼 Mon Équipe
            </a>
          )}

          <a href="/absences" className="nav-link">
            📅 Absences
          </a>
        </nav>

        {/* Menu utilisateur */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: 'white',
              margin: 0
            }}>
              {userName}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#FFC107', 
              textTransform: 'capitalize',
              margin: 0,
              fontWeight: '500'
            }}>
              {userRole?.replace('_', ' ')}
            </div>
          </div>
          
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            backgroundColor: '#FFC107',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white'
          }}>
            <span style={{ 
              color: '#1B5E20', 
              fontWeight: '700', 
              fontSize: '1rem' 
            }}>
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="btn btn-red"
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 1rem'
            }}
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

// Composant MainLayout principal avec navigation mauritanienne
const MainLayout = () => {
  const { logout, user, userName, userRole } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fffe' }}>
      <MauritanianHeader 
        user={user}
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Routes Admin RH */}
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="admin_rh">
                  <div className="card slide-up">
                    <div className="card-header">
                      <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        👥 Gestion des Utilisateurs
                      </h2>
                    </div>
                    <div className="card-body text-center">
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                      <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                      <p style={{ color: '#6b7280' }}>
                        Ce module permettra de gérer les comptes utilisateurs du système MESRS.
                      </p>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/services"
              element={
                <ProtectedRoute requiredRole="admin_rh">
                  <div className="card slide-up">
                    <div className="card-header">
                      <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🏢 Gestion des Services
                      </h2>
                    </div>
                    <div className="card-body text-center">
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                      <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                      <p style={{ color: '#6b7280' }}>
                        Ce module permettra de gérer les services du ministère.
                      </p>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/personnes"
              element={
                <ProtectedRoute requiredRole="admin_rh">
                  <div className="card slide-up">
                    <div className="card-header">
                      <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        👤 Gestion du Personnel
                      </h2>
                    </div>
                    <div className="card-body text-center">
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                      <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                      <p style={{ color: '#6b7280' }}>
                        Ce module permettra de gérer les dossiers du personnel.
                      </p>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Routes Chef de Service */}
            <Route
              path="/mon-equipe"
              element={
                <div className="card slide-up">
                  <div className="card-header">
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      👨‍💼 Mon Équipe
                    </h2>
                  </div>
                  <div className="card-body text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                    <p style={{ color: '#6b7280' }}>
                      Ce module permettra de gérer votre équipe.
                    </p>
                  </div>
                </div>
              }
            />

            <Route
              path="/mon-service"
              element={
                <div className="card slide-up">
                  <div className="card-header">
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🏢 Mon Service
                    </h2>
                  </div>
                  <div className="card-body text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                    <p style={{ color: '#6b7280' }}>
                      Ce module permettra de voir les informations de votre service.
                    </p>
                  </div>
                </div>
              }
            />

            {/* Routes communes */}
            <Route
              path="/absences"
              element={
                <div className="card slide-up">
                  <div className="card-header">
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📅 Gestion des Absences
                    </h2>
                  </div>
                  <div className="card-body text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                    <p style={{ color: '#6b7280' }}>
                      Ce module permettra de gérer les demandes d'absence.
                    </p>
                  </div>
                </div>
              }
            />

            <Route
              path="/mes-absences"
              element={
                <div className="card slide-up">
                  <div className="card-header">
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📋 Mes Absences
                    </h2>
                  </div>
                  <div className="card-body text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                    <p style={{ color: '#6b7280' }}>
                      Ce module permettra de gérer vos demandes d'absence.
                    </p>
                  </div>
                </div>
              }
            />

            <Route
              path="/profil"
              element={
                <div className="card slide-up">
                  <div className="card-header">
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      👤 Mon Profil
                    </h2>
                  </div>
                  <div className="card-body text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                    <p style={{ color: '#6b7280' }}>
                      Ce module permettra de voir et modifier votre profil.
                    </p>
                  </div>
                </div>
              }
            />

            <Route
              path="/documents"
              element={
                <div className="card slide-up">
                  <div className="card-header">
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📁 Gestion des Documents
                    </h2>
                  </div>
                  <div className="card-body text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                    <p style={{ color: '#6b7280' }}>
                      Ce module permettra de gérer les documents administratifs.
                    </p>
                  </div>
                </div>
              }
            />

            <Route
              path="/mes-documents"
              element={
                <div className="card slide-up">
                  <div className="card-header">
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📄 Mes Documents
                    </h2>
                  </div>
                  <div className="card-body text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Module en développement</h3>
                    <p style={{ color: '#6b7280' }}>
                      Ce module permettra d'accéder à vos documents personnels.
                    </p>
                  </div>
                </div>
              }
            />

            {/* Route par défaut */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

      {/* Footer mauritanien */}
      <footer style={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '2rem 1rem',
        borderTop: '4px solid #FFC107'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <img 
              src="/images/logo-rim.png" 
              alt="RIM" 
              style={{ width: '2rem', height: '2rem', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>
              République Islamique de Mauritanie
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
            © 2024 Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#FFC107' }}>
            Honneur - Fraternité - Justice
          </p>
        </div>
      </footer>
    </div>
  );
};

// Composant principal avec gestion des routes d'authentification
function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mauritanian flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="spinner-mauritanian" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-4 text-white font-medium">Chargement du système MESRS...</p>
        </div>
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
        <AuthProvider>
          <div className="App">
            <AppContent />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#2E7D32',
                  color: '#fff',
                  border: '2px solid #FFC107'
                },
                success: {
                  style: {
                    background: '#4CAF50',
                    border: '2px solid #FFC107'
                  },
                },
                error: {
                  style: {
                    background: '#D32F2F',
                    border: '2px solid #FFC107'
                  },
                },
              }}
            />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;