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

export interface HistoricalTableData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: string;
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