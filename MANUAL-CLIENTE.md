# Manual de uso de XIMNANZAS

## 1. Acceso al sitio

Sitio oficial:

<https://www.ximnanzas.com/>

Desde la página principal, los visitantes pueden:

- Consultar los servicios de XIMNANZAS.
- Usar la simulador de retiro.
- Leer las notas de la sección **Ideas**.
- Solicitar información.
- Agendar una cita.
- Contactar por WhatsApp.

## 2. Recibir solicitudes de prospectos

Cuando una persona completa el formulario de contacto, sus datos se guardan en el panel de Prospectos y se envía una notificación al correo administrativo configurado.

Los datos principales son:

- Nombre.
- Correo electrónico.
- Teléfono.
- Servicio de interés.
- Mensaje.
- Fecha de registro.

## 3. Acceso al panel de Prospectos

El acceso se encuentra en el pie de página del sitio, con el botón **Acceso a prospectos**.

También se puede abrir directamente:

<https://www.ximnanzas.com/#/prospectos>

Para entrar:

1. Abre la dirección anterior.
2. Escribe el correo administrativo.
3. Escribe la contraseña.
4. Presiona **Ingresar**.

No compartas las credenciales por correo, WhatsApp ni documentos públicos. Si se sospecha que una contraseña fue expuesta, debe cambiarse desde Supabase.

## 4. Pestaña Prospectos

La pestaña **Prospectos** muestra todas las solicitudes recibidas.

### Cambiar el estado de un prospecto

Cada prospecto tiene un selector de estado. Los estados disponibles son:

- **Nuevo:** solicitud pendiente de revisar.
- **Contactado:** ya se tuvo el primer contacto.
- **En seguimiento:** existe una conversación o seguimiento activo.
- **Cerrado:** la atención terminó o no requiere más seguimiento.

El cambio se guarda automáticamente. Si la conexión falla, el panel conserva el estado anterior y muestra un mensaje de error.

### Exportar prospectos

Presiona **Exportar CSV** para descargar un archivo con:

- Nombre.
- Correo.
- Teléfono.
- Servicio.
- Estado.
- Mensaje.
- Fecha de registro.

El archivo puede abrirse con Excel o Google Sheets.

## 5. Pestaña Citas

La pestaña **Citas** muestra las citas solicitadas desde el calendario del sitio.

Cada registro incluye:

- Fecha de registro.
- Nombre.
- Servicio.
- Fecha solicitada.
- Hora.
- Estado.

Para descargar la información, presiona **Exportar CSV**.

El archivo de citas contiene:

- Nombre.
- Teléfono.
- Fecha.
- Hora.
- Fecha de registro.

## 6. Pestaña Ideas / Blog

La pestaña **Ideas / Blog** permite crear notas para la sección pública **Ideas** del sitio.

### Crear una nota

1. Entra al panel de Prospectos.
2. Abre **Ideas / Blog**.
3. Escribe la categoría, por ejemplo: `Retiro`, `Protección` o `Hábitos`.
4. Escribe el título.
5. Añade un resumen breve.
6. Escribe el contenido completo.
7. Deja marcada la opción **Publicar en Ideas al guardar**.
8. Presiona **Guardar nota**.

La nota aparecerá en la sección **Ideas** de la página principal después de guardarse.

### Guardar como borrador

Para conservar una nota sin mostrarla al público, desmarca **Publicar en Ideas al guardar** antes de guardarla.

## 7. Confirmación de formularios

### Solicitud de información

Después de enviar correctamente el formulario, el visitante verá el mensaje:

> ¡Gracias! Hemos recibido tu información. Un asesor te contactará muy pronto.

### Cita

Después de guardar correctamente una cita, el visitante verá:

> ¡Cita confirmada! Hemos agendado tu cita.

Si aparece un mensaje de error, la información no debe considerarse confirmada hasta revisar el panel.

## 8. Correo de notificaciones

Las notificaciones de prospectos y citas se envían al correo administrativo configurado por el responsable del sistema.

Si no llega un correo:

1. Revisa la carpeta de spam o correo no deseado.
2. Confirma que el prospecto o la cita aparezcan en el panel.
3. Verifica la configuración del servicio de correo transaccional.
4. Solicita revisión técnica si el registro tampoco aparece en el panel.

## 9. Solución de problemas frecuentes

### El panel no abre

- Confirma que estés usando la dirección oficial.
- Revisa la conexión a internet.
- Recarga la página.
- Verifica que el dominio sea `www.ximnanzas.com`.

### El inicio de sesión no funciona

- Confirma el correo administrativo.
- Revisa que la contraseña no tenga espacios adicionales.
- Si persiste el problema, solicita restablecer la contraseña en Supabase.

### No se guarda una nota

- Revisa que todos los campos estén completos.
- Confirma que la sesión siga activa.
- Presiona **Actualizar** y vuelve a intentar.
- Si aparece un error sobre `blog_posts`, solicita aplicar la migración de base de datos.

### No aparece una nota en Ideas

- Confirma que la opción **Publicar en Ideas al guardar** esté marcada.
- Recarga la página pública.
- Revisa que la nota aparezca como **Publicada** en el panel.

## 10. Recomendaciones de seguridad

- No compartir contraseñas en documentos públicos.
- No guardar claves secretas en el navegador.
- Cerrar sesión al terminar de usar el panel.
- Descargar archivos CSV solo en equipos autorizados.
- Cambiar la contraseña periódicamente.
- Avisar inmediatamente si se pierde el acceso administrativo.

## Soporte

Para soporte técnico, proporcionar:

- La dirección de la página donde ocurrió el problema.
- La acción que se estaba realizando.
- El mensaje de error exacto.
- La fecha y hora aproximada del incidente.

No enviar contraseñas, claves secretas ni tokens de acceso en la solicitud de soporte.
