# Huellitas · GA8-220501096-AA1-EV01

Aplicativo de gestión de mascotas y solicitudes de adopción.

## Ejecución local

1. Descomprime el ZIP y abre una terminal en la carpeta `huellitas`.
2. Con Node.js 20 o superior, ejecuta `npm install`.
3. Ejecuta `npm run dev` y abre la dirección local que indique Vite.
4. Usa **Crear cuenta** con datos de ejemplo y una contraseña de al menos ocho caracteres. El acceso es de demostración. Tras recargar, entra de nuevo con datos de prueba.

## Recorrido de revisión

1. En **Registro**, crea una mascota con todos los datos obligatorios. Usa, por ejemplo, **Kiara Demo** como nombre y datos ficticios para el responsable. La foto es opcional.
2. En **Panel**, busca a Kiara Demo, pulsa **Ver ficha** y comprueba los datos guardados. Pulsa **Editar mascota**, cambia su nombre a **Kiara Actualizada** y guarda.
3. Recarga la página, vuelve a entrar y verifica en **Panel** que se conservó el nombre actualizado.
4. En **Adopciones**, busca a Kiara Actualizada y pulsa **Solicitar adopción**. Completa el formulario con datos ficticios y envíalo. En **Solicitudes**, verifica que aparezca como pendiente y asociada a la mascota por su identificador. Recarga y consulta de nuevo.
5. En **Panel → Ver ficha**, selecciona **Desactivar mascota** y confirma. Verifica que desaparezca de **Panel** y **Adopciones**, incluso tras recargar. En **Solicitudes**, la solicitud se conserva y muestra que la mascota está desactivada.

## Organización del código

- **Presentación**. `Dashboard.jsx` contiene el registro, la ficha y el catálogo. `Solicitudes.jsx` contiene el formulario y la consulta de adopciones.
- **Lógica del proyecto**. `gestion.js` aplica las operaciones de mascotas y valida que la mascota esté disponible al solicitar la adopción.
- **Almacenamiento**. `repositorio.js` guarda mascotas y solicitudes en el almacenamiento local del navegador. `data.js` contiene los datos iniciales.

La persistencia funciona en el mismo navegador y dirección del aplicativo. Cada navegador conserva su propia copia. Usa datos ficticios para la demostración.
