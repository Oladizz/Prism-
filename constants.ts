
import React from 'react';
import { Asset, Transaction, Nft, TransactionType, TransactionStatus, PortfolioHistory, CryptoDetailData } from './types.ts';
import { BitcoinIcon, EthereumIcon, SolanaIcon, BnbIcon, ToncoinIcon, PolygonIcon, BaseIcon, AvalancheIcon, OptimismIcon, ArbitrumIcon } from './components/icons/CryptoIcons.tsx';
import { LinkIcon, FileIcon, CodeIcon, ForumIcon } from './components/icons/DetailIcons.tsx';

const generateSparkline = (base: number, points: number = 7, volatility: number = 0.05) => 
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


export const ASSETS: Asset[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    ticker: 'BTC',
    icon: BitcoinIcon,
    price: 68420.00,
    change24h: 2.5,
    balanceCrypto: 0.5,
    balanceUSD: 34210.00,
    marketCap: 1300000000000,
    volume24h: 45600000000,
    chain: 'Bitcoin',
    sparklineData: generateSparkline(68420),
  },
  {
    id: 'eth',
    name: 'Ethereum',
    ticker: 'ETH',
    icon: EthereumIcon,
    price: 3550.12,
    change24h: -1.2,
    balanceCrypto: 10,
    balanceUSD: 35501.20,
    marketCap: 426000000000,
    volume24h: 21000000000,
    chain: 'Ethereum',
    sparklineData: generateSparkline(3550.12),
  },
  {
    id: 'bnb',
    name: 'BNB',
    ticker: 'BNB',
    icon: BnbIcon,
    price: 589.10,
    change24h: 1.8,
    balanceCrypto: 15,
    balanceUSD: 8836.50,
    marketCap: 86000000000,
    volume24h: 2100000000,
    chain: 'BNB Chain',
    sparklineData: generateSparkline(589.10),
  },
  {
    id: 'sol',
    name: 'Solana',
    ticker: 'SOL',
    icon: SolanaIcon,
    price: 150.78,
    change24h: 5.8,
    balanceCrypto: 50,
    balanceUSD: 7539.00,
    marketCap: 69000000000,
    volume24h: 3500000000,
    chain: 'Solana',
    sparklineData: generateSparkline(150.78),
  },
  {
    id: 'ton',
    name: 'Toncoin',
    ticker: 'TON',
    icon: ToncoinIcon,
    price: 7.50,
    change24h: 4.2,
    balanceCrypto: 2000,
    balanceUSD: 15000.00,
    marketCap: 18000000000,
    volume24h: 350000000,
    chain: 'TON',
    sparklineData: generateSparkline(7.50),
  },
  {
    id: 'base',
    name: 'Base',
    ticker: 'BASE',
    icon: BaseIcon,
    price: 1.02,
    change24h: 3.1,
    balanceCrypto: 15000,
    balanceUSD: 15300.00,
    marketCap: 0,
    volume24h: 120000000,
    chain: 'Base',
    sparklineData: generateSparkline(1.02),
  },
  {
    id: 'avax',
    name: 'Avalanche',
    ticker: 'AVAX',
    icon: AvalancheIcon,
    price: 35.50,
    change24h: -2.5,
    balanceCrypto: 300,
    balanceUSD: 10650.00,
    marketCap: 13000000000,
    volume24h: 500000000,
    chain: 'Avalanche',
    sparklineData: generateSparkline(35.50),
  },
  {
    id: 'op',
    name: 'Optimism',
    ticker: 'OP',
    icon: OptimismIcon,
    price: 2.15,
    change24h: 6.2,
    balanceCrypto: 8000,
    balanceUSD: 17200.00,
    marketCap: 2400000000,
    volume24h: 250000000,
    chain: 'Optimism',
    sparklineData: generateSparkline(2.15),
  },
  {
    id: 'arb',
    name: 'Arbitrum',
    ticker: 'ARB',
    icon: ArbitrumIcon,
    price: 0.95,
    change24h: 1.5,
    balanceCrypto: 20000,
    balanceUSD: 19000.00,
    marketCap: 2500000000,
    volume24h: 200000000,
    chain: 'Arbitrum',
    sparklineData: generateSparkline(0.95),
  },
  {
    id: 'matic',
    name: 'Polygon',
    ticker: 'MATIC',
    icon: PolygonIcon,
    price: 0.57,
    change24h: -2.1,
    balanceCrypto: 25000,
    balanceUSD: 14250.00,
    marketCap: 5600000000,
    volume24h: 300000000,
    chain: 'Polygon',
    sparklineData: generateSparkline(0.57, 7, 0.09),
  }
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2024-07-20 14:30',
    type: TransactionType.RECEIVE,
    asset: ASSETS.find(a => a.id === 'btc')!,
    amountCrypto: 0.1,
    amountUSD: 6812.35,
    status: TransactionStatus.COMPLETED,
    wallet: 'Primary Wallet',
    chain: 'Bitcoin',
    gasFeeUSD: 3.52,
  },
  {
    id: '2',
    date: '2024-07-20 09:15',
    type: TransactionType.SEND,
    asset: ASSETS.find(a => a.id === 'eth')!,
    amountCrypto: 2,
    amountUSD: 7100.24,
    status: TransactionStatus.COMPLETED,
    address: '0x123...abc',
    wallet: 'Primary Wallet',
    chain: 'Ethereum',
    gasFeeUSD: 8.91,
  },
  {
    id: '3',
    date: '2024-07-19 18:00',
    type: TransactionType.SWAP,
    asset: ASSETS.find(a => a.id === 'eth')!,
    amountCrypto: 1,
    amountUSD: 3550.12,
    status: TransactionStatus.COMPLETED,
    wallet: 'Trading Wallet',
    chain: 'Ethereum',
    gasFeeUSD: 12.45,
  },
  {
    id: '4',
    date: '2024-07-18 11:45',
    type: TransactionType.BUY,
    asset: ASSETS.find(a => a.id === 'sol')!,
    amountCrypto: 10,
    amountUSD: 1507.80,
    status: TransactionStatus.COMPLETED,
    wallet: 'Trading Wallet',
    chain: 'Solana',
    gasFeeUSD: 0.02,
  },
  {
    id: '5',
    date: '2024-07-17 22:05',
    type: TransactionType.SEND,
    asset: ASSETS.find(a => a.id === 'avax')!,
    amountCrypto: 200,
    amountUSD: 7100.00,
    status: TransactionStatus.PENDING,
    wallet: 'Primary Wallet',
    chain: 'Avalanche',
    address: '0x456...def',
    gasFeeUSD: 0.75,
  },
  {
    id: '6',
    date: '2024-07-16 10:00',
    type: TransactionType.RECEIVE,
    asset: ASSETS.find(a => a.id === 'op')!,
    amountCrypto: 2000,
    amountUSD: 4300.00,
    status: TransactionStatus.COMPLETED,
    wallet: 'Staking Wallet',
    chain: 'Optimism',
    gasFeeUSD: 0.18,
  },
  {
    id: '7',
    date: '2024-07-15 15:20',
    type: TransactionType.BUY,
    asset: ASSETS.find(a => a.id === 'ton')!,
    amountCrypto: 500,
    amountUSD: 3750.00,
    status: TransactionStatus.COMPLETED,
    wallet: 'Trading Wallet',
    chain: 'TON',
    gasFeeUSD: 0.25,
  },
  {
    id: '8',
    date: '2024-07-14 12:00',
    type: TransactionType.SEND,
    asset: ASSETS.find(a => a.id === 'arb')!,
    amountCrypto: 1000,
    amountUSD: 950.00,
    status: TransactionStatus.FAILED,
    wallet: 'Primary Wallet',
    chain: 'Arbitrum',
    address: 'rP123...xyz',
    gasFeeUSD: 0.01,
  },
].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const NFTS: Nft[] = [
    { id: 'nft1', name: 'CryptoPunk #7804', collection: 'CryptoPunks', imageUrl: `https://picsum.photos/seed/nft1/400/400`, chain: 'Ethereum' },
    { id: 'nft2', name: 'Bored Ape #8585', collection: 'Bored Ape Yacht Club', imageUrl: `https://picsum.photos/seed/nft2/400/400`, chain: 'Ethereum' },
    { id: 'nft3', name: 'Pudgy Penguin #1234', collection: 'Pudgy Penguins', imageUrl: `https://picsum.photos/seed/nft3/400/400`, chain: 'Ethereum' },
    { id: 'nft4', name: 'Azuki #5678', collection: 'Azuki', imageUrl: `https://picsum.photos/seed/nft4/400/400`, chain: 'Ethereum' },
    { id: 'nft5', name: 'Meebit #9101', collection: 'Meebits', imageUrl: `https://picsum.photos/seed/nft5/400/400`, chain: 'Ethereum' },
    { id: 'nft6', name: 'Doodle #1121', collection: 'Doodles', imageUrl: `https://picsum.photos/seed/nft6/400/400`, chain: 'Polygon' },
    { id: 'nft7', name: 'Cool Cat #3141', collection: 'Cool Cats', imageUrl: `https://picsum.photos/seed/nft7/400/400`, chain: 'Ethereum' },
    { id: 'nft8', name: 'Okay Bear #5161', collection: 'Okay Bears', imageUrl: `https://picsum.photos/seed/nft8/400/400`, chain: 'Solana' },
    { id: 'nft9', name: 'CloneX #1001', collection: 'CloneX', imageUrl: `https://picsum.photos/seed/nft9/400/400`, chain: 'Ethereum'},
    { id: 'nft10', name: 'Moonbird #2022', collection: 'Moonbirds', imageUrl: `https://picsum.photos/seed/nft10/400/400`, chain: 'Ethereum'},
    { id: 'nft11', name: 'Mad Lad #3333', collection: 'Mad Lads', imageUrl: `https://picsum.photos/seed/nft11/400/400`, chain: 'Solana'},
    { id: 'nft12', name: 'Bored Ape #2081', collection: 'Bored Ape Yacht Club', imageUrl: `https://picsum.photos/seed/nft12/400/400`, chain: 'Ethereum'},
];


