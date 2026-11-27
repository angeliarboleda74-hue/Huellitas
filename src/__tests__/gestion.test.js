// Pruebas de la lógica (gestion.js + repositorio.js) relacionadas con solicitudes – Persona 2
import { describe, it, expect } from 'vitest'
import { solicitarAdopcion, desactivarMascota, guardarMascota } from '../gestion.js'
import { leerDatos, guardarDatos } from '../repositorio.js'
import { inicial } from '../data.js'

const base = () => ({ mascotas: inicial, solicitudes: [] })
const sol = (mascotaId) => ({ id: 's1', mascotaId, solicitante: 'Ana', correo: 'a@a.co', motivo: 'x', fecha: new Date().toISOString() })
const memoria = () => { const m = {}; return { getItem: (k) => m[k] ?? null, setItem: (k, v) => { m[k] = v } } }

describe('solicitarAdopcion', () => {
  it('crea la solicitud en estado Pendiente ligada por id', () => {
    const r = solicitarAdopcion(base(), sol(956781))
    expect(r.solicitudes).toHaveLength(1)
    expect(r.solicitudes[0]).toMatchObject({ mascotaId: 956781, estado: 'Pendiente' })
  })
  it('rechaza mascota ya adoptada', () => {
    expect(() => solicitarAdopcion(base(), sol(956783))).toThrow(/ya no está disponible/)
  })
  it('rechaza mascota desactivada', () => {
    const d = desactivarMascota(base(), 956781)
    expect(() => solicitarAdopcion(d, sol(956781))).toThrow(/ya no está disponible/)
  })
  it('rechaza id inexistente', () => {
    expect(() => solicitarAdopcion(base(), sol(999))).toThrow()
  })
  it('no modifica los datos originales (inmutabilidad)', () => {
    const d = base(); solicitarAdopcion(d, sol(956781))
    expect(d.solicitudes).toHaveLength(0)
  })
})

describe('integración mascotas ↔ solicitudes', () => {
  it('una mascota nueva puede recibir solicitud', () => {
    const nueva = { id: 'abc', nombre: 'Kiara', estado: 'En adopción', activa: true }
    const r = solicitarAdopcion(guardarMascota(base(), nueva), sol('abc'))
    expect(r.solicitudes[0].mascotaId).toBe('abc')
  })
  it('editar la mascota no rompe la solicitud (se enlaza por id)', () => {
    let d = solicitarAdopcion(base(), sol(956781))
    d = guardarMascota(d, { ...d.mascotas[0], nombre: 'Canela 2' })
    const m = d.mascotas.find((x) => x.id === d.solicitudes[0].mascotaId)
    expect(m.nombre).toBe('Canela 2')
  })
  it('desactivar conserva la solicitud', () => {
    const d = desactivarMascota(solicitarAdopcion(base(), sol(956781)), 956781)
    expect(d.solicitudes).toHaveLength(1)
  })
})

describe('repositorio (persistencia)', () => {
  it('guarda y vuelve a leer las solicitudes', () => {
    const al = memoria()
    guardarDatos((d) => solicitarAdopcion(d, sol(956781)), al)
    expect(leerDatos(al).solicitudes).toHaveLength(1)
  })
})
