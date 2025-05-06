// getSchemaContext.js
const { session } = require("./neo4j");

async function getSchemaContext() {
  const result = await session.run(`
    MATCH (t:Table)-[:HAS_COLUMN]->(c:Column)
    RETURN t.name AS table, collect(c.name + " (" + c.type + ")") AS columns
  `);

  let schemaText = "";
  result.records.forEach((record) => {
    const table = record.get("table");
    const columns = record.get("columns").join(", ");
    schemaText += `Table: ${table}\nColumns: ${columns}\n\n`;
  });

  return schemaText;
}

module.exports = { getSchemaContext };
