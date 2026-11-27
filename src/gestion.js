export function guardarMascota(datos, mascota) {
  if (datos.mascotas.some((registro) => registro.id === mascota.id)) {
    return { ...datos, mascotas: datos.mascotas.map((registro) => registro.id === mascota.id ? mascota : registro) }
  }
  return { ...datos, mascotas: [mascota, ...datos.mascotas] }
}

export function desactivarMascota(datos, id) {
  return {
    ...datos,
    mascotas: datos.mascotas.map((mascota) => mascota.id === id ? { ...mascota, activa: false } : mascota),
  }
}

export function solicitarAdopcion(datos, solicitud) {
  const mascota = datos.mascotas.find((registro) => registro.id === solicitud.mascotaId)
  if (!mascota || mascota.activa === false || mascota.estado !== 'En adopción') {
    throw new Error('Esta mascota ya no está disponible para adopción.')
  }
  return { ...datos, solicitudes: [{ ...solicitud, estado: 'Pendiente' }, ...datos.solicitudes] }
}
