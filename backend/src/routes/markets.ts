import express from 'express';
import { getMarketChart, getCoinDetailsById, getGlobal, getCoinsMarkets, getCompanyTreasury, getTrending } from '../coingecko';
import { getCmcGlobalMetrics, getCmcGlobalMetricsHistory, getCmcListings } from '../coinmarketcap';

const router = express.Router();

router.get('/coin/:coinId', async (req, res) => {
    const { coinId } = req.params;
    try {
        const coinDetails = await getCoinDetailsById(coinId);
        res.json(coinDetails);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/coin/:coinId/market-chart', async (req, res) => {
    const { coinId } = req.params;
    const { days } = req.query;
    try {
        const marketChart = await getMarketChart(coinId, days as string);
        res.json(marketChart);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/cmc/global-metrics', async (req, res) => {
    try {
        const metrics = await getCmcGlobalMetrics();
        res.json(metrics);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/cmc/global-metrics/historical', async (req, res) => {
    try {
        const metrics = await getCmcGlobalMetricsHistory();
        res.json(metrics);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/cmc/listings', async (req, res) => {
    try {
        const listings = await getCmcListings();
        res.json(listings);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/coingecko/global', async (req, res) => {
    try {
        const global = await getGlobal();
        res.json(global);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/coingecko/coins/markets', async (req, res) => {
    try {
        const markets = await getCoinsMarkets();
        res.json(markets);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/coingecko/treasury/:coinId', async (req, res) => {
    const { coinId } = req.params;
    try {
        const treasury = await getCompanyTreasury(coinId);
        res.json(treasury);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/coingecko/trending', async (req, res) => {
    try {
        const trending = await getTrending();
        res.json(trending);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;