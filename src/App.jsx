import { useState } from 'react'
import './App.css'
import Auth from './Auth.jsx'
import Dashboard from './Dashboard.jsx'

export default function App() {
  const [usuario, setUsuario] = useState(null)
  return usuario
    ? <Dashboard usuario={usuario} onSalir={() => setUsuario(null)} />
    : <Auth onEntrar={setUsuario} />
}
