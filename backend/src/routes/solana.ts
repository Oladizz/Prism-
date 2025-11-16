import express from 'express';
import { getSolanaBalance, getSolanaTokenBalances, getSolanaTransactions } from '../solana';
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
        const balance = await getSolanaBalance(address);
        const tokens = await getSolanaTokenBalances(address);

        const uniqueTokenSymbols = new Set<string>();
        uniqueTokenSymbols.add('SOL'); // Add native token
        for (const token of tokens) {
            uniqueTokenSymbols.add(token.tokenSymbol);
        }

        const coingeckoIdsToFetch: string[] = [];
        uniqueTokenSymbols.forEach(symbol => {
            const id = tokenSymbolToCoinGeckoId[symbol];
            if (id) {
                coingeckoIdsToFetch.push(id);
            }
        });

        const prices = await getPrices(coingeckoIdsToFetch);

        const assets = [];

        // Add native asset (SOL)
        const solPrice = prices[tokenSymbolToCoinGeckoId['SOL']]?.usd || 0;
        assets.push({
            id: 'solana',
            name: 'Solana',
            ticker: 'SOL',
            icon: 'SolanaIcon', // Placeholder, frontend will map
            price: solPrice,
            change24h: 0, // Not available from current API
            balanceCrypto: balance / 1e9,
            balanceUSD: (balance / 1e9) * solPrice,
            marketCap: 0, // Not available from current API
            volume24h: 0, // Not available from current API
            chain: chain,
            sparklineData: [], // Not available from current API
            coingeckoId: tokenSymbolToCoinGeckoId['SOL'],
        });

        // Add SPL tokens
        for (const token of tokens) {
            const coingeckoId = tokenSymbolToCoinGeckoId[token.tokenSymbol];
            const tokenPrice = prices[coingeckoId]?.usd || 0;
            const balanceCrypto = token.tokenAmount.uiAmount;

            assets.push({
                id: token.tokenAddress,
                name: token.tokenName,
                ticker: token.tokenSymbol,
                icon: token.tokenIcon, // Solscan provides icon
                price: tokenPrice,
                change24h: 0, // Not available from current API
                balanceCrypto: balanceCrypto,
                balanceUSD: balanceCrypto * tokenPrice,
                marketCap: 0, // Not available from current API
                volume24h: 0, // Not available from current API
                chain: chain,
                sparklineData: [], // Not available from current API
                coingeckoId: coingeckoId,
            });
        }

        res.json(assets);
    } catch (error: any) {
        console.error('Error in /assets/:address (Solana):', error);
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
        const transactions = await getSolanaTransactions(address);
        const solPrice = (await getPrices([tokenSymbolToCoinGeckoId['SOL']]))[tokenSymbolToCoinGeckoId['SOL']]?.usd || 0;

        const formattedTransactions = transactions.map((tx: any) => {
            // Simplified Solana transaction parsing
            const isError = tx.meta?.err !== null;
            const status = isError ? 'Failed' : 'Completed';
            const type = 'Unknown'; // Solana transactions can be complex to categorize simply

            const fee = (tx.meta?.fee || 0) / 1e9; // fee in SOL
            const gasFeeUSD = fee * solPrice;

            // Attempt to find a relevant transfer for amount
            let amountCrypto = 0;
            let amountUSD = 0;
            let tokenSymbol = 'SOL'; // Default to SOL
            let assetId = 'solana';

            if (tx.meta?.postBalances && tx.meta?.preBalances) {
                const balanceChange = (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9;
                if (balanceChange !== 0) {
                    amountCrypto = Math.abs(balanceChange);
                    amountUSD = amountCrypto * solPrice;
                }
            }
            // Further logic would be needed to parse SPL token transfers within a transaction

            return {
                id: tx.transaction?.signatures?.[0] || tx.signature,
                date: new Date(tx.blockTime * 1000).toLocaleString(),
                type: type,
                asset: {
                    id: assetId,
                    name: 'Solana',
                    ticker: tokenSymbol,
                    icon: '', // Frontend will map
                    price: solPrice,
                    change24h: 0,
                    balanceCrypto: 0,
                    balanceUSD: 0,
                    marketCap: 0,
                    volume24h: 0,
                    chain: chain,
                    sparklineData: [],
                    coingeckoId: tokenSymbolToCoinGeckoId['SOL'],
                },
                amountCrypto: amountCrypto,
                amountUSD: amountUSD,
                status: status,
                address: tx.transaction?.message?.accountKeys?.[0]?.pubkey || 'N/A', // Simplified
                wallet: address,
                chain: chain,
                gasFeeUSD: gasFeeUSD,
            };
        });

        res.json(formattedTransactions);
    } catch (error: any) {
        console.error('Error in /transactions/:address (Solana):', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/nfts/:address', async (req, res) => {
    // Solana NFT fetching is more complex and not directly supported by solscan API in the same way as Etherscan.
    // This would typically involve using a dedicated NFT API like Alchemy's NFT API or parsing transaction logs.
    res.json([]); // Return empty for now
});

export default router;
