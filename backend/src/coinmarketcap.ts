import axios from 'axios';
import dotenv from 'dotenv';
import { getCache, setCache } from 'data/cache'; // Import caching utilities
dotenv.config();

const CMC_API_URL = 'https://pro-api.coinmarketcap.com';
const CMC_API_KEY = process.env.CMC_API_KEY;

export const getCmcGlobalMetrics = async (): Promise<any> => {
    if (!CMC_API_KEY) {
        console.warn('CoinMarketCap API key is not set. Skipping fetch.');
        return null;
    }
    const cacheKey = `cmc_global_metrics`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(`${CMC_API_URL}/v1/global-metrics/quotes/latest`, {
            headers: {
                'X-CMC_PRO_API_KEY': CMC_API_KEY,
            },
        });
        await setCache(cacheKey, response.data.data, 300); // Cache for 5 minutes
        return response.data.data;
    } catch (error) {
        console.error('Error fetching global metrics from CoinMarketCap:', error);
        return null;
    }
};

export const getCmcGlobalMetricsHistory = async (): Promise<any> => {
    if (!CMC_API_KEY) {
        console.warn('CoinMarketCap API key is not set. Skipping fetch.');
        return null;
    }
    const cacheKey = `cmc_global_metrics_history`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(`${CMC_API_URL}/v1/global-metrics/quotes/historical`, {
            headers: {
                'X-CMC_PRO_API_KEY': CMC_API_KEY,
            },
        });
        await setCache(cacheKey, response.data.data, 3600); // Cache for 1 hour
        return response.data.data;
    } catch (error) {
        console.error('Error fetching global metrics history from CoinMarketCap:', error);
        return null;
    }
};

export const getCmcListings = async (): Promise<any[]> => {
    if (!CMC_API_KEY) {
        console.warn('CoinMarketCap API key is not set. Skipping fetch.');
        return [];
    }
    const cacheKey = `cmc_listings`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(`${CMC_API_URL}/v1/cryptocurrency/listings/latest`, {
            headers: {
                'X-CMC_PRO_API_KEY': CMC_API_KEY,
            },
        });
        await setCache(cacheKey, response.data.data, 300); // Cache for 5 minutes
        return response.data.data;
    } catch (error) {
        console.error('Error fetching listings from CoinMarketCap:', error);
        return [];
    }
};
