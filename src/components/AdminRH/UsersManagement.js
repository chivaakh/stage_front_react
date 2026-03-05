// Traduit automatiquement
// src/components/AdminRH/UsersManagement.js - GESTION COMPLÈTE DES UTILISATEURS POUR ADMIN RH
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import UserDetail from './UserDetail';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';

const UsersManagement = () => {
  const { t, isArabic } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  
  // États pour la navigation
  const [currentView, setCurrentView] = useState('list');
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadUsers();
    loadServices();
    
    // Vérifier les paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const editParam = urlParams.get('edit');
    const createParam = urlParams.get('create');
    
    if (viewParam) {
      setSelectedUserId(viewParam);
      setCurrentView('detail');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (editParam) {
      setSelectedUserId(editParam);
      setCurrentView('edit');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (createParam === 'true') {
      setCurrentView('create');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, filterRole, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('👥 Chargement des utilisateurs...');
      
      const response = await apiService.getUsers();
      const usersData = response.results || response || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
      
      console.log('✅ Utilisateurs chargés:', usersData);
    } catch (err) {
      console.error('❌ Erreur chargement utilisateurs:', err);
      setError(t('common.erreurChargement') + ' des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await apiService.get('/services/');
      const servicesData = response.data?.results || response.data || [];
      setServices(servicesData);
    } catch (err) {
      console.error('Erreur chargement services:', err);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole) {
      result = result.filter(u => u.role === filterRole);
    }

    if (filterStatus) {
      if (filterStatus === 'active') {
        result = result.filter(u => u.is_active);
      } else if (filterStatus === 'inactive') {
        result = result.filter(u => !u.is_active);
      }
    }

    setFilteredUsers(result);
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setCurrentView('detail');
  };

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setCurrentView('edit');
  };

  const handleCreateUser = () => {
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedUserId(null);
    loadUsers();
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedUserId(null);
    loadUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }

    try {
      await apiService.delete(`/users/${userId}/`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setFilteredUsers(prev => prev.filter(u => u.id !== userId));
      alert('Utilisateur supprimé avec succès');
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await apiService.updateUser(userId, { is_active: !currentStatus });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_active: !currentStatus } : u
      ));
      setFilteredUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_active: !currentStatus } : u
      ));
      alert(`Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
    } catch (err) {
      console.error('❌ Erreur changement statut:', err);
      alert('Erreur lors du changement de statut');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin_rh': '#b91c1c',
      'chef_enseignant': '#1e3a8a',
      'chef_pat': '#1e3a8a',
      'chef_contractuel': '#f59e0b',
      'employe': '#6b7280'
    };
    return colors[role] || '#6b7280';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'admin_rh': 'Admin RH',
      'chef_enseignant': 'Chef Service Enseignant',
      'chef_pat': 'Chef Service PAT',
      'chef_contractuel': 'Chef Service Contractuel',
      'employe': 'Employé'
    };
    return labels[role] || role;
  };

  // Calcul des statistiques
  const stats = {
    total: users.length,
    adminRh: users.filter(u => u.role === 'admin_rh').length,
    chefs: users.filter(u => u.role?.startsWith('chef_')).length,
    employes: users.filter(u => u.role === 'employe').length,
    actifs: users.filter(u => u.is_active).length,
    inactifs: users.filter(u => !u.is_active).length
  };

  // Rendu conditionnel selon la vue
  if (currentView === 'detail' && selectedUserId) {
    return (
      <UserDetail
        userId={selectedUserId}
        onBack={handleBackToList}
        onEdit={handleEditUser}
      />
    );
  }

  if (currentView === 'create') {
    return (
      <CreateUserForm
        services={services}
        onCancel={handleBackToList}
        onSuccess={handleSuccess}
      />
    );
  }

  if (currentView === 'edit' && selectedUserId) {
    return (
      <EditUserForm
        userId={selectedUserId}
        services={services}
        onCancel={handleBackToList}
        onSuccess={handleSuccess}
      />
    );
  }

  if (loading) {
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
            borderTop: '3px solid #b91c1c',
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
            Chargement des utilisateurs
          </h3>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* En-tête */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}
              >
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />{t('common.retour')}</button>
              
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Gestion des utilisateurs
                </div>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#b91c1c',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <UsersIcon style={{
                    width: '1.5rem',
                    height: '1.5rem'
                  }} />
                  Liste des utilisateurs
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem'
                }}>
                  {stats.total} utilisateur{stats.total > 1 ? 's' : ''} enregistré{stats.total > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCreateUser}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#b91c1c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <PlusIcon style={{ width: '1rem', height: '1rem' }} />
              Nouvel utilisateur
            </button>
          </div>

          {/* Statistiques rapides */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#b91c1c',
                marginBottom: '0.25rem'
              }}>
                {stats.total}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>{t('common.total')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#b91c1c',
                marginBottom: '0.25rem'
              }}>
                {stats.adminRh}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Admin RH
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.chefs}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Chefs de service
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                marginBottom: '0.25rem'
              }}>
                {stats.actifs}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Actifs
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '0.25rem'
              }}>
                {stats.inactifs}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Inactifs
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Barre de recherche */}
            <div style={{
              position: 'relative',
              flex: '1',
              minWidth: '300px'
            }}>
              <MagnifyingGlassIcon style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: '#fafbfc'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#b91c1c';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.backgroundColor = '#fafbfc';
                }}
              />
            </div>

            {/* Filtre par rôle */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: '#fafbfc',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="">Tous les rôles</option>
              <option value="admin_rh">Admin RH</option>
              <option value="chef_enseignant">Chef Service Enseignant</option>
              <option value="chef_pat">Chef Service PAT</option>
              <option value="chef_contractuel">Chef Service Contractuel</option>
              <option value="employe">{t('common.employe')}</option>
            </select>

            {/* Filtre par statut */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: '#fafbfc',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {filteredUsers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#6b7280'
            }}>
              <UsersIcon style={{
                width: '4rem',
                height: '4rem',
                margin: '0 auto 2rem',
                color: '#e5e7eb'
              }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                Aucun utilisateur trouvé
              </h3>
              <p style={{
                fontSize: '1rem',
                margin: 0
              }}>
                {searchTerm || filterRole || filterStatus
                  ? 'Aucun utilisateur ne correspond aux critères de recherche'
                  : 'Commencez par créer votre premier utilisateur'}
              </p>
            </div>
          ) : (
            <div>
              {/* En-tête du tableau */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.5fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                <div>Utilisateur</div>
                <div>{t('common.email')}</div>
                <div>{t('common.role')}</div>
                <div>{t('common.statut')}</div>
                <div style={{ textAlign: 'center' }}>{t('common.actions')}</div>
              </div>

              {/* Lignes du tableau */}
              {filteredUsers.map((userItem, index) => {
                const roleColor = getRoleColor(userItem.role);

                return (
                  <div
                    key={userItem.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.5fr',
                      gap: '1rem',
                      padding: '1rem 1.5rem',
                      borderBottom: index < filteredUsers.length - 1 ? '1px solid #f3f4f6' : 'none',
                      cursor: 'pointer',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafbfc';
                    }}
                    onClick={() => handleViewUser(userItem.id)}
                  >
                    {/* Utilisateur */}
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: `${roleColor}15`,
                          border: `2px solid ${roleColor}40`,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: roleColor
                        }}>
                          {userItem.first_name?.charAt(0) || userItem.username?.charAt(0)}
                          {userItem.last_name?.charAt(0) || ''}
                        </div>
                        <div>
                          <p style={{
                            fontWeight: '600',
                            color: '#374151',
                            margin: '0 0 0.25rem 0',
                            fontSize: '0.875rem'
                          }}>
                            {userItem.full_name || `${userItem.first_name || ''} ${userItem.last_name || ''}`.trim() || userItem.username}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            margin: 0
                          }}>
                            @{userItem.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {userItem.email || 'N/A'}
                    </div>

                    {/* Rôle */}
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: `${roleColor}15`,
                        color: roleColor,
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: `1px solid ${roleColor}40`
                      }}>
                        {getRoleLabel(userItem.role)}
                      </span>
                    </div>

                    {/* Statut */}
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: userItem.is_active ? '#f8fafc' : '#fef2f2',
                        color: userItem.is_active ? '#1e3a8a' : '#b91c1c',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: `1px solid ${userItem.is_active ? '#cbd5e1' : '#cbd5e1'}`
                      }}>
                        {userItem.is_active ? t('common.actif') : t('common.inactif')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewUser(userItem.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        title="Voir les détails"
                      >
                        <EyeIcon style={{
                          width: '1rem',
                          height: '1rem',
                          color: '#6b7280'
                        }} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUser(userItem.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        title={t('common.modifier')} >
                        <PencilIcon style={{
                          width: '1rem',
                          height: '1rem',
                          color: '#1e3a8a'
                        }} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(userItem.id, userItem.is_active);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: userItem.is_active ? '#fef2f2' : '#f8fafc',
                          border: `1px solid ${userItem.is_active ? '#cbd5e1' : '#cbd5e1'}`,
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                        title={userItem.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {userItem.is_active ? (
                          <XCircleIcon style={{
                            width: '1rem',
                            height: '1rem',
                            color: '#b91c1c'
                          }} />
                        ) : (
                          <CheckCircleIcon style={{
                            width: '1rem',
                            height: '1rem',
                            color: '#1e3a8a'
                          }} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;

