import React, { useState, useEffect } from 'react';
import './components.css';

function Dashboard({ account, balance, network, updateBalance, setCurrentPage }) {
    const [showToast, setShowToast] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Effect to update balance when network changes
    useEffect(() => {
        if (account && network && updateBalance && !isRefreshing) {
            handleRefreshBalance();
        }
    }, [network, account, updateBalance]);
    
    const handleRefreshBalance = async () => {
        if (!updateBalance || !account) return;
        
        setIsRefreshing(true);
        try {
            await updateBalance(account);
        } catch (error) {
            console.error("Error al actualizar saldo desde Dashboard:", error);
        } finally {
            setIsRefreshing(false);
        }
    };
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(account);
        setShowToast(true);
        
        // Automatically hide the toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };
    
    // Navigation functions
    const navigateToTransactions = () => {
        setCurrentPage('transactions');
    };
    
    const navigateToHistory = () => {
        setCurrentPage('history');
    };
    
    const navigateToContacts = () => {
        setCurrentPage('contacts');
    };
    
    return (
        <div className="dashboard">
            {/* Balance Card */}
            <div className="balance-card">
                <h2>Balance</h2>
                <div className="balance-amount">{balance} ETH</div>
                <div className="network-info">Red: {network || 'No conectado'}</div>
            </div>
            
            {/* Account Info Card */}
            <div className="account-info">
                <h2>Dirección de la Billetera</h2>
                <div className="address-container">
                    <div className="address">{account}</div>
                    <button className="copy-button" onClick={copyToClipboard}>
                        <i className="fa fa-copy"></i> Copiar
                    </button>
                </div>
            </div>
            
            {/* Quick Actions Card */}
            <div className="quick-actions">
                <h2>Acciones Rápidas</h2>
                <div className="action-buttons">
                    <button className="action-button" onClick={navigateToTransactions}>
                        <span className="action-icon">↗</span>
                        Enviar ETH
                    </button>
                    <button className="action-button" onClick={navigateToHistory}>
                        <span className="action-icon">⏱</span>
                        Ver Historial
                    </button>
                    <button className="action-button" onClick={navigateToContacts}>
                        <span className="action-icon">👤</span>
                        Gestionar Contactos
                    </button>
                </div>
            </div>
            
            {/* Network Info Card */}
            <div className="network-card">
                <h2>Información de Red</h2>
                <table className="network-table">
                    <tbody>
                        <tr>
                            <td className="table-label">Red Actual:</td>
                            <td className="table-value">{network || 'No conectado'}</td>
                        </tr>
                        <tr>
                            <td className="table-label">Dirección:</td>
                            <td className="table-value address-short">
                                {account ? `${account.slice(0, 10)}...${account.slice(-8)}` : 'No conectado'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            {/* Refresh Balance Button - Added separate styling */}
            <button 
                className="connect-button"  
                onClick={handleRefreshBalance}
                disabled={isRefreshing}
                style={{ margin: '15px 0' }}
            >
                <i className="fa fa-refresh"></i>
                {isRefreshing ? 'Actualizando...' : 'Actualizar Saldo'}
            </button>
            
            {/* Toast Notification */}
            {showToast && (
                <div className="notification success">
                    Dirección copiada al portapapeles
                </div>
            )}
        </div>
    );
}

export default Dashboard;