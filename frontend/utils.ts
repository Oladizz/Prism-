import { Transaction, TransactionType, TransactionStatus, Asset } from './types.ts';
import { COINGECKO_IDS, CHAINS } from './constants.ts';
import { BitcoinIcon, EthereumIcon, SolanaIcon, BnbIcon, ToncoinIcon, PolygonIcon, BaseIcon, AvalancheIcon, OptimismIcon, ArbitrumIcon } from './components/icons/CryptoIcons';

const CryptoIcons: { [key: string]: any } = {
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

export const normalizeTransactions = (data: any, blockchain: string, walletAddress: string, prices: { [key: string]: number }): Transaction[] => {
    if (!data || data.error) {
        console.error(`API error for ${blockchain} wallet ${walletAddress}:`, data?.error);
        return [];
    }

    let transactions: any[] = [];
    try {
        switch (blockchain) {
            case 'ethereum':
            case 'binance-smart-chain':
            case 'polygon':
            case 'arbitrum':
            case 'optimism':
            case 'base':
            case 'avalanche': {
                const chainInfo = CHAINS.find(c => c.id === blockchain);
                if (!chainInfo) return [];

                const processEvmTransaction = (tx: any, isNft: boolean = false): Transaction | null => {
                    if (!tx) return null;

                    const tokenSymbol = tx.tokenSymbol || chainInfo.ticker;
                    const coingeckoId = COINGECKO_IDS[tokenSymbol] || COINGECKO_IDS[chainInfo.ticker];
                    const assetPrice = prices[coingeckoId] || 0;
                    const tokenDecimal = parseInt(tx.tokenDecimal || '18');
                    const value = parseFloat(tx.value || '0');

                    let amountCrypto = isNft ? 0 : value / (10 ** tokenDecimal);
                    let amountUSD = isNft ? 0 : amountCrypto * assetPrice;
                    let txType: TransactionType = TransactionType.SEND;

                    if (tx.to?.toLowerCase() === walletAddress.toLowerCase()) {
                        txType = isNft ? TransactionType.RECEIVE : TransactionType.RECEIVE;
                    } else if (tx.from?.toLowerCase() === walletAddress.toLowerCase()) {
                        txType = isNft ? TransactionType.SEND : TransactionType.SEND;
                    } else {
                        txType = TransactionType.SWAP; // Or some other type if applicable
                    }

                    return {
                        id: tx.hash,
                        date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
                        type: txType,
                        asset: {
                            id: tx.contractAddress || chainInfo.id,
                            name: tx.tokenName || chainInfo.name,
                            ticker: tokenSymbol,
                            icon: CryptoIcons[tokenSymbol] || chainInfo.icon,
                            price: assetPrice,
                            change24h: 0, // Not available in tx data
                            balanceCrypto: 0, // Not directly available from tx data
                            balanceUSD: 0, // Not directly available from tx data
                            marketCap: 0, // Not directly available from tx data
                            volume24h: 0, // Not directly available from tx data
                            chain: blockchain,
                            sparklineData: [], // Not available in tx data
                            coingeckoId: coingeckoId,
                        },
                        amountCrypto: amountCrypto,
                        amountUSD: amountUSD,
                        status: tx.isError === '0' ? TransactionStatus.COMPLETED : TransactionStatus.FAILED,
                        address: tx.to || tx.from,
                        wallet: walletAddress,
                        chain: blockchain,
                        gasFeeUSD: (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / (10 ** 18) * (prices[COINGECKO_IDS['ETH']] || 0), // Gas paid in native token
                    };
                };

                if (data.normal_transactions) {
                    transactions = transactions.concat(data.normal_transactions.map((tx: any) => processEvmTransaction(tx)).filter(Boolean));
                }
                if (data.token_transactions) {
                    transactions = transactions.concat(data.token_transactions.map((tx: any) => processEvmTransaction(tx)).filter(Boolean));
                }
                if (data.nft_transactions) {
                    transactions = transactions.concat(data.nft_transactions.map((tx: any) => processEvmTransaction(tx, true)).filter(Boolean));
                }
                break;
            }
            case 'solana': {
                const chainInfo = CHAINS.find(c => c.id === blockchain);
                if (!chainInfo) return [];

                transactions = data.map((tx: any) => {
                    if (!tx || !tx.meta || !tx.transaction?.message?.accountKeys?.[0]) return null;

                    const solPrice = prices[COINGECKO_IDS['SOL']] || 0;
                    const amount = (tx.meta.postBalances?.[0] || 0) / 10**9 - (tx.meta.preBalances?.[0] || 0) / 10**9;
                    const txType = amount > 0 ? TransactionType.RECEIVE : TransactionType.SEND;

                    return {
                        id: tx.transaction.signatures?.[0],
                        date: new Date(tx.blockTime * 1000).toLocaleString(),
                        type: txType,
                        asset: {
                            id: chainInfo.id,
                            name: chainInfo.name,
                            ticker: chainInfo.ticker,
                            icon: chainInfo.icon,
                            price: solPrice,
                            change24h: 0,
                            balanceCrypto: Math.abs(amount),
                            balanceUSD: Math.abs(amount) * solPrice,
                            marketCap: 0,
                            volume24h: 0,
                            chain: blockchain,
                            sparklineData: [],
                            coingeckoId: COINGECKO_IDS['SOL'],
                        },
                        amountCrypto: Math.abs(amount),
                        amountUSD: Math.abs(amount) * solPrice,
                        status: tx.meta.err ? TransactionStatus.FAILED : TransactionStatus.COMPLETED,
                        address: tx.transaction.message.accountKeys[1]?.pubkey || 'N/A',
                        wallet: walletAddress,
                        chain: blockchain,
                        gasFeeUSD: (tx.meta.fee || 0) / 10**9 * solPrice,
                    };
                }).filter(Boolean);
                break;
            }
            case 'bitcoin': {
                const chainInfo = CHAINS.find(c => c.id === blockchain);
                if (!chainInfo) return [];

                transactions = data.map((tx: any) => {
                    if (!tx || !tx.status) return null;

                    const btcPrice = prices[COINGECKO_IDS['BTC']] || 0;
                    // Simplified: Bitcoin transactions are complex, this is a basic representation
                    const amount = tx.vout.reduce((acc: number, output: any) => {
                        if (output.scriptpubkey_address === walletAddress) {
                            return acc + output.value;
                        }
                        return acc;
                    }, 0) / 10**8; // Convert satoshis to BTC

                    return {
                        id: tx.txid,
                        date: new Date(tx.status.block_time * 1000).toLocaleString(),
                        type: TransactionType.RECEIVE, // Simplification
                        asset: {
                            id: chainInfo.id,
                            name: chainInfo.name,
                            ticker: chainInfo.ticker,
                            icon: chainInfo.icon,
                            price: btcPrice,
                            change24h: 0,
                            balanceCrypto: amount,
                            balanceUSD: amount * btcPrice,
                            marketCap: 0,
                            volume24h: 0,
                            chain: blockchain,
                            sparklineData: [],
                            coingeckoId: COINGECKO_IDS['BTC'],
                        },
                        amountCrypto: amount,
                        amountUSD: amount * btcPrice,
                        status: tx.status.confirmed ? TransactionStatus.COMPLETED : TransactionStatus.PENDING,
                        address: tx.vin[0]?.prevout?.scriptpubkey_address || 'N/A', // Simplified
                        wallet: walletAddress,
                        chain: blockchain,
                        gasFeeUSD: (tx.fee || 0) / 10**8 * btcPrice,
                    };
                }).filter(Boolean);
                break;
            }
            case 'ton': {
                const chainInfo = CHAINS.find(c => c.id === blockchain);
                if (!chainInfo) return [];

                transactions = data.map((tx: any) => {
                    if (!tx || !tx.transaction_id || !tx.in_msg) return null;

                    const tonPrice = prices[COINGECKO_IDS['TON']] || 0;
                    const amount = (tx.in_msg.value || 0) / 10**9;

                    return {
                        id: tx.transaction_id.hash,
                        date: new Date(tx.utime * 1000).toLocaleString(),
                        type: TransactionType.RECEIVE, // Simplification
                        asset: {
                            id: chainInfo.id,
                            name: chainInfo.name,
                            ticker: chainInfo.ticker,
                            icon: chainInfo.icon,
                            price: tonPrice,
                            change24h: 0,
                            balanceCrypto: amount,
                            balanceUSD: amount * tonPrice,
                            marketCap: 0,
                            volume24h: 0,
                            chain: blockchain,
                            sparklineData: [],
                            coingeckoId: COINGECKO_IDS['TON'],
                        },
                        amountCrypto: amount,
                        amountUSD: amount * tonPrice,
                        status: TransactionStatus.COMPLETED,
                        address: tx.in_msg.destination || 'N/A',
                        wallet: walletAddress,
                        chain: blockchain,
                        gasFeeUSD: ((parseInt(tx.fee) + parseInt(tx.storage_fee) + parseInt(tx.other_fee)) || 0) / 10**9 * tonPrice,
                    };
                }).filter(Boolean);
                break;
            }
            default:
                console.warn(`Normalization not implemented for blockchain: ${blockchain}`);
                break;
        }
    } catch (e) {
        console.error('Error normalizing transactions:', e);
        return [];
    }
    return transactions.filter(Boolean);
};

export const shortenHash = (hash: string, length = 6) => {
    if (!hash) return '';
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};
