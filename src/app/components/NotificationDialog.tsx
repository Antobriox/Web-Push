import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import './NotificationDialog.css'; // Asegúrate de que los estilos personalizados se carguen

interface NotificationDialogProps {
    visible: boolean;
    onHide: () => void;
    onSend: (subject: string, description: string) => void;  // Elimina imageUrl de los parámetros
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ visible, onHide, onSend }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleSend = () => {
        onSend(subject, description);  // Envía solo el asunto y la descripción
        setSubject('');
        setDescription('');
    };

    const footer = (
        <div className="dialog-footer">
            <Button label="Enviar Notificación" icon="pi pi-check" onClick={handleSend} className="p-button" autoFocus />
        </div>
    );

    return (
        <Dialog header="Creación de Notificación" visible={visible} style={{ width: '50vw' }} footer={footer} onHide={onHide}>
            <div className="dialog-content">
                <div className="dialog-field">
                    <label htmlFor="subject" className="dialog-label">Asunto</label>
                    <InputText id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="dialog-input" />
                </div>
                <div className="dialog-field">
                    <label htmlFor="description" className="dialog-label">Descripción</label>
                    <InputTextarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="dialog-textarea" />
                </div>
            </div>
        </Dialog>
    );
};

export default NotificationDialog;
