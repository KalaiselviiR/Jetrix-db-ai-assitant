const express = require("express");
const bodyParser = require("body-parser");
const neo4j = require("neo4j-driver");
const { askGemini } = require("./gemini");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// Neo4j driver setup
const driver = neo4j.driver(
  "neo4j+s://2ab7210c.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "pD4qvZyDPdozsCZnTek5J-R16FoOPr5GFYq5CRaOb44")
);

const session = driver.session();

app.post("/api/ask", async (req, res) => {
  const session = driver.session();
  const { question } = req.body;

  try {
    const result = await session.run("MATCH (n) RETURN n LIMIT 50");

    const neo4jData = result.records.map(
      (record) => record.get("n").properties
    );

    const prompt = `You are an AI database assistant. Answer the user's question based on the following database context:\n\n${JSON.stringify(
      neo4jData
    )}\n\nQuestion: "${question}"`;

    const geminiAnswer = await askGemini(prompt);

    res.json({ answer: geminiAnswer, neo4jData });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process question.", details: err.message });
  } finally {
    await session.close();
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