export const PORTFOLIO_HISTORY: PortfolioHistory[] = [
  { name: 'Jan', value: 75000 },
  { name: 'Feb', value: 78000 },
  { name: 'Mar', value: 85000 },
  { name: 'Apr', value: 82000 },
  { name: 'May', value: 91000 },
  { name: 'Jun', value: 95000 },
  { name: 'Jul', value: ASSETS.reduce((acc, asset) => acc + asset.balanceUSD, 0) },
];

export const GAS_FEES = [
  { 
    chain: 'Ethereum', 
    icon: EthereumIcon, 
    low: 15, 
    average: 25, 
    high: 40,
    priceUSD: 1.50 
  },
  { 
    chain: 'BNB Chain', 
    icon: BnbIcon, 
    low: 3, 
    average: 5, 
    high: 7,
    priceUSD: 0.15 
  },
  { 
    chain: 'Polygon', 
    icon: PolygonIcon, 
    low: 30, 
    average: 50, 
    high: 80,
    priceUSD: 0.02
  },
  { 
    chain: 'Solana', 
    icon: SolanaIcon, 
    low: 0.000005, 
    average: 0.000005, 
    high: 0.000005,
    priceUSD: 0.01
  },
];

const CRYPTO_DETAIL_DATA_GENERATOR = (asset: Asset, description: string): CryptoDetailData => ({
    description,
    links: [
        { name: 'Official Website', url: '#', icon: LinkIcon },
        { name: 'Whitepaper', url: '#', icon: FileIcon },
        { name: 'Source Code', url: '#', icon: CodeIcon },
        { name: 'Community Forum', url: '#', icon: ForumIcon }
    ],
    historicalChartData: {
        '1D': Array.from({ length: 24 }, (_, i) => ({ date: `${i}:00`, price: asset.price * (1 + (Math.random() - 0.5) * 0.05 + Math.sin(i/3) * 0.02) })),
        '7D': generateHistoricalChartData(asset.price, 7, 0.1),
        '1M': generateHistoricalChartData(asset.price, 30, 0.2),
        '1Y': generateHistoricalChartData(asset.price, 12, 0.8),
        'ALL': generateHistoricalChartData(asset.price, 50, 1.5),
    },
    historicalTableData: generateHistoricalTableData(asset.price, 10),
});

