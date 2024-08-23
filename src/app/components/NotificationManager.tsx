"use client";

import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import NotificationDialog from './NotificationDialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './NotificationManager.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

const NotificationManager: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);

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

    const sendNotification = async (subject: string, description: string, url: string) => {
        setLoading(true);

        if (selectedEndpoint) {
            try {
                await fetch('https://bs19l2t0-5000.use2.devtunnels.ms/api/notifications/send', {
                    method: 'POST',
                    body: JSON.stringify({
                        endpoint: selectedEndpoint,
                        title: subject,
                        body: description,
                        url: url // Aquí se incluye la URL enviada desde el formulario
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Notificación enviada con éxito.', life: 3000 });
            } catch (error) {
                console.error('Error al enviar la notificación:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar la notificación.', life: 3000 });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleOpenDialog = (endpoint: string) => {
        setSelectedEndpoint(endpoint);
        setDialogVisible(true);
    };

    const handleDialogSend = (subject: string, description: string, url: string) => {
        sendNotification(subject, description, url);
        setDialogVisible(false);
    };

    return (
        <div>
            <Toast ref={toast} position="top-right" />

            <DataTable
                value={subscriptions}
                className="p-datatable-custom"
                emptyMessage="No hay suscripciones disponibles"
                style={{ width: '80%', margin: '0 auto' }}
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
                    headerStyle={{ textAlign: 'center', width: '100px' }}
                    style={{ textAlign: 'center', width: '100px' }}
                />
            </DataTable>

            <NotificationDialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                onSend={handleDialogSend}
            />

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <ProgressSpinner />
                </div>
            )}
        </div>
    );
};

export default NotificationManager;
