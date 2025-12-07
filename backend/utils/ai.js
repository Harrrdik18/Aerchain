const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generateRFPFromText = async (text) => {
    try {
        const prompt = `
            You are an expert procurement assistant. Convert the following natural language request into a structured RFP JSON object. 
            The JSON should match this schema: { title: String, description: String, budget: String, deliveryTimeline: String, items: [{ name: String, quantity: Number, specs: String }], paymentTerms: String, warranty: String }. 
            Return ONLY the JSON.
            Request: ${text}
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const responseText = result.response.text();
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error generating RFP from text with Gemini:", error);
        throw error;
    }
};

const parseProposal = async (emailBody) => {
    try {
        const prompt = `
            You are an expert data extractor. Extract the following details from the vendor email response into a structured JSON object: 
            { totalPrice: String, itemBreakdown: [{ name: String, price: String, quantity: Number }], warranty: String, delivery: String, paymentTerms: String }. 
            Return ONLY the JSON.
            Email Body: ${emailBody}
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const responseText = result.response.text();
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error parsing proposal with Gemini:", error);
        throw error;
    }
};

const compareProposals = async (proposals) => {
    try {
        const prompt = `
            Compare the following proposals and provide a recommendation.
            Proposals: ${JSON.stringify(proposals)}
            
            Return a JSON object with:
            {
                summary: "Summary of differences",
                recommendation: "Name of recommended vendor",
                justification: "Reason for recommendation",
                vendorScores: [{ vendorId: String, score: Number (0-100) }]
            }
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const responseText = result.response.text();
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error comparing proposals with Gemini:", error);
        throw error;
    }
};

module.exports = { generateRFPFromText, parseProposal, compareProposals };
