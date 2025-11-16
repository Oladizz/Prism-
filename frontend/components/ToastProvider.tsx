import React, { useState, useCallback } from 'react';
import { ToastContext } from '../contexts/ToastContext.tsx';
import { ToastMessage } from '../types.ts';
import Toast from './icons/Toast.tsx';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
        const id = crypto.randomUUID();
        setToasts((prevToasts) => [...prevToasts, { id, ...toast }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div 
                aria-live="assertive"
                className="fixed inset-0 flex flex-col items-end px-4 py-6 space-y-2 pointer-events-none sm:p-6 z-50"
            >
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};