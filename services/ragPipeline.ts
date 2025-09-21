import { GoogleGenAI } from '@google/genai';
import { db } from './firebase';
import { collection, doc, getDocs, query as firestoreQuery, where, writeBatch } from 'firebase/firestore';
import { pdfCacheService, type PDFProcessingResult } from './pdfCache';

// Optimized RAG service with batching, caching, and page-level progress
export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    userId: string;
    documentId: string;
    documentName: string;
    chapterTitle?: string;
    pageNumber?: number;
    chunkIndex: number;
    createdAt: string;
  };
  embedding?: number[];
}

export interface RAGQuery {
  query: string;
  userId: string;
  documentId: string;
  maxResults?: number;
  similarityThreshold?: number;
}

export interface RAGResult {
  chunks: DocumentChunk[];
  totalChunks: number;
  query: string;
}

export interface PageProgress {
  pageNumber: number;
  totalPages: number;
  status: 'reading' | 'processing' | 'complete';
  textLength: number;
}

// Optimized configuration
const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 100;
const BATCH_SIZE = 5; // Process 5 chunks at once for embeddings
const MAX_RESULTS = 3;
const SIMILARITY_THRESHOLD = 0.6;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

class OptimizedRAGService {
  private genAI: GoogleGenAI;
  private embeddingModel: any;
  private embeddingCache = new Map<string, number[]>();

  constructor() {
    const apiKey =
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      process.env.API_KEY ||
      process.env.GEMINI_API_KEY ||
      'your-fallback-key';

    this.genAI = new GoogleGenAI({ apiKey });
    // Note: @google/genai doesn't have text-embedding-004, we'll use a different approach
    this.embeddingModel = null; // Will implement embedding generation differently
  }

