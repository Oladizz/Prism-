import { Asset, Transaction, Nft, TransactionType, TransactionStatus, PortfolioHistory } from '../types';
import { generateSparkline, COINGECKO_IDS } from '../constants';
import { BitcoinIcon, EthereumIcon, SolanaIcon, BnbIcon, ToncoinIcon, PolygonIcon, BaseIcon, AvalancheIcon, OptimismIcon, ArbitrumIcon } from '../components/icons/CryptoIcons';
import { saveToCache, loadFromCache, invalidateCache } from '../utils/cache'; // Import caching utilities

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const getApiUrl = (chain: string): string => {
    return `${BASE_URL}/${chain}`;
};

const CryptoIcons: { [keyof typeof COINGECKO_IDS]: any } = {
  BTC: BitcoinIcon,
  ETH: EthereumIcon,
  SOL: SolanaIcon,
  BNB: BnbIcon,
  TON: ToncoinIcon,
  MATIC: PolygonIcon,
  BASE: BaseIcon,
  AVAX: AvalancheIcon,
  OP: OptimismIcon,
  ARB: ArbitrumIcon,
  USDT: EthereumIcon, // Placeholder, ideally a specific icon for USDT
  USDC: EthereumIcon, // Placeholder
  DAI: EthereumIcon, // Placeholder
  WETH: EthereumIcon, // Placeholder
};

export const getAssets = async (chain: string, address: string): Promise<Asset[]> => {
  const cacheKey = `assets_${chain}_${address}`;
  const cachedData = loadFromCache<Asset[]>(cacheKey);
  if (cachedData) {
      return cachedData;
  }

  const apiUrl = getApiUrl(chain);
  const response = await fetch(`${apiUrl}/assets/${address}`);
  const assets = await response.json();
  const formattedAssets = assets.map((asset: any) => ({
    id: asset.id || '',
    name: asset.name || '',
    ticker: asset.ticker || '',
    icon: CryptoIcons[asset.ticker] || (() => null),
    price: asset.price || 0,
    change24h: asset.change24h || 0,
    balanceCrypto: asset.balanceCrypto || 0,
    balanceUSD: asset.balanceUSD || 0,
    marketCap: asset.marketCap || 0,
    volume24h: asset.volume24h || 0,
    chain: asset.chain || '',
    sparklineData: asset.sparklineData || [],
    coingeckoId: COINGECKO_IDS[asset.ticker] || '',
  }));
  saveToCache(cacheKey, formattedAssets);
  return formattedAssets;
};

