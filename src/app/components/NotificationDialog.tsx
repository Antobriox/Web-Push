import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import './NotificationDialog.css';

interface NotificationDialogProps {
    visible: boolean;
    onHide: () => void;
    onSend: (subject: string, description: string, url: string) => void;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ visible, onHide, onSend }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');

    const handleSend = () => {
        onSend(subject, description, url);
        setSubject('');
        setDescription('');
        setUrl('');
    };

    const dialogFooter = (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
                label="Enviar Notificación" 
                onClick={handleSend} 
                autoFocus 
                style={{ 
                    backgroundColor: '#28a745', 
                    borderColor: '#28a745', 
                    color: 'white', 
                    fontSize: '1.2rem',
                    padding: '0.50rem 1.0rem',
                    width: 'auto',  // Cambia esto a 'auto' para que el ancho se ajuste al contenido
                    textAlign: 'center'
                }} 
            />
        </div>
    );

    return (
        <Dialog
            header="Creación de Notificación"
            visible={visible}
            style={{ width: '50vw' }}
            footer={dialogFooter}
            onHide={onHide}
            draggable={false}
            resizable={false}
        >
            <div className="dialog-content">
                <div className="dialog-field">
                    <label htmlFor="subject" className="dialog-label">Asunto</label>
                    <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="dialog-input"
                    />
                </div>
                <div className="dialog-field">
                    <label htmlFor="description" className="dialog-label">Descripción</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="dialog-textarea"
                    />
                </div>
                <div className="dialog-field">
                    <label htmlFor="url" className="dialog-label">URL del Enlace</label>
                    <input
                        id="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="dialog-input"
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default NotificationDialog;