export const CRYPTO_DETAIL_DATA: { [key: string]: CryptoDetailData } = {
    'BTC': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='btc')!, 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.'),
    'ETH': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='eth')!, 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform.'),
    'BNB': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='bnb')!, 'BNB is a cryptocurrency that powers the BNB Chain ecosystem. It is one of the world\'s most popular utility tokens, usable in a wide range of applications and use cases.'),
    'SOL': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='sol')!, 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.'),
    'TON': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='ton')!, 'Toncoin (TON) is the native cryptocurrency of The Open Network, a decentralized layer-1 blockchain developed by Telegram. It focuses on scalability and user-friendly applications.'),
    'BASE': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='base')!, 'Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.'),
    'AVAX': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='avax')!, 'Avalanche is an open, programmable smart contracts platform for decentralized applications. It is the fastest smart contracts platform in the blockchain industry, as measured by time-to-finality.'),
    'OP': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='op')!, 'Optimism is a low-cost and lightning-fast Ethereum L2 blockchain. It is designed to be simple, pragmatic, and optimistic.'),
    'ARB': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='arb')!, 'Arbitrum is a suite of Ethereum scaling solutions that enables high-throughput, low-cost smart contracts while remaining trustlessly secure.'),
    'MATIC': CRYPTO_DETAIL_DATA_GENERATOR(ASSETS.find(a=>a.id==='matic')!, 'Polygon (MATIC) is a protocol and a framework for building and connecting Ethereum-compatible blockchain networks, offering scalable solutions on Ethereum.'),
};