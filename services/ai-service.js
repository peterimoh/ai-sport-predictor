import { GoogleGenAI } from '@google/genai';
import { config } from 'dotenv';
import { populatePromptTemplate } from '../utils/prompts.js';

config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function getPredictionFromGemini(combinedData) {
  const prompt = await populatePromptTemplate(combinedData);

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    const content = result.text;

    try {
      return JSON.parse(content);
    } catch (err) {
      return { raw: content, error: 'Could not parse JSON' };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return { raw: 'Error generating prediction', error: error.message };
  }
}
