import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './icons/ToastIcons.tsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={handleBackdropClick}
        >
            <div 
                ref={modalRef} 
                className="bg-card border border-border rounded-3xl shadow-xl w-full max-w-lg animate-slide-up backdrop-blur-lg"
            >
                <header className="flex items-center justify-between p-4 border-b border-border">
                    <h2 id="modal-title" className="text-xl font-semibold text-white">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-gray-400 hover:bg-secondary hover:text-white"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6">
                    {children}
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Modal;