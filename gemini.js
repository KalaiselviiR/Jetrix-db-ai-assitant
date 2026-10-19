// gemini.js
require("dotenv").config();
const axios = require("axios");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function askGemini(prompt) {
  const response = await axios.post(
    GEMINI_API_URL,
    { contents: [{ parts: [{ text: prompt }] }] },
    { headers: { "x-goog-api-key": process.env.GEMINI_API_KEY } }
  );
  return response.data.candidates[0].content.parts[0].text;
}