export const getTransactions = async (chain: string, address: string): Promise<Transaction[]> => {
  const effectiveChain = chain || 'ethereum'; // Add this line
  console.log('getTransactions chain:', effectiveChain);
  const cacheKey = `transactions_${effectiveChain}_${address}`;
  const cachedData = loadFromCache<Transaction[]>(cacheKey);
  if (cachedData) {
      return cachedData;
  }

  const apiUrl = getApiUrl(effectiveChain);
  try {
    const response = await fetch(`${apiUrl}/transactions/${address}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const transactions = await response.json();
    console.log('Frontend API: Raw transactions from backend:', transactions);
    const formattedTransactions = transactions.map((tx: any) => {
      console.log('Frontend API: Mapping transaction:', tx);
      return {
        id: tx.hash || tx.txid || tx.transaction_id?.hash || Math.random().toString(36).substring(7),
        date: tx.date,
        type: tx.type || TransactionType.SEND, // Default to SEND if type is not provided
        asset: {
            id: tx.contractAddress || tx.tokenSymbol?.toLowerCase() || 'unknown',
            name: tx.tokenName || tx.tokenSymbol || 'Unknown',
            ticker: tx.tokenSymbol || 'UNKNOWN',
            icon: CryptoIcons[tx.tokenSymbol] || (() => null),
            price: tx.tokenPrice || 0, // Assuming backend provides tokenPrice
            change24h: 0, // Not available from current backend tx data
            balanceCrypto: 0, // Not directly available from tx data
            balanceUSD: 0, // Not directly available from tx data
            marketCap: 0, // Not directly available from tx data
            volume24h: 0, // Not directly available from tx data
            chain: chain,
            sparklineData: [], // Not directly available from tx data
            coingeckoId: COINGECKO_IDS[tx.tokenSymbol] || '',
        },
        amountCrypto: (tx.value / (10 ** (tx.tokenDecimal || 18))) || 0,
        amountUSD: tx.amountUSD || 0, // Assuming backend provides amountUSD
        status: tx.status,
        address: tx.to || tx.from || '',
        wallet: address,
        chain: chain,
        gasFeeUSD: tx.gasFeeUSD || 0, // Assuming backend provides gasFeeUSD
      };
    });
    saveToCache(cacheKey, formattedTransactions);
    return formattedTransactions;
  } catch (error: any) {
    console.error('Error fetching transactions from backend:', error.message);
    throw error; // Re-throw to be caught by the frontend component
  }
};

export const getNfts = async (chain: string, address: string): Promise<Nft[]> => {
  const cacheKey = `nfts_${chain}_${address}`;
  const cachedData = loadFromCache<Nft[]>(cacheKey);
  if (cachedData) {
      return cachedData;
  }

  const apiUrl = getApiUrl(chain);
  const response = await fetch(`${apiUrl}/nfts/${address}`);
  const nfts = await response.json();
  saveToCache(cacheKey, nfts);
  return nfts;
};

export const getPortfolioHistory = async (assets: { coingeckoId?: string, balance: number }[], days: number = 30): Promise<PortfolioHistory[]> => {
    const cacheKey = `portfolio_history_${JSON.stringify(assets)}_${days}`; // Cache key based on assets and days
    const cachedData = loadFromCache<PortfolioHistory[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch(`${BASE_URL}/portfolio/history`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assets, days }),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch portfolio history');
    }
    const history = await response.json();
    saveToCache(cacheKey, history);
    return history;
};

export const getAssetHistory = async (coingeckoId: string, days: number | string): Promise<{ date: string, price: number }[]> => {
    const cacheKey = `asset_history_${coingeckoId}_${days}`;
    const cachedData = loadFromCache<{ date: string, price: number }[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch(`${BASE_URL}/portfolio/asset-history/${coingeckoId}?days=${days}`);
    if (!response.ok) {
        throw new Error('Failed to fetch asset history');
    }
    const history = await response.json();
    saveToCache(cacheKey, history);
    return history;
};

export const getProfile = async (): Promise<any> => {
    const cacheKey = `profile`;
    const cachedData = loadFromCache<any>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch(`${BASE_URL}/api/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    const profile = await response.json();
    saveToCache(cacheKey, profile);
    return profile;
};

export const updateProfile = async (profileData: any): Promise<any> => {
    // Invalidate profile cache on update
    invalidateCache('profile');
    const response = await fetch(`${BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    const updatedProfile = await response.json();
    saveToCache('profile', updatedProfile); // Update cache with new profile
    return updatedProfile;
};

export const analyzeContract = async (chain: string, address: string): Promise<{ isVerified: boolean, message?: string }> => {
  const apiUrl = getApiUrl(chain);
  const response = await fetch(`${apiUrl}/contract/verify/${address}`);
  if (!response.ok) {
      throw new Error('Failed to analyze contract');
  }
  return response.json();
};

export const getCmcGlobalMetrics = async (): Promise<any> => {
    const cacheKey = `cmc_global_metrics`;
    const cachedData = loadFromCache<any>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/markets/cmc/global-metrics`);
        const data = await response.json();
        saveToCache(cacheKey, data || null);
        return data || null;
    } catch (error) {
        console.error('Error fetching global metrics from backend:', error);
        return null;
    }
};

export const getCmcGlobalMetricsHistory = async (): Promise<any> => {
    const cacheKey = `cmc_global_metrics_history`;
    const cachedData = loadFromCache<any>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/markets/cmc/global-metrics/historical`);
        const data = await response.json();
        saveToCache(cacheKey, data || null);
        return data || null;
    } catch (error) {
        console.error('Error fetching global metrics history from backend:', error);
        return null;
    }
};

export const getCmcListings = async (): Promise<any[]> => {
    const cacheKey = `cmc_listings`;
    const cachedData = loadFromCache<any[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/markets/cmc/listings`);
        const data = await response.json();
        saveToCache(cacheKey, data || []);
        return data || [];
    } catch (error) {
        console.error('Error fetching listings from backend:', error);
        return [];
    }
};

export const getCmcTrending = async (): Promise<any[]> => {
    const cacheKey = `cmc_trending`;
    const cachedData = loadFromCache<any[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/markets/cmc/trending`);
        const data = await response.json();
        saveToCache(cacheKey, data || []);
        return data || [];
    } catch (error) {
        console.error('Error fetching trending data from backend:', error);
        return [];
    }
};

export const getCgGlobal = async (): Promise<any> => {
    const cacheKey = `cg_global`;
    const cachedData = loadFromCache<any>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/markets/coingecko/global`);
        const data = await response.json();
        saveToCache(cacheKey, data || null);
        return data || null;
    } catch (error) {
        console.error('Error fetching global data from backend:', error);
        return null;
    }
};

export const getCgCoinsMarkets = async (): Promise<any[]> => {
    const cacheKey = `cg_coins_markets`;
    const cachedData = loadFromCache<any[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/markets/coingecko/coins/markets`);
        const data = await response.json();
        saveToCache(cacheKey, data || []);
        return data || [];
    } catch (error) {
        console.error('Error fetching coins markets from backend:', error);
        return [];
    }
};

export const getCgTreasury = async (coinId: string): Promise<any> => {
    const cacheKey = `cg_treasury_${coinId}`;
    const cachedData = loadFromCache<any>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/markets/coingecko/treasury/${coinId}`);
        const data = await response.json();
        saveToCache(cacheKey, data || null);
        return data || null;
    } catch (error) {
        console.error(`Error fetching treasury for ${coinId} from backend:`, error);
        return null;
    }
};

export const getCgTrending = async (): Promise<any[]> => {
    const cacheKey = `cg_trending`;
    const cachedData = loadFromCache<any[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/markets/coingecko/trending`);
        const data = await response.json();
        saveToCache(cacheKey, data || []);
        return data || [];
    } catch (error) {
        console.error('Error fetching trending data from backend:', error);
        return [];
    }
};