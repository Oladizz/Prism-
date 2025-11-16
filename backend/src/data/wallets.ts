import { Db, Collection, ObjectId } from 'mongodb';
import { client } from '../config/mongodb';

export interface Wallet {
  _id?: ObjectId;
  userId: string; // To associate wallets with a user (e.g., 'main_user')
  name: string;
  address: string;
  chain: string; // e.g., 'ethereum', 'solana', 'bitcoin'
}

let db: Db;
let walletsCollection: Collection<Wallet>;

async function initializeMongoDB() {
  if (!db) {
    db = await client.db();
    walletsCollection = db.collection<Wallet>('wallets');
    await walletsCollection.createIndex({ userId: 1, address: 1, chain: 1 }, { unique: true });
  }
}

export const addWalletToDB = async (userId: string, name: string, address: string, chain: string): Promise<Wallet> => {
  await initializeMongoDB();
  const newWallet: Omit<Wallet, '_id'> = { userId, name, address, chain };
  const result = await walletsCollection.insertOne(newWallet as Wallet);
  const insertedDoc = await walletsCollection.findOne({ _id: result.insertedId });
  if (!insertedDoc) {
    throw new Error('Failed to retrieve inserted wallet.');
  }
  return insertedDoc;
};

export const getWalletsFromDB = async (userId: string): Promise<Wallet[]> => {
  await initializeMongoDB();
  return walletsCollection.find({ userId }).toArray();
};

export const deleteWalletFromDB = async (walletId: string): Promise<boolean> => {
  await initializeMongoDB();
  const result = await walletsCollection.deleteOne({ _id: new ObjectId(walletId) });
  return result.deletedCount === 1;
};
