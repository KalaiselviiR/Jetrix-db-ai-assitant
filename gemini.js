// gemini.js
const axios = require("axios");

const GEMINI_API_URL =process.env.GEMINI_API_KEY

async function askGemini(prompt) {
  const response = await axios.post(GEMINI_API_URL, {
    contents: [{ parts: [{ text: prompt }] }],
  });
  return response.data.candidates[0].content.parts[0].text;
}

module.exports = { askGemini };
