// src/app/components/NotificationManager.tsx
"use client";

import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './NotificationManager.css';  // Asegúrate de que los estilos personalizados se carguen

const PUBLIC_VAPID_KEY = 'BJHMAExOhPj3AwQtYYK1Sh5ZxBFKpRNOYml6iFUc3DPVSwUCLWGhGISiLYl7x0Ibr7_QaDfUqdOpaOfJ4BK4tk8';

async function subscribeUser() {
  const register = await navigator.serviceWorker.register('/sw.js');
  const existingSubscription = await register.pushManager.getSubscription();

  if (!existingSubscription) {
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });

    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else {
    console.log('El usuario ya está suscrito.');
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<{ endpoint: string; domain: string; }[]>([]);

  useEffect(() => {
    subscribeUser();
  }, []);

  const handleNotifyClick = () => {
    const url = 'http://localhost:5000/'; // Reemplaza con la URL que desees
    navigator.serviceWorker.ready.then(function (registration) {
      registration.showNotification('Notificación Manual', {
        body: 'Has presionado el botón para enviar esta notificación.',
        icon: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W',
        data: {
          url: url
        }
      });
    });
  };

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('https://bs19l2t0-5000.use2.devtunnels.ms/api/notifications/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      } else {
        console.error("Error al cargar las suscripciones:", response.statusText);
      }
    } catch (error) {
      console.error("Error al cargar las suscripciones:", error);
    }
  };

  const sendNotification = async (endpoint: string) => {
    await fetch('https://bs19l2t0-5000.use2.devtunnels.ms/api/notifications/send', {
        method: 'POST',
        body: JSON.stringify({
            endpoint: endpoint,
            title: 'Notificación Personalizada',
            body: 'Esta es una notificación enviada solo a este usuario.'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

  useEffect(() => {
    loadSubscriptions();
  }, []);

  return (
    <div>
      <div className="flex justify-center mb-6">
        <Button
          label="Enviar Notificación"
          icon="pi pi-bell"
          className="p-button-success text-xl px-6 py-3 rounded-full"
          onClick={handleNotifyClick}
        />
      </div>
      <DataTable value={subscriptions} className="p-datatable-custom w-full" emptyMessage="No hay suscripciones disponibles">
        <Column field="endpoint" header="Endpoint" />
        <Column field="domain" header="Domain" />
        <Column
          header="Acción"
          body={(rowData) => (
            <Button label="Enviar Notificación" className="p-button-info" onClick={() => sendNotification(rowData.endpoint)} />
          )}
        />
      </DataTable>
    </div>
  );
};

export default NotificationManager;
