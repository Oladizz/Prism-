import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ASSETS as ALL_ASSETS } from '../constants.ts';
import { Asset } from '../types.ts';

interface PortfolioContextType {
    assets: Asset[];
    allAssets: Asset[];
    addAsset: (assetId: string, balanceCrypto: number) => void;
    updateAssetBalance: (assetId: string, newBalanceCrypto: number) => void;
    removeAsset: (assetId: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [assets, setAssets] = useState<Asset[]>(ALL_ASSETS);

    const updateAssetBalance = useCallback((assetId: string, newBalanceCrypto: number) => {
        setAssets(prevAssets =>
            prevAssets.map(asset => {
                if (asset.id === assetId) {
                    return {
                        ...asset,
                        balanceCrypto: newBalanceCrypto,
                        balanceUSD: newBalanceCrypto * asset.price,
                    };
                }
                return asset;
            })
        );
    }, []);
    
    const removeAsset = useCallback((assetId: string) => {
        setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
    }, []);

    const addAsset = useCallback((assetId: string, balanceCrypto: number) => {
        const assetToAdd = ALL_ASSETS.find(a => a.id === assetId);
        if (assetToAdd && !assets.some(a => a.id === assetId)) {
            const newAsset: Asset = {
                ...assetToAdd,
                balanceCrypto,
                balanceUSD: balanceCrypto * assetToAdd.price,
            };
            setAssets(prevAssets => [...prevAssets, newAsset].sort((a,b) => b.marketCap - a.marketCap));
        }
    }, [assets]);


    const value = {
        assets,
        allAssets: ALL_ASSETS,
        addAsset,
        updateAssetBalance,
        removeAsset,
    };

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};
