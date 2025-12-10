import { MongoClient, ServerApiVersion } from 'mongodb';

let client: MongoClient;

async function connectToMongoDB() {
  const uri: string = process.env.MONGODB_URI || '';

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set.');
  }

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client.db(); // Return the default database instance
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export { connectToMongoDB, client };
