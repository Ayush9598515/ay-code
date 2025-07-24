const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const aiCodeReview = async (code) => {
  if (!code || typeof code !== "string") {
    throw new Error("Invalid code input for AI review.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `🧠 Analyze the following code and provide a short, concise review with suggested improvements:\n\n${code}`,
            },
          ],
        },
      ],
    });

    const review =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No review generated.";
    return review;
  } catch (err) {
    console.error("❌ AI Code Review Error:", err.message);
    return "⚠️ AI review generation failed. Please try again later.";
  }
};

module.exports = {
  aiCodeReview,
};
