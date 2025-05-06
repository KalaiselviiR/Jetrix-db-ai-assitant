const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://srivani:srivani@cluster0.b6vvhau.mongodb.net/?retryWrites=true&w=majority";
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
