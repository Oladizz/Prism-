import axios from 'axios';

const BITCOIN_API_URL = 'https://blockstream.info/api';

export const getBitcoinBalance = async (address: string): Promise<number> => {
  const response = await axios.get(`${BITCOIN_API_URL}/address/${address}`);
  return response.data.chain_stats.funded_txo_sum - response.data.chain_stats.spent_txo_sum;
};

export const getBitcoinTransactions = async (address: string): Promise<any> => {
  const response = await axios.get(`${BITCOIN_API_URL}/address/${address}/txs`);
  return response.data;
};
