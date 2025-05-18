import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./Components/dapp/Home/Home"
import Login from "./Components/dapp/Login/Login"
import Navbar from "./Components/dapp/Navbar/Navbar"
import Dashboard from "./Components/dapp/Dashboard/Dashboard"

// Placeholder components for other pages (you can replace these with your actual components)
const SendPage = () => (
  <div className="page-container">
    <h2>Enviar ETH</h2>
    <p>Aquí podrás enviar ETH a otras direcciones.</p>
  </div>
)

const HistoryPage = () => (
  <div className="page-container">
    <h2>Historial de Transacciones</h2>
    <p>Aquí verás tu historial de transacciones.</p>
  </div>
)

const ContactsPage = () => (
  <div className="page-container">
    <h2>Gestionar Contactos</h2>
    <p>Aquí podrás gestionar tus contactos.</p>
  </div>
)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Navbar as a layout with nested routes */}
        <Route path="/menu" element={<Navbar />}>
          {/* Default redirect to dashboard when accessing /menu */}
          <Route index element={<Navigate to="/menu/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="send" element={<SendPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="contacts" element={<ContactsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
