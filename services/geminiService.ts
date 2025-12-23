
import { GoogleGenAI, Type } from "@google/genai";
import { PsychometricScores, AIAnalysis, ReflectionData } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const analyzeCareerPath = async (scores: PsychometricScores, reflection: ReflectionData): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Conduct a holistic career analysis combining quantitative scores and qualitative narrative:
    
    QUANTITATIVE PROFILE:
    - Analytical: ${scores.analytical}
    - Creative: ${scores.creative}
    - Social: ${scores.social}
    - Leadership: ${scores.leadership}
    - Practical: ${scores.practical}
    
    QUALITATIVE CONTEXT (USER'S STORY):
    - Struggles: ${reflection.struggles}
    - Testimonies: ${reflection.testimonies}
    - Fears: ${reflection.fears}
    - Goals: ${reflection.goals}
    
    TASK:
    1. Identify 3 real-world careers matching BOTH the scores and the user's specific story context.
    2. Find REAL-TIME job market trends via Google Search for 2025.
    3. Include 3 highly relevant motivational YouTube video recommendations (provide titles and URLs from search).
    4. Provide an empathetic note addressing their specific fears and struggles.
    5. For each career, suggest an image search term for visualization.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT + "\nAdditionally, find real YouTube video links that are highly motivational and career-oriented.",
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            persona: { type: Type.STRING },
            summary: { type: Type.STRING },
            empatheticNote: { type: Type.STRING },
            topCareers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  salaryRange: { type: Type.STRING },
                  growthPotential: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  imageSearchTerm: { type: Type.STRING }
                },
                required: ["title", "description", "salaryRange", "growthPotential", "reasoning", "imageSearchTerm"]
              }
            },
            motivationalVideos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "url", "description"]
              }
            }
          },
          required: ["persona", "summary", "topCareers", "motivationalVideos", "empatheticNote"]
        }
      }
    });

    const jsonStr = response.text || "{}";
    const data = JSON.parse(jsonStr);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Reference Source",
        uri: chunk.web.uri
      }));

    return {
      ...data,
      searchSources
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
