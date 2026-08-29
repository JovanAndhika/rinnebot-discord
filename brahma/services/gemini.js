// services/gemini.js
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Initialize the Google Gen AI client once
const ai = new GoogleGenAI({ apiKey: process.env.BRAHMA_GEMINI_API_KEY });

// 2. Load the System Instruction / Dialogue text file once
const personalityPath = path.join(__dirname, '../personality/brahma_personality.txt');
let systemInstruction = "You are Brahma, a dynamic companion and like to tease other people.";

try {
    if (fs.existsSync(personalityPath)) {
        systemInstruction = fs.readFileSync(personalityPath, 'utf-8');
    }
} catch (error) {
    console.error("Could not load brahma_personality.txt:", error);
}

/**
 * Generate a dynamic mention response in bot's persona
 * @param {string} username - Name of the user mentioning the bot
 * @param {string} userMessage - The message content (stripped of bot mention)
 */
export async function generateMentionResponse(username, userMessage) {
    const prompt = userMessage || "*calls your name or looks over at you*";

    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: `User "${username}" says: "${prompt}"`,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.9,
            maxOutputTokens: 114,
        },
    });

    return response.text;
}

/**
 * Answer a direct question from a user
 * @param {string} username - Name of the user asking
 * @param {string} question - The user's question
 */
export async function generateAnswer(username, question) {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: `User "${username}" asks: "${question}"`,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.9,
            maxOutputTokens: 114,
        },
    });

    return response.text;
}

/**
* Generate a dynamic narrative when a user hugs bot
* @param {string} username - Name of the user hugging bot
*/
export async function generateHugResponse(username) {
    const prompt = `User "${username}" gives you a warm hug. Describe your affectionate and gentle reaction/embrace toward them, speaking/acting in character. Keep it brief, warm, and comforting (2-3 sentences max).`;

    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.9,
            maxOutputTokens: 150,
        },
    });

    return response.text;
}