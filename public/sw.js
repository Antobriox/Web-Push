// Maneja el evento de 'push' para mostrar la notificación
self.addEventListener("push", (e) => {
    const data = e.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W",
        badge: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W",
        data: {
            url: data.url || "https://sistemasgenesis.com.ec/", // URL por defecto a tu página principal
        },
        actions: [
            {
                action: "aceptar",
                title: "Aceptar",
                icon: "ruta/a/tu/imagen.png", // Reemplaza con la URL correcta del icono
            },
        ],
    });
});

console.log("Service Worker registrado");

// Maneja el evento 'notificationclick' cuando el usuario hace clic en la notificación
self.addEventListener("notificationclick", function (event) {
    console.log("Acción seleccionada:", event.action); // Verifica qué acción se está seleccionando
    event.notification.close(); // Cierra la notificación

    const urlToOpen = event.notification.data.url || '/'; // URL proporcionada en los datos de la notificación

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // Si ya hay una ventana abierta con la URL, enfocarla
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Si no hay ninguna ventana abierta con la URL, abrir una nueva
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
