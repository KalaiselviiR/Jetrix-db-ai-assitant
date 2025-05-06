const axios = require("axios");

// Function to index schema chunks into Chroma
async function indexChunksToChroma(schema) {
  const chunks = [];
  for (const [table, meta] of Object.entries(schema)) {
    const chunkText = `Table: ${table}\nColumns: ${meta.columns.join(
      ", "
    )}\nSample Row: ${JSON.stringify(meta.sample)}`;
    chunks.push(chunkText);
  }

  await axios.post("http://localhost:5001/index", { chunks });
}

// Function to search for relevant chunks in Chroma
async function searchChunks(query) {
  const res = await axios.post("http://localhost:5001/search", {
    query,
    top_k: 3,
  });
  return res.data.documents;
}

module.exports = { indexChunksToChroma, searchChunks };
