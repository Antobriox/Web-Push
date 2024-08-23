Web Push Notification Manager:

Este proyecto es una aplicación de gestión de notificaciones web push, que permite a un administrador enviar notificaciones a los usuarios, ver las suscripciones de los usuarios, y gestionar esas suscripciones.


Características:

* Envío de Notificaciones: Permite enviar notificaciones personalizadas a los usuarios suscritos.

* Gestión de Suscripciones: Muestra una tabla con las suscripciones activas, incluyendo el dominio, la latitud, longitud, y el user    agent de los usuarios suscritos.

* Soporte para Geolocalización: Captura y muestra la ubicación (latitud y longitud) del usuario al momento de la suscripción.

* Diálogo de Creación de Notificaciones: Interfaz para crear notificaciones con asunto, descripción y un enlace URL opcional.
Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:
- Node.js (versión 14 o superior)
- npm o yarn



Instalación:
1. Clona este repositorio en tu máquina local:
   *git clone https://github.com/Antobriox/Web-Push.git*

2. Instala las dependencias:
   *npm install*

3. Crea un archivo .env en la raíz del proyecto y añade las siguientes variables de entorno:
   *PUBLIC_VAPID_KEY=your_public_vapid_key*
    Configura el archivo sw.js en la carpeta public si es necesario.



Uso:
1. Inicia el servidor de desarrollo:
   *npm run dev*
   
2. Abre tu navegador y navega a http://localhost:3000 para ver la aplicación en acción.



Estructura del Proyecto:
* src/app/components/NotificationManager.tsx: Componente principal para gestionar las notificaciones y las suscripciones.
* src/app/components/NotificationDialog.tsx: Componente de diálogo para crear y enviar notificaciones.
* public/sw.js: Archivo Service Worker para manejar las notificaciones push.



Implementación del Backend:
El backend se encarga de manejar las suscripciones y el envío de notificaciones. Asegúrate de que el backend está corriendo y las rutas 

API están correctamente configuradas:
* POST /api/notifications/subscribe: Ruta para registrar una nueva suscripción.
* POST /api/notifications/send: Ruta para enviar una notificación a un usuario suscrito.
* DELETE /api/notifications/unsubscribe: Ruta para eliminar una suscripción.



Tecnologías Utilizadas
1. Next.js: Framework React para SSR y SSG.
2. PrimeReact: Biblioteca de componentes UI para React.
4. Tailwind CSS: Framework de utilidades CSS.
5. Service Workers: Para la gestión de notificaciones push.



Contribuciones:
Las contribuciones son bienvenidas. Por favor, sigue los pasos a continuación para contribuir:
1. Haz un fork del repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
3. Realiza tus cambios y haz commit (git commit -am 'Añadir nueva funcionalidad').
4. Haz push a la rama (git push origin feature/nueva-funcionalidad).
5. Abre un Pull Request.