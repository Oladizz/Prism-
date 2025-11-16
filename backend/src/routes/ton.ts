import express from 'express';
import { getTonBalance, getTonTransactions } from '../ton';
import { getPrices } from '../coingecko';
import { tokenSymbolToCoinGeckoId } from '../constants';


const router = express.Router();

router.get('/assets/:address', async (req, res) => {
    const { address } = req.params;
    const { chain } = req;
    if (!chain) {
        return res.status(400).json({ error: 'Chain is not specified' });
    }
    try {
        const balance = await getTonBalance(address);
        const prices = await getPrices([tokenSymbolToCoinGeckoId['TON']]);
        const tonPrice = prices[tokenSymbolToCoinGeckoId['TON']]?.usd || 0;

        const assets = [{
            id: 'ton',
            name: 'Toncoin',
            ticker: 'TON',
            icon: 'ToncoinIcon', // Placeholder, frontend will map
            price: tonPrice,
            change24h: 0, // Not available from current API
            balanceCrypto: parseFloat(balance) / 1e9,
            balanceUSD: (parseFloat(balance) / 1e9) * tonPrice,
            marketCap: 0, // Not available from current API
            volume24h: 0, // Not available from current API
            chain: chain,
            sparklineData: [], // Not available from current API
            coingeckoId: tokenSymbolToCoinGeckoId['TON'],
        }];
        res.json(assets);
    } catch (error: any) {
        console.error('Error in /assets/:address (TON):', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/transactions/:address', async (req, res) => {
    const { address } = req.params;
    const { chain } = req;
    if (!chain) {
        return res.status(400).json({ error: 'Chain is not specified' });
    }
    try {
        const transactions = await getTonTransactions(address);
        const prices = await getPrices([tokenSymbolToCoinGeckoId['TON']]);
        const tonPrice = prices[tokenSymbolToCoinGeckoId['TON']]?.usd || 0;

        const formattedTransactions = transactions.map((tx: any) => {
            // Simplified TON transaction parsing
            const status = 'Completed'; // Assuming all fetched TON transactions are completed
            const type = 'Unknown'; // TON transactions can be complex to categorize simply

            const amount = (tx.in_msg?.value || 0) / 1e9;
            const gasFeeTON = ((parseInt(tx.fee) + parseInt(tx.storage_fee) + parseInt(tx.other_fee)) || 0) / 1e9;
            const gasFeeUSD = gasFeeTON * tonPrice;

            return {
                id: tx.transaction_id?.hash,
                date: new Date((tx.utime || 0) * 1000).toLocaleString(),
                type: amount > 0 ? 'Receive' : 'Send', // Simplified
                asset: {
                    id: 'ton',
                    name: 'Toncoin',
                    ticker: 'TON',
                    icon: '', // Frontend will map
                    price: tonPrice,
                    change24h: 0,
                    balanceCrypto: 0,
                    balanceUSD: 0,
                    marketCap: 0,
                    volume24h: 0,
                    chain: chain,
                    sparklineData: [],
                    coingeckoId: tokenSymbolToCoinGeckoId['TON'],
                },
                amountCrypto: Math.abs(amount),
                amountUSD: Math.abs(amount) * tonPrice,
                status: status,
                address: tx.in_msg?.destination || 'N/A', // Simplified
                wallet: address,
                chain: chain,
                gasFeeUSD: gasFeeUSD,
            };
        });

        res.json(formattedTransactions);
    } catch (error: any) {
        console.error('Error in /transactions/:address (TON):', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/nfts/:address', async (req, res) => {
    res.json([]); // TON NFT fetching not implemented yet
});

export default router;
