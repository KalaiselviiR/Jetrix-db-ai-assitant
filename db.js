const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "srivani@19",
  database: "company_db",
};

async function getSchema() {
  const connection = await mysql.createConnection(dbConfig);
  const [tables] = await connection.execute("SHOW TABLES");

  const schema = {};

  for (const row of tables) {
    const tableName = Object.values(row)[0];
    const [columns] = await connection.execute(
      `SHOW COLUMNS FROM \`${tableName}\``
    );
    const [sampleRows] = await connection.execute(
      `SELECT * FROM \`${tableName}\` LIMIT 1`
    );

    schema[tableName] = {
      columns: columns.map((col) => `${col.Field} (${col.Type})`),
      sample: sampleRows[0] || {},
    };
  }

  await connection.end();
  return schema;
}

module.exports = { getSchema };
