import { TONClient } from 'ton-client-js';

const TON_RPC_URL = 'https://toncenter.com/api/v2/jsonRPC';

const client = new TONClient({
    endpoint: TON_RPC_URL,
});

export const getTonBalance = async (address: string): Promise<string> => {
    const balance = await client.getBalance(address);
    return balance;
};

export const getTonTransactions = async (address: string): Promise<any> => {
    const transactions = await client.getTransactions(address);
    return transactions;
};
