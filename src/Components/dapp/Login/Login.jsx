import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import './Login.css';

// Componente FoxIcon que faltaba
const FoxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.17 2.06L13.54 8.45L15.09 5.13L21.17 2.06Z" fill="#E17726"/>
    <path d="M2.83 2.06L10.43 8.48L8.91 5.13L2.83 2.06Z" fill="#E27625"/>
    <path d="M18.3 16.25L16.26 19.59L20.72 20.85L22 16.32L18.3 16.25Z" fill="#E27625"/>
    <path d="M2.01 16.32L3.28 20.85L7.74 19.59L5.7 16.25L2.01 16.32Z" fill="#E27625"/>
    <path d="M7.53 10.8L6.14 12.73L10.54 12.95L10.39 8.11L7.53 10.8Z" fill="#E27625"/>
    <path d="M16.47 10.8L13.58 8.08L13.46 12.95L17.86 12.73L16.47 10.8Z" fill="#E27625"/>
    <path d="M7.74 19.59L10.27 18.24L8.09 16.35L7.74 19.59Z" fill="#E27625"/>
    <path d="M13.73 18.24L16.26 19.59L15.91 16.35L13.73 18.24Z" fill="#E27625"/>
    <path d="M16.26 19.59L13.73 18.24L13.98 20.06L13.96 20.79L16.26 19.59Z" fill="#D5BFB2"/>
    <path d="M7.74 19.59L10.04 20.79L10.03 20.06L10.27 18.24L7.74 19.59Z" fill="#D5BFB2"/>
    <path d="M10.09 15.11L8 14.36L9.47 13.58L10.09 15.11Z" fill="#233447"/>
    <path d="M13.91 15.11L14.53 13.58L16.01 14.36L13.91 15.11Z" fill="#233447"/>
    <path d="M7.74 19.59L8.11 16.25L5.7 16.32L7.74 19.59Z" fill="#CC6228"/>
    <path d="M15.89 16.25L16.26 19.59L18.3 16.32L15.89 16.25Z" fill="#CC6228"/>
    <path d="M17.86 12.73L13.46 12.95L13.91 15.11L14.53 13.58L16.01 14.36L17.86 12.73Z" fill="#CC6228"/>
    <path d="M8 14.36L9.47 13.58L10.09 15.11L10.54 12.95L6.14 12.73L8 14.36Z" fill="#CC6228"/>
    <path d="M6.14 12.73L8.09 16.35L8 14.36L6.14 12.73Z" fill="#E27525"/>
    <path d="M16.01 14.36L15.91 16.35L17.86 12.73L16.01 14.36Z" fill="#E27525"/>
    <path d="M10.54 12.95L10.09 15.11L10.66 17.8L10.8 14.23L10.54 12.95Z" fill="#E27525"/>
    <path d="M13.46 12.95L13.21 14.22L13.34 17.8L13.91 15.11L13.46 12.95Z" fill="#E27525"/>
    <path d="M13.91 15.11L13.34 17.8L13.73 18.24L15.91 16.35L16.01 14.36L13.91 15.11Z" fill="#F5841F"/>
    <path d="M8 14.36L8.09 16.35L10.27 18.24L10.66 17.8L10.09 15.11L8 14.36Z" fill="#F5841F"/>
    <path d="M13.96 20.79L13.98 20.06L13.75 19.86H10.25L10.03 20.06L10.04 20.79L7.74 19.59L8.56 20.26L10.21 21.42H13.79L15.44 20.26L16.26 19.59L13.96 20.79Z" fill="#C0AC9D"/>
    <path d="M13.73 18.24L13.34 17.8H10.66L10.27 18.24L10.03 20.06L10.25 19.86H13.75L13.98 20.06L13.73 18.24Z" fill="#161616"/>
    <path d="M21.54 8.62L22.25 5.56L21.17 2.06L13.73 8.23L16.47 10.8L20.66 12.02L21.54 10.97L21.17 10.7L21.78 10.14L21.32 9.8L21.93 9.33L21.54 8.62Z" fill="#763E1A"/>
    <path d="M1.75 5.56L2.46 8.62L2.06 9.33L2.68 9.8L2.22 10.14L2.83 10.7L2.46 10.97L3.34 12.02L7.53 10.8L10.27 8.23L2.83 2.06L1.75 5.56Z" fill="#763E1A"/>
    <path d="M20.66 12.02L16.47 10.8L17.86 12.73L15.91 16.35L18.3 16.32H22L20.66 12.02Z" fill="#F5841F"/>
    <path d="M7.53 10.8L3.34 12.02L2.01 16.32H5.7L8.09 16.35L6.14 12.73L7.53 10.8Z" fill="#F5841F"/>
    <path d="M13.46 12.95L13.73 8.23L15.09 5.13H8.91L10.27 8.23L10.54 12.95L10.66 14.23L10.67 17.8H13.33L13.34 14.23L13.46 12.95Z" fill="#F5841F"/>
  </svg>
);

function Login({ onConnected }) {
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    
    const connectWallet = async () => {
        setConnecting(true);
        setError(null);
        setSuccess(null);
        setShowAlert(false);
        setShowSuccess(false);
        
        try {
            // Verificar si MetaMask está instalado
            if (typeof window.ethereum === 'undefined') {
                throw new Error('Por favor instala MetaMask para continuar');
            }

            // Solicitar conexión de cuenta
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            // Obtener dirección de la cuenta conectada
            const account = accounts[0];
            
            // Llamar al callback con la información de la cuenta
            if (onConnected) {
                onConnected(account);
            }
            
            console.log('Conectado con la cuenta:', account);
            
            // Mostrar notificación de éxito
            setSuccess(`¡Conexión exitosa! Cuenta: ${account.slice(0, 6)}...${account.slice(-4)}`);
            setShowSuccess(true);
            
            // Redireccionar después de un breve retraso para que el usuario vea la notificación
            setTimeout(() => {
                // Redireccionar al Navbar después de iniciar sesión exitosamente
                navigate('/menu', { 
                    state: { 
                        showNotification: true,
                        accountAddress: account 
                    }
                });
            }, 1500);
            
        } catch (err) {
            console.error('Error al conectar con MetaMask:', err);
            setError(err.message || 'Error al conectar con MetaMask');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000); // Ocultar alerta después de 5 segundos
        } finally {
            setConnecting(false);
        }
    };
    
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                    <img src="/img/Pagape.png" alt="Logo PagaPe" />
                    <h1 className="logo-text">
                        <span className="blue-text">Paga</span>
                        <span className="gold-text">Pe</span>
                    </h1>
                </div>
                <p className="tagline">Tu billetera digital para transacciones en múltiples redes</p>
                
                {showAlert && error && (
                    <div className="alert-message error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                        <button className="close-alert" onClick={() => setShowAlert(false)}>×</button>
                    </div>
                )}
                
                {showSuccess && success && (
                    <div className="alert-message success">
                        <CheckCircle size={20} />
                        <span>{success}</span>
                    </div>
                )}
                
                <button 
                    className={`connect-button ${connecting ? 'connecting' : ''}`}
                    onClick={connectWallet}
                    disabled={connecting}
                >
                    <div className="button-content">
                        {connecting ? (
                            <>
                                <div className="spinner"></div>
                                <span>Conectando...</span>
                            </>
                        ) : (
                            <>
                                <FoxIcon />
                                <span>Conectar con MetaMask</span>
                            </>
                        )}
                    </div>
                </button>
                
                <div className="footer-text">
                    <p>Accede de forma segura con tu billetera MetaMask</p>
                </div>
            </div>
        </div>
    );
}

export default Login;