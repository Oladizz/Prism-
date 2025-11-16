import { Collection, Document } from 'mongodb';
import { client } from '../config/mongodb';

interface CacheEntry extends Document {
  key: string;
  data: any;
  createdAt: Date;
  expiresAt: Date;
}

let cacheCollection: Collection<CacheEntry>;

async function getCacheCollection(): Promise<Collection<CacheEntry>> {
  if (!cacheCollection) {
    const db = client.db(); // Get the default database
    cacheCollection = db.collection<CacheEntry>('api_cache');
    // Ensure TTL index is created for automatic expiration
    await cacheCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  }
  return cacheCollection;
}

export async function getCache(key: string): Promise<any | null> {
  const collection = await getCacheCollection();
  const entry = await collection.findOne({ key, expiresAt: { $gt: new Date() } });
  return entry ? entry.data : null;
}

export async function setCache(key: string, data: any, ttlSeconds: number): Promise<void> {
  const collection = await getCacheCollection();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ttlSeconds * 1000);
  await collection.updateOne(
    { key },
    { $set: { data, createdAt, expiresAt } },
    { upsert: true }
  );
}
