import { client } from '../config/mongodb';
import { Db, Collection } from 'mongodb';

const PROFILE_COLLECTION = 'profiles';

export interface Profile {
  userId: string;
  fullName: string;
  username: string;
  email: string;
}

let db: Db;
let profilesCollection: Collection<Profile>;

async function initializeMongoDB() {
  if (!db) {
    db = await client.db();
    profilesCollection = db.collection<Profile>(PROFILE_COLLECTION);
    await profilesCollection.createIndex({ userId: 1 }, { unique: true });
  }
}

export const getProfileFromMongoDB = async (userId: string): Promise<Profile | null> => {
  await initializeMongoDB();
  const profile = await profilesCollection.findOne({ userId });
  if (profile) {
    return profile;
  } else {
    const newProfile: Omit<Profile, '_id'> = {
        userId: userId,
        fullName: 'Satoshi Nakamoto',
        username: 'satoshi',
        email: 'satoshi@nakamoto.com',
    };
    const result = await profilesCollection.insertOne(newProfile as Profile);
    const insertedDoc = await profilesCollection.findOne({ _id: result.insertedId });
    return insertedDoc;
  }
};

export const updateProfileInMongoDB = async (userId: string, profileData: Partial<Profile>): Promise<Profile | null> => {
  await initializeMongoDB();
  const result = await profilesCollection.findOneAndUpdate(
    { userId },
    { $set: profileData },
    { upsert: true, returnDocument: 'after' }
  );
  return result;
};
