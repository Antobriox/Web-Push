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

const PUBLIC_VAPID_KEY = 'BJHMAExOhPj3AwQtYYK1Sh5ZxBFKpRNOYml6iFUc3DPVSwUCLWGhGISiLYl7x0Ibr7_QaDfUqdOpaOfJ4BK4tk8';

const NotificationManager: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        registerServiceWorkerAndSubscribe();
        loadSubscriptions();
    }, []);

    const registerServiceWorkerAndSubscribe = async () => {
        try {
            console.log("Intentando registrar el Service Worker...");
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log("Service Worker registrado con éxito:", registration);

            const notificationPermission = await Notification.requestPermission();
            if (notificationPermission !== "granted") {
                throw new Error("Permiso de notificación no concedido");
            }

            requestLocationPermission();
        } catch (error) {
            console.error("Error al registrar el Service Worker:", error);
        }
    };

    const requestLocationPermission = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Ubicación obtenida:", position);
                    subscribeUserWithLocation(position); // Llama a la función con la ubicación
                },
                (error) => {
                    console.error("Error al obtener la ubicación:", error);
                },
                {
                    enableHighAccuracy: false, // Reducir la precisión si no es necesario
                    timeout: 10000, // Aumentar el tiempo de espera
                    maximumAge: 0,
                }
            );
        } else {
            console.warn("La geolocalización no está soportada en este navegador.");
        }
    };

    const subscribeUserWithLocation = async (position: GeolocationPosition) => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(async (registration) => {
                const existingSubscription = await registration.pushManager.getSubscription();

                if (!existingSubscription) {
                    try {
                        const subscription = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
                        });

                        console.log(subscription); // Verifica que tenga endpoint, keys, etc.

                        const locationData = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };

                        const p256dhArray = Array.from(new Uint8Array(subscription.getKey('p256dh')!));
                        const authArray = Array.from(new Uint8Array(subscription.getKey('auth')!));

                        const dataToSend = {
                            endpoint: subscription.endpoint,
                            keys: {
                                p256dh: btoa(String.fromCharCode(...p256dhArray)),
                                auth: btoa(String.fromCharCode(...authArray))
                            },
                            location: locationData
                        };

                        console.log("Datos enviados:", dataToSend);

                        await fetch('https://bs19l2t0-5000.use2.devtunnels.ms/api/notifications/subscribe', {
                            method: 'POST',
                            body: JSON.stringify(dataToSend),
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                        });

                        console.log('Usuario suscrito con éxito con ubicación.');
                    } catch (error) {
                        console.error('Error al suscribir el usuario:', error);
                    }
                } else {
                    console.log('El usuario ya está suscrito.');
                }
            });
        } else {
            console.warn('Service Workers no están soportados en este navegador.');
        }
    };

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

export default NotificationManager;