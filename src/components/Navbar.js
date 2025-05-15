import React, { useState, useEffect } from 'react';
import './components.css';

function Navbar({
    account,
    setCurrentPage,
    currentPage,
    network,
    switchNetwork,
    disconnectWallet,
    menuOpen,
    toggleMenu,
    updateBalance // Asegurándonos de utilizar esta prop
}) {
    const [showNetworkMenu, setShowNetworkMenu] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '' });
    const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);
    
    const networks = [
        { name: 'ETH Mainnet', chainId: '0x1', symbol: 'ETH' },
        { name: 'Holesky', chainId: '0x4268', symbol: 'ETH', rpcUrl: 'https://holesky.drpc.org', explorer: 'https://holesky.etherscan.io' }, // 17000
        { name: 'ETH Sepolia', chainId: '0xaa36a7', symbol: 'ETH' }, // 11155111
        { name: 'ETH Goerli', chainId: '0x5', symbol: 'ETH' }  // 5
    ];

    // Efecto para actualizar el saldo cuando cambia la red
    useEffect(() => {
        if (network && account && !isUpdatingBalance && updateBalance) {
            refreshBalance();
        }
    }, [network, account, updateBalance]);
    
    const toggleNetworkMenu = () => {
        setShowNetworkMenu(!showNetworkMenu);
    };
    
    // Función para actualizar el saldo - MODIFICADA para usar la prop updateBalance
    const refreshBalance = async () => {
        if (!updateBalance || !account) return;
        
        setIsUpdatingBalance(true);
        try {
            setNotification({
                show: true,
                message: "Actualizando saldo..."
            });
            
            const success = await updateBalance(account);
            
            setNotification({
                show: true,
                message: success ? "Saldo actualizado correctamente" : "Error al actualizar saldo"
            });
            
            setTimeout(() => {
                setNotification({ show: false, message: '' });
            }, 2000);
        } catch (error) {
            console.error("Error al actualizar saldo:", error);
            setNotification({
                show: true,
                message: "Error al actualizar saldo"
            });
            
            setTimeout(() => {
                setNotification({ show: false, message: '' });
            }, 3000);
        } finally {
            setIsUpdatingBalance(false);
        }
    };
    
    // Función mejorada para manejar el cambio de red
    const handleNetworkSwitch = async (chainId) => {
        try {
            // Get the network information
            const networkInfo = networks.find(net => net.chainId === chainId);
            
            setNotification({
                show: true,
                message: `Cambiando a ${networkInfo?.name || 'nueva red'}...`
            });
            
            // Switch network with additional parameters for Holesky
            if (networkInfo?.name === 'Holesky') {
                await switchNetwork(chainId, {
                    chainName: 'Holesky',
                    rpcUrls: [networkInfo.rpcUrl || 'https://holesky.drpc.org'],
                    nativeCurrency: {
                        name: 'Ethereum',
                        symbol: 'ETH',
                        decimals: 18
                    },
                    blockExplorerUrls: [networkInfo.explorer || 'https://holesky.etherscan.io']
                });
            } else {
                await switchNetwork(chainId);
            }
            
            // El saldo se actualizará automáticamente gracias al useEffect
            // cuando la red cambie
        } catch (error) {
            console.error("Error en handleNetworkSwitch:", error);
            setNotification({
                show: true,
                message: `Error al cambiar de red: ${error.message}`
            });
            
            setTimeout(() => {
                setNotification({ show: false, message: '' });
            }, 5000);
        }
        
        setShowNetworkMenu(false);
    };
    
    // Get current network display name based on chainId
    const getCurrentNetworkName = () => {
        const currentNetwork = networks.find(net => 
            net.chainId === network || 
            net.name === network
        );
        return currentNetwork?.name || network || 'Red Desconocida';
    };
    
    return (
        <nav className="navbar">
            {/* Notificación */}
            {notification.show && (
                <div className="network-notification">
                    {notification.message}
                </div>
            )}
            
            <div className="mobile-top-row">
                <div className="logo">
                    <img src="/img/icono.png" alt="Logo PagaPe" className="nav-logo" />
                    <span>PagaPe</span>
                </div>
                
                <div className="mobile-controls">
                    <div className="account-mobile">
                        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No conectado'}
                    </div>
                    <button className="menu-toggle" onClick={toggleMenu}>
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
            
            <div className={`navbar-content ${menuOpen ? 'open' : ''}`}>
                <div className="navbar-left">
                    <div className="network-selector">
                        <button onClick={toggleNetworkMenu} className="network-button">
                            {getCurrentNetworkName()} ▼
                        </button>
                        {showNetworkMenu && (
                            <div className="network-menu">
                                {networks.map((net) => (
                                    <div
                                        key={net.chainId}
                                        className={`network-item ${getCurrentNetworkName() === net.name ? 'active' : ''}`}
                                        onClick={() => handleNetworkSwitch(net.chainId)}
                                    >
                                        {net.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div 
                        className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('dashboard')}
                    >
                        Dashboard
                    </div>
                </div>
                
                <div className="nav-menu">
                    <div 
                        className={`nav-item ${currentPage === 'transactions' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('transactions')}
                    >
                        Enviar
                    </div>
                    <div 
                        className={`nav-item ${currentPage === 'history' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('history')}
                    >
                        Historial
                    </div>
                    <div 
                        className={`nav-item ${currentPage === 'contacts' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('contacts')}
                    >
                        Contactos
                    </div>
                </div>
                
                <div className="navbar-right">
                    <div className="account-logout">
                        <div className="account desktop-only">
                            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No conectado'}
                        </div>
                        
                        <button className="logout-button" onClick={disconnectWallet}>
                            Salir
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;