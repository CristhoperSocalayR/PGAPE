import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import ContactManager from './components/ContactManager';
import TransactionForm from './components/TransactionForm';
import Navbar from './components/Navbar';
import Notification from './components/Notification';

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState('');
  const [balance, setBalance] = useState('0');
  const [contacts, setContacts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false); // Estado para control de menú móvil
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false); // Añadido para controlar actualizaciones concurrentes

  // Inicializar conexión a MetaMask
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // For ethers v5 syntax
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const signer = provider.getSigner();
        setSigner(signer);
        
        const address = await signer.getAddress();
        setAccount(address);
        
        // Obtener el Chain ID actual y mapearlo a un nombre de red
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        handleNetworkName(chainId);
        
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
        
        loadTransactionHistory(address);
        loadContacts();
        
        // Escuchar cambios de red (actualizado para no recargar)
        window.ethereum.on('chainChanged', handleChainChanged);
        
        // Escuchar cambios de cuenta
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        
        return true;
      } else {
        showNotification('Por favor instala MetaMask para usar esta aplicación', 'error');
        return false;
      }
    } catch (error) {
      showNotification('Error al conectar con MetaMask: ' + error.message, 'error');
      return false;
    }
  };
  
  // Función agregada para mapear chainId a nombre de red
  const handleNetworkName = (chainId) => {
    let networkName;
    switch (chainId) {
      case '0x1':
        networkName = 'ETH Mainnet';
        break;
      case '0x4268': // 17000
        networkName = 'Holesky';
        break;
      case '0xaa36a7': // 11155111
        networkName = 'ETH Sepolia';
        break;
      case '0x5': // 5
        networkName = 'ETH Goerli';
        break;
      default:
        networkName = 'Red Desconocida';
    }
    setNetwork(networkName);
  };
  
  // Manejar cambio de red sin recargar página - MODIFICADO
  const handleChainChanged = async (chainId) => {
    try {
      setIsUpdatingBalance(true);
      
      // Actualizar provider para reflejar la nueva red
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      
      // Actualizar signer
      const signer = provider.getSigner();
      setSigner(signer);
      
      // Actualizar nombre de red usando el chainId
      handleNetworkName(chainId);
      
      // Esperar un momento para que se actualice el estado
      setTimeout(async () => {
        // Actualizar balance en la nueva red
        if (account) {
          try {
            const balance = await provider.getBalance(account);
            setBalance(ethers.utils.formatEther(balance));
            showNotification(`Red cambiada a ${network}`, 'success');
          } catch (error) {
            console.error("Error actualizando balance:", error);
            showNotification('Error al actualizar el saldo', 'error');
          } finally {
            setIsUpdatingBalance(false);
          }
        }
      }, 100);
    } catch (error) {
      setIsUpdatingBalance(false);
      console.error("Error actualizando después del cambio de red:", error);
      showNotification('Error al actualizar después del cambio de red', 'error');
    }
  };
  
  // Manejar cambio de cuenta
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setSigner(null);
    } else {
      setAccount(accounts[0]);
      updateBalance(accounts[0]);
    }
  };
  
  // Limpiar event listeners cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  
  // Desconectar wallet
  const disconnectWallet = () => {
    // Limpiar event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
    
    setAccount('');
    setProvider(null);
    setSigner(null);
    setNetwork('');
    setBalance('0');
    setCurrentPage('dashboard');
    showNotification('Sesión cerrada correctamente', 'success');
  };
  
  // Método de actualización de balance - MODIFICADO
  const updateBalance = async (address) => {
    if (provider && !isUpdatingBalance) {
      try {
        setIsUpdatingBalance(true);
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
        return true;
      } catch (error) {
        console.error("Error actualizando balance:", error);
        return false;
      } finally {
        setIsUpdatingBalance(false);
      }
    }
    return false;
  };
  
  const loadTransactionHistory = async (address) => {
    try {
      // En una aplicación real, podrías obtener el historial desde un API o indexador blockchain
      // Por ahora, cargaremos datos de ejemplo o del localStorage
      const savedTransactions = localStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error("Error cargando historial de transacciones:", error);
    }
  };
  
  const loadContacts = () => {
    // Cargar contactos desde localStorage
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  };
  
  const addContact = (contact) => {
    const newContacts = [...contacts, contact];
    setContacts(newContacts);
    localStorage.setItem('contacts', JSON.stringify(newContacts));
    showNotification('Contacto agregado exitosamente', 'success');
  };
  
  const sendTransaction = async (transactionData) => {
    try {
      if (!signer) {
        throw new Error('No hay una billetera conectada');
      }
      
      const { recipient, amount, isDual, secondRecipient, secondAmount } = transactionData;
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      let tx;
      
      if (isDual && secondRecipient) {
        // Transacción dual (enviar a dos direcciones)
        const secondAmountInWei = ethers.utils.parseEther(secondAmount.toString());
        
        // Primera transacción
        tx = await signer.sendTransaction({
          to: recipient,
          value: amountInWei
        });
        
        await tx.wait();
        
        // Segunda transacción
        const tx2 = await signer.sendTransaction({
          to: secondRecipient,
          value: secondAmountInWei
        });
        
        await tx2.wait();
        
        // Registrar ambas transacciones
        const newTransaction1 = {
          hash: tx.hash,
          from: account,
          to: recipient,
          amount: amount,
          timestamp: Date.now(),
          network: network
        };
        
        const newTransaction2 = {
          hash: tx2.hash,
          from: account,
          to: secondRecipient,
          amount: secondAmount,
          timestamp: Date.now(),
          network: network
        };
        
        const updatedTransactions = [...transactions, newTransaction1, newTransaction2];
        setTransactions(updatedTransactions);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        
      } else {
        // Transacción simple (a un solo destinatario)
        tx = await signer.sendTransaction({
          to: recipient,
          value: amountInWei
        });
        
        await tx.wait();
        
        // Registrar la transacción
        const newTransaction = {
          hash: tx.hash,
          from: account,
          to: recipient,
          amount: amount,
          timestamp: Date.now(),
          network: network
        };
        
        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      }
      
      // Actualizar balance después de la transacción
      updateBalance(account);
      
      showNotification('Transacción completada con éxito', 'success');
      return true;
      
    } catch (error) {
      showNotification('Error en la transacción: ' + error.message, 'error');
      return false;
    }
  };
  
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };
  
  // Función modificada para cambiar de red y aceptar parámetros de red - MODIFICADO
  const switchNetwork = async (chainId, networkParams) => {
    try {
      if (!window.ethereum) throw new Error("MetaMask no está instalado");
      
      setIsUpdatingBalance(true);
      
      // Primero intentamos cambiar a la red
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (switchError) {
        // Si la red no existe, añadirla (código 4902)
        if (switchError.code === 4902 && networkParams) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainId,
                chainName: networkParams.chainName,
                rpcUrls: networkParams.rpcUrls,
                nativeCurrency: networkParams.nativeCurrency,
                blockExplorerUrls: networkParams.blockExplorerUrls
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
      
      // La red ha cambiado, actualizamos la interfaz
      handleNetworkName(chainId);
      
      // Actualizar provider para reflejar la nueva red
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
      
      // Actualizar signer
      const newSigner = newProvider.getSigner();
      setSigner(newSigner);
      
      // Esperar un momento para que se actualice el estado
      setTimeout(async () => {
        // Actualizar balance en la nueva red
        if (account) {
          try {
            const balance = await newProvider.getBalance(account);
            setBalance(ethers.utils.formatEther(balance));
          } catch (error) {
            console.error("Error actualizando balance después de cambiar red:", error);
          } finally {
            setIsUpdatingBalance(false);
          }
        }
      }, 100);
      
      return true;
    } catch (error) {
      setIsUpdatingBalance(false);
      console.error("Error al cambiar de red:", error);
      showNotification('Error cambiando de red: ' + error.message, 'error');
      throw error;
    }
  };

  // Toggle menú móvil
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Cerrar menú después de seleccionar una página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  // Renderizar página actual - MODIFICADO
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard 
                account={account} 
                balance={balance} 
                network={network}
                updateBalance={updateBalance}
                setCurrentPage={handlePageChange}  // Añadido para poder navegar desde el Dashboard
              />;
      case 'transactions':
        return <TransactionForm 
                contacts={contacts} 
                sendTransaction={sendTransaction} 
              />;
      case 'history':
        return <TransactionHistory transactions={transactions} />;
      case 'contacts':
        return <ContactManager 
                contacts={contacts} 
                addContact={addContact} 
              />;
      default:
        return <Dashboard 
                account={account} 
                balance={balance} 
                network={network}
                updateBalance={updateBalance}
                setCurrentPage={handlePageChange}  // Añadido aquí también
              />;
    }
  };

  return (
    <div className="app">
      {account ? (
        <>
          <Navbar 
            account={account} 
            setCurrentPage={handlePageChange} 
            currentPage={currentPage}
            network={network}
            switchNetwork={switchNetwork}
            disconnectWallet={disconnectWallet}
            menuOpen={menuOpen}
            toggleMenu={toggleMenu}
            updateBalance={updateBalance}
          />
          <main className="main-content">
            {renderCurrentPage()}
          </main>
          {notification.show && (
            <Notification 
              message={notification.message} 
              type={notification.type} 
            />
          )}
        </>
      ) : (
        <Login connectWallet={connectWallet} />
      )}
    </div>
  );
}

export default App;