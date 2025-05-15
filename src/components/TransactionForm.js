import React, { useState } from 'react';
import './components.css';

function TransactionForm({ contacts, sendTransaction }) {
    const [isDual, setIsDual] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [secondRecipient, setSecondRecipient] = useState('');
    const [secondAmount, setSecondAmount] = useState('');
    const [selectedContact, setSelectedContact] = useState('');
    const [secondSelectedContact, setSecondSelectedContact] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!recipient || !amount || (isDual && (!secondRecipient || !secondAmount))) {
        alert('Por favor complete todos los campos');
        return;
        }
        
        // Validar que los montos sean números válidos
        if (isNaN(parseFloat(amount)) || (isDual && isNaN(parseFloat(secondAmount)))) {
        alert('Por favor ingrese montos válidos');
        return;
        }
        
        const transactionData = {
        recipient,
        amount: parseFloat(amount),
        isDual,
        secondRecipient: isDual ? secondRecipient : '',
        secondAmount: isDual ? parseFloat(secondAmount) : 0
        };
        
        await sendTransaction(transactionData);
        
        // Limpiar el formulario
        setRecipient('');
        setAmount('');
        setSecondRecipient('');
        setSecondAmount('');
        setSelectedContact('');
        setSecondSelectedContact('');
    };
    
    const handleContactSelect = (e) => {
        const selectedAddress = e.target.value;
        setSelectedContact(selectedAddress);
        if (selectedAddress) {
        setRecipient(selectedAddress);
        }
    };
    
    const handleSecondContactSelect = (e) => {
        const selectedAddress = e.target.value;
        setSecondSelectedContact(selectedAddress);
        if (selectedAddress) {
        setSecondRecipient(selectedAddress);
        }
    };
    
    return (
        <div className="transaction-form-container">
        <h2>Enviar Transacción</h2>
        
        <div className="transaction-type-toggle">
            <button 
            className={`toggle-button ${!isDual ? 'active' : ''}`}
            onClick={() => setIsDual(false)}
            >
            Transacción Simple
            </button>
            <button 
            className={`toggle-button ${isDual ? 'active' : ''}`}
            onClick={() => setIsDual(true)}
            >
            Transacción Dual
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group">
            <label>Seleccionar Contacto (opcional)</label>
            <select 
                value={selectedContact} 
                onChange={handleContactSelect}
                className="contact-select"
            >
                <option value="">Seleccione un contacto o ingrese dirección</option>
                {contacts.map((contact, index) => (
                <option key={index} value={contact.address}>
                    {contact.name} ({contact.address.slice(0, 6)}...{contact.address.slice(-4)})
                </option>
                ))}
            </select>
            </div>
            
            <div className="form-group">
            <label>Dirección de Destinatario</label>
            <input 
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                required
                className="address-input"
            />
            </div>
            
            <div className="form-group">
            <label>Monto a Enviar (ETH)</label>
            <input 
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                required
                className="amount-input"
            />
            </div>
            
            {isDual && (
            <>
                <div className="form-group">
                <label>Seleccionar Segundo Contacto (opcional)</label>
                <select 
                    value={secondSelectedContact} 
                    onChange={handleSecondContactSelect}
                    className="contact-select"
                >
                    <option value="">Seleccione un contacto o ingrese dirección</option>
                    {contacts.map((contact, index) => (
                    <option key={index} value={contact.address}>
                        {contact.name} ({contact.address.slice(0, 6)}...{contact.address.slice(-4)})
                    </option>
                    ))}
                </select>
                </div>
                
                <div className="form-group">
                <label>Dirección de Segundo Destinatario</label>
                <input 
                    type="text"
                    value={secondRecipient}
                    onChange={(e) => setSecondRecipient(e.target.value)}
                    placeholder="0x..."
                    required
                    className="address-input"
                />
                </div>
                
                <div className="form-group">
                <label>Monto a Enviar al Segundo Destinatario (ETH)</label>
                <input 
                    type="text"
                    value={secondAmount}
                    onChange={(e) => setSecondAmount(e.target.value)}
                    placeholder="0.01"
                    required
                    className="amount-input"
                />
                </div>
            </>
            )}
            
            <button type="submit" className="send-button">
            Enviar Transacción
            </button>
        </form>
        </div>
    );
}

export default TransactionForm;