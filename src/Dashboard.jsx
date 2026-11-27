import { useState } from 'react'
import { LayoutDashboard, PawPrint, CalendarClock, ClipboardList, LogOut, Search, Dog, Cat, Rabbit, History, Plus, X, Upload } from 'lucide-react'
import { Foto } from './Foto.jsx'
import { citas } from './data.js'
import { leerDatos, guardarDatos } from './repositorio.js'
import { guardarMascota, desactivarMascota, solicitarAdopcion } from './gestion.js'
import { FormularioSolicitud, ListaSolicitudes } from './Solicitudes.jsx'

const menu = [
  { id: 'panel', texto: 'Panel', Icono: LayoutDashboard },
  { id: 'adopciones', texto: 'Adopciones', Icono: PawPrint },
  { id: 'solicitudes', texto: 'Solicitudes', Icono: ClipboardList },
  { id: 'citas', texto: 'Citas', Icono: CalendarClock },
  { id: 'registro', texto: 'Registro', Icono: ClipboardList },
]
const tabs = [
  { id: 'Recientes', Icono: History }, { id: 'Perro', texto: 'Perros', Icono: Dog },
  { id: 'Gato', texto: 'Gatos', Icono: Cat }, { id: 'Otro', texto: 'Otros', Icono: Rabbit },
]

