import React from 'react';
import './App.css';
import TestConnection from './components/TestConnection';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MESRS - Frontend React</h1>
        <p>Test de connexion avec Django</p>
      </header>
      <TestConnection />
    </div>
  );
}

export default App;