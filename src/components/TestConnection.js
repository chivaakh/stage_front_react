import React, { useState } from 'react';
import { authService, apiService } from '../services/api';

const TestConnection = () => {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    setResult('Test en cours...');
    
    try {
      // Test simple de l'API
      const response = await fetch('http://localhost:8000/api/permissions/mes_permissions/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setResult('✅ Backend accessible ! Status: ' + response.status);
      } else {
        setResult('❌ Erreur: ' + response.status + ' - ' + response.statusText);
      }
    } catch (error) {
      setResult('❌ Erreur de connexion: ' + error.message);
    }
    
    setIsLoading(false);
  };

  const testLogin = async () => {
    setIsLoading(true);
    setResult('Test de connexion...');
    
    try {
      const result = await authService.login({
        username: 'admin',  // Utilisez un compte de test
        password: 'password'
      });
      
      if (result.success) {
        setResult('✅ Connexion réussie ! Utilisateur: ' + result.user.username + ' - Rôle: ' + result.user.role);
      } else {
        setResult('❌ Échec de connexion: ' + result.error);
      }
    } catch (error) {
      setResult('❌ Erreur de connexion: ' + error.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Test de connexion Backend ↔ Frontend</h2>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={testAPI} 
          disabled={isLoading}
          className="btn btn-primary"
          style={{ marginRight: '10px' }}
        >
          Tester l'API
        </button>
        
        <button 
          onClick={testLogin} 
          disabled={isLoading}
          className="btn btn-primary"
        >
          Tester la connexion
        </button>
      </div>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '5px',
        marginTop: '20px',
        minHeight: '50px'
      }}>
        <strong>Résultat :</strong><br />
        {result || 'Cliquez sur un bouton pour tester...'}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Configuration :</strong><br />
        API URL: {process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}<br />
        React: http://localhost:3000<br />
        Django: http://localhost:8000
      </div>
    </div>
  );
};

export default TestConnection;