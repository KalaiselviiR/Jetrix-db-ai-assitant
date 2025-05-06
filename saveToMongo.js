const mysql = require("mysql2/promise");
const { MongoClient } = require("mongodb");

// 🔹 Replace these with your actual credentials
const MYSQL_CONFIG = {
  host: "localhost",
  user: "root",
  password: "srivani@19",
  database: "company_db",
};

const MONGO_URI =
  "mongodb+srv://srivani:srivani@cluster0.b6vvhau.mongodb.net/?retryWrites=true&w=majority";
const MONGO_DB = "ai_assistant";
const MONGO_COLLECTION = "schema_metadata";

async function extractAndSaveSchema() {
  try {
    // MySQL connection
    const mysqlConn = await mysql.createConnection(MYSQL_CONFIG);

    const [tables] = await mysqlConn.execute(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `,
      [MYSQL_CONFIG.database]
    );

    const schemaData = [];

    for (const row of tables) {
      const tableName = row.TABLE_NAME;

      const [columns] = await mysqlConn.execute(
        `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = ? AND table_name = ?
      `,
        [MYSQL_CONFIG.database, tableName]
      );

      const [sample] = await mysqlConn.execute(
        `SELECT * FROM \`${tableName}\` LIMIT 1`
      );

      schemaData.push({
        table: tableName,
        columns: columns.map((col) => ({
          name: col.column_name,
          type: col.data_type,
        })),
        sampleRow: sample[0] || {},
      });
    }

    await mysqlConn.end();

    // MongoDB connection
    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();

    const db = mongoClient.db(MONGO_DB);
    const collection = db.collection(MONGO_COLLECTION);

    await collection.deleteMany({}); // Clean old
    await collection.insertMany(schemaData); // Insert fresh

    console.log("✅ Schema saved to MongoDB");
    await mongoClient.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

extractAndSaveSchema();
