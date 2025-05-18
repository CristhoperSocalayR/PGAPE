"use client"

import { useState, useEffect, useCallback } from "react"
import "./Dashboard.css"
import { Send, History, Users, RefreshCw } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { ethers } from "ethers"

// Lista de redes disponibles
const networks = [
  {
    name: "ETH Mainnet",
    chainId: "0x1",
    symbol: "ETH",
    rpcUrl: "https://mainnet.infura.io/v3/your-infura-key",
  },
  {
    name: "Holesky",
    chainId: "0x4268",
    symbol: "ETH",
    rpcUrl: "https://holesky.drpc.org",
    explorer: "https://holesky.etherscan.io",
  },
  {
    name: "Sepolia",
    chainId: "0xaa36a7", // 11155111 en decimal
    symbol: "SepoliaETH",
    rpcUrl: "https://sepolia.infura.io/v3/your-infura-key",
    rpcUrlBackups: ["https://rpc.sepolia.org", "https://ethereum-sepolia.publicnode.com"],
    explorer: "https://sepolia.etherscan.io",
  },
  {
    name: "ETH Goerli",
    chainId: "0x5",
    symbol: "ETH",
    rpcUrl: "https://goerli.infura.io/v3/your-infura-key",
  },
]

const Dashboard = () => {
  const [balance, setBalance] = useState(0)
  const [walletAddress, setWalletAddress] = useState("")
  const [network, setNetwork] = useState("Sepolia")
  const [isLoading, setIsLoading] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [lastUpdated, setLastUpdated] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Función para acortar la dirección de la billetera
  const shortenedAddress = walletAddress
    ? `${walletAddress.substring(0, 7)}...${walletAddress.substring(walletAddress.length - 7)}`
    : ""

  // Función para obtener el saldo (memoizada con useCallback)
  const fetchBalance = useCallback(
    async (address, networkInfo) => {
      if (!address) return 0

      // Verificar si hay un cambio de red en progreso
      const isNetworkChanging = location.state && location.state.networkChanging
      if (isNetworkChanging) {
        console.log("Dashboard: Evitando fetchBalance durante cambio de red")
        return location.state.balance || 0
      }

      setIsLoading(true)
      try {
        let provider = null
        let connected = false

        // Función para intentar conectar con un proveedor dado una URL RPC
        const tryProvider = async (rpcUrl) => {
          if (connected) return true // Ya se conectó con éxito

          try {
            console.log(`Intentando conectar a: ${rpcUrl}`)

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
        if (networkInfo.rpcUrl) {
          await tryProvider(networkInfo.rpcUrl)
        }

        // Si no funciona y hay URLs de respaldo, intentar con ellas
        if (!connected && networkInfo.rpcUrlBackups && Array.isArray(networkInfo.rpcUrlBackups)) {
          for (const backupUrl of networkInfo.rpcUrlBackups) {
            const success = await tryProvider(backupUrl)
            if (success) break
          }
        }

        // Si es Sepolia y aún no se ha conectado, intentar con una URL pública conocida
        if (!connected && networkInfo.name === "Sepolia") {
          console.log("Intentando con URL pública para Sepolia")
          await tryProvider("https://rpc.sepolia.org")
        }

        // Si ninguna URL funcionó
        if (!connected) {
          console.error(`No se pudo conectar a ningún RPC para ${networkInfo.name}`)
          setIsLoading(false)
          return 0
        }

        // Obtener el saldo de la billetera
        const balanceWei = await provider.getBalance(address)

        // Convertir de Wei a Ether
        const balanceEth = ethers.utils.formatEther(balanceWei)
        const balanceFloat = Number.parseFloat(balanceEth)

        console.log(`Saldo obtenido en ${networkInfo.name}: ${balanceFloat} ${networkInfo.symbol}`)

        // Actualizar el estado y almacenar el momento de la última actualización
        setBalance(balanceFloat)
        setLastUpdated(Date.now())
        setIsLoading(false)

        // Actualizar el estado de navegación con el nuevo saldo y red
        navigate(location.pathname, {
          state: {
            ...location.state,
            network: networkInfo.name,
            balance: balanceFloat,
            accountAddress: address,
          },
          replace: true,
        })

        return balanceFloat
      } catch (error) {
        console.error(`Error al obtener el saldo en la red ${networkInfo.name}:`, error)
        setIsLoading(false)
        return 0
      }
    },
    [navigate, location.pathname, location.state],
  )

  // Obtener información de la red, dirección y saldo desde la navegación
  useEffect(() => {
    const fetchWalletAddress = async () => {
      // Verificar si MetaMask está instalado
      if (typeof window.ethereum !== "undefined") {
        try {
          // Obtener la dirección actual de MetaMask
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0])
          }
        } catch (error) {
          console.error("Error al obtener la dirección de la billetera:", error)
        }
      }
    }

    fetchWalletAddress()

    // Verificar si hay información de red y saldo en la navegación
    if (location.state) {
      if (location.state.network) {
        setNetwork(location.state.network)
      }

      // Si hay un saldo proporcionado en el state, usarlo directamente
      if (location.state.balance !== undefined) {
        setBalance(location.state.balance)
      }

      // Si hay una dirección proporcionada en el state, usarla
      if (location.state.accountAddress) {
        setWalletAddress(location.state.accountAddress)
      }
    }
  }, [location.state])

  // Configurar un intervalo para actualizar el saldo automáticamente
  useEffect(() => {
    // Solo establecer un intervalo si tenemos una dirección de wallet
    if (!walletAddress) return

    const currentNetwork = networks.find((n) => n.name === network) || networks[2]

    // Actualización inicial
    if (lastUpdated === null) {
      fetchBalance(walletAddress, currentNetwork)
    }

    // Establecer intervalo para actualizaciones automáticas (cada 2 minutos)
    const interval = setInterval(() => {
      fetchBalance(walletAddress, currentNetwork)
    }, 120000) // 2 minutos en lugar de 30 segundos

    return () => clearInterval(interval)
  }, [walletAddress, network, fetchBalance, lastUpdated])

  // Efecto para escuchar los eventos de bloques nuevos
  useEffect(() => {
    if (!walletAddress) return

    const currentNetwork = networks.find((n) => n.name === network) || networks[2]

    // Si no hay URL RPC, no podemos escuchar bloques
    if (!currentNetwork.rpcUrl) return

    try {
      // Crear un proveedor para escuchar nuevos bloques
      const provider = new ethers.providers.JsonRpcProvider(currentNetwork.rpcUrl)

      // Variable para almacenar el último número de bloque procesado
      let lastProcessedBlock = 0

      // Función que se ejecuta cuando se detecta un nuevo bloque
      const handleNewBlock = (blockNumber) => {
        // Evitar procesar el mismo bloque múltiples veces
        if (blockNumber <= lastProcessedBlock) return

        lastProcessedBlock = blockNumber
        console.log(`Nuevo bloque detectado: ${blockNumber}`)

        // Verificar si pasaron al menos 60 segundos desde la última actualización
        // para evitar actualizaciones demasiado frecuentes
        const now = Date.now()
        if (!lastUpdated || now - lastUpdated > 60000) {
          // 1 minuto en lugar de 5 segundos
          fetchBalance(walletAddress, currentNetwork)
        }
      }

      // Suscribirse al evento de nuevos bloques
      provider.on("block", handleNewBlock)

      // Limpiar el listener al desmontar
      return () => {
        provider.off("block", handleNewBlock)
      }
    } catch (error) {
      console.error("Error al configurar el listener de bloques:", error)
    }
  }, [walletAddress, network, fetchBalance, lastUpdated])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)

    // Mostrar notificación
    setNotificationMessage("Dirección copiada al portapapeles")
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const updateBalance = async () => {
    if (!walletAddress) return

    // Encontrar la información de la red actual
    const currentNetwork = networks.find((n) => n.name === network) || networks[2]

    setNotificationMessage(`Actualizando saldo en ${currentNetwork.name}...`)
    setShowNotification(true)

    const newBalance = await fetchBalance(walletAddress, currentNetwork)

    setNotificationMessage(`Saldo actualizado: ${newBalance.toFixed(6)} ${currentNetwork.symbol}`)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  // Escuchar cambios en la cuenta de MetaMask
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])

          // Obtener el saldo para la nueva cuenta
          const currentNetwork = networks.find((n) => n.name === network) || networks[2]
          const newBalance = await fetchBalance(accounts[0], currentNetwork)

          // Mostrar notificación
          setNotificationMessage(`Cuenta cambiada. Saldo: ${newBalance.toFixed(6)} ${currentNetwork.symbol}`)
          setShowNotification(true)
          setTimeout(() => {
            setShowNotification(false)
          }, 3000)
        } else {
          setWalletAddress("")
          setBalance(0)
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      // Limpieza del evento al desmontar el componente
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [network, fetchBalance])

  // Escuchar cambios en la red de MetaMask
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleChainChanged = async (chainId) => {
        // Verificar si el cambio de red está en progreso según el estado de navegación
        const isNetworkChanging = location.state && location.state.networkChanging

        if (isNetworkChanging) {
          console.log("Dashboard: Ignorando evento chainChanged porque networkChanging=true")
          return
        }

        console.log("Dashboard: Procesando evento chainChanged", chainId)

        // Identificar la red basada en el chainId
        const networkFound = networks.find((n) => n.chainId === chainId)
        if (networkFound) {
          setNetwork(networkFound.name)

          // Actualizar el saldo para la nueva red inmediatamente
          if (walletAddress) {
            setIsLoading(true)
            const newBalance = await fetchBalance(walletAddress, networkFound)
            setIsLoading(false)

            // Mostrar notificación al cambiar de red con el saldo actualizado
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

      // Obtener la red actual
      const getCurrentChain = async () => {
        try {
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          const networkFound = networks.find((n) => n.chainId === chainId)
          if (networkFound) {
            setNetwork(networkFound.name)
            // Actualizar el saldo para la red actual
            if (walletAddress) {
              setIsLoading(true)
              await fetchBalance(walletAddress, networkFound)
              setIsLoading(false)
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
  }, [walletAddress, fetchBalance, location.state])

  // Añadir un efecto para actualizar el saldo cuando cambia la red desde la navegación:
  useEffect(() => {
    // Si hay información de red en la navegación y es diferente a la actual
    if (location.state) {
      // Verificar si hay un cambio de red en progreso
      const isNetworkChanging = location.state.networkChanging

      if (location.state.network && location.state.network !== network) {
        console.log("Dashboard: Actualizando red desde location.state:", location.state.network)
        setNetwork(location.state.network)

        // Si hay un saldo proporcionado, usarlo directamente
        if (location.state.balance !== undefined) {
          setBalance(location.state.balance)
        }
        // Si no hay un cambio de red en progreso, actualizar el saldo
        else if (!isNetworkChanging && walletAddress) {
          // Buscar la información de la red
          const networkInfo = networks.find((n) => n.name === location.state.network) || networks[2]

          // Actualizar el saldo para la nueva red
          fetchBalance(walletAddress, networkInfo)
        }
      }
      // Si la red es la misma pero hay un saldo actualizado, usarlo
      else if (location.state.balance !== undefined) {
        setBalance(location.state.balance)
      }
    }
  }, [location.state, network, walletAddress, fetchBalance])

  // Encontrar el objeto de red actual
  const currentNetwork = networks.find((n) => n.name === network) || networks[2]

  return (
    <div className="dashboard-container">
      {showNotification && <div className="notification-banner">{notificationMessage}</div>}

      <div className="balance-card">
        <div className="balance-amount">
          {balance.toFixed(8)} {currentNetwork.symbol}
        </div>
        <div className="network-label">
          Red: {network}
          {lastUpdated && (
            <span className="last-updated">• Actualizado {new Date(lastUpdated).toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      <div className="wallet-card">
        <h2 className="card-title">Dirección de la Billetera</h2>
        <div className="wallet-address-container">
          <div className="wallet-address">{walletAddress}</div>
          <button className="copy-button" onClick={copyToClipboard}>
            Copiar
          </button>
        </div>
      </div>

      <div className="actions-card">
        <h2 className="card-title">Acciones Rápidas</h2>
        <div className="actions-container">
          <div
            className="action-button"
            onClick={() =>
              navigate("/send", {
                state: { network, balance, accountAddress: walletAddress },
              })
            }
          >
            <div className="action-icon-container">
              <Send size={24} className="action-icon" />
            </div>
            <div className="action-label">Enviar {currentNetwork.symbol}</div>
          </div>
          <div
            className="action-button"
            onClick={() =>
              navigate("/history", {
                state: { network, balance, accountAddress: walletAddress },
              })
            }
          >
            <div className="action-icon-container">
              <History size={24} className="action-icon" />
            </div>
            <div className="action-label">Ver Historial</div>
          </div>
          <div
            className="action-button"
            onClick={() =>
              navigate("/contacts", {
                state: { network, balance, accountAddress: walletAddress },
              })
            }
          >
            <div className="action-icon-container">
              <Users size={24} className="action-icon" />
            </div>
            <div className="action-label">Gestionar Contactos</div>
          </div>
        </div>
      </div>

      <div className="network-info-card">
        <h2 className="card-title">Información de Red</h2>
        <div className="info-row">
          <div className="info-label">Red Actual:</div>
          <div className="info-value">{network}</div>
        </div>
        <div className="info-divider"></div>
        <div className="info-row">
          <div className="info-label">Chain ID:</div>
          <div className="info-value">{currentNetwork.chainId}</div>
        </div>
        <div className="info-divider"></div>
        <div className="info-row">
          <div className="info-label">Dirección:</div>
          <div className="info-value">{shortenedAddress}</div>
        </div>
        {currentNetwork.explorer && (
          <>
            <div className="info-divider"></div>
            <div className="info-row">
              <div className="info-label">Explorador:</div>
              <div className="info-value">
                <a
                  href={`${currentNetwork.explorer}/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="explorer-link"
                >
                  {currentNetwork.explorer.replace("https://", "")}
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      <button className="update-button" onClick={updateBalance} disabled={isLoading}>
        {isLoading ? (
          <>
            <RefreshCw size={18} className="refresh-icon spinning" />
            Actualizando...
          </>
        ) : (
          <>
            <RefreshCw size={18} className="refresh-icon" />
            Actualizar Saldo
          </>
        )}
      </button>
    </div>
  )
}

export default Dashboard
