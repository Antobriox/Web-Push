// public/sw.ts

self.addEventListener('push', (event: PushEvent) => {
    const options: NotificationOptions = {
      body: event.data ? event.data.text() : 'Sin mensaje',
      icon: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W',
      badge: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W'
    };
  
    event.waitUntil(
      self.registration.showNotification('Notificación', options)
    );
  });
  