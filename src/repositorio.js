import { inicial } from './data.js'

const clave = 'huellitas.datos.v1'

export function leerDatos(almacen = localStorage) {
  const guardado = almacen.getItem(clave)
  return guardado ? JSON.parse(guardado) : { mascotas: inicial, solicitudes: [] }
}

export function guardarDatos(cambiar, almacen = localStorage) {
  const datos = cambiar(leerDatos(almacen))
  almacen.setItem(clave, JSON.stringify(datos))
  return datos
}
