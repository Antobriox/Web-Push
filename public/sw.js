swSelf.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Cierra la notificación

    const urlToOpen = event.notification.data.url || '/'; // URL proporcionada en los datos de la notificación

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
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
