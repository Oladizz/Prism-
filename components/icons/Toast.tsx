import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../../types.ts';
import { SuccessIcon, ErrorIcon, InfoIcon, CloseIcon } from './ToastIcons.tsx';

interface ToastProps {
    toast: ToastMessage;
    onDismiss: (id: string) => void;
}

const icons = {
    success: <SuccessIcon className="w-6 h-6 text-green-400" />,
    error: <ErrorIcon className="w-6 h-6 text-red-400" />,
    info: <InfoIcon className="w-6 h-6 text-blue-400" />,
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onDismiss(toast.id), 300);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [toast.id, onDismiss]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };
    
    // Animation classes
    const animationClass = isExiting 
        ? 'animate-toast-out'
        : 'animate-toast-in';

    return (
        <div 
            role="alert"
            className={`
                w-full max-w-sm p-4 bg-card border border-border rounded-xl shadow-lg flex items-start gap-3
                pointer-events-auto transition-all duration-300 ease-in-out ${animationClass} backdrop-blur-lg
            `}
        >
            <div className="flex-shrink-0">
                {icons[toast.type]}
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-white">{toast.title}</p>
                <p className="mt-1 text-sm text-gray-300">{toast.message}</p>
            </div>
            <div className="flex-shrink-0">
                <button
                    onClick={handleDismiss}
                    className="p-1 rounded-full text-gray-400 hover:bg-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label="Close"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            <style>{`
                @keyframes toast-in {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes toast-out {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
                .animate-toast-in {
                    animation: toast-in 0.3s ease-out forwards;
                }
                .animate-toast-out {
                    animation: toast-out 0.3s ease-in forwards;
                }
            `}</style>
        </div>
    );
};

export default Toast;