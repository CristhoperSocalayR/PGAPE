import React from 'react';
import './components.css';

function TransactionHistory({ transactions }) {
  // Función para formatear la fecha
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };
    
    // Ordenar transacciones por timestamp (más recientes primero)
    const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);
    
    return (
        <div className="transaction-history">
        <h2>Historial de Transacciones</h2>
        
        {sortedTransactions.length === 0 ? (
            <p className="no-transactions">No hay transacciones para mostrar</p>
        ) : (
            <div className="transaction-list">
            {sortedTransactions.map((tx, index) => (
                <div key={index} className="transaction-item">
                <div className="transaction-header">
                    <span className="transaction-date">{formatDate(tx.timestamp)}</span>
                    <span className="transaction-network">{tx.network}</span>
                </div>
                
                <div className="transaction-details">
                    <div className="transaction-addresses">
                    <div className="transaction-from">
                        <span className="label">De:</span>
                        <span className="address">{tx.from.slice(0, 6)}...{tx.from.slice(-4)}</span>
                    </div>
                    <div className="transaction-arrow">→</div>
                    <div className="transaction-to">
                        <span className="label">Para:</span>
                        <span className="address">{tx.to.slice(0, 6)}...{tx.to.slice(-4)}</span>
                    </div>
                    </div>
                    
                    <div className="transaction-amount">
                    <span className="amount">{tx.amount} ETH</span>
                    </div>
                </div>
                
                <div className="transaction-hash">
                    <span className="label">Hash:</span>
                    <a 
                    href={`https://etherscan.io/tx/${tx.hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hash-link"
                    >
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                    </a>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}

export default TransactionHistory;