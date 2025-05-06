// saveToNeo4j.js
const mysql = require("mysql2/promise");
const { session } = require("./neo4j");

async function getMySQLSchema() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "srivani@19",
    database: "company_db",
  });

  const [tables] = await conn.execute(`SHOW TABLES`);
  const tableNames = tables.map((row) => Object.values(row)[0]);

  for (const table of tableNames) {
    const [columns] = await conn.execute(`SHOW COLUMNS FROM \`${table}\``);

    // Create table node
    await session.run(`MERGE (t:Table {name: $table})`, { table });

    for (const col of columns) {
      // Create column node and relationship
      await session.run(
        `MERGE (c:Column {name: $col, type: $type})
         MERGE (t:Table {name: $table})-[:HAS_COLUMN]->(c)`,
        { table, col: col.Field, type: col.Type }
      );
    }
  }

  console.log("✅ Schema pushed to Neo4j!");
  await conn.end();
  await session.close();
}

getMySQLSchema().catch(console.error);
