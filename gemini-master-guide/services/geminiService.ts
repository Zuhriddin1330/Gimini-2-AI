
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const analyzeContent = async (prompt: string, base64Image?: string): Promise<string> => {
  const ai = getAIClient();
  
  try {
    const parts: any[] = [{ text: prompt }];
    
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: base64Image.split(',')[1] // Remove the data:image/png;base64, prefix
        }
      });
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: "You are a helpful AI assistant explaining technical concepts to an Uzbek user. Answer in Uzbek clearly and professionally."
      }
    });

    return response.text || "Kechirasiz, javob olishda xatolik yuz berdi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Xatolik yuz berdi: ${error instanceof Error ? error.message : 'Noma\'lum xato'}`;
  }
};
