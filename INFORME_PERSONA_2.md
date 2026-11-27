# Informe – Persona 2: Integración de módulos (Huellitas)

**Resultado: la integración Mascotas → Catálogo → Solicitud → Módulo Solicitudes funciona correctamente.**
Se verificó con 18 pruebas automáticas (todas pasan) y con el recorrido manual de abajo.

## 1. Qué se revisó y resultado

| Responsabilidad | Resultado | Cómo funciona |
|---|---|---|
| Revisar el catálogo de adopciones | ✅ OK | Sección **Adopciones** muestra solo mascotas activas con estado "En adopción". Tiene buscador por nombre/raza y contador en el menú. |
| Mascotas registradas aparecen en el catálogo | ✅ OK | Al registrar una mascota nueva queda "En adopción" y aparece de inmediato en Adopciones. |
| Seleccionar una mascota | ✅ OK | Botón **Solicitar adopción** en cada tarjeta abre el formulario con el nombre de esa mascota. |
| Envío de solicitudes | ✅ OK | Valida nombre, correo y motivo (no acepta espacios vacíos). Si la mascota ya no está disponible, muestra error. |
| Solicitudes aparecen en su módulo | ✅ OK | Tras enviar, lleva a **Solicitudes** con estado *Pendiente*, ligada a la mascota por su ID. Se conserva al recargar. |

Casos extra comprobados:
- Thor (estado "Adoptado") **no** aparece en el catálogo.
- Una mascota desactivada desaparece del catálogo, pero su solicitud **se conserva** y muestra "Mascota desactivada".
- Si se edita el nombre de la mascota, la solicitud muestra el nombre nuevo (se enlaza por ID, no por nombre).

## 2. Recorrido manual para probar (≈3 minutos)

1. `npm install` y `npm run dev`; abrir la dirección que indique Vite. Crear cuenta (demo).
2. **Registro** → crear "Kiara Demo" con todos los campos → Guardar.
3. **Adopciones** → buscar "Kiara" → debe aparecer. Verificar que **Thor no está**.
4. Clic en **Solicitar adopción** → llenar nombre, correo, motivo → **Enviar solicitud**.
5. Se abre **Solicitudes**: debe verse "Kiara Demo · #…", tus datos y **Pendiente**.
6. Recargar (F5), entrar de nuevo → Solicitudes → la solicitud sigue ahí.
7. (Opcional) Panel → Kiara → Ver ficha → Desactivar → Adopciones ya no la muestra; Solicitudes dice "Mascota desactivada".

## 3. Pruebas automáticas

Archivos: `src/__tests__/integracion.test.jsx` (9, simulan clics en pantalla) y `src/__tests__/gestion.test.js` (9, lógica y almacenamiento).

Instalar y ejecutar:
```
npm i -D vitest@2 jsdom@24 @testing-library/react@16 @testing-library/dom@10 @testing-library/user-event@14 @testing-library/jest-dom@6
npx vitest run
```
Resultado: `Test Files 2 passed · Tests 18 passed`.
(Opcional: agregar `"test": "vitest run"` en `scripts` de package.json.)

## 4. Observaciones / limitaciones (no bloquean la entrega)

1. **Solicitudes duplicadas permitidas**: la misma persona puede pedir la misma mascota varias veces.
2. **Las solicitudes no se pueden aprobar ni rechazar**: siempre quedan "Pendiente"; al enviar una, la mascota sigue "En adopción".
3. **Datos solo en el navegador** (localStorage): cada navegador tiene su propia copia; no hay base de datos ni servidor.
4. **Foto de mascotas nuevas sin foto**: `Foto.jsx` pide una imagen en línea con `clave` que las mascotas nuevas no tienen (`.../undefined`); termina mostrando una imagen aleatoria o el ícono. Conviene omitir esa fuente cuando no hay `clave`.
5. **`npm run lint` falla con 2 errores** en `Dashboard.jsx` (líneas 175 y 200: "Icono is defined but never used"). Es un falso positivo de la configuración de ESLint (el componente sí se usa en JSX); es tema de Persona 3.
6. Los botones **Solicitudes** y **Registro** del menú usan el mismo ícono (detalle visual).
7. `crypto.randomUUID()` solo funciona en `localhost` o HTTPS; para la demo con `npm run dev` no hay problema.
