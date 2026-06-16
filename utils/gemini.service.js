require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function generateResponse(prompt) {
  try {
    //    const models = await ai.models.list();
    // console.log("AVAILABLE MODELS:", models);
    const response = await ai.models.generateContent({
        model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("NEW GEMINI ERROR:", error);
    throw error;
  }
}

module.exports = { generateResponse };