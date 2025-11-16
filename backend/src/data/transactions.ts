import { client } from '../config/mongodb';
import { Db, Collection } from 'mongodb';

const TRANSACTIONS_COLLECTION = 'transactions';

interface Transaction {
  hash: string;
  timeStamp: string;
  // Add other relevant transaction fields
}

let db: Db;
let transactionsCollection: Collection<Transaction>;

async function initializeMongoDB() {
  if (!db) {
    db = await client.db(); // Get the default database
    transactionsCollection = db.collection<Transaction>(TRANSACTIONS_COLLECTION);
    // Ensure an index on hash for efficient upserts
    await transactionsCollection.createIndex({ hash: 1 }, { unique: true });
    // Ensure an index on address, chain, and timeStamp for efficient queries
    await transactionsCollection.createIndex({ address: 1, chain: 1, timeStamp: -1 });
  }
}

export const saveTransactions = async (address: string, chain: string, transactions: Transaction[]) => {
  await initializeMongoDB();
  const operations = transactions.map(tx => ({
    updateOne: {
      filter: { hash: tx.hash, address: address.toLowerCase(), chain: chain.toLowerCase() },
      update: { $set: { ...tx, address: address.toLowerCase(), chain: chain.toLowerCase() } },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await transactionsCollection.bulkWrite(operations);
    console.log(`Saved ${transactions.length} transactions for ${address} on ${chain} to MongoDB.`);
  }
};

export const getLatestTransactionTimestamp = async (address: string, chain: string): Promise<string | null> => {
  await initializeMongoDB();
  const latestTx = await transactionsCollection.find(
    { address: address.toLowerCase(), chain: chain.toLowerCase() }
  )
  .sort({ timeStamp: -1 })
  .limit(1)
  .next();

  return latestTx ? latestTx.timeStamp : null;
};

export const getTransactionsFromMongoDB = async (address: string, chain: string, limit: number, offset: number): Promise<Transaction[]> => {
  await initializeMongoDB();
  const transactions = await transactionsCollection.find(
    { address: address.toLowerCase(), chain: chain.toLowerCase() }
  )
  .sort({ timeStamp: -1 })
  .skip(offset)
  .limit(limit)
  .toArray();

  return transactions;
};

export const deleteTransactionsByWallet = async (address: string, chain: string): Promise<void> => {
  await initializeMongoDB();
  await transactionsCollection.deleteMany({ address: address.toLowerCase(), chain: chain.toLowerCase() });
  console.log(`Deleted transactions for address ${address} on ${chain} from MongoDB.`);
};