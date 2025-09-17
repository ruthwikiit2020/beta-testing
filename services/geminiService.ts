import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { ChapterDeck, Flashcard } from '../types';

export async function generateFlashcardsFromText(
  studyMaterial: string,
  onProgress: (progress: number, status: string) => void
): Promise<ChapterDeck[]> {
  try {
    onProgress(0, 'Initializing AI...');
    
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || 'AIzaSyCZHn2yAzKqyM-zaIVEB8YHkI98VdEz-ss';
    console.log('API Key check:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyPrefix: apiKey?.substring(0, 10) || 'none',
      isPlaceholder: apiKey === 'PLACEHOLDER_API_KEY',
      allEnvVars: Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('API')),
      usingFallback: !process.env.API_KEY && !process.env.GEMINI_API_KEY
    });
    
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      throw new Error("API key is not configured. Please set your Gemini API key in the environment variables.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    if (!studyMaterial || studyMaterial.trim().length === 0) {
      throw new Error("Study material is empty.");
    }
    
    if (studyMaterial.length < 50) {
      throw new Error("Study material is too short. Please upload a PDF with more content.");
    }
    
    console.log('Study material length:', studyMaterial.length);
    console.log('Study material preview:', studyMaterial.substring(0, 200) + '...');
    
    onProgress(0.1, 'Crafting expert prompt...');
    const prompt = `You are an expert AI study assistant. Analyze the following study material and convert it into a structured set of flashcards, organized by chapter or main topic. For each flashcard, provide a concise 'question' or 'term' for the front and a clear 'answer' or 'definition' for the back. The material is as follows: \n\n---START OF MATERIAL---\n${studyMaterial}\n---END OF MATERIAL---`;
    
    onProgress(0.25, 'Sending request to Gemini...');
    console.log('Sending request to Gemini API...');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "A list of chapters from the study material.",
          items: {
            type: Type.OBJECT,
            properties: {
              chapterTitle: {
                type: Type.STRING,
                description: "The title of the chapter or main topic.",
              },
              flashcards: {
                type: Type.ARRAY,
                description: "A list of flashcards for this chapter.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: {
                      type: Type.STRING,
                      description: "The question or term for the front of the flashcard.",
                    },
                    answer: {
                      type: Type.STRING,
                      description: "The answer or definition for the back of the flashcard.",
                    },
                  },
                  required: ["question", "answer"],
                },
              },
            },
            required: ["chapterTitle", "flashcards"],
          },
        },
      },
    });
    
    console.log('Received response from Gemini:', response);

    onProgress(0.8, 'Parsing AI response...');
    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText) as any[];

    // Add unique IDs to each flashcard
    const dataWithIds: ChapterDeck[] = parsedData.map((chapter) => ({
      ...chapter,
      flashcards: chapter.flashcards.map((card: any, index: number) => ({
        ...card,
        id: `${chapter.chapterTitle.replace(/\s/g, '-')}-${index}-${Date.now()}`
      }))
    }));
    
    onProgress(1, 'Flashcards ready!');
    return dataWithIds;

  } catch (error) {
    console.error("Error generating flashcards:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error("Invalid API key. Please check your Gemini API key configuration.");
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error("API quota exceeded. Please try again later or check your API usage limits.");
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error("Network error. Please check your internet connection and try again.");
      } else {
        throw new Error(`Failed to generate flashcards: ${error.message}`);
      }
    }
    
    throw new Error("Failed to generate flashcards from the provided material. Please check the content and try again.");
  }
}

export async function getDetailedExplanation(card: Flashcard): Promise<string> {
  try {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || 'AIzaSyCZHn2yAzKqyM-zaIVEB8YHkI98VdEz-ss';
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Provide a detailed explanation for the following flashcard concept. Explain it clearly as if you were a tutor helping a student understand it better.
    
    Term/Question: "${card.question}"
    Answer/Definition: "${card.answer}"

    Your explanation should go beyond the simple answer and provide more context, examples, or analogies to make the concept easier to grasp.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error getting detailed explanation:", error);
    return "Sorry, I couldn't fetch a detailed explanation at this time. Please try again later.";
  }
}

export function startCardChat(card: Flashcard): Chat {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || 'AIzaSyCZHn2yAzKqyM-zaIVEB8YHkI98VdEz-ss';
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = `You are an expert AI tutor. Your student is reviewing a flashcard and needs help.
  
  The flashcard is:
  - Question: "${card.question}"
  - Answer: "${card.answer}"
  
  Your role is to help the student understand this concept deeply. Answer their questions, provide simple explanations, and give real-world examples when asked. Be encouraging and helpful.`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
}