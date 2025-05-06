// neo4j.js
const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "neo4j+s://2ab7210c.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "pD4qvZyDPdozsCZnTek5J-R16FoOPr5GFYq5CRaOb44")
);

const session = driver.session();

module.exports = { driver, session };
