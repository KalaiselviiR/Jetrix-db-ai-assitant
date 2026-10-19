require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { askGemini } = require("./gemini");
// Reuse the shared Neo4j driver (credentials come from .env via neo4j.js)
const { driver } = require("./neo4j");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

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