"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation, NavLink, Outlet, useNavigate } from "react-router-dom"
import "./Navbar.css"
import { Home, Send, Clock, Users, LogOut, X, ChevronDown, Menu, Check } from "lucide-react"
import { ethers } from "ethers"

// Lista de redes disponibles con URLs RPC mejoradas
const networks = [
  { name: "ETH Mainnet", chainId: "0x1", symbol: "ETH", rpcUrl: "https://mainnet.infura.io/v3/your-infura-key" },
  {
    name: "Holesky",
    chainId: "0x4268",
    symbol: "ETH",
    rpcUrl: "https://holesky.drpc.org",
    explorer: "https://holesky.etherscan.io",
  }, // 17000
  {
    name: "Sepolia",
    chainId: "0xaa36a7", // 11155111 en decimal
    symbol: "SepoliaETH",
    rpcUrl: "https://sepolia.infura.io/v3/your-infura-key",
    rpcUrlBackups: ["https://rpc.sepolia.org", "https://ethereum-sepolia.publicnode.com"],
    explorer: "https://sepolia.etherscan.io",
  },
  { name: "ETH Goerli", chainId: "0x5", symbol: "ETH", rpcUrl: "https://goerli.infura.io/v3/your-infura-key" }, // 5
]

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [accountAddress, setAccountAddress] = useState("")
  const [accountName, setAccountName] = useState("Usuario")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState(networks[2]) // Sepolia por defecto
  const [accountBalance, setAccountBalance] = useState(0)
  const [networkChanging, setNetworkChanging] = useState(false) // Estado para controlar si el cambio de red está en progreso
  const mobileMenuRef = useRef(null)
  const networkDropdownRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Referencia para llevar el seguimiento de intentos de conexión a RPC
  const rpcAttemptRef = useRef(0)

  // Mejorar la función fetchBalance para manejar mejor la conexión a Sepolia
  const fetchBalance = async (address, network) => {
    if (!address) return 0

    try {
      let provider = null
      let connected = false
      rpcAttemptRef.current = 0

      // Función para intentar conectar con un proveedor dado una URL RPC
      const tryProvider = async (rpcUrl) => {
        if (connected) return true // Ya se conectó con éxito

        try {
          rpcAttemptRef.current++
          console.log(`Intento ${rpcAttemptRef.current} con URL: ${rpcUrl}`)

          // Para Infura, asegurarse de que la clave API esté presente
          if (rpcUrl.includes("infura.io") && !rpcUrl.includes("your-infura-key")) {
            console.warn("URL de Infura sin clave API válida, intentando con URL alternativa")
            return false
          }

          const tempProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
          // Verificar que el proveedor funciona con una llamada simple
          await tempProvider.getNetwork()

          // Si llegamos aquí, la conexión fue exitosa
          provider = tempProvider
          connected = true
          console.log(`Conexión exitosa a ${rpcUrl}`)
          return true
        } catch (error) {
          console.warn(`Error con RPC ${rpcUrl}:`, error.message)
          return false
        }
      }

      // Intentar con la URL RPC principal
      if (network.rpcUrl) {
        await tryProvider(network.rpcUrl)
      }

      // Si no funciona y hay URLs de respaldo, intentar con ellas
      if (!connected && network.rpcUrlBackups && Array.isArray(network.rpcUrlBackups)) {
        for (const backupUrl of network.rpcUrlBackups) {
          const success = await tryProvider(backupUrl)
          if (success) break
        }
      }

      // Si es Sepolia y aún no se ha conectado, intentar con una URL pública conocida
      if (!connected && network.name === "Sepolia") {
        console.log("Intentando con URL pública para Sepolia")
        await tryProvider("https://rpc.sepolia.org")
      }

      // Si ninguna URL funcionó
      if (!connected) {
        console.error(`No se pudo conectar a ningún RPC para ${network.name}`)
        return 0
      }

      // Obtener el saldo de la billetera
      const balanceWei = await provider.getBalance(address)

      // Convertir de Wei a Ether
      const balanceEth = ethers.utils.formatEther(balanceWei)
      const balanceFloat = Number.parseFloat(balanceEth)

      console.log(`Saldo obtenido en ${network.name}: ${balanceFloat} ${network.symbol}`)

      // Actualizar el estado
      setAccountBalance(balanceFloat)

      // Actualizar el estado de navegación con el nuevo saldo
      navigate(location.pathname, {
        state: {
          network: network.name,
          balance: balanceFloat,
          accountAddress: address,
          accountName,
        },
        replace: true,
      })

      return balanceFloat
    } catch (error) {
      console.error(`Error al obtener el saldo en la red ${network.name}:`, error)
      return 0
    }
  }

  // Efecto para recuperar la dirección de la billetera
  useEffect(() => {
    const getWalletAddress = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            setAccountAddress(accounts[0])
            // Obtener el saldo inicial una vez que tenemos la dirección
            fetchBalance(accounts[0], selectedNetwork)
          }
        } catch (error) {
          console.error("Error al obtener la dirección de la billetera:", error)
        }
      }
    }

    getWalletAddress()
  }, [])

  // Escuchar cambios en las cuentas de MetaMask
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setAccountAddress(accounts[0])
          // Actualizar el saldo cuando cambia la cuenta
          await fetchBalance(accounts[0], selectedNetwork)
        } else {
          setAccountAddress("")
          setAccountBalance(0)
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [selectedNetwork])

  // Escuchar cambios en la red de MetaMask
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleChainChanged = async (chainId) => {
        // No procesar si estamos en medio de un cambio de red manual
        if (networkChanging) {
          console.log("Ignorando evento chainChanged durante cambio manual de red")
          return
        }

        console.log("Detectado cambio de red a chainId:", chainId)
        // Identificar la red basada en el chainId
        const networkFound = networks.find((n) => n.chainId === chainId)
        if (networkFound) {
          setSelectedNetwork(networkFound)

          // Actualizar el saldo inmediatamente para la nueva red
          if (accountAddress) {
            const newBalance = await fetchBalance(accountAddress, networkFound)

            // Mostrar notificación
            setNotificationMessage(
              `Red cambiada a ${networkFound.name}. Saldo: ${newBalance.toFixed(6)} ${networkFound.symbol}`,
            )
            setShowNotification(true)

            setTimeout(() => {
              setShowNotification(false)
            }, 3000)
          }
        }
      }

      // Obtener chainId actual al iniciar
      const getCurrentChain = async () => {
        try {
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          const networkFound = networks.find((n) => n.chainId === chainId)
          if (networkFound && networkFound.name !== selectedNetwork.name) {
            setSelectedNetwork(networkFound)

            // Actualizar el saldo para la red actual
            if (accountAddress) {
              await fetchBalance(accountAddress, networkFound)
            }
          }
        } catch (error) {
          console.error("Error al obtener la red actual:", error)
        }
      }

      getCurrentChain()
      window.ethereum.on("chainChanged", handleChainChanged)

      // Limpieza del evento al desmontar el componente
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [accountAddress, networkChanging])

  useEffect(() => {
    // Verificar si hay información de estado en la ubicación
    if (location.state) {
      const {
        showNotification: shouldShowNotification,
        accountAddress: account,
        accountName: name,
        network,
      } = location.state

      if (shouldShowNotification) {
        setShowNotification(true)
        setNotificationMessage("¡Bienvenido! Has iniciado sesión correctamente")
        // Ocultar la notificación después de 3 segundos
        setTimeout(() => {
          setShowNotification(false)
        }, 3000)
      }

      if (account) {
        setAccountAddress(account)
      }

      if (name) {
        setAccountName(name)
      }

      // Solo actualizar la red si no estamos en un proceso de cambio
      if (network && !networkChanging) {
        const foundNetwork = networks.find((n) => n.name === network)
        if (foundNetwork && foundNetwork.name !== selectedNetwork.name) {
          setSelectedNetwork(foundNetwork)
          // Actualizar el saldo cuando cambia la red desde la navegación
          if (account) {
            fetchBalance(account, foundNetwork)
          }
        }
      }
    }
  }, [location, networkChanging])

  // Formatear la dirección de la cuenta para mostrar solo los primeros y últimos caracteres
  const formattedAddress = accountAddress
    ? `${accountAddress.slice(0, 6)}...${accountAddress.slice(-4)}`
    : "0x9f97...26d4" // Dirección por defecto si no hay ninguna

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const toggleNetworkDropdown = () => {
    setNetworkDropdownOpen(!networkDropdownOpen)
  }

  const handleNetworkChange = async (network) => {
    // No hacer nada si ya estamos cambiando de red o si es la misma red
    if (networkChanging || network.name === selectedNetwork.name) {
      setNetworkDropdownOpen(false)
      return
    }

    // Indicar que estamos en proceso de cambio de red
    setNetworkChanging(true)

    // Actualizar el estado local primero para UI inmediata
    setSelectedNetwork(network)
    setNetworkDropdownOpen(false)

    // Mostrar notificación al cambiar de red
    setNotificationMessage(`Cambiando a ${network.name}...`)
    setShowNotification(true)

    try {
      // Intentar cambiar la red en MetaMask
      if (typeof window.ethereum !== "undefined") {
        try {
          // Guardar el estado actual para pasarlo a las rutas
          const currentState = {
            network: network.name,
            balance: accountBalance,
            accountAddress,
            accountName,
            networkChanging: true, // Indicar que estamos cambiando de red
          }

          // Actualizar el estado de navegación antes de cambiar la red
          navigate(location.pathname, {
            state: currentState,
            replace: true,
          })

          console.log(`Intentando cambiar a red ${network.name} con chainId ${network.chainId}`)

          // Cambiar la red en MetaMask
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: network.chainId }],
          })

          // Esperar un momento para que MetaMask complete el cambio
          // Usamos setTimeout en lugar de una promesa para dar tiempo a que los eventos de MetaMask se procesen
          setTimeout(async () => {
            console.log(`Cambio exitoso a red ${network.name}, actualizando saldo...`)

            // Actualizar el saldo después de cambiar la red
            if (accountAddress) {
              const newBalance = await fetchBalance(accountAddress, network)

              // Actualizar la notificación con el saldo
              if (newBalance > 0) {
                setNotificationMessage(
                  `Red cambiada a ${network.name}. Saldo: ${newBalance.toFixed(6)} ${network.symbol}`,
                )
              } else {
                setNotificationMessage(`Red cambiada a ${network.name}. Verificando saldo...`)
              }

              // Actualizar el estado de navegación con el saldo actualizado
              navigate(location.pathname, {
                state: {
                  ...currentState,
                  balance: newBalance,
                  networkChanging: false,
                },
                replace: true,
              })
            }

            // Finalizar el proceso de cambio de red
            setNetworkChanging(false)
          }, 2000) // Aumentado el tiempo de espera para asegurar que MetaMask complete el cambio
        } catch (switchError) {
          // Si la red no está configurada en MetaMask, añadirla
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: network.chainId,
                    chainName: network.name,
                    nativeCurrency: {
                      name: "Ethereum",
                      symbol: network.symbol,
                      decimals: 18,
                    },
                    rpcUrls: network.rpcUrlBackups ? [network.rpcUrl, ...network.rpcUrlBackups] : [network.rpcUrl],
                    blockExplorerUrls: network.explorer ? [network.explorer] : null,
                  },
                ],
              })

              // Intentar cambiar a la red después de añadirla
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: network.chainId }],
              })

              // Esperar un momento para que MetaMask complete el cambio
              setTimeout(async () => {
                // Actualizar el saldo después de cambiar la red
                if (accountAddress) {
                  const newBalance = await fetchBalance(accountAddress, network)
                  setNotificationMessage(
                    `Red cambiada a ${network.name}. Saldo: ${newBalance.toFixed(6)} ${network.symbol}`,
                  )

                  // Actualizar el estado de navegación con el saldo actualizado
                  navigate(location.pathname, {
                    state: {
                      network: network.name,
                      balance: newBalance,
                      accountAddress,
                      accountName,
                      networkChanging: false,
                    },
                    replace: true,
                  })
                }

                // Finalizar el proceso de cambio de red
                setNetworkChanging(false)
              }, 2000)
            } catch (addError) {
              console.error("Error al añadir la red:", addError)
              setNotificationMessage(`Error al añadir la red ${network.name}`)
              setNetworkChanging(false)

              // Actualizar el estado de navegación con el error
              navigate(location.pathname, {
                state: {
                  network: selectedNetwork.name, // Volver a la red anterior
                  balance: accountBalance,
                  accountAddress,
                  accountName,
                  networkChanging: false,
                },
                replace: true,
              })
            }
          } else {
            console.error("Error al cambiar de red:", switchError)
            setNotificationMessage(`Error al cambiar a ${network.name}`)
            setNetworkChanging(false)

            // Actualizar el estado de navegación con el error
            navigate(location.pathname, {
              state: {
                network: selectedNetwork.name, // Volver a la red anterior
                balance: accountBalance,
                accountAddress,
                accountName,
                networkChanging: false,
              },
              replace: true,
            })
          }
        }
      }
    } catch (error) {
      console.error("Error al cambiar la red:", error)
      setNetworkChanging(false)

      // Actualizar el estado de navegación con el error
      navigate(location.pathname, {
        state: {
          network: selectedNetwork.name, // Volver a la red anterior
          balance: accountBalance,
          accountAddress,
          accountName,
          networkChanging: false,
        },
        replace: true,
      })
    }

    setTimeout(() => {
      if (showNotification) {
        setShowNotification(false)
      }
    }, 3000)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-menu")
      ) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Close network dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (networkDropdownOpen && networkDropdownRef.current && !networkDropdownRef.current.contains(event.target)) {
        setNetworkDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [networkDropdownOpen])

  // Navigation items with their respective icons and routes
  const navItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Enviar", icon: <Send size={18} />, path: "/send" },
    { name: "Historial", icon: <Clock size={18} />, path: "/history" },
    { name: "Contactos", icon: <Users size={18} />, path: "/contacts" },
  ]

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <div className="navbar-page">
      {showNotification && <div className="notification-banner">{notificationMessage}</div>}

      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src="/img/Pagape.png" alt="Logo" className="logo-image" />
            <span className="logo-text">
              <span className="blue-text">Paga</span>
              <span className="gold-text">Pe</span>
            </span>
          </div>

          <div className="navbar-right">
            <div className="navbar-buttons">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) => `navbar-button ${isActive ? "active" : ""}`}
                  onClick={closeMobileMenu}
                  state={{
                    network: selectedNetwork.name,
                    balance: accountBalance, // Pasar el saldo actual a todas las rutas
                    networkChanging: networkChanging, // Pasar estado de cambio de red
                  }}
                >
                  <span className="button-icon">{item.icon}</span>
                  <span className="button-text">{item.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="wallet-container">
              <div className="network-dropdown-container" ref={networkDropdownRef}>
                <div className={`wallet-selector ${networkChanging ? "disabled" : ""}`} onClick={toggleNetworkDropdown}>
                  <span>{selectedNetwork.name}</span>
                  <span className="dropdown-arrow">
                    <ChevronDown size={14} />
                  </span>
                </div>

                {networkDropdownOpen && (
                  <div className="network-dropdown">
                    {networks.map((network, index) => (
                      <div
                        key={index}
                        className={`network-option ${selectedNetwork.name === network.name ? "selected" : ""}`}
                        onClick={() => handleNetworkChange(network)}
                      >
                        <span>{network.name}</span>
                        {selectedNetwork.name === network.name && <Check size={14} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="wallet-address">
                <span className="account-name">{accountName}</span>
                <span className="address">{formattedAddress}</span>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Salir</span>
              </button>
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <div className={`hamburger-menu ${mobileMenuOpen ? "active" : ""}`} onClick={toggleMobileMenu}>
            <Menu size={24} color="white" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <div ref={mobileMenuRef} className={`mobile-menu-sidebar ${mobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <button className="close-menu-button" onClick={closeMobileMenu}>
            <X size={24} />
          </button>
        </div>

        <div className="mobile-menu-content">
          <div className="mobile-menu-buttons">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => `mobile-menu-button ${isActive ? "active" : ""}`}
                onClick={closeMobileMenu}
                state={{
                  network: selectedNetwork.name,
                  balance: accountBalance, // Pasar el saldo actual a todas las rutas
                  networkChanging: networkChanging, // Pasar estado de cambio de red
                }}
              >
                <span className="button-icon">{item.icon}</span>
                <span className="button-text">{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="mobile-wallet-container">
            <div className="network-dropdown-container">
              <div className={`wallet-selector ${networkChanging ? "disabled" : ""}`} onClick={toggleNetworkDropdown}>
                <span>{selectedNetwork.name}</span>
                <span className="dropdown-arrow">
                  <ChevronDown size={14} />
                </span>
              </div>

              {networkDropdownOpen && (
                <div className="mobile-network-dropdown">
                  {networks.map((network, index) => (
                    <div
                      key={index}
                      className={`network-option ${selectedNetwork.name === network.name ? "selected" : ""}`}
                      onClick={() => handleNetworkChange(network)}
                    >
                      <span>{network.name}</span>
                      {selectedNetwork.name === network.name && <Check size={14} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mobile-wallet-address">
              <span className="account-name">{accountName}</span>
              <span className="address">{formattedAddress}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      <div className={`mobile-menu-backdrop ${mobileMenuOpen ? "active" : ""}`} onClick={closeMobileMenu}></div>

      {/* This is where the child routes will be rendered */}
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  )
}

export default Navbar
