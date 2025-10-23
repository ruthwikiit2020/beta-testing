import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { ChapterDeck, Flashcard } from '../types';
import type { FlashcardFilters } from '../types/filters';
import { ragPipeline } from './ragPipeline';
import { retryWithBackoff } from './utils';


// Function to build enhanced prompt based on filters
function buildFilteredPrompt(studyMaterial: string, filters: FlashcardFilters, totalPages: number = 0): string {
  const { studyGoal, contentType, depth, organization, limitPerChapter, pageRange } = filters;
  
  // Check if filters are in default state (no custom filters applied)
  const isDefaultFilters = studyGoal === 'concept-mastery' && 
                          contentType.includes('full-detail') && 
                          contentType.length === 1 &&
                          depth === 'moderate' && 
                          organization === 'chapter-wise' && 
                          limitPerChapter === 15 && 
                          !pageRange;
  
  if (isDefaultFilters) {
    // Use original LLM behavior - no custom prompts, let the LLM decide naturally
    return `You are an expert AI study assistant. Analyze the following study material and convert it into a structured set of flashcards, organized by chapter or main topic. For each flashcard, provide a concise 'question' or 'term' for the front and a clear 'answer' or 'definition' for the back. The material is as follows: \n\n---START OF MATERIAL---\n${studyMaterial}\n---END OF MATERIAL---`;
  }
  
  // Use custom filters if they've been modified
  let prompt = `You are an expert AI study assistant. Analyze the following study material and convert it into a structured set of flashcards, organized by chapter or main topic.`;
  
  // Study Goal Instructions
  switch (studyGoal) {
    case 'exam-revision':
      prompt += ` Focus on key facts, formulas, and quick recall information that would be essential for exam preparation. Prioritize memorization-friendly content.`;
      break;
    case 'concept-mastery':
      prompt += ` Focus on deep understanding, conceptual connections, and comprehensive explanations that help build mastery of the subject.`;
      break;
    case 'quick-review':
      prompt += ` Focus on concise summaries, main points, and essential information for quick review sessions. Keep content brief and to the point.`;
      break;
  }
  
  // Content Type Instructions
  if (contentType.length > 0 && !contentType.includes('full-detail')) {
    const contentTypes = contentType.map(type => {
      switch (type) {
        case 'formulas': return 'mathematical formulas, equations, and calculations';
        case 'definitions': return 'key terms, definitions, and important concepts';
        case 'full-detail': return 'comprehensive content with full details';
        default: return type;
      }
    }).join(', ');
    prompt += ` Specifically focus on: ${contentTypes}.`;
  }
  
  // Depth Instructions
  switch (depth) {
    case 'short':
      prompt += ` Keep flashcards concise and crisp - essential information only.`;
      break;
    case 'moderate':
      prompt += ` Provide balanced detail - not too brief, not too verbose.`;
      break;
    case 'in-depth':
      prompt += ` Provide comprehensive and detailed explanations for thorough understanding.`;
      break;
  }
  
  // Organization Instructions
  switch (organization) {
    case 'chapter-wise':
      prompt += ` Organize flashcards by chapters or main sections as they appear in the material.`;
      break;
    case 'topic-clusters':
      prompt += ` Group related flashcards by topic clusters rather than strict chapter order.`;
      break;
    case 'custom-tags':
      prompt += ` Organize flashcards with meaningful tags and categories based on content type and difficulty.`;
      break;
  }
  
  // Quantity Instructions
  prompt += ` Generate approximately ${limitPerChapter} flashcards per chapter/topic.`;
  
  // Page Range Instructions
  if (pageRange) {
    prompt += ` Focus on content from pages ${pageRange.from} to ${pageRange.to} of the material.`;
  }
  
  prompt += `\n\nFor each flashcard, provide a concise 'question' or 'term' for the front and a clear 'answer' or 'definition' for the back. The material is as follows: \n\n---START OF MATERIAL---\n${studyMaterial}\n---END OF MATERIAL---`;
  
  return prompt;
}

