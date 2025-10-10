import React from 'react';
import { ToastMessage } from '../types.ts';

type ToastContextType = {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
};

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);