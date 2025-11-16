import express from 'express';
import { getMarketChart } from '../coingecko';

const router = express.Router();

router.post('/history', async (req, res) => {
    const { assets, days } = req.body; // assets: { coingeckoId: string, balance: number }[]

    if (!assets || !Array.isArray(assets) || assets.length === 0) {
        return res.status(400).json({ error: 'Invalid assets array' });
    }

    try {
        const historyPromises = assets.map(asset => 
            getMarketChart(asset.coingeckoId, days || 30)
        );
        const results = await Promise.all(historyPromises);

        const portfolioHistory: { [timestamp: number]: number } = {};

        results.forEach((history, index) => {
            const asset = assets[index];
            if (history && history.prices) {
                history.prices.forEach(([timestamp, price]: [number, number]) => {
                    if (!portfolioHistory[timestamp]) {
                        portfolioHistory[timestamp] = 0;
                    }
                    portfolioHistory[timestamp] += price * asset.balance;
                });
            }
        });

        const formattedHistory = Object.keys(portfolioHistory).map(timestamp => ({
            name: new Date(parseInt(timestamp)).toLocaleDateString(),
            value: portfolioHistory[parseInt(timestamp)],
        })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

        res.json(formattedHistory);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/asset-history/:coingeckoId', async (req, res) => {
    const { coingeckoId } = req.params;
    const { days } = req.query;

    try {
        const history = await getMarketChart(coingeckoId, (days as string) || '30');
        if (history && history.prices) {
            const formattedHistory = history.prices.map(([timestamp, price]: [number, number]) => ({
                date: new Date(timestamp).toISOString(),
                price: price,
            }));
            res.json(formattedHistory);
        } else {
            res.json([]);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
