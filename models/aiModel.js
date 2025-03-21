const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBJ5_LIgoUhl-hAFhnb72wS8FBcv_Q-1kI");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateWebPageCode(prompt) {
    try {
        const result = await model.generateContent(prompt);
        
        return result.response.text();
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = { generateWebPageCode };