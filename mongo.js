const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let cachedDb = null;

async function connectToMongo() {
  if (!cachedDb) {
    await client.connect();
    cachedDb = client.db("ai_assistant");
  }
  return cachedDb;
}

module.exports = { connectToMongo };
