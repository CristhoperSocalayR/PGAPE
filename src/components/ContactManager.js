import React, { useState } from 'react';
import './components.css';

function ContactManager({ contacts, addContact }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name || !address) {
        alert('Por favor complete todos los campos');
        return;
        }
        
        // Validar que la dirección sea un formato Ethereum válido
        if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        alert('Por favor ingrese una dirección Ethereum válida');
        return;
        }
        
        // Verificar si el contacto ya existe
        const contactExists = contacts.some(
        contact => contact.address.toLowerCase() === address.toLowerCase()
        );
        
        if (contactExists) {
        alert('Este contacto ya existe en su lista');
        return;
        }
        
        addContact({ name, address });
        
        // Limpiar el formulario
        setName('');
        setAddress('');
    };
    
    const importContacts = async () => {
        try {
        // Aquí se podría implementar la funcionalidad para importar contactos de MetaMask
        // Por ahora, mostraremos un mensaje
        alert('Funcionalidad de importación desde MetaMask en desarrollo');
        } catch (error) {
        alert('Error al importar contactos: ' + error.message);
        }
    };
    
    return (
        <div className="contact-manager">
        <h2>Gestionar Contactos</h2>
        
        <div className="add-contact-form">
            <h3>Agregar Nuevo Contacto</h3>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Nombre</label>
                <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del contacto"
                required
                className="contact-input"
                />
            </div>
            
            <div className="form-group">
                <label>Dirección Ethereum</label>
                <input 
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                required
                className="contact-input"
                />
            </div>
            
            <button type="submit" className="add-contact-button">
                Agregar Contacto
            </button>
            </form>
            
            <button onClick={importContacts} className="import-button">
            Importar Contactos de MetaMask
            </button>
        </div>
        
        <div className="contact-list-container">
            <h3>Lista de Contactos</h3>
            
            {contacts.length === 0 ? (
            <p className="no-contacts">No hay contactos para mostrar</p>
            ) : (
            <div className="contact-list">
                {contacts.map((contact, index) => (
                <div key={index} className="contact-item">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-address">
                    {contact.address.slice(0, 6)}...{contact.address.slice(-4)}
                    </div>
                    <button 
                    className="copy-address-button"
                    onClick={() => {
                        navigator.clipboard.writeText(contact.address);
                        alert('Dirección copiada al portapapeles');
                    }}
                    >
                    Copiar
                    </button>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
}

export default ContactManager;