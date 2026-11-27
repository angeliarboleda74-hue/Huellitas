export function FormularioSolicitud({ mascota, onGuardar, onCerrar }) {
  function enviar(evento) {
    evento.preventDefault()
    const campos = Object.fromEntries(new FormData(evento.currentTarget))
    if (!campos.solicitante.trim() || !campos.motivo.trim()) {
      evento.currentTarget.reportValidity()
      return
    }
    onGuardar({
      id: crypto.randomUUID(),
      mascotaId: mascota.id,
      solicitante: campos.solicitante.trim(),
      correo: campos.correo.trim(),
      motivo: campos.motivo.trim(),
      fecha: new Date().toISOString(),
    })
  }

  return (
    <form className="tarjeta-form" onSubmit={enviar}>
      <h2>Solicitar adopción de {mascota.nombre}</h2>
      <div className="fila">
        <label>Nombre completo<input name="solicitante" required pattern={'.*\\S.*'} /></label>
        <label>Correo electrónico<input name="correo" type="email" required /></label>
      </div>
      <label>Motivo de adopción<input name="motivo" required pattern={'.*\\S.*'} /></label>
      <div className="acciones">
        <button className="btn btn-lila" type="submit">Enviar solicitud</button>
        <button className="btn btn-gris" type="button" onClick={onCerrar}>Cancelar</button>
      </div>
    </form>
  )
}

export function ListaSolicitudes({ solicitudes, mascotas }) {
  return (
    <>
      <h1 className="titulo">Solicitudes de adopción</h1>
      {solicitudes.length === 0 && <p className="vacio">Aún no hay solicitudes de adopción.</p>}
      <div className="grilla">
        {solicitudes.map((solicitud) => {
          const mascota = mascotas.find((registro) => registro.id === solicitud.mascotaId)
          return (
            <article className="mascota mascota-info" key={solicitud.id}>
              <h3>{mascota?.nombre ?? 'Mascota'} · #{solicitud.mascotaId}</h3>
              <p>{solicitud.solicitante} · {solicitud.correo}</p>
              <p>{solicitud.motivo}</p>
              <p>{new Date(solicitud.fecha).toLocaleDateString('es-CO')}</p>
              <strong>{solicitud.estado}</strong>
              {mascota?.activa === false && <p>Mascota desactivada</p>}
            </article>
          )
        })}
      </div>
    </>
  )
}
