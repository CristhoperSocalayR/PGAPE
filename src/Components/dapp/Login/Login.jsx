import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import './Login.css';

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

    // SVG del zorro (Fox/MetaMask)
    const FoxIcon = () => (
        <svg width="24" height="24" viewBox="0 0 318.6 318.6" xmlns="http://www.w3.org/2000/svg">
            <path d="M274.1 35.5l-99.5 73.9L193 65.8z" fill="#E2761B"/>
            <path d="M44.4 35.5l98.7 74.6-17.5-44.3z" fill="#E4761B"/>
            <path d="M238.3 206.8l-26.5 40.6 56.7 15.6 16.3-55.3z" fill="#E4761B"/>
            <path d="M33.9 207.7L50.1 263l56.7-15.6-26.5-40.6z" fill="#E4761B"/>
            <path d="M103.6 138.2l-15.8 23.9 56.3 2.5-2-60.5z" fill="#E4761B"/>
            <path d="M214.9 138.2l-39-34.8-1.3 61.2 56.2-2.5z" fill="#E4761B"/>
            <path d="M106.8 247.4l33.8-16.5-29.2-22.8z" fill="#E4761B"/>
            <path d="M177.9 230.9l33.9 16.5-4.7-39.3z" fill="#E4761B"/>
            <path d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3z" fill="#D7C1B3"/>
            <path d="M106.8 247.4l31.5 14.9-.2-9.3 2.5-22.1z" fill="#D7C1B3"/>
            <path d="M138.8 193.5l-28.2-8.3 19.9-9.1z" fill="#233447"/>
            <path d="M179.7 193.5l8.3-17.4 20 9.1z" fill="#233447"/>
            <path d="M106.8 247.4l4.8-40.6-31.3.9z" fill="#CD6116"/>
            <path d="M207 206.8l-4.8 40.6 26.5-39.7z" fill="#CD6116"/>
            <path d="M230.8 162.1l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1z" fill="#CD6116"/>
            <path d="M110.6 185.2l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z" fill="#CD6116"/>
            <path d="M87.8 162.1l23.6 46-.8-22.9z" fill="#E4751F"/>
            <path d="M207.1 185.2l-1 22.9 23.7-46z" fill="#E4751F"/>
            <path d="M144.1 164.6l-5.3 28.9 6.6 34.1 1.5-44.9z" fill="#E4751F"/>
            <path d="M174.6 164.6l-2.7 18 1.2 45 6.7-34.1z" fill="#E4751F"/>
            <path d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9z" fill="#F6851B"/>
            <path d="M110.6 185.2l.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z" fill="#F6851B"/>
            <path d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z" fill="#C0AD9E"/>
            <path d="M177.9 230.9l-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z" fill="#161616"/>
            <path d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1z" fill="#763D16"/>
            <path d="M31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z" fill="#763D16"/>
            <path d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5z" fill="#F6851B"/>
            <path d="M103.6 138.2l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46z" fill="#F6851B"/>
            <path d="M174.6 164.6l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z" fill="#F6851B"/>
        </svg>
    );

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