"use client";

import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import NotificationDialog from './NotificationDialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './NotificationManager.css';

const NotificationManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('https://bs19l2t0-5000.use2.devtunnels.ms/api/notifications/subscriptions');
      if (response.ok) {
        const data = await response.json();
        const subscriptions = data.map((sub: any) => ({
          endpoint: sub.endpoint,
          domain: sub.domain,
          latitude: sub.location?.latitude || 'N/A',
          longitude: sub.location?.longitude || 'N/A',
          userAgent: sub.userAgent || 'N/A',
        }));
        setSubscriptions(subscriptions);
      } else {
        console.error('Error al cargar las suscripciones:', response.statusText);
      }
    } catch (error) {
      console.error('Error al cargar las suscripciones:', error);
    }
  };

  const sendNotification = async (subject: string, description: string) => {
    if (selectedEndpoint) {
      await fetch('https://bs19l2t0-5000.use2.devtunnels.ms/api/notifications/send', {
        method: 'POST',
        body: JSON.stringify({
          endpoint: selectedEndpoint,
          title: subject,
          body: description,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };

  const handleOpenDialog = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    setDialogVisible(true);
  };

  const handleDialogSend = (subject: string, description: string) => {
    sendNotification(subject, description);
    setDialogVisible(false);
  };

  return (
    <div>
      <DataTable
        value={subscriptions}
        className="p-datatable-custom"
        emptyMessage="No hay suscripciones disponibles"
        style={{ width: '80%', margin: '0 auto' }} // Ajusta el ancho de la tabla y la centra
      >
        <Column field="domain" header="Domain" />
        <Column field="latitude" header="Latitude" />
        <Column field="longitude" header="Longitude" />
        <Column field="userAgent" header="UserAgent" />
        <Column
          header="Acción"
          body={(rowData) => (
            <Button
              icon="pi pi-bell"
              className="p-button-rounded p-button-info"
              style={{ color: 'white' }}
              onClick={() => handleOpenDialog(rowData.endpoint)}
            />
          )}
          headerStyle={{ textAlign: 'center', width: '100px' }} // Alinea el encabezado "Acción" al centro y ajusta el ancho
          style={{ textAlign: 'center', width: '100px' }} // Alinea el contenido de la columna "Acción" al centro y ajusta el ancho
        />
      </DataTable>

      <NotificationDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSend={handleDialogSend}
      />
    </div>
  );
};

export default NotificationManager;