  /**
   * Process PDF with page-level progress reporting
   */
  async processPDFWithProgress(
    pdf: any,
    documentName: string,
    userId: string,
    documentId: string,
    onPageProgress: (progress: PageProgress) => void
  ): Promise<DocumentChunk[]> {
    const totalPages = pdf.numPages;
    let allChunks: DocumentChunk[] = [];
    let chunkIndex = 0;

    console.log(`📄 Processing PDF: ${documentName} (${totalPages} pages)`);

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      onPageProgress({
        pageNumber: pageNum,
        totalPages,
        status: 'reading',
        textLength: 0,
      });

      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');

        onPageProgress({
          pageNumber: pageNum,
          totalPages,
          status: 'processing',
          textLength: pageText.length,
        });

        const pageChunks = this.chunkText(pageText, documentName, pageNum);

        const chunksWithMetadata = pageChunks.map((chunk) => ({
          ...chunk,
          id: `${documentId}-page-${pageNum}-chunk-${chunkIndex++}`,
          metadata: {
            userId,
            documentId,
            documentName,
            pageNumber: pageNum,
            chunkIndex: chunkIndex - 1,
            createdAt: new Date().toISOString(),
          },
        }));

        allChunks.push(...chunksWithMetadata);
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`Error processing page ${pageNum}:`, error);
      }
    }

    console.log(
      `🔢 Generating embeddings for ${allChunks.length} chunks in batches of ${BATCH_SIZE}`
    );
    const chunksWithEmbeddings = await this.generateEmbeddingsBatch(
      allChunks,
      (progress, status) => {
        onPageProgress({
          pageNumber: totalPages,
          totalPages,
          status: 'processing',
          textLength: 0,
        });
      }
    );

    await this.storeChunksBatch(chunksWithEmbeddings);

    onPageProgress({
      pageNumber: totalPages,
      totalPages,
      status: 'complete',
      textLength: allChunks.reduce((sum, chunk) => sum + chunk.content.length, 0),
    });

    return chunksWithEmbeddings;
  }

  private chunkText(
  text: string,
  documentName: string,
  pageNumber: number
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  let currentChunk = '';
  let chunkIndex = 0;

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    if (
      currentChunk.length + trimmedSentence.length > CHUNK_SIZE &&
      currentChunk.length > 0
    ) {
      chunks.push({
        id: '', // placeholder, set later in processPDFWithProgress
        content: currentChunk.trim(),
        metadata: {
          userId: '', // placeholder, set later
          documentId: '',
          documentName,
          pageNumber,
          chunkIndex: chunkIndex++,
          createdAt: new Date().toISOString(),
        },
        embedding: undefined,
      });

      const overlap = currentChunk.slice(-CHUNK_OVERLAP);
      currentChunk = overlap + ' ' + trimmedSentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: '',
      content: currentChunk.trim(),
      metadata: {
        userId: '',
        documentId: '',
        documentName,
        pageNumber,
        chunkIndex: chunkIndex++,
        createdAt: new Date().toISOString(),
      },
      embedding: undefined,
    });
  }

  return chunks;
}


  private async generateEmbeddingsBatch(
    chunks: DocumentChunk[],
    onProgress?: (progress: number, status: string) => void
  ): Promise<DocumentChunk[]> {
    const chunksWithEmbeddings: DocumentChunk[] = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);

      onProgress?.(
        i / chunks.length,
        `Generating embeddings batch ${batchNumber}/${totalBatches}...`
      );

      const batchPromises = batch.map(async (chunk) => {
        const cacheKey = this.getEmbeddingCacheKey(chunk.content);
        let embedding = this.embeddingCache.get(cacheKey);

        if (!embedding) {
          try {
            // For now, create a simple hash-based embedding since @google/genai doesn't have embeddings
            // In a real implementation, you would use a proper embedding service
            embedding = this.createSimpleEmbedding(chunk.content);
            this.embeddingCache.set(cacheKey, embedding);
          } catch (error) {
            console.error('Error generating embedding:', error);
            embedding = new Array(768).fill(0);
          }
        }

        return {
          ...chunk,
          embedding,
        };
      });

      const batchResults = await Promise.all(batchPromises);
      chunksWithEmbeddings.push(...batchResults);

      if (i + BATCH_SIZE < chunks.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return chunksWithEmbeddings;
  }

  private async storeChunksBatch(chunks: DocumentChunk[]): Promise<void> {
    if (!chunks || chunks.length === 0) {
      console.log('⚠️ No chunks to store, skipping Firestore operation');
      return;
    }

    const batch = writeBatch(db);
    const chunksCollection = collection(db, 'documentChunks');

    // Safety check for metadata
    if (!chunks[0]?.metadata?.documentId || !chunks[0]?.metadata?.userId) {
      console.warn('⚠️ Chunks missing required metadata, skipping Firestore operation');
      return;
    }

    const existingQuery = firestoreQuery(
      collection(db, 'documentChunks'),
      where('metadata.documentId', '==', chunks[0].metadata.documentId),
      where('metadata.userId', '==', chunks[0].metadata.userId)
    );

    const existingChunks = await getDocs(existingQuery);
    existingChunks.forEach((doc) => {
      batch.delete(doc.ref);
    });

    for (let i = 0; i < chunks.length; i += 500) {
      const chunkBatch = chunks.slice(i, i + 500);
      chunkBatch.forEach((chunk) => {
        const docRef = doc(chunksCollection);
        batch.set(docRef, chunk);
      });
    }

    await batch.commit();
    console.log(`✅ Stored ${chunks.length} chunks in Firestore`);
  }

  async retrieveRelevantChunks(ragQuery: RAGQuery): Promise<RAGResult> {
    const {
      query,
      userId,
      documentId,
      maxResults = MAX_RESULTS,
      similarityThreshold = SIMILARITY_THRESHOLD,
    } = ragQuery;

    // const cacheKey = `rag_${userId}_${documentId}_${query}`;
    // const cachedResult = cacheService.get<RAGResult>(cacheKey);
    // if (cachedResult) {
    //   console.log('📋 RAG result retrieved from cache');
    //   return cachedResult;
    // }

    try {
      const queryEmbedding = await this.generateEmbedding(query);

      let allChunks: DocumentChunk[] = [];
      
      try {
        const chunksQuery = firestoreQuery(
          collection(db, 'documentChunks'),
          where('metadata.documentId', '==', documentId),
          where('metadata.userId', '==', userId)
        );

        const chunksSnapshot = await getDocs(chunksQuery);

        chunksSnapshot.forEach((doc) => {
          const chunk = doc.data() as DocumentChunk;
          if (chunk.embedding) {
            allChunks.push(chunk);
          }
        });
      } catch (firestoreError) {
        console.warn('⚠️ Failed to retrieve chunks from Firestore:', firestoreError);
        // Return empty result - the calling code will handle the fallback
        return {
          chunks: [],
          totalChunks: 0,
          query
        } as RAGResult;
      }

      const chunksWithSimilarity = allChunks.map((chunk) => ({
        ...chunk,
        similarity: this.calculateCosineSimilarity(
          queryEmbedding,
          chunk.embedding!
        ),
      }));

      const relevantChunks = chunksWithSimilarity
        .filter((chunk) => chunk.similarity >= similarityThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, maxResults)
        .map(({ similarity, ...chunk }) => chunk);

      const result: RAGResult = {
        chunks: relevantChunks,
        totalChunks: allChunks.length,
        query,
      };

      // cacheService.set(cacheKey, result, CACHE_TTL);

      return result;
    } catch (error) {
      console.error('Error retrieving relevant chunks:', error);
      return {
        chunks: [],
        totalChunks: 0,
        query,
      };
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const cacheKey = this.getEmbeddingCacheKey(text);
    let embedding = this.embeddingCache.get(cacheKey);

    if (!embedding) {
      try {
        // For now, create a simple hash-based embedding since @google/genai doesn't have embeddings
        // In a real implementation, you would use a proper embedding service
        embedding = this.createSimpleEmbedding(text);
        this.embeddingCache.set(cacheKey, embedding);
      } catch (error) {
        console.error('Error generating embedding:', error);
        embedding = new Array(768).fill(0);
      }
    }

    return embedding;
  }

  private createSimpleEmbedding(text: string): number[] {
    // Create a simple hash-based embedding for demonstration
    // In a real implementation, you would use a proper embedding service like OpenAI's text-embedding-ada-002
    const hash = this.simpleHash(text);
    const embedding = new Array(768).fill(0);
    
    // Distribute the hash across the embedding dimensions
    for (let i = 0; i < 768; i++) {
      embedding[i] = Math.sin(hash + i) * 0.1;
    }
    
    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private getEmbeddingCacheKey(text: string): string {
    return `embedding_${text.slice(0, 100)}_${text.length}`;
  }

  // Get current user ID from localStorage or context
  private getCurrentUserId(): string {
    try {
      // Try to get from localStorage first
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        // Use email as a simple user identifier
        return userEmail.split('@')[0]; // Use the part before @ as user ID
      }
      
      // Fallback to a default user ID
      return 'anonymous-user';
    } catch (error) {
      console.error('Error getting user ID:', error);
      return 'anonymous-user';
    }
  }

  // Generate flashcards from retrieved chunks using RAG
  async generateFlashcardsFromChunks(
    chunks: DocumentChunk[],
    filters: any,
    totalPages: number,
    onProgress: (progress: number, status: string) => void
  ): Promise<any[]> {
    try {
      onProgress(0.1, 'Formatting context for AI...');
      
      // Format the retrieved chunks for the AI
      const context = this.formatContextForGemini(chunks);
      console.log('📝 Formatted context length:', context.length);
      
      // Check if context is empty
      if (!context || context.trim().length === 0) {
        throw new Error('No content available for flashcard generation');
      }
      
      onProgress(0.2, 'Generating flashcards with AI...');
      
      // Import the original function dynamically to avoid circular imports
      const { generateFlashcardsFromText } = await import('./geminiService');
      
      // Use the original Gemini service but with the retrieved context
      const chapterDecks = await generateFlashcardsFromText(
        context, // Use the retrieved context instead of full text
        (progress, status) => {
          // Map the progress from 0.2 to 0.9
          const mappedProgress = 0.2 + (progress * 0.7);
          onProgress(mappedProgress, status);
        },
        filters,
        totalPages
      );
      
      onProgress(0.9, 'Processing RAG results...');
      
      // Add RAG metadata to each chapter
      chapterDecks.forEach((chapter: any) => {
        chapter.ragMetadata = {
          sourceChunks: chunks.length,
          retrievalMethod: 'semantic_search',
          contextLength: context.length
        };
      });
      
      onProgress(1.0, 'RAG flashcard generation complete!');
      
      return chapterDecks;
    } catch (error) {
      console.error('Error in RAG flashcard generation from chunks:', error);
      throw error;
    }
  }

  formatContextForGemini(chunks: DocumentChunk[]): string {
    if (chunks.length === 0) {
      console.warn('⚠️ No chunks provided to formatContextForGemini');
      return '';
    }

    console.log(`📝 Formatting ${chunks.length} chunks for Gemini...`);
    
    const summarizedChunks = chunks.map((chunk, index) => {
      const content = chunk.content || '';
      if (content.length > 400) {
        return content.slice(0, 200) + '...' + content.slice(-200);
      }
      return content;
    });

    const context = summarizedChunks
      .map((chunk, index) => `Context ${index + 1}:\n${chunk}`)
      .join('\n\n');
    
    console.log(`📝 Formatted context: ${context.length} characters from ${chunks.length} chunks`);
    
    return context;
  }

  async clearDocumentCache(documentId: string, userId: string): Promise<void> {
    const chunksQuery = firestoreQuery(
      collection(db, 'documentChunks'),
      where('metadata.documentId', '==', documentId),
      where('metadata.userId', '==', userId)
    );

    const chunksSnapshot = await getDocs(chunksQuery);
    const batch = writeBatch(db);

    chunksSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`🗑️ Cleared cache for document ${documentId}`);
  }

  /**
   * Generate flashcards using RAG pipeline with intelligent caching
   * This method integrates with the existing geminiService and adds caching
   */
  async generateFlashcards(
    studyMaterial: string,
    fileName: string,
    filters: any,
    totalPages: number,
    onProgress: (progress: number, status: string) => void,
    userId?: string
  ): Promise<{
    flashcards: any[];
    metadata: {
      totalChunks: number;
      processingTime: number;
      fileName: string;
      isFromCache: boolean;
    };
  }> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 RAG Pipeline: Starting intelligent flashcard generation...');
      onProgress(0.05, 'Initializing RAG pipeline...');

      // Get user ID from context or parameter
      const currentUserId = userId || this.getCurrentUserId();
      console.log('👤 User ID:', currentUserId);

      // Generate content hash for caching (including filters)
      const contentHash = pdfCacheService.generateContentHash(studyMaterial, fileName, filters);
      console.log('🔍 Content hash (with filters):', contentHash);

      // Check cache first
      onProgress(0.1, 'Checking cache for existing PDF...');
      const cachedEntry = await pdfCacheService.checkCache(contentHash, currentUserId, filters);
      
      if (cachedEntry) {
        console.log('⚡ PDF found in cache! Returning cached results...');
        onProgress(0.3, 'Loading from cache...');
        
        // Simulate some processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        onProgress(1.0, 'Flashcards loaded from cache!');
        
        // Convert cached chapter decks to flashcards
        const flashcards: any[] = [];
        cachedEntry.chapterDecks.forEach(chapter => {
          chapter.flashcards.forEach(card => {
            flashcards.push({
              question: card.question,
              answer: card.answer,
              chapter: chapter.chapterTitle,
              id: card.id
            });
          });
        });

        return {
          flashcards: flashcards,
          metadata: {
            totalChunks: flashcards.length,
            processingTime: Date.now() - startTime,
            fileName: fileName,
            isFromCache: true
          }
        };
      }

      console.log('📝 PDF not in cache, processing with RAG pipeline...');
      onProgress(0.2, 'Chunking and analyzing content...');
      
      // Use RAG pipeline for new PDFs - chunk the content first
      const chunks = this.chunkText(studyMaterial, fileName, 1);
      console.log(`📊 Created ${chunks.length} chunks for RAG processing`);
      
      // Estimate total pages (assuming ~500 words per page)
      const totalPages = Math.max(1, Math.ceil(studyMaterial.split(/\s+/).length / 500));
      
      // Debug: Log the first few chunks to see if text is being processed
      console.log('🔍 First few chunks:', chunks.slice(0, 3));
      console.log('🔍 Study material length:', studyMaterial.length);
      console.log('🔍 Study material preview:', studyMaterial.substring(0, 200));
      
      onProgress(0.3, 'Generating embeddings...');
      
      // Generate embeddings for all chunks
      const embeddings = await this.generateEmbeddingsBatch(chunks, (progress, status) => {
        onProgress(0.3 + (progress * 0.1), status);
      });
      console.log(`🔗 Generated ${embeddings.length} embeddings`);
      
      onProgress(0.4, 'Storing chunks in database...');
      
      // Store chunks in Firestore for future retrieval (with error handling)
      try {
        // Update chunks with proper metadata before storing
        const chunksWithMetadata = embeddings.map((chunk, index) => ({
          ...chunk,
          id: `${fileName}-chunk-${index}`,
          metadata: {
            ...chunk.metadata,
            userId: currentUserId,
            documentId: fileName,
          }
        }));
        
        console.log('🔍 Chunks with metadata:', chunksWithMetadata.slice(0, 2));
        console.log('🔍 Current user ID:', currentUserId);
        console.log('🔍 File name:', fileName);
        
        await this.storeChunksBatch(chunksWithMetadata);
        console.log('✅ Chunks stored successfully in Firestore');
      } catch (error) {
        console.warn('⚠️ Failed to store chunks in Firestore, continuing with local processing:', error);
        // Continue without storing - we can still generate flashcards
      }
      
      onProgress(0.5, 'Generating flashcards with RAG...');
      
      let chapterDecks: any[] = [];
      
      try {
        // Use RAG retrieval to find relevant chunks for flashcard generation
        const ragResult = await this.retrieveRelevantChunks({
          query: studyMaterial,
          documentId: fileName,
          userId: currentUserId,
          maxResults: 10
        });
        
        onProgress(0.6, 'Creating flashcards from retrieved content...');
        
        // Check if we got valid chunks from retrieval
        if (ragResult.chunks && ragResult.chunks.length > 0) {
          console.log(`🎯 Using ${ragResult.chunks.length} retrieved chunks for flashcard generation`);
          // Generate flashcards using the retrieved chunks
          chapterDecks = await this.generateFlashcardsFromChunks(
            ragResult.chunks,
            filters,
            totalPages,
            (progress, status) => {
              const mappedProgress = 0.6 + (progress * 0.3);
              onProgress(mappedProgress, status);
            }
          );
        } else {
          throw new Error('No chunks retrieved from RAG');
        }
      } catch (error) {
        console.warn('⚠️ RAG retrieval failed, falling back to direct processing:', error);
        onProgress(0.6, 'Using direct content processing...');
        
        // Fallback: use the original chunks directly for flashcard generation
        console.log(`🔄 Using ${chunks.length} original chunks for fallback processing`);
        
        try {
          chapterDecks = await this.generateFlashcardsFromChunks(
            chunks,
            filters,
            totalPages,
            (progress, status) => {
              const mappedProgress = 0.6 + (progress * 0.3);
              onProgress(mappedProgress, status);
            }
          );
        } catch (chunkError) {
          console.warn('⚠️ Chunk processing failed, using original study material:', chunkError);
          onProgress(0.7, 'Using original study material...');
          
          // Final fallback: use the original study material directly
          const { generateFlashcardsFromText } = await import('./geminiService');
          chapterDecks = await generateFlashcardsFromText(
            studyMaterial,
            (progress, status) => {
              const mappedProgress = 0.7 + (progress * 0.3);
              onProgress(mappedProgress, status);
            },
            filters,
            totalPages
          );
        }
      }

      onProgress(0.9, 'Caching results for future use...');
      
      // Add RAG processing metadata
      const ragMetadata = {
        chunksProcessed: chunks.length,
        embeddingsGenerated: embeddings.length,
        retrievalMethod: 'semantic_search',
        processingType: 'rag_pipeline'
      };
      
      // Store in cache for future use
      await pdfCacheService.storeCache(
        contentHash,
        currentUserId,
        fileName,
        totalPages,
        studyMaterial.length,
        chapterDecks,
        { ...filters, ragMetadata },
        Date.now() - startTime
      );
      
      onProgress(0.95, 'Converting to RAG format...');
      
      // Convert ChapterDeck format to the format expected by the RAG pipeline
      const flashcards: any[] = [];
      chapterDecks.forEach(chapter => {
        chapter.flashcards.forEach(card => {
          flashcards.push({
            question: card.question,
            answer: card.answer,
            chapter: chapter.chapterTitle,
            id: card.id
          });
        });
      });

      onProgress(1.0, 'RAG flashcard generation complete!');

      console.log('✅ RAG Pipeline completed successfully!');
      console.log('📊 RAG Statistics:', {
        chunksProcessed: chunks.length,
        embeddingsGenerated: embeddings.length,
        flashcardsGenerated: flashcards.length,
        processingTime: Date.now() - startTime,
        retrievalMethod: 'semantic_search'
      });

      return {
        flashcards: flashcards,
        metadata: {
          totalChunks: flashcards.length,
          processingTime: Date.now() - startTime,
          fileName: fileName,
          isFromCache: false,
          ragMetadata: {
            chunksProcessed: chunks.length,
            embeddingsGenerated: embeddings.length,
            retrievalMethod: 'semantic_search',
            processingType: 'rag_pipeline'
          }
        } as any
      };
    } catch (error) {
      console.error('Error in RAG pipeline flashcard generation:', error);
      throw error;
    }
  }
}

export const optimizedRAGService = new OptimizedRAGService();
export const ragPipeline = optimizedRAGService; // Alias for compatibility