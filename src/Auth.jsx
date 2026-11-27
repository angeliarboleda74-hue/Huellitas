import { useState } from 'react'
import { PawPrint } from 'lucide-react'
import { Foto } from './Foto.jsx'
import { inicial } from './data.js'

export default function Auth({ onEntrar }) {
  const [modo, setModo] = useState('registro')
  const [error, setError] = useState('')
  const registro = modo === 'registro'

  const enviar = (e) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.target))
    if (d.clave.length < 8) return setError('La contraseña debe tener mínimo 8 caracteres.')
    onEntrar({ nombre: d.nombre || d.correo.split('@')[0], rol: d.rol || 'Voluntario' })
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <aside className="auth-lado">
          <Foto mascota={inicial[0]} className="auth-foto" />
          <div className="auth-velo" />
          <div className="auth-texto">
            <span className="logo"><PawPrint /> Huellitas</span>
            <h2>{registro ? 'Únete al equipo' : 'Qué bueno verte de nuevo'}</h2>
            <p>Ayuda a que más mascotas encuentren una familia.</p>
          </div>
        </aside>
        <form className="auth-form" onSubmit={enviar}>
          <h1>{registro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
          <p className="suave">{registro ? 'Solo te tomará un minuto' : 'Ingresa con tu correo y contraseña'}</p>
          {registro && <label>Nombre completo<input name="nombre" required placeholder="Angely Arboleda" /></label>}
          <label>Correo electrónico<input name="correo" type="email" required placeholder="angeliarboleda74@gmail.com" /></label>
          {registro && (
            <label>Rol en el sistema
              <select name="rol" required defaultValue="">
                <option value="" disabled>Selecciona tu rol</option>
                <option>Veterinario</option><option>Voluntario</option><option>Administrador</option>
              </select>
            </label>
          )}
          <label>Contraseña<input name="clave" type="password" required placeholder="Mínimo 8 caracteres" /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-lila" type="submit">{registro ? 'Crear mi cuenta' : 'Entrar'}</button>
          <button type="button" className="enlace" onClick={() => { setModo(registro ? 'login' : 'registro'); setError('') }}>
            {registro ? '¿Ya tienes cuenta? Inicia sesión' : '¿Eres nuevo? Crea tu cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
