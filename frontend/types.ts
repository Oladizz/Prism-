import type { ReactElement, SVGProps, FC, ImgHTMLAttributes } from 'react';

export enum TransactionType {
  SEND = 'Send',
  RECEIVE = 'Receive',
  SWAP = 'Swap',
  BUY = 'Buy'
}

export enum TransactionStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  FAILED = 'Failed'
}

export interface Asset {
  id: string;
  name: string;
  ticker: string;
  icon: FC<ImgHTMLAttributes<HTMLImageElement>>;
  price: number;
  change24h: number;
  balanceCrypto: number;
  balanceUSD: number;
  marketCap: number;
  volume24h: number;
  chain: string;
  sparklineData?: { name: string; value: number }[];
  coingeckoId?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  asset: Asset;
  amountCrypto: number;
  amountUSD: number;
  status: TransactionStatus;
  address?: string;
  wallet: string;
  chain: string;
  gasFeeUSD?: number;
}

export interface Nft {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  chain: string;
}

export interface PortfolioHistory {
    name: string;
    value: number;
}

export interface HistoricalDataPoint {
    date: string;
    price: number;
}

export interface PortfolioStats {
    totalBalance: number;
    portfolioChangeValue: number;
    portfolioChange24h: number;
    totalGasFees: number;
    distributionData: { name: string; value: number }[];
    topGainers: Asset[];
    topLosers: Asset[];
    gasFeesByChain: { [key: string]: number };
}

export interface Wallet {
  _id: string; // MongoDB ObjectId as string
  userId: string;
  name: string;
  address: string;
  chain: string;
}

export interface CryptoDetailData {
    description: string;
    links: { name: string; url: string; icon: FC<SVGProps<SVGSVGElement>> }[];
    historicalChartData: { [key: string]: HistoricalDataPoint[] };
    historicalTableData: HistoricalTableData[];
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}