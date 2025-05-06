// gemini.js
const axios = require("axios");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDpLMghbiXz19dnG-MmjAUXm3tokQaZmFA";

async function askGemini(prompt) {
  const response = await axios.post(GEMINI_API_URL, {
    contents: [{ parts: [{ text: prompt }] }],
  });
  return response.data.candidates[0].content.parts[0].text;
}

module.exports = { askGemini };
