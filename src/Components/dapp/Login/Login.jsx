import React from 'react';
import './Login.css';

const Login = ({ connectWallet }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <img src="/img/Pagape.png" alt="Logo PagaPe" className="logo-image" />
          <h1 className="app-title">PagaPe</h1>
        </div>
        <p className="description">
          Tu billetera digital para transacciones en múltiples redes
        </p>
        <button className="connect-button" onClick={connectWallet}>
          <span className="button-icon">🔗</span>
          Conectar con MetaMask
        </button>
      </div>
    </div>
  );
};

export default Login;