function Grilla({ lista, catalogo, onElegir }) {
  if (!lista.length) return <p className="vacio">No hay mascotas para mostrar. Registra una nueva desde la sección Registro.</p>
  return (
    <div className="grilla">
      {lista.map((m) => (
        <article className="mascota" key={m.id}>
          <Foto key={m.foto || m.nombre} mascota={m} />
          <div className="mascota-info">
            <h3>{m.nombre}</h3>
            <p>{m.raza} · {m.edad} · {m.genero}</p>
            <span className={m.estado === 'Adoptado' ? 'estado ok' : 'estado'}>{m.estado}</span>
            <button className="btn btn-gris" onClick={() => onElegir(m)}>
              {catalogo ? 'Solicitar adopción' : 'Ver ficha'}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function Registro({ mascota, onGuardar, onCerrar }) {
  const [foto, setFoto] = useState(mascota?.foto ?? '')
  const [errorFoto, setErrorFoto] = useState('')
  const [leyendoFoto, setLeyendoFoto] = useState(false)
  const campo = (nombre, etiqueta, opciones, extra = {}) => {
    const valor = nombre === 'edad' ? mascota?.edadAnios ?? parseFloat(mascota?.edad) / (mascota?.edad?.includes('mes') ? 12 : 1) : mascota?.[nombre]
    return (
      <label>{etiqueta}
        {opciones
          ? <select name={nombre} required defaultValue={valor ?? ''}><option value="" disabled>Seleccionar</option>{opciones.map((o) => <option key={o}>{o}</option>)}</select>
          : <input name={nombre} required defaultValue={Number.isNaN(valor) ? '' : valor ?? ''} pattern={extra.type ? undefined : '.*\\S.*'} {...extra} />}
      </label>
    )
  }

  const enviar = (e) => {
    e.preventDefault()
    const campos = Object.fromEntries([...new FormData(e.currentTarget)].map(([nombre, valor]) => [nombre, valor.trim()]))
    onGuardar({
      ...mascota,
      ...campos,
      id: mascota?.id ?? crypto.randomUUID(),
      edadAnios: campos.edad,
      edad: `${campos.edad} años`,
      estado: mascota?.estado ?? 'En adopción',
      activa: true,
      foto,
    })
  }

  function cargarFoto(evento) {
    const archivo = evento.target.files[0]
    if (!archivo) return
    if (!['image/png', 'image/jpeg'].includes(archivo.type) || archivo.size > 2 * 1024 * 1024) {
      setErrorFoto('Elige una imagen JPG o PNG de hasta 2 MB.')
      return
    }
    setLeyendoFoto(true)
    setErrorFoto('')
    const lector = new FileReader()
    lector.onload = () => setFoto(lector.result)
    lector.onerror = () => setErrorFoto('No se pudo leer la foto.')
    lector.onloadend = () => setLeyendoFoto(false)
    lector.readAsDataURL(archivo)
  }

  return (
    <form className="tarjeta-form" onSubmit={enviar}>
      <button type="button" className="cerrar" onClick={onCerrar} aria-label="Cerrar"><X /></button>
      <h2>{mascota ? 'Editar mascota' : 'Registrar mascota'}</h2>
      <div className="cols">
        <div className="fila">
          {campo('nombre', 'Nombre de la mascota')}
          {campo('tipo', 'Tipo', ['Perro', 'Gato', 'Otro'])}
          {campo('raza', 'Raza')}
          {campo('genero', 'Género', ['Hembra', 'Macho'])}
          {campo('edad', 'Edad (años)', null, { type: 'number', min: 0, step: 'any' })}
          {campo('peso', 'Peso (kg)', null, { type: 'number', min: 0, step: '0.1' })}
        </div>
        <div className="fila">
          {campo('tamano', 'Tamaño', ['Pequeño', 'Mediano', 'Grande'])}
          {campo('color', 'Color')}
          {campo('pelaje', 'Pelaje', ['Corto', 'Medio', 'Largo'])}
          {campo('esterilizado', 'Esterilizado', ['Sí', 'No'])}
          {campo('microchip', 'Microchip #')}
          {campo('rabia', 'Carné de rabia #')}
        </div>
      </div>
      <h3 className="sub-form">Información del dueño</h3>
      <div className="cols">
        <div className="fila">
          {campo('dueno', 'Nombre completo')}
          {campo('direccion', 'Dirección')}
        </div>
        <div className="subir">
          <div className="vista">{foto ? <img src={foto} alt="Vista previa" /> : <PawPrint size={36} />}</div>
          <div>
            <strong>Subir foto</strong>
            <small>JPG o PNG, máximo 2 MB</small>
            <label className="btn btn-gris"><Upload size={18} /> Elegir foto
              <input type="file" accept="image/png,image/jpeg" hidden disabled={leyendoFoto} onChange={cargarFoto} />
            </label>
          </div>
        </div>
      </div>
      <p className="error" role="alert">{errorFoto}</p>
      <button className="btn btn-lila ancho" type="submit" disabled={leyendoFoto}><Plus size={18} /> Guardar mascota</button>
    </form>
  )
}

export default function Dashboard({ usuario, onSalir }) {
  const [vista, setVista] = useState('panel')
  const [tab, setTab] = useState('Recientes')
  const [q, setQ] = useState('')
  const [datos, setDatos] = useState(leerDatos)
  const [seleccion, setSeleccion] = useState(null)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')
  const mascota = datos.mascotas.find((registro) => registro.id === seleccion)
  const activas = datos.mascotas.filter((registro) => registro.activa !== false)
  const catalogo = vista === 'adopciones'
  const filtradas = activas
    .filter((m) => (catalogo ? m.estado === 'En adopción' : tab === 'Recientes' || m.tipo === tab))
    .filter((m) => `${m.nombre} ${m.raza}`.toLowerCase().includes(q.trim().toLowerCase()))
  const enAdopcion = activas.filter((m) => m.estado === 'En adopción').length

  function navegar(destino, id = null) {
    setSeleccion(id)
    setVista(destino)
    setAviso('')
    setError('')
    setQ('')
  }

  function persistir(cambiar, destino, mensaje) {
    try {
      setDatos(guardarDatos(cambiar))
      navegar(destino)
      setTab('Recientes')
      setAviso(mensaje)
    } catch (fallo) {
      setError(fallo.name === 'QuotaExceededError'
        ? 'El almacenamiento del navegador está lleno. Prueba con una foto más pequeña.'
        : fallo.message)
    }
  }

  return (
    <div className="app">
      <aside className="lateral">
        <span className="logo"><PawPrint /> Huellitas</span>
        <nav>
          {menu.map(({ id, texto, Icono }) => (
            <button key={id} className={vista === id ? 'item activo' : 'item'} onClick={() => navegar(id)}>
              <Icono size={22} /> {texto}
              {id === 'adopciones' && <span className="insignia">{enAdopcion}</span>}
            </button>
          ))}
          <button className="item" onClick={onSalir}><LogOut size={22} /> Cerrar sesión</button>
        </nav>
        <div className="perfil">
          <span className="avatar">{usuario.nombre.charAt(0).toUpperCase()}</span>
          <div><strong>{usuario.nombre}</strong><small>{usuario.rol}</small></div>
        </div>
      </aside>

      <main className="contenido">
        {(vista === 'panel' || catalogo) && <label className="buscar"><Search size={22} />
          <input placeholder="Buscar por nombre o raza" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
        </label>}
        {error && <p className="error" role="alert">{error}</p>}
        {aviso && <div className="aviso" role="status">{aviso}</div>}

        {vista === 'panel' && (
          <>
            <div className="barra-tabs">
              <div className="tabs">
                {tabs.map(({ id, texto, Icono }) => (
                  <button key={id} className={tab === id ? 'tab activo' : 'tab'} onClick={() => setTab(id)}><Icono size={22} /> {texto || id}</button>
                ))}
              </div>
              <button className="btn btn-tinta" onClick={() => navegar('registro')}><Plus size={18} /> Registrar mascota</button>
            </div>
            <Grilla lista={filtradas} onElegir={(registro) => navegar('ficha', registro.id)} />
          </>
        )}
        {vista === 'adopciones' && <><h1 className="titulo">Mascotas en adopción</h1><Grilla lista={filtradas} catalogo onElegir={(registro) => navegar('solicitar', registro.id)} /></>}
        {vista === 'citas' && (
          <>
            <h1 className="titulo">Citas de hoy</h1>
            <ul className="citas">
              {citas.map((c) => (
                <li key={c.hora}><strong>{c.hora}</strong><div><b>{c.mascota}</b><span>{c.motivo}</span></div><small>{c.dueno}</small></li>
              ))}
            </ul>
          </>
        )}
        {vista === 'ficha' && mascota && (
          <section className="tarjeta-form">
            <h2>{mascota.nombre} <span>#{mascota.id}</span></h2>
            <dl className="ficha">
              {Object.entries({
                Tipo: mascota.tipo, Raza: mascota.raza, Edad: mascota.edad, Género: mascota.genero,
                Estado: mascota.estado, Peso: mascota.peso && `${mascota.peso} kg`, Tamaño: mascota.tamano,
                Color: mascota.color, Pelaje: mascota.pelaje, Esterilizado: mascota.esterilizado,
                Microchip: mascota.microchip, 'Carné de rabia': mascota.rabia,
                Responsable: mascota.dueno, Dirección: mascota.direccion,
              }).map(([campo, valor]) => <div key={campo}><dt>{campo}</dt><dd>{valor ?? 'Sin dato'}</dd></div>)}
            </dl>
            <div className="acciones">
              <button className="btn btn-lila" onClick={() => navegar('registro', mascota.id)}>Editar mascota</button>
              <button className="btn btn-gris" onClick={() => {
                if (window.confirm(`¿Desactivar a ${mascota.nombre}?`)) {
                  persistir((actual) => desactivarMascota(actual, mascota.id), 'panel', `${mascota.nombre} fue desactivada.`)
                }
              }}>Desactivar mascota</button>
              <button className="btn btn-gris" onClick={() => navegar('panel')}>Volver al panel</button>
            </div>
          </section>
        )}
        {vista === 'registro' && <Registro key={seleccion ?? 'nueva'} mascota={mascota}
          onGuardar={(registro) => persistir((actual) => guardarMascota(actual, registro), 'panel', `Se guardó la ficha de ${registro.nombre}.`)}
          onCerrar={() => mascota ? navegar('ficha', mascota.id) : navegar('panel')} />}
        {vista === 'solicitar' && mascota && <FormularioSolicitud mascota={mascota}
          onGuardar={(solicitud) => persistir((actual) => solicitarAdopcion(actual, solicitud), 'solicitudes', 'Solicitud de adopción enviada.')}
          onCerrar={() => navegar('adopciones')} />}
        {vista === 'solicitudes' && <ListaSolicitudes solicitudes={datos.solicitudes} mascotas={datos.mascotas} />}
      </main>
    </div>
  )
}
