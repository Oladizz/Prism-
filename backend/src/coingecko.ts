import axios from 'axios';
import dotenv from 'dotenv';
import { getCache, setCache } from 'data/cache'; // Import caching utilities
dotenv.config();

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

export const getPrices = async (tokenIds: string[]): Promise<any> => {
  if (!tokenIds || tokenIds.length === 0) {
    return {};
  }
  const cacheKey = `coingecko_prices_${tokenIds.join(',')}`;
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: tokenIds.join(','),
        vs_currencies: 'usd',
        x_cg_demo_api_key: COINGECKO_API_KEY,
      },
    });
    await setCache(cacheKey, response.data, 300); // Cache for 5 minutes
    return response.data;
  } catch (error: any) {
    console.error('Error fetching prices from CoinGecko:', error);
    return {};
  }
};

export const getMarkets = async (tokenIds: string[]): Promise<any> => {
  if (!tokenIds || tokenIds.length === 0) {
    return [];
  }
  const cacheKey = `coingecko_markets_${tokenIds.join(',')}`;
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: tokenIds.join(','),
        sparkline: true,
        x_cg_demo_api_key: COINGECKO_API_KEY,
      }
    });
    await setCache(cacheKey, response.data, 300); // Cache for 5 minutes
    return response.data;
  } catch (error: any) {
    console.error('Error fetching markets from CoinGecko:', error);
    return [];
  }
};

export const getMarketChart = async (tokenId: string, days: number | string = 30): Promise<any> => {
  if (!tokenId) {
    return null;
  }
  const cacheKey = `coingecko_market_chart_${tokenId}_${days}`;
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${tokenId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        x_cg_demo_api_key: COINGECKO_API_KEY,
      },
    });
    await setCache(cacheKey, response.data, 3600); // Cache for 1 hour
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching market chart for ${tokenId} from CoinGecko:`, error);
    return null;
  }
};

export const getCoinDetailsById = async (coinId: string): Promise<any> => {
  if (!coinId) {
    return null;
  }
  const cacheKey = `coingecko_coin_details_${coinId}`;
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}`, {
      params: {
        x_cg_demo_api_key: COINGECKO_API_KEY,
      },
    });
    await setCache(cacheKey, response.data, 3600); // Cache for 1 hour
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching coin details for ${coinId} from CoinGecko:`, error);
    return null;
  }
};

export const getGlobal = async (): Promise<any> => {
  const cacheKey = `coingecko_global`;
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/global`, {
      params: {
        x_cg_demo_api_key: COINGECKO_API_KEY,
      },
    });
    await setCache(cacheKey, response.data.data, 300); // Cache for 5 minutes
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching global data from CoinGecko:', error);
    return null;
  }
};

export const getCoinsMarkets = async (): Promise<any[]> => {
    const cacheKey = `coingecko_coins_markets`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 100,
                page: 1,
                sparkline: true,
                price_change_percentage: '7d',
                x_cg_demo_api_key: COINGECKO_API_KEY,
            }
        });
        await setCache(cacheKey, response.data, 300); // Cache for 5 minutes
        return response.data;
    } catch (error) {
        console.error('Error fetching coins markets from CoinGecko:', error);
        return [];
    }
};

export const getCompanyTreasury = async (coinId: string): Promise<any> => {
  if (!coinId) {
    return null;
  }
  const cacheKey = `coingecko_company_treasury_${coinId}`;
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/companies/public_treasury/${coinId}`, {
      params: {
        x_cg_demo_api_key: COINGECKO_API_KEY,
      },
    });
    await setCache(cacheKey, response.data, 3600); // Cache for 1 hour
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching company treasury for ${coinId} from CoinGecko:`, error);
    return null;
  }
};

export const getTrending = async (): Promise<any[]> => {
  const cacheKey = `coingecko_trending`;
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/search/trending`, {
      params: {
        x_cg_demo_api_key: COINGECKO_API_KEY,
      },
    });
    await setCache(cacheKey, response.data.coins, 300); // Cache for 5 minutes
    return response.data.coins;
  } catch (error: any) {
    console.error('Error fetching trending data from CoinGecko:', error);
    return [];
  }
};