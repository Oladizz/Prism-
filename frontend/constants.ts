
import React from 'react';
import { BitcoinIcon, EthereumIcon, SolanaIcon, BnbIcon, ToncoinIcon, PolygonIcon, BaseIcon, AvalancheIcon, OptimismIcon, ArbitrumIcon } from './components/icons/CryptoIcons.tsx';
import { LinkIcon, FileIcon, CodeIcon, ForumIcon } from './components/icons/DetailIcons.tsx';

export const generateSparkline = (base: number, points: number = 7, volatility: number = 0.05) => 
    Array.from({ length: points }, (_, i) => ({
        name: `d${i}`,
        value: base * (1 + (Math.random() - 0.5) * volatility * (i / points)),
    }));

const generateHistoricalChartData = (basePrice: number, days: number, volatility: number) => 
    Array.from({ length: days }, (_, i) => ({ 
        date: `Day ${i + 1}`, 
        price: basePrice * (1 + (Math.random() - 0.5) * volatility * (i / days) + (Math.sin(i / (days/10)) * volatility))
    }));

const generateHistoricalTableData = (basePrice: number, days: number = 5) =>
    Array.from({ length: days}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const open = basePrice * (1 + (Math.random() - 0.5) * 0.05);
        const close = open * (1 + (Math.random() - 0.5) * 0.03);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        const volume = (Math.random() * 50 + 10).toFixed(1) + 'B';

        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}),
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume: `$${volume}`
        }
    });


export const COINGECKO_IDS: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'BNB': 'binancecoin',
    'TON': 'the-open-network',
    'MATIC': 'polygon',
    'BASE': 'base', // Assuming 'base' is the coingecko ID for Base chain's native token
    'AVAX': 'avalanche-2',
    'OP': 'optimism',
    'ARB': 'arbitrum',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'DAI': 'dai',
    'WETH': 'weth',
};

export const CHAINS = [
    { id: 'ethereum', name: 'Ethereum', ticker: 'ETH', icon: EthereumIcon },
    { id: 'solana', name: 'Solana', ticker: 'SOL', icon: SolanaIcon },
    { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', icon: BitcoinIcon },
    { id: 'ton', name: 'TON', ticker: 'TON', icon: ToncoinIcon },
    { id: 'binance-smart-chain', name: 'BNB Smart Chain', ticker: 'BNB', icon: BnbIcon },
    { id: 'polygon', name: 'Polygon', ticker: 'MATIC', icon: PolygonIcon },
    { id: 'base', name: 'Base', ticker: 'BASE', icon: BaseIcon },
    { id: 'avalanche', name: 'Avalanche', ticker: 'AVAX', icon: AvalancheIcon },
    { id: 'optimism', name: 'Optimism', ticker: 'OP', icon: OptimismIcon },
    { id: 'arbitrum', name: 'Arbitrum', ticker: 'ARB', icon: ArbitrumIcon },
];

export const ASSETS: Asset[] = [];

export const TRANSACTIONS: Transaction[] = [];

export const NFTS: Nft[] = [];

export const PORTFOLIO_HISTORY: PortfolioHistory[] = [];

export const GAS_FEES: any[] = [];

export const CRYPTO_DETAIL_DATA: { [key: string]: CryptoDetailData } = {};