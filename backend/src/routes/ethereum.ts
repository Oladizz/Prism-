import express from 'express';
import { getEthBalance, getTokenBalances, getTransactions, getNfts, verifyContract } from '../etherscan';
import { getMarkets, getPrices } from '../coingecko';
import { tokenSymbolToCoinGeckoId } from '../constants';



const router = express.Router();

router.get('/assets/:address', async (req, res) => {
    const { address } = req.params;
    const { chain } = req;
    if (!chain) {
        return res.status(400).json({ error: 'Chain is not specified' });
    }
    try {
        const ethBalance = await getEthBalance(address, chain);
        const tokenTransfers = await getTokenBalances(address, chain);

        const uniqueTokenSymbols = new Set<string>();
        uniqueTokenSymbols.add('ETH'); // Add native token
        for (const tx of tokenTransfers) {
            uniqueTokenSymbols.add(tx.tokenSymbol);
        }

        const coingeckoIdsToFetch: string[] = [];
        uniqueTokenSymbols.forEach(symbol => {
            const id = tokenSymbolToCoinGeckoId[symbol];
            if (id) {
                coingeckoIdsToFetch.push(id);
            }
        });

        const markets = await getMarkets(coingeckoIdsToFetch);
        const marketDataMap = new Map<string, any>(markets.map((m: any) => [m.id, m]));

        const assets = [];

        // Add native asset (ETH)
        const ethMarketData = marketDataMap.get(tokenSymbolToCoinGeckoId['ETH']);
        const ethPrice = ethMarketData?.current_price || 0;
        const ethChange24h = ethMarketData?.price_change_percentage_24h || 0;
        const ethSparkline = ethMarketData?.sparkline_in_7d?.price.map((p: number, i: number) => ({ name: `d${i}`, value: p })) || [];

        assets.push({
            id: 'ethereum',
            name: 'Ethereum',
            ticker: 'ETH',
            icon: 'EthereumIcon', // Placeholder, frontend will map
            price: ethPrice,
            change24h: ethChange24h,
            balanceCrypto: parseFloat(ethBalance) / 1e18,
            balanceUSD: (parseFloat(ethBalance) / 1e18) * ethPrice,
            marketCap: ethMarketData?.market_cap || 0,
            volume24h: ethMarketData?.total_volume || 0,
            chain: chain,
            sparklineData: ethSparkline,
            coingeckoId: tokenSymbolToCoinGeckoId['ETH'],
        });

        // Aggregate ERC-20 token balances
        for (const token of tokenTransfers) {
            if (parseFloat(token.balance) <= 0) continue; // Only add tokens with positive balance

            const coingeckoId = tokenSymbolToCoinGeckoId[token.tokenSymbol];
            const tokenMarketData = marketDataMap.get(coingeckoId);
            const tokenPrice = tokenMarketData?.current_price || 0;
            const tokenChange24h = tokenMarketData?.price_change_percentage_24h || 0;
            const tokenSparkline = tokenMarketData?.sparkline_in_7d?.price.map((p: number, i: number) => ({ name: `d${i}`, value: p })) || [];
            const balanceCrypto = parseFloat(token.balance);

            assets.push({
                id: token.contractAddress,
                name: token.tokenName,
                ticker: token.tokenSymbol,
                icon: '', // Placeholder, frontend will map
                price: tokenPrice,
                change24h: tokenChange24h,
                balanceCrypto: balanceCrypto,
                balanceUSD: balanceCrypto * tokenPrice,
                marketCap: tokenMarketData?.market_cap || 0,
                volume24h: tokenMarketData?.total_volume || 0,
                chain: chain,
                sparklineData: tokenSparkline,
                coingeckoId: coingeckoId,
            });
        }

        res.json(assets);
    } catch (error: any) {
        console.error('Error in /assets/:address:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/transactions/:address', async (req, res) => {
    console.log('Backend: /transactions/:address route hit');
    const { address } = req.params;
    const { chain } = req;
    const limit = parseInt(req.query.limit as string || '100', 10); // Default to 100
    const offset = parseInt(req.query.offset as string || '0', 10); // Default to 0

    if (!chain) {
        console.log('Backend: Chain is not specified for /transactions/:address');
        return res.status(400).json({ error: 'Chain is not specified' });
    }
    try {
        console.log(`Backend: Fetching transactions for address: ${address} on chain: ${chain} with limit: ${limit}, offset: ${offset}`);
        const allTransactions = await getTransactions(address, chain, limit, offset);
        console.log(`Backend: Fetched ${allTransactions.length} transactions.`);

        const uniqueTokenSymbols = new Set<string>();
        uniqueTokenSymbols.add('ETH'); // Add native token
        for (const tx of allTransactions) {
            // Check if tx.tokenSymbol exists before adding
            if (tx.tokenSymbol) {
                uniqueTokenSymbols.add(tx.tokenSymbol);
            } else if (tx.tokenID) { // Assuming tokenID implies NFT
                uniqueTokenSymbols.add('NFT');
            } else {
                uniqueTokenSymbols.add('ETH');
            }
        }

        const coingeckoIdsToFetch: string[] = [];
        uniqueTokenSymbols.forEach(symbol => {
            const id = tokenSymbolToCoinGeckoId[symbol];
            if (id) {
                coingeckoIdsToFetch.push(id);
            }
        });

        const prices = await getPrices(coingeckoIdsToFetch);
        const ethPrice = prices[tokenSymbolToCoinGeckoId['ETH']]?.usd || 0;

        const formattedTransactions = allTransactions.map((tx: any) => {
            const isNFT = tx.tokenID !== undefined; // Simple check for NFT transaction
            const tokenSymbol = isNFT ? 'NFT' : (tx.tokenSymbol || 'ETH'); // Use 'NFT' for NFT transactions
            const coingeckoId = tokenSymbolToCoinGeckoId[tokenSymbol];
            const assetPrice = prices[coingeckoId]?.usd || 0; // Use prices from the earlier fetch if available

            const gasUsed = parseInt(tx.gasUsed || '0');
            const gasPrice = parseInt(tx.gasPrice || '0');
            const gasFeeETH = (gasUsed * gasPrice) / 1e18;
            const gasFeeUSD = gasFeeETH * ethPrice;

            let type: string;
            let amountCrypto: number;
            let amountUSD: number;

            if (isNFT) {
                type = tx.to.toLowerCase() === address.toLowerCase() ? 'NFT Receive' : 'NFT Send';
                amountCrypto = 1; // 1 NFT
                amountUSD = 0; // NFT value not directly in Etherscan tx
            } else {
                type = tx.to.toLowerCase() === address.toLowerCase() ? 'Receive' : 'Send';
                amountCrypto = parseFloat(tx.value) / (10 ** parseInt(tx.tokenDecimal || '18'));
                amountUSD = amountCrypto * assetPrice;
            }

            return {
                id: tx.hash,
                date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
                type: type,
                asset: {
                    id: tx.contractAddress || chain,
                    name: tx.tokenName || (isNFT ? 'NFT' : 'Ethereum'),
                    ticker: tokenSymbol,
                    icon: '', // Frontend will map
                    price: assetPrice,
                    change24h: 0,
                    balanceCrypto: 0,
                    balanceUSD: 0,
                    marketCap: 0,
                    volume24h: 0,
                    chain: chain,
                    sparklineData: [],
                    coingeckoId: coingeckoId,
                },
                amountCrypto: amountCrypto,
                amountUSD: amountUSD,
                status: tx.isError === '0' ? 'Completed' : 'Failed',
                address: tx.to,
                wallet: address,
                chain: chain,
                gasFeeUSD: gasFeeUSD,
            };
        });

        res.json(formattedTransactions);
    } catch (error: any) {
        console.error('Error in /transactions/:address:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/nfts/:address', async (req, res) => {
    const { address } = req.params;
    const { chain } = req;
    if (!chain) {
        return res.status(400).json({ error: 'Chain is not specified' });
    }
    try {
        const nfts = await getNfts(address, chain);
        const formattedNfts = nfts.map((nft: any) => ({
            id: nft.tokenID,
            name: nft.tokenName,
            collection: nft.tokenName, // Etherscan doesn't provide collection name directly
            imageUrl: '', // Etherscan doesn't provide image URL directly
            chain: chain,
        }));
        res.json(formattedNfts);
    } catch (error: any) {
        console.error('Error in /nfts/:address:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/contract/verify/:address', async (req, res) => {
    const { address } = req.params;
    const { chain } = req;
    if (!chain) {
        return res.status(400).json({ error: 'Chain is not specified' });
    }
    try {
        const verificationStatus = await verifyContract(address, chain);
        res.json(verificationStatus);
    } catch (error: any) {
        console.error('Error in /contract/verify/:address:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
