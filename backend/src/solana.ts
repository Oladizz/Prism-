import axios from 'axios';

const SOLSCAN_API_URL = 'https://pro-api.solscan.io/v1.0';
const SOLSCAN_API_KEY = process.env.SOLSCAN_API_KEY;

const api = axios.create({
    baseURL: SOLSCAN_API_URL,
    headers: {
        'Authorization': `Bearer ${SOLSCAN_API_KEY}`
    }
});

export const getSolanaBalance = async (address: string): Promise<number> => {
  const response = await api.get(`/account/${address}`);
  return response.data.lamports;
};

export const getSolanaTokenBalances = async (address: string): Promise<any> => {
    const response = await api.get(`/account/tokens?address=${address}`);
    return response.data;
};

export const getSolanaTransactions = async (address: string): Promise<any> => {
    const response = await api.get(`/account/transactions?address=${address}`);
    return response.data;
};
