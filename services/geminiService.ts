
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateTifo = async (base64Image: string, teamName: string): Promise<string> => {
  // Initialisation directe comme spécifié dans les guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imageData = base64Image.split(',')[1];
  
  const prompt = `A high-quality wide-angle cinematic shot of a professional football stadium packed with thousands of fans. In the main grandstand, the supporters are holding up colored panels to form a massive mosaic (tifo). The tifo MUST feature a faithful recreation of the face from the provided image, integrated with the colors and identity of ${teamName}. Ultra-realistic, 8k resolution.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { data: imageData, mimeType: 'image/jpeg' } },
          { text: prompt },
        ],
      },
      config: { imageConfig: { aspectRatio: "16:9" } },
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) throw new Error("L'image n'a pas pu être générée par le modèle.");
    return imageUrl;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Gestion spécifique pour aider au débogage du déploiement
    if (error.message?.includes('API_KEY')) {
      throw new Error("Configuration requise : Assurez-vous d'avoir ajouté API_KEY dans les variables d'environnement de Vercel.");
    }
    throw error;
  }
};
