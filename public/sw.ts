/// <reference lib="webworker" />

// Forzamos el contexto de 'self' a ser de tipo ServiceWorkerGlobalScope
const swSelf = self as unknown as ServiceWorkerGlobalScope;

swSelf.addEventListener('push', (event: PushEvent) => {
    const options: NotificationOptions = {
        body: event.data ? event.data.text() : 'Sin mensaje',
        icon: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W',
        badge: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W'
    };

    event.waitUntil(
        swSelf.registration.showNotification('Notificación', options)
    );
});
