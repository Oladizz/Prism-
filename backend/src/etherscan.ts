import axios from 'axios';
import { saveTransactions, getTransactionsFromMongoDB } from './data/transactions'; // Changed import

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const BASE_V2_API_URL = 'https://api.etherscan.io/v2/api';

const getApiUrl = (chain: string): { apiUrl: string, chainId: number } => {
  switch (chain) {
    case 'ethereum':
      return { apiUrl: BASE_V2_API_URL, chainId: 1 };
    case 'polygon':
      return { apiUrl: BASE_V2_API_URL, chainId: 137 };
    case 'avalanche':
      return { apiUrl: BASE_V2_API_URL, chainId: 43114 };
    case 'binance-smart-chain':
      return { apiUrl: BASE_V2_API_URL, chainId: 56 };
    case 'optimism':
      return { apiUrl: BASE_V2_API_URL, chainId: 10 };
    case 'arbitrum':
      return { apiUrl: BASE_V2_API_URL, chainId: 42161 };
    case 'base':
        return { apiUrl: BASE_V2_API_URL, chainId: 8453 };
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
};

export const getEthBalance = async (address: string, chain: string): Promise<string> => {
    const { apiUrl, chainId } = getApiUrl(chain);
    const url = `${apiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}&chainid=${chainId}`;
    const response = await axios.get(url);
    return response.data.result;
};

export const getTokenBalances = async (address: string, chain: string): Promise<any> => {
    const { apiUrl, chainId } = getApiUrl(chain);
    const url = `${apiUrl}?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}&chainid=${chainId}`;
    try {
        const response = await axios.get(url);

        if (!Array.isArray(response.data.result)) {
            return [];
        }

        const tokenTransfers = response.data.result;
        const tokenBalances: { [key: string]: { contractAddress: string, tokenName: string, tokenSymbol: string, tokenDecimal: string, balance: bigint } } = {};

        for (const tx of tokenTransfers) {
            const { contractAddress, tokenName, tokenSymbol, tokenDecimal, value, from, to } = tx;

            console.log('Processing transaction:', tx);
            console.log('tx.from:', from, 'tx.to:', to);

            // Convert value to a BigInt for accurate calculations
            const tokenValue = BigInt(value);

            if (!tokenBalances[contractAddress]) {
                tokenBalances[contractAddress] = {
                    contractAddress,
                    tokenName,
                    tokenSymbol,
                    tokenDecimal,
                    balance: 0n, // Initialize balance as BigInt
                };
            }

            // Aggregate balance based on incoming and outgoing transfers
            if (to && typeof to === 'string' && to.toLowerCase() === address.toLowerCase()) {
                tokenBalances[contractAddress].balance += tokenValue;
            } else if (from && typeof from === 'string' && from.toLowerCase() === address.toLowerCase()) {
                tokenBalances[contractAddress].balance -= tokenValue;
            }
        }

        // Convert BigInt balances back to string, applying tokenDecimal
        const formattedTokenBalances = Object.values(tokenBalances).map(token => {
            const balance = token.balance;
            const decimal = parseInt(token.tokenDecimal, 10);

            // Handle negative balances if they occur (e.g., due to initial state or specific transaction types)
            const sign = balance < 0n ? "-" : "";
            const absoluteBalance = balance < 0n ? -balance : balance;

            // Pad with leading zeros if necessary for division
            let balanceStr = absoluteBalance.toString();
            while (balanceStr.length <= decimal) {
                balanceStr = "0" + balanceStr;
            }

            const integerPart = balanceStr.slice(0, balanceStr.length - decimal);
            const fractionalPart = balanceStr.slice(balanceStr.length - decimal).replace(/0+$/, ''); // Remove trailing zeros

            let formattedBalance = integerPart;
            if (fractionalPart.length > 0) {
                formattedBalance += "." + fractionalPart;
            }
            if (formattedBalance === "") { // Handle cases where integer part is "0" and no fractional part
                formattedBalance = "0";
            }

            return {
                contractAddress: token.contractAddress,
                tokenName: token.tokenName,
                tokenSymbol: token.tokenSymbol,
                tokenDecimal: token.tokenDecimal,
                balance: sign + formattedBalance,
            };
        });

        return formattedTokenBalances;
    } catch (error: any) {
        console.error('Error in getTokenBalances:', error);
        return [];
    }
};

export const getTransactions = async (address: string, chain: string, limit: number, offset: number): Promise<any> => {
    let transactions = await getTransactionsFromMongoDB(address, chain, limit, offset); // Changed function call

    if (transactions.length < limit + offset) { // If not enough transactions in MongoDB, fetch from Etherscan
        const { apiUrl, chainId } = getApiUrl(chain);
        const normalTxUrl = `${apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}&chainid=${chainId}`;
        const tokenTxUrl = `${apiUrl}?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}&chainid=${chainId}`;
        const nftTxUrl = `${apiUrl}?module=account&action=tokennfttx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}&chainid=${chainId}`;

        const [normalResponse, tokenResponse, nftResponse] = await Promise.all([
            axios.get(normalTxUrl),
            axios.get(tokenTxUrl),
            axios.get(nftTxUrl)
        ]);

        const normalTransactions = Array.isArray(normalResponse.data.result) ? normalResponse.data.result : [];
        const tokenTransactions = Array.isArray(tokenResponse.data.result) ? tokenResponse.data.result : [];
        const nftTransactions = Array.isArray(nftResponse.data.result) ? nftResponse.data.result : [];

        const allEtherscanTransactions = [...normalTransactions, ...tokenTransactions, ...nftTransactions];

        // Save all fetched transactions to MongoDB
        await saveTransactions(address, chain, allEtherscanTransactions);

        // Re-fetch from MongoDB to get the paginated and sorted list
        transactions = await getTransactionsFromMongoDB(address, chain, limit, offset); // Changed function call
    }

    return transactions;
};

export const getNfts = async (address: string, chain: string): Promise<any> => {
    const { apiUrl, chainId } = getApiUrl(chain);
    const url = `${apiUrl}?module=account&action=tokennfttx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}&chainid=${chainId}`;
    try {
        const response = await axios.get(url);
        if (!Array.isArray(response.data.result)) {
            return [];
        }
        return response.data.result;
    } catch (error: any) {
        console.error('Error fetching NFTs:', error);
        return [];
    }
};

export const verifyContract = async (address: string, chain: string): Promise<any> => {
    const { apiUrl, chainId } = getApiUrl(chain);
    const url = `${getApiUrl(chain).apiUrl.replace('/v2', '')}?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}&chainid=${chainId}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === '1' && response.data.result[0].SourceCode) {
            return { isVerified: true };
        } else {
            return { isVerified: false, message: response.data.result };
        }
    } catch (error: any) {
        console.error('Error verifying contract:', error);
        return { isVerified: false, error: error.message };
    }
};