// Optimized RAG-based flashcard generation
export async function generateFlashcardsWithRAG(
  studyMaterial: string,
  fileName: string,
  onProgress: (progress: number, status: string) => void,
  filters: FlashcardFilters,
  totalPages: number = 1
): Promise<ChapterDeck[]> {
  try {
    console.log('🚀 Starting RAG-based flashcard generation...');
    console.log('📄 File:', fileName);
    console.log('📝 Text length:', studyMaterial.length);
    console.log('📝 Text preview:', studyMaterial.substring(0, 300));
    console.log('🔧 Filters:', filters);
    console.log('📊 Total pages:', totalPages);
    
    // Use RAG pipeline for optimized generation
    const ragResult = await ragPipeline.generateFlashcards(
      studyMaterial,
      fileName,
      filters,
      totalPages,
      onProgress
    );
    
    console.log('✅ RAG Pipeline completed:', ragResult.metadata);
    console.log('📊 Generated flashcards:', ragResult.flashcards.length);
    
    // Log cache status and RAG processing info
    if (ragResult.metadata.isFromCache) {
      console.log('⚡ Results loaded from cache - instant response!');
    } else {
      console.log('🔄 Results generated with RAG pipeline and cached for future use');
      if ((ragResult.metadata as any).ragMetadata) {
        console.log('🧠 RAG Processing Details:', (ragResult.metadata as any).ragMetadata);
      }
    }
    
    // Convert the result to ChapterDeck format
    // The RAG pipeline returns flashcards, we need to organize them by chapter
    const chapterDecks: ChapterDeck[] = [];
    
    if (ragResult.flashcards && ragResult.flashcards.length > 0) {
      // Group flashcards by chapter if available
      const chapterMap = new Map<string, any[]>();
      
      ragResult.flashcards.forEach((card: any) => {
        const chapter = card.chapter || 'General';
        if (!chapterMap.has(chapter)) {
          chapterMap.set(chapter, []);
        }
        chapterMap.get(chapter)!.push(card);
      });
      
      // Convert to ChapterDeck format
      chapterMap.forEach((cards, chapterName) => {
        chapterDecks.push({
          chapterTitle: chapterName,
          flashcards: cards.map((card, index) => ({
            id: card.id || `card_${Date.now()}_${index}`,
            question: card.question || card.front || card.term || 'Question',
            answer: card.answer || card.back || card.definition || 'Answer'
          }))
        });
      });
    }

    // Add cache status to the result
    (chapterDecks as any).isFromCache = ragResult.metadata.isFromCache;
    (chapterDecks as any).processingTime = ragResult.metadata.processingTime;
    
    // If no chapters found, create a single chapter
    if (chapterDecks.length === 0) {
      chapterDecks.push({
        chapterTitle: 'General',
        flashcards: []
      });
    }
    
    return chapterDecks;
    
  } catch (error) {
    console.error('❌ RAG Pipeline Error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    // Fallback to original method
    console.log('🔄 Falling back to original generation method...');
    return generateFlashcardsFromText(studyMaterial, onProgress, filters, 0);
  }
}

export async function generateFlashcardsFromText(
  studyMaterial: string,
  onProgress: (progress: number, status: string) => void,
  filters: FlashcardFilters,
  totalPages: number = 0
): Promise<ChapterDeck[]> {
  try {
    onProgress(0, 'Initializing AI...');
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY || 'AIzaSyCZHn2yAzKqyM-zaIVEB8YHkI98VdEz-ss';
    console.log('API Key check:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyPrefix: apiKey?.substring(0, 10) || 'none',
      isPlaceholder: apiKey === 'PLACEHOLDER_API_KEY',
      allEnvVars: Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('API')),
      usingFallback: !import.meta.env.VITE_GEMINI_API_KEY && !process.env.API_KEY && !process.env.GEMINI_API_KEY
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
    console.log('🎯 Applying filters:', {
      studyGoal: filters.studyGoal,
      contentType: filters.contentType,
      depth: filters.depth,
      organization: filters.organization,
      limitPerChapter: filters.limitPerChapter,
      pageRange: filters.pageRange
    });
    const prompt = buildFilteredPrompt(studyMaterial, filters, totalPages);
    
    onProgress(0.25, 'Sending request to Gemini...');
    console.log('Sending request to Gemini API...');
    
    const response = await retryWithBackoff(async () => {
      onProgress(0.3, 'Connecting to AI service...');
      return await ai.models.generateContent({
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
    }, 3, 2000); // 3 retries with 2 second base delay
    
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

  } catch (error: any) {
    console.error("Error generating flashcards:", error);
    
    // Handle specific error types
    if (error?.code === 503 || error?.status === 'UNAVAILABLE' || error?.message?.includes('overloaded')) {
      throw new Error("The AI service is currently overloaded. Please wait a moment and try again. The system will automatically retry for you.");
    } else if (error?.message?.includes('API key')) {
      throw new Error("Invalid API key. Please check your Gemini API key configuration.");
    } else if (error?.message?.includes('quota') || error?.message?.includes('limit')) {
      throw new Error("API quota exceeded. Please try again later or check your API usage limits.");
    } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      throw new Error("Network error. Please check your internet connection and try again.");
    } else if (error?.message?.includes('Max retries exceeded')) {
      throw new Error("The AI service is temporarily unavailable. Please try again in a few minutes.");
    } else if (error instanceof Error) {
      throw new Error(`Failed to generate flashcards: ${error.message}`);
    }
    
    throw new Error("Failed to generate flashcards from the provided material. Please check the content and try again.");
  }
}

export async function getDetailedExplanation(card: Flashcard): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY || 'AIzaSyCZHn2yAzKqyM-zaIVEB8YHkI98VdEz-ss';
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Provide a detailed explanation for the following flashcard concept. Explain it clearly as if you were a friendly tutor helping a student understand it better.
    
    Term/Question: "${card.question}"
    Answer/Definition: "${card.answer}"

    Your explanation should go beyond the simple answer and provide more context, examples, or analogies to make the concept easier to grasp. 
    
    **Guidelines:**
    - Use emojis naturally to make the explanation more engaging (:lightbulb:, :thinking:, :thumbsup:, etc.)
    - Break down complex concepts into simple parts
    - Use real-world examples and analogies
    - Be encouraging and supportive
    - Keep the tone conversational and friendly`;

    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    }, 2, 1000); // 2 retries with 1 second base delay
    
    return response.text;

  } catch (error: any) {
    console.error("Error getting detailed explanation:", error);
    if (error?.code === 503 || error?.status === 'UNAVAILABLE' || error?.message?.includes('overloaded')) {
      return "The AI service is currently overloaded. Please try again in a moment.";
    }
    return "Sorry, I couldn't fetch a detailed explanation at this time. Please try again later.";
  }
}

export function startCardChat(card: Flashcard): Chat {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY || 'AIzaSyCZHn2yAzKqyM-zaIVEB8YHkI98VdEz-ss';
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = `You are an expert AI tutor with a friendly and engaging personality. Your student is reviewing a flashcard and needs help.
  
  The flashcard is:
  - Question: "${card.question}"
  - Answer: "${card.answer}"
  
  Your role is to help the student understand this concept deeply. Answer their questions, provide simple explanations, and give real-world examples when asked. Be encouraging and helpful.
  
  **Important guidelines:**
  - Use emojis naturally in your responses to make them more engaging and friendly (e.g., :smile:, :thinking:, :lightbulb:, :thumbsup:)
  - You can also use regular emojis directly (😊, 🤔, 💡, 👍, etc.)
  - Keep responses conversational and encouraging
  - Break down complex concepts into simple, digestible parts
  - Use analogies and examples to make concepts clearer
  - Ask follow-up questions to check understanding when appropriate`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
}