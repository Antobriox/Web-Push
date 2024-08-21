// src/app/components/NotificationTable.tsx
"use client"; // Añadir esta línea para marcar el componente como Client Component

import { useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const NotificationTable = () => {
  const [data, setData] = useState([]);

  const sendNotification = () => {
    // Lógica para enviar notificaciones
    alert('Notificación enviada!');
  };

  return (
    <div className="p-fluid">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a la Web Push App</h1>
      <Button label="Enviar Notificación" icon="pi pi-bell" onClick={sendNotification} className="mb-4" />

      <DataTable value={data} className="p-datatable-gridlines">
        <Column field="endpoint" header="Endpoint" />
        <Column field="domain" header="Domain" />
        <Column field="action" header="Acción" />
      </DataTable>
    </div>
  );
};

export default NotificationTable;
