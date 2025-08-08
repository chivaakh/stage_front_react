import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      console.log('🔄 Début de connexion...');
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      console.log('✅ Connexion réussie:', action.payload.user.username);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      console.log('❌ Échec de connexion:', action.payload.error);
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    case 'LOGOUT':
      console.log('🚪 Déconnexion effectuée');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'SET_USER':
      console.log('👤 Utilisateur défini:', action.payload?.username);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Vérification de l\'authentification...');
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser();
          if (user) {
            console.log('✅ Utilisateur trouvé dans localStorage:', user.username);
            dispatch({ type: 'SET_USER', payload: user });
          } else {
            console.log('❌ Pas d\'utilisateur valide dans localStorage');
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          console.log('❌ Pas d\'authentification trouvée');
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification de l\'authentification:', error);
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const result = await authService.login(credentials);

      if (result.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: result.user },
        });
        return { success: true };
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { error: result.error },
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erreur de connexion';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { error: errorMessage },
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const isAdminRH = () => {
    return state.user?.role === 'admin_rh';
  };

  const isChefService = () => {
    return state.user?.role?.startsWith('chef_') || false;
  };

  const getDashboardType = () => {
    if (isAdminRH()) return 'admin_rh';
    if (isChefService()) return 'chef_service';
    return 'employe';
  };

  const contextValue = {
    ...state,
    login,
    logout,
    isAdminRH,
    isChefService,
    getDashboardType,
    userName: state.user?.full_name || state.user?.username || '',
    userRole: state.user?.role || '',
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}

export default AuthContext;