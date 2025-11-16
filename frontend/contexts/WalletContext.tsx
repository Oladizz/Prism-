import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useToast } from '../hooks/useToast';

interface Wallet {
    id: number;
    name: string;
    address: string;
    chain: string;
}

interface WalletContextType {
    wallets: Wallet[];
    addWallet: (name: string, address: string, chain: string) => void;
    removeWallet: (id: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        const storedWallets = localStorage.getItem('prism_wallets');
        if (storedWallets) {
            const parsedWallets = JSON.parse(storedWallets);
            const walletsWithChain = parsedWallets.map((wallet: any) => {
                if (!wallet.chain) {
                    return { ...wallet, chain: 'ethereum' };
                }
                return wallet;
            });
            setWallets(walletsWithChain);
        }
    }, []);

    const addWallet = (name: string, address: string, chain: string) => {
        if (name.trim() && address.trim() && chain.trim()) {
            const newWallet = {
                id: Date.now(),
                name,
                address,
                chain,
            };
            const newWallets = [...wallets, newWallet];
            setWallets(newWallets);
            localStorage.setItem('prism_wallets', JSON.stringify(newWallets));
            addToast({ type: 'success', title: 'Wallet Added', message: `${name} has been added.` });
        } else {
            addToast({ type: 'error', title: 'Invalid Input', message: 'Please enter a valid wallet name, address, and chain.'});
        }
    };

    const removeWallet = (id: number) => {
        const walletToRemove = wallets.find(w => w.id === id);
        if (walletToRemove) {
            const newWallets = wallets.filter(w => w.id !== id);
            setWallets(newWallets);
            localStorage.setItem('prism_wallets', JSON.stringify(newWallets));
            addToast({ type: 'success', title: 'Wallet Removed', message: `${walletToRemove.name} has been removed.` });
        }
    };

    const value = {
        wallets,
        addWallet,
        removeWallet,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallets = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallets must be used within a WalletProvider');
    }
    return context;
};
