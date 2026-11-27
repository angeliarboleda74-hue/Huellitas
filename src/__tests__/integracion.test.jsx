// Pruebas de integración – Persona 2: mascotas → catálogo → solicitud → módulo Solicitudes
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import Dashboard from '../Dashboard.jsx'

const usuario = { nombre: 'Demo', rol: 'Administrador' }
const montar = () => render(<Dashboard usuario={usuario} onSalir={() => {}} />)
const ir = (u, texto) => u.click(screen.getByRole('button', { name: new RegExp(`^${texto}`) }))

async function registrarMascota(u, nombre) {
  await ir(u, 'Registro')
  const form = screen.getByRole('heading', { name: 'Registrar mascota' }).closest('form')
  const q = (n) => form.querySelector(`[name="${n}"]`)
  await u.type(q('nombre'), nombre)
  await u.selectOptions(q('tipo'), 'Perro')
  await u.type(q('raza'), 'Criollo')
  await u.selectOptions(q('genero'), 'Hembra')
  await u.type(q('edad'), '2')
  await u.type(q('peso'), '8')
  await u.selectOptions(q('tamano'), 'Mediano')
  await u.type(q('color'), 'Café')
  await u.selectOptions(q('pelaje'), 'Corto')
  await u.selectOptions(q('esterilizado'), 'Sí')
  await u.type(q('microchip'), '123')
  await u.type(q('rabia'), '456')
  await u.type(q('dueno'), 'Ana Prueba')
  await u.type(q('direccion'), 'Calle 1 # 2-3')
  await u.click(screen.getByRole('button', { name: /Guardar mascota/ }))
}

async function solicitar(u, nombre) {
  await ir(u, 'Adopciones')
  const tarjeta = screen.getByRole('heading', { name: nombre }).closest('article')
  await u.click(within(tarjeta).getByRole('button', { name: 'Solicitar adopción' }))
  await u.type(screen.getByLabelText(/Nombre completo/), 'Carlos Solicitante')
  await u.type(screen.getByLabelText(/Correo/), 'carlos@correo.com')
  await u.type(screen.getByLabelText(/Motivo/), 'Quiero darle un hogar')
  await u.click(screen.getByRole('button', { name: 'Enviar solicitud' }))
}

beforeEach(() => { cleanup(); localStorage.clear() })

describe('Catálogo de adopciones', () => {
  it('muestra solo mascotas "En adopción" (Thor, Adoptado, no aparece)', async () => {
    const u = userEvent.setup(); montar()
    await ir(u, 'Adopciones')
    expect(screen.getByRole('heading', { name: 'Canela' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Thor' })).not.toBeInTheDocument()
  })

  it('una mascota recién registrada aparece en el catálogo', async () => {
    const u = userEvent.setup(); montar()
    await registrarMascota(u, 'Kiara Demo')
    await ir(u, 'Adopciones')
    expect(screen.getByRole('heading', { name: 'Kiara Demo' })).toBeInTheDocument()
  })

  it('el buscador filtra el catálogo', async () => {
    const u = userEvent.setup(); montar()
    await ir(u, 'Adopciones')
    await u.type(screen.getByLabelText('Buscar'), 'luna')
    expect(screen.getByRole('heading', { name: 'Luna' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Canela' })).not.toBeInTheDocument()
  })

  it('una mascota desactivada desaparece del catálogo', async () => {
    const u = userEvent.setup(); montar()
    await registrarMascota(u, 'Kiara Demo')
    const t = screen.getByRole('heading', { name: 'Kiara Demo' }).closest('article')
    await u.click(within(t).getByRole('button', { name: 'Ver ficha' }))
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await u.click(screen.getByRole('button', { name: 'Desactivar mascota' }))
    await ir(u, 'Adopciones')
    expect(screen.queryByRole('heading', { name: 'Kiara Demo' })).not.toBeInTheDocument()
  })
})

describe('Solicitudes de adopción', () => {
  it('abre el formulario de la mascota elegida', async () => {
    const u = userEvent.setup(); montar()
    await ir(u, 'Adopciones')
    const t = screen.getByRole('heading', { name: 'Rocky' }).closest('article')
    await u.click(within(t).getByRole('button', { name: 'Solicitar adopción' }))
    expect(screen.getByRole('heading', { name: 'Solicitar adopción de Rocky' })).toBeInTheDocument()
  })

  it('la solicitud enviada aparece como Pendiente en Solicitudes', async () => {
    const u = userEvent.setup(); montar()
    await solicitar(u, 'Canela')
    expect(screen.getByRole('heading', { name: /Solicitudes de adopción/ })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Solicitud de adopción enviada.')
    expect(screen.getByText(/Canela · #956781/)).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByText(/Carlos Solicitante/)).toBeInTheDocument()
  })

  it('la solicitud sigue ahí tras "recargar" (desmontar y volver a montar)', async () => {
    const u = userEvent.setup(); montar()
    await solicitar(u, 'Canela')
    cleanup(); montar()
    await ir(u, 'Solicitudes')
    expect(screen.getByText(/Canela · #956781/)).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('flujo completo con mascota nueva: registrar → catálogo → solicitar → Solicitudes', async () => {
    const u = userEvent.setup(); montar()
    await registrarMascota(u, 'Kiara Demo')
    await solicitar(u, 'Kiara Demo')
    expect(screen.getByText(/Kiara Demo · #/)).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('si la mascota se desactiva, la solicitud se conserva y lo indica', async () => {
    const u = userEvent.setup(); montar()
    await registrarMascota(u, 'Kiara Demo')
    await solicitar(u, 'Kiara Demo')
    await ir(u, 'Panel')
    const t = screen.getByRole('heading', { name: 'Kiara Demo' }).closest('article')
    await u.click(within(t).getByRole('button', { name: 'Ver ficha' }))
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await u.click(screen.getByRole('button', { name: 'Desactivar mascota' }))
    await ir(u, 'Solicitudes')
    expect(screen.getByText(/Kiara Demo · #/)).toBeInTheDocument()
    expect(screen.getByText('Mascota desactivada')).toBeInTheDocument()
  })
})
