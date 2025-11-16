import express from 'express';
import { getBitcoinBalance, getBitcoinTransactions } from '../bitcoin';
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
        const balance = await getBitcoinBalance(address);
        const prices = await getPrices([tokenSymbolToCoinGeckoId['BTC']]);
        const btcPrice = prices[tokenSymbolToCoinGeckoId['BTC']]?.usd || 0;

        const assets = [{
            id: 'bitcoin',
            name: 'Bitcoin',
            ticker: 'BTC',
            icon: 'BitcoinIcon', // Placeholder, frontend will map
            price: btcPrice,
            change24h: 0, // Not available from current API
            balanceCrypto: balance / 1e8,
            balanceUSD: (balance / 1e8) * btcPrice,
            marketCap: 0, // Not available from current API
            volume24h: 0, // Not available from current API
            chain: chain,
            sparklineData: [], // Not available from current API
            coingeckoId: tokenSymbolToCoinGeckoId['BTC'],
        }];
        res.json(assets);
    } catch (error: any) {
        console.error('Error in /assets/:address (Bitcoin):', error);
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
        const transactions = await getBitcoinTransactions(address);
        const prices = await getPrices([tokenSymbolToCoinGeckoId['BTC']]);
        const btcPrice = prices[tokenSymbolToCoinGeckoId['BTC']]?.usd || 0;

        const formattedTransactions = transactions.map((tx: any) => {
            // Simplified Bitcoin transaction parsing
            const isConfirmed = tx.status?.confirmed || false;
            const status = isConfirmed ? 'Completed' : 'Pending';
            const type = 'Unknown'; // Bitcoin transactions can be complex to categorize simply

            const fee = (tx.fee || 0) / 1e8; // fee in BTC
            const gasFeeUSD = fee * btcPrice;

            // Calculate amount based on inputs/outputs for the given address
            let amountCrypto = 0;
            tx.vout.forEach((output: any) => {
                if (output.scriptpubkey_address === address) {
                    amountCrypto += output.value;
                }
            });
            tx.vin.forEach((input: any) => {
                if (input.prevout?.scriptpubkey_address === address) {
                    amountCrypto -= input.prevout.value;
                }
            });
            amountCrypto /= 1e8; // Convert satoshis to BTC

            return {
                id: tx.txid,
                date: new Date((tx.status?.block_time || 0) * 1000).toLocaleString(),
                type: amountCrypto > 0 ? 'Receive' : 'Send', // Simplified
                asset: {
                    id: 'bitcoin',
                    name: 'Bitcoin',
                    ticker: 'BTC',
                    icon: '', // Frontend will map
                    price: btcPrice,
                    change24h: 0,
                    balanceCrypto: 0,
                    balanceUSD: 0,
                    marketCap: 0,
                    volume24h: 0,
                    chain: chain,
                    sparklineData: [],
                    coingeckoId: tokenSymbolToCoinGeckoId['BTC'],
                },
                amountCrypto: Math.abs(amountCrypto),
                amountUSD: Math.abs(amountCrypto) * btcPrice,
                status: status,
                address: tx.vin[0]?.prevout?.scriptpubkey_address || 'N/A', // Simplified
                wallet: address,
                chain: chain,
                gasFeeUSD: gasFeeUSD,
            };
        });

        res.json(formattedTransactions);
    } catch (error: any) {
        console.error('Error in /transactions/:address (Bitcoin):', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/nfts/:address', async (req, res) => {
    res.json([]); // Bitcoin does not natively support NFTs in the same way as other chains
});

export default router;
