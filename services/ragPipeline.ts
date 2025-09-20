// RAG Pipeline Service
// Optimized retrieval and generation for flashcard creation

import { embeddingService, Chunk, VectorSearchResult } from './embeddingService';
import { generateFlashcardsFromText } from './geminiService';
import { retryWithBackoff } from './utils';
import { performanceMonitor } from './performanceMonitor';
import { GoogleGenAI } from '@google/genai';
import type { FlashcardFilters } from '../types/filters';

export interface RAGConfig {
  topK: number;
  maxTokens: number;
  enableStreaming: boolean;
  batchSize: number;
  // Large document optimizations
  maxChunksPerChapter: number;
  enablePagination: boolean;
  maxMemoryChunks: number;
  enableProgressiveLoading: boolean;
}

export interface RAGResult {
  flashcards: any[];
  metadata: {
    chunksUsed: number;
    totalChunks: number;
    processingTime: number;
    tokensUsed: number;
  };
}

export class RAGPipeline {
  private static instance: RAGPipeline;
  private defaultConfig: RAGConfig = {
    topK: 5,
    maxTokens: 2000,
    enableStreaming: true,
    batchSize: 2,
    // Large document optimizations
    maxChunksPerChapter: 10,
    enablePagination: true,
    maxMemoryChunks: 1000, // Limit memory usage
    enableProgressiveLoading: true
  };

  // Large document configuration
  private largeDocumentConfig: RAGConfig = {
    topK: 15, // More chunks for better context
    maxTokens: 4000, // Larger context window
    enableStreaming: true,
    batchSize: 5, // Larger batches for efficiency
    maxChunksPerChapter: 20, // More chunks per chapter
    enablePagination: true,
    maxMemoryChunks: 2000, // Higher memory limit
    enableProgressiveLoading: true
  };

  static getInstance(): RAGPipeline {
    if (!RAGPipeline.instance) {
      RAGPipeline.instance = new RAGPipeline();
    }
    return RAGPipeline.instance;
  }

  // Detect if document is large and needs special handling
  private isLargeDocument(text: string, totalPages: number): boolean {
    // Consider document large if:
    // 1. More than 100 pages, OR
    // 2. More than 50,000 words, OR
    // 3. More than 200,000 characters
    return totalPages > 100 || 
           text.split(/\s+/).length > 50000 || 
           text.length > 200000;
  }

  // Get appropriate configuration based on document size
  private getConfigForDocument(text: string, totalPages: number): RAGConfig {
    if (this.isLargeDocument(text, totalPages)) {
      console.log('📚 Large document detected, using optimized configuration');
      return this.largeDocumentConfig;
    }
    return this.defaultConfig;
  }

  // Main RAG pipeline for flashcard generation
  async generateFlashcards(
    text: string,
    fileName: string,
    filters: FlashcardFilters,
    totalPages: number = 1,
    onProgress?: (progress: number, status: string) => void
  ): Promise<RAGResult> {
    const startTime = Date.now();
    performanceMonitor.startSession();
    
    // Get appropriate configuration based on document size
    const config = this.getConfigForDocument(text, totalPages);
    console.log('🚀 RAG Pipeline: Starting flashcard generation');
    console.log('📄 File:', fileName);
    console.log('📝 Text length:', text.length);
    console.log('📊 Total pages:', totalPages);
    console.log('🔧 Filters:', filters);
    console.log('⚙️ Using config:', config);
    
    try {
      // Step 1: Chunk the PDF text
      onProgress?.(10, 'Chunking document...');
      console.log('📦 RAG Pipeline: Step 1 - Chunking document...');
      const chunkingStart = Date.now();
      const chunks = await embeddingService.chunkPDFText(text, fileName);
      const chunkingTime = Date.now() - chunkingStart;
      console.log(`✅ RAG Pipeline: Chunking completed in ${chunkingTime}ms, created ${chunks.length} chunks`);
      performanceMonitor.recordChunkingTime(chunkingTime);
      performanceMonitor.recordChunksProcessed(chunks.length);
      
      // Step 2: Generate query based on filters or content analysis
      onProgress?.(20, 'Generating search query...');
      console.log('🔍 RAG Pipeline: Step 2 - Generating search query...');
      const query = this.generateQueryFromFilters(filters, chunks);
      console.log('🔍 Generated query:', query);
      
      // Step 3: Retrieve relevant chunks
      onProgress?.(30, 'Retrieving relevant content...');
      console.log('🎯 RAG Pipeline: Step 3 - Retrieving relevant chunks...');
      const retrievalStart = Date.now();
      const relevantChunks = await this.retrieveRelevantChunks(
        query, 
        chunks, 
        filters,
        config.topK
      );
      const retrievalTime = Date.now() - retrievalStart;
      console.log(`✅ RAG Pipeline: Retrieval completed in ${retrievalTime}ms, found ${relevantChunks.length} relevant chunks`);
      performanceMonitor.recordRetrievalTime(retrievalTime);
      performanceMonitor.recordChunksRetrieved(relevantChunks.length);
      
      // Step 4: Compress and prepare context
      onProgress?.(40, 'Preparing context...');
      console.log('📝 RAG Pipeline: Step 4 - Preparing context...');
      const context = this.prepareContext(relevantChunks, filters, chunks, config);
      const tokenCount = this.estimateTokenUsage(context);
      console.log(`📝 Context prepared: ${tokenCount} tokens, ${context.length} characters`);
      performanceMonitor.recordTokensUsed(tokenCount);
      
      // Step 5: Generate flashcards using LLM
      onProgress?.(50, 'Generating flashcards...');
      console.log('🤖 RAG Pipeline: Step 5 - Generating flashcards with LLM...');
      const generationStart = Date.now();
      const flashcards = await this.generateFlashcardsWithContext(
        context,
        filters,
        config,
        onProgress
      );
      const generationTime = Date.now() - generationStart;
      console.log(`✅ RAG Pipeline: Generation completed in ${generationTime}ms, created ${flashcards.length} flashcards`);
      performanceMonitor.recordGenerationTime(generationTime);
      
      const processingTime = Date.now() - startTime;
      const metrics = performanceMonitor.endSession();
      
      return {
        flashcards,
        metadata: {
          chunksUsed: relevantChunks.length,
          totalChunks: chunks.length,
          processingTime,
          tokensUsed: metrics.tokensUsed
        }
      };
      
    } catch (error) {
      console.error('RAG Pipeline Error:', error);
      throw new Error(`Flashcard generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate search query based on user filters or use context-based approach
  private generateQueryFromFilters(filters: FlashcardFilters, chunks: Chunk[]): string {
    // Check if filters are in default state (no custom filters applied)
    const isDefaultFilters = filters.studyGoal === 'concept-mastery' && 
                            filters.contentType.includes('full-detail') && 
                            filters.contentType.length === 1 &&
                            filters.depth === 'moderate' && 
                            filters.organization === 'chapter-wise' && 
                            filters.limitPerChapter === 15 && 
                            !filters.pageRange;
    
    console.log('🔧 Filter analysis:', { 
      isDefaultFilters, 
      filters,
      studyGoal: filters.studyGoal,
      contentType: filters.contentType,
      depth: filters.depth,
      limitPerChapter: filters.limitPerChapter,
      pageRange: filters.pageRange
    });
    
    if (isDefaultFilters) {
      // Use context-based query generation based on content analysis
      console.log('🧠 Using context-based query generation');
      return this.generateContextBasedQuery(chunks);
    }
    
    // Use filter-based query generation
    console.log('🎯 Using filter-based query generation');
    const queryParts: string[] = [];
    
    // Study goal context
    switch (filters.studyGoal) {
      case 'exam-revision':
        queryParts.push('exam preparation', 'key concepts', 'important facts', 'testable material');
        break;
      case 'concept-mastery':
        queryParts.push('fundamental concepts', 'core principles', 'understanding', 'deep learning');
        break;
      case 'quick-review':
        queryParts.push('summary', 'overview', 'quick reference', 'essential points');
        break;
    }
    
    // Content type context
    if (filters.contentType.includes('formulas')) {
      queryParts.push('formulas', 'equations', 'mathematical expressions', 'calculations');
    }
    if (filters.contentType.includes('definitions')) {
      queryParts.push('definitions', 'terms', 'vocabulary', 'key terms');
    }
    if (filters.contentType.includes('diagrams')) {
      queryParts.push('diagrams', 'figures', 'visual representations', 'charts');
    }
    if (filters.contentType.includes('full-detail')) {
      queryParts.push('comprehensive information', 'detailed explanations', 'complete coverage');
    }
    
    // Depth context
    switch (filters.depth) {
      case 'short':
        queryParts.push('brief', 'concise', 'summary', 'essential');
        break;
      case 'moderate':
        queryParts.push('detailed', 'comprehensive', 'thorough', 'balanced');
        break;
      case 'in-depth':
        queryParts.push('comprehensive', 'detailed analysis', 'deep understanding', 'extensive');
        break;
    }
    
    // Organization context
    if (filters.organization === 'chapter-wise') {
      queryParts.push('chapter organization', 'structured content');
    } else if (filters.organization === 'topic-clusters') {
      queryParts.push('topic clusters', 'grouped concepts', 'thematic organization');
    }
    
    const query = queryParts.join(' ');
    console.log('🔍 Generated filter-based query:', query);
    return query;
  }

  // Generate context-based query by analyzing content
  private generateContextBasedQuery(chunks: Chunk[]): string {
    console.log('🧠 RAG Pipeline: Generating context-based query from content analysis');
    
    // Analyze content to determine what to focus on
    const contentAnalysis = this.analyzeContent(chunks);
    const queryParts: string[] = [];
    
    // Add general academic terms
    queryParts.push('key concepts', 'important information', 'main ideas');
    
    // Add content-specific terms based on analysis
    if (contentAnalysis.hasFormulas) {
      queryParts.push('formulas', 'equations', 'mathematical concepts');
    }
    if (contentAnalysis.hasDefinitions) {
      queryParts.push('definitions', 'terms', 'vocabulary');
    }
    if (contentAnalysis.hasExamples) {
      queryParts.push('examples', 'applications', 'case studies');
    }
    if (contentAnalysis.hasProcesses) {
      queryParts.push('processes', 'procedures', 'steps');
    }
    
    const query = queryParts.join(' ');
    console.log('🧠 Generated context-based query:', query);
    return query;
  }

  // Analyze content to determine focus areas
  private analyzeContent(chunks: Chunk[]): {
    hasFormulas: boolean;
    hasDefinitions: boolean;
    hasExamples: boolean;
    hasProcesses: boolean;
    averageChunkLength: number;
    totalContent: number;
  } {
    let hasFormulas = false;
    let hasDefinitions = false;
    let hasExamples = false;
    let hasProcesses = false;
    let totalLength = 0;
    
    chunks.forEach(chunk => {
      const content = chunk.content.toLowerCase();
      totalLength += chunk.content.length;
      
      if (content.includes('=') || content.includes('formula') || content.includes('equation')) {
        hasFormulas = true;
      }
      if (content.match(/\b(?:is|are|means?|refers to|defined as)\b/)) {
        hasDefinitions = true;
      }
      if (content.match(/\b(?:for example|e\.g\.|such as|instance)\b/)) {
        hasExamples = true;
      }
      if (content.match(/\b(?:step|process|procedure|method|approach)\b/)) {
        hasProcesses = true;
      }
    });
    
    return {
      hasFormulas,
      hasDefinitions,
      hasExamples,
      hasProcesses,
      averageChunkLength: totalLength / chunks.length,
      totalContent: totalLength
    };
  }

  // Retrieve relevant chunks based on query and filters
  private async retrieveRelevantChunks(
    query: string,
    chunks: Chunk[],
    filters: FlashcardFilters,
    topK: number
  ): Promise<VectorSearchResult[]> {
    const searchFilters = {
      chapter: filters.organization === 'chapter-wise' ? undefined : undefined,
      type: this.getContentTypeFilter(filters.contentType),
      pageRange: filters.pageRange
    };

    return await embeddingService.searchSimilarChunks(
      query,
      chunks,
      topK,
      searchFilters
    );
  }

  // Map content type filters to chunk types
  private getContentTypeFilter(contentTypes: string[]): string | undefined {
    if (contentTypes.includes('formulas')) return 'formula';
    if (contentTypes.includes('definitions')) return 'definition';
    if (contentTypes.includes('diagrams')) return 'concept';
    return undefined;
  }

  // Prepare context for LLM with intelligent chapter-based organization
  private prepareContext(
    relevantChunks: VectorSearchResult[],
    filters: FlashcardFilters,
    allChunks: Chunk[],
    config: RAGConfig
  ): string {
    console.log('📝 RAG Pipeline: Preparing context with chapter-based organization');
    
    // Group chunks by chapter
    const chapterGroups = this.groupChunksByChapter(relevantChunks, allChunks);
    console.log('📝 Found chapters:', Object.keys(chapterGroups));
    
    // Calculate target cards per chapter based on content density
    const targetCardsPerChapter = this.calculateTargetCardsPerChapter(chapterGroups, filters);
    console.log('📝 Target cards per chapter:', targetCardsPerChapter);
    
    // Prepare context with chapter information
    let context = '';
    let totalTokens = 0;
    const maxTokens = config.maxTokens;
    
    for (const [chapterName, chunks] of Object.entries(chapterGroups)) {
      if (totalTokens >= maxTokens) break;
      
      // Add chapter header
      const chapterHeader = `\n=== CHAPTER ${chapterName} ===\n`;
      context += chapterHeader;
      totalTokens += this.estimateTokenCount(chapterHeader);
      
      // Add chapter content
      for (const result of chunks) {
        const chunk = result.chunk;
        const chunkTokens = chunk.metadata.tokenCount;
        
        if (totalTokens + chunkTokens > maxTokens) break;
        
        // Add chunk content with metadata
        const chunkContent = `[Page ${chunk.metadata.page || '?'}] ${chunk.content}\n`;
        context += chunkContent;
        totalTokens += chunkTokens;
      }
    }
    
    console.log(`📝 Context prepared: ${totalTokens} tokens, ${context.length} characters`);
    return context.trim();
  }

  // Group chunks by chapter for better organization
  private groupChunksByChapter(relevantChunks: VectorSearchResult[], allChunks: Chunk[]): Record<string, VectorSearchResult[]> {
    const chapterGroups: Record<string, VectorSearchResult[]> = {};
    
    // First, add relevant chunks to their chapters
    relevantChunks.forEach(result => {
      const chapter = result.chunk.metadata.chapter || 'General';
      if (!chapterGroups[chapter]) {
        chapterGroups[chapter] = [];
      }
      chapterGroups[chapter].push(result);
    });
    
    // If no chapters found, try to detect chapters from all chunks
    if (Object.keys(chapterGroups).length === 0 || (Object.keys(chapterGroups).length === 1 && Object.keys(chapterGroups)[0] === 'General')) {
      console.log('📝 No chapters detected, analyzing content for chapter structure...');
      const detectedChapters = this.detectChapters(allChunks);
      
      // Reorganize chunks by detected chapters
      chapterGroups['General'] = [];
      relevantChunks.forEach(result => {
        const chunk = result.chunk;
        const detectedChapter = this.findChapterForChunk(chunk, detectedChapters);
        
        if (!chapterGroups[detectedChapter]) {
          chapterGroups[detectedChapter] = [];
        }
        chapterGroups[detectedChapter].push(result);
      });
    }
    
    // Sort chunks within each chapter by page order
    Object.keys(chapterGroups).forEach(chapter => {
      chapterGroups[chapter].sort((a, b) => {
        const pageA = a.chunk.metadata.page || 0;
        const pageB = b.chunk.metadata.page || 0;
        return pageA - pageB;
      });
    });
    
    return chapterGroups;
  }

  // Detect chapters from content analysis
  private detectChapters(chunks: Chunk[]): Array<{ name: string; startPage: number; endPage: number }> {
    console.log('🔍 Detecting chapters from PDF content...');
    const chapters: Array<{ name: string; startPage: number; endPage: number }> = [];
    const seenChapters = new Set<string>();
    
    // Sort chunks by page number
    const sortedChunks = [...chunks].sort((a, b) => (a.metadata.page || 0) - (b.metadata.page || 0));
    
    sortedChunks.forEach(chunk => {
      const content = chunk.content;
      const page = chunk.metadata.page || 1;
      
      // Multiple patterns for chapter detection
      const patterns = [
        // Chapter X: Title
        /(?:chapter|section|part)\s+(\d+|[ivx]+)[\s:]*([^\n]+)/i,
        // Chapter X - Title
        /(?:chapter|section|part)\s+(\d+|[ivx]+)\s*-\s*([^\n]+)/i,
        // X. Title (numbered sections)
        /^(\d+)\s*\.\s*([^\n]+)$/im,
        // X Title (numbered sections without dot)
        /^(\d+)\s+([A-Z][^\n]+)$/im,
        // Roman numerals
        /^([IVX]+)\s*\.?\s*([^\n]+)$/im,
        // Bold/strong text that might be chapter titles
        /^\*\*([^\n]+)\*\*$/im,
        // All caps titles
        /^([A-Z\s]{3,50})$/im
      ];
      
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
          let chapterTitle = '';
          if (match[2]) {
            // Pattern with number and title
            chapterTitle = match[2].trim();
          } else if (match[1]) {
            // Pattern with just title
            chapterTitle = match[1].trim();
          }
          
          // Clean up the title
          chapterTitle = chapterTitle
            .replace(/^[^\w]*/, '') // Remove leading non-word chars
            .replace(/[^\w\s-].*$/, '') // Remove everything after first sentence-ending char
            .trim();
          
          // Only add if it's a meaningful title and not already seen
          if (chapterTitle.length > 3 && 
              chapterTitle.length < 100 && 
              !seenChapters.has(chapterTitle.toLowerCase()) &&
              !chapterTitle.match(/^(page|figure|table|image)\s*\d*$/i)) {
            
            chapters.push({
              name: chapterTitle,
              startPage: page,
              endPage: page
            });
            seenChapters.add(chapterTitle.toLowerCase());
            console.log(`📚 Found chapter: "${chapterTitle}" on page ${page}`);
          }
        }
      }
    });
    
    // If no chapters found, try to detect based on content structure
    if (chapters.length === 0) {
      console.log('⚠️ No explicit chapters found, analyzing content structure...');
      
      // Look for content that might indicate section breaks
      const sectionIndicators = [];
      sortedChunks.forEach((chunk, index) => {
        const content = chunk.content;
        const page = chunk.metadata.page || 1;
        
        // Look for content that starts with numbers or has specific patterns
        if (content.match(/^\d+\.\s+[A-Z]/) || 
            content.match(/^[A-Z][a-z]+.*:$/) ||
            content.match(/^[A-Z\s]{10,}$/)) {
          sectionIndicators.push({ content: content.substring(0, 50), page, index });
        }
      });
      
      // Create logical divisions based on content density and structure
      const totalPages = Math.max(...chunks.map(c => c.metadata.page || 1));
      const pagesPerChapter = Math.max(2, Math.ceil(totalPages / 4)); // 4 chapters for better distribution
      
      for (let i = 0; i < Math.ceil(totalPages / pagesPerChapter); i++) {
        const startPage = i * pagesPerChapter + 1;
        const endPage = Math.min((i + 1) * pagesPerChapter, totalPages);
        
        // Try to find a meaningful title from the content in this range
        const rangeChunks = sortedChunks.filter(c => 
          (c.metadata.page || 1) >= startPage && (c.metadata.page || 1) <= endPage
        );
        
        let chapterTitle = `Section ${i + 1}`;
        if (rangeChunks.length > 0) {
          const firstChunk = rangeChunks[0];
          const titleMatch = firstChunk.content.match(/^([A-Z][^.!?]{10,50})/);
          if (titleMatch) {
            chapterTitle = titleMatch[1].trim();
          }
        }
        
        chapters.push({
          name: chapterTitle,
          startPage,
          endPage
        });
        console.log(`📚 Created logical chapter: "${chapterTitle}" (pages ${startPage}-${endPage})`);
      }
    }
    
    console.log(`✅ Detected ${chapters.length} chapters:`, chapters.map(c => c.name));
    return chapters;
  }

  // Find the appropriate chapter for a chunk
  private findChapterForChunk(chunk: Chunk, chapters: Array<{ name: string; startPage: number; endPage: number }>): string {
    const page = chunk.metadata.page || 1;
    
    for (const chapter of chapters) {
      if (page >= chapter.startPage && page <= chapter.endPage) {
        return chapter.name;
      }
    }
    
    return 'General';
  }

  // Calculate target cards per chapter based on content density
  private calculateTargetCardsPerChapter(
    chapterGroups: Record<string, VectorSearchResult[]>,
    filters: FlashcardFilters
  ): Record<string, number> {
    const targetCards: Record<string, number> = {};
    
    // Check if using default filters (no custom selection)
    const isDefaultFilters = filters.studyGoal === 'concept-mastery' && 
                            filters.contentType.includes('full-detail') && 
                            filters.contentType.length === 1 &&
                            filters.depth === 'moderate' && 
                            filters.organization === 'chapter-wise' && 
                            filters.limitPerChapter === 15 && 
                            !filters.pageRange;
    
    Object.entries(chapterGroups).forEach(([chapterName, chunks]) => {
      if (isDefaultFilters) {
        // Calculate based on content density and chapter length
        const totalContent = chunks.reduce((sum, chunk) => sum + chunk.chunk.content.length, 0);
        const avgChunkLength = totalContent / chunks.length;
        const contentDensity = totalContent / 1000; // Content per 1000 characters
        
        // Base cards: 1 per 500 characters of content, minimum 3, maximum 20
        let baseCards = Math.max(3, Math.min(20, Math.ceil(contentDensity * 2)));
        
        // Adjust based on chunk count (more chunks = more concepts)
        const chunkMultiplier = Math.min(2, chunks.length / 5);
        baseCards = Math.ceil(baseCards * chunkMultiplier);
        
        targetCards[chapterName] = baseCards;
        console.log(`📊 Chapter "${chapterName}": ${baseCards} cards (content-based)`);
      } else {
        // Use filter-based calculation - respect user's selection
        targetCards[chapterName] = filters.limitPerChapter;
        console.log(`📊 Chapter "${chapterName}": ${filters.limitPerChapter} cards (filter-based)`);
      }
    });
    
    return targetCards;
  }

  // Generate flashcards using the prepared context
  private async generateFlashcardsWithContext(
    context: string,
    filters: FlashcardFilters,
    config: RAGConfig,
    onProgress?: (progress: number, status: string) => void
  ): Promise<any[]> {
    console.log('🤖 RAG Pipeline: Generating flashcards with enhanced context');
    
    // Check if using default filters (no custom selection)
    const isDefaultFilters = filters.studyGoal === 'concept-mastery' && 
                            filters.contentType.includes('full-detail') && 
                            filters.contentType.length === 1 &&
                            filters.depth === 'moderate' && 
                            filters.organization === 'chapter-wise' && 
                            filters.limitPerChapter === 15 && 
                            !filters.pageRange;
    
    if (isDefaultFilters) {
      // Use enhanced prompt for better card generation
      const enhancedPrompt = this.buildEnhancedPrompt(context, filters);
      return await this.generateWithEnhancedPrompt(enhancedPrompt, onProgress);
    } else {
      // Use the existing Gemini service with optimized context
      return await generateFlashcardsFromText(
        context,
        (progress, status) => {
          // Map progress from 50-100% for this step
          const mappedProgress = 50 + (progress * 0.5);
          onProgress?.(mappedProgress, status);
        },
        filters,
        0 // No total pages needed for RAG pipeline
      );
    }
  }

  // Build enhanced prompt for better card generation
  private buildEnhancedPrompt(context: string, filters: FlashcardFilters): string {
    const isDefaultFilters = filters.studyGoal === 'concept-mastery' && 
                            filters.contentType.includes('full-detail') && 
                            filters.contentType.length === 1 &&
                            filters.depth === 'moderate' && 
                            filters.organization === 'chapter-wise' && 
                            filters.limitPerChapter === 15 && 
                            !filters.pageRange;

    let prompt = `You are an expert AI study assistant. Analyze the following study material and create comprehensive flashcards organized by chapter.

IMPORTANT INSTRUCTIONS:`;

    if (isDefaultFilters) {
      prompt += `
1. Create flashcards for EACH chapter/section in the material
2. Generate 5-15 cards per chapter based on content density
3. Focus on key concepts, definitions, formulas, processes, and important facts`;
    } else {
      // Use filter-based instructions
      prompt += `
1. Create flashcards according to the specified filters
2. Generate exactly ${filters.limitPerChapter} cards per chapter
3. Focus on: ${filters.contentType.join(', ')}
4. Study goal: ${filters.studyGoal}
5. Depth level: ${filters.depth}
6. Organization: ${filters.organization}`;
      
      if (filters.pageRange) {
        prompt += `
7. Limit content to pages ${filters.pageRange.from} to ${filters.pageRange.to}`;
      }
    }

    prompt += `
4. Ensure each card covers a unique concept or idea
5. Make questions clear and answers comprehensive but concise
6. Include both factual recall and conceptual understanding questions
7. Generate REAL content based on the material, not placeholder text

For each flashcard, provide:
- question: A clear, specific question or term from the actual content
- answer: A detailed but concise answer based on the material
- chapter: The chapter/section name this card belongs to

The material is organized as follows:

${context}

Generate flashcards that cover all the important content in each chapter.`;

    return prompt;
  }

  // Generate flashcards with enhanced prompt
  private async generateWithEnhancedPrompt(prompt: string, onProgress?: (progress: number, status: string) => void): Promise<any[]> {
    try {
      onProgress?.(60, 'Connecting to AI...');
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY || 'AIzaSyCZHn2yAzKqyM-zaIVEB8YHkI98VdEz-ss';
      if (!apiKey) {
        throw new Error('No API key found. Please check your environment variables.');
      }
      
      const genAI = new GoogleGenAI({ apiKey });
      const model = genAI.models.generateContent;
      
      onProgress?.(70, 'Generating flashcards...');
      
      const result = await retryWithBackoff(async () => {
        return await model({
          model: "gemini-1.5-flash",
          contents: prompt
        });
      });
      
      onProgress?.(90, 'Processing response...');
      
      const text = result.text;
      
      console.log('🤖 Raw AI response:', text);
      
      // Parse the response to extract flashcards
      const flashcards = this.parseFlashcardsFromResponse(text);
      
      onProgress?.(100, 'Complete!');
      
      console.log(`🤖 Generated ${flashcards.length} flashcards`);
      return flashcards;
      
    } catch (error) {
      console.error('🤖 Enhanced generation failed:', error);
      throw error;
    }
  }

  // Parse flashcards from AI response
  private parseFlashcardsFromResponse(text: string): any[] {
    console.log('🔍 Parsing AI response for flashcards...');
    const flashcards: any[] = [];
    
    // Try to parse JSON format first
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          console.log(`✅ Parsed ${parsed.length} flashcards from JSON format`);
          return parsed;
        }
      }
    } catch (e) {
      console.log('⚠️ JSON parsing failed, trying text format...');
    }
    
    // Parse text format with multiple patterns
    const lines = text.split('\n');
    let currentCard: any = null;
    let currentChapter = 'General';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Chapter detection
      if (trimmedLine.match(/^(Chapter|Section|Part)\s*\d*[:\-\s]/i)) {
        currentChapter = trimmedLine.replace(/^(Chapter|Section|Part)\s*\d*[:\-\s]*/i, '').trim() || 'General';
        console.log(`📚 Found chapter: ${currentChapter}`);
        continue;
      }
      
      // Question detection (multiple patterns)
      if (trimmedLine.match(/^(Q|Question|Q\d+)[:\-\s]/i)) {
        if (currentCard && currentCard.question && currentCard.answer) {
          flashcards.push({ ...currentCard, chapter: currentChapter });
        }
        currentCard = {
          question: trimmedLine.replace(/^(Q|Question|Q\d+)[:\-\s]*/i, '').trim(),
          answer: '',
          chapter: currentChapter
        };
      } 
      // Answer detection
      else if (trimmedLine.match(/^(A|Answer|A\d+)[:\-\s]/i)) {
        if (currentCard) {
          currentCard.answer = trimmedLine.replace(/^(A|Answer|A\d+)[:\-\s]*/i, '').trim();
        }
      } 
      // Continue building current card
      else if (currentCard && trimmedLine && !trimmedLine.startsWith('---') && !trimmedLine.startsWith('===')) {
        if (currentCard.answer) {
          currentCard.answer += ' ' + trimmedLine;
        } else if (currentCard.question) {
          currentCard.question += ' ' + trimmedLine;
        }
      }
    }
    
    // Add the last card
    if (currentCard && currentCard.question && currentCard.answer) {
      flashcards.push({ ...currentCard, chapter: currentChapter });
    }
    
    console.log(`✅ Parsed ${flashcards.length} flashcards from text format`);
    
    // If no structured format found, try to extract Q&A pairs
    if (flashcards.length === 0) {
      console.log('⚠️ No structured format found, extracting Q&A pairs...');
      const qaPairs = this.extractQAPairs(text);
      qaPairs.forEach(pair => {
        flashcards.push({
          question: pair.question,
          answer: pair.answer,
          chapter: currentChapter
        });
      });
      console.log(`✅ Extracted ${qaPairs.length} Q&A pairs`);
    }
    
    // Filter out invalid cards
    const validFlashcards = flashcards.filter(card => 
      card.question && 
      card.answer && 
      card.question.trim() !== '' && 
      card.answer.trim() !== '' &&
      !card.question.includes('question text') &&
      !card.answer.includes('answers text')
    );
    
    console.log(`✅ Final result: ${validFlashcards.length} valid flashcards`);
    return validFlashcards;
  }

  // Extract Q&A pairs from unstructured text
  private extractQAPairs(text: string): Array<{ question: string; answer: string }> {
    const pairs: Array<{ question: string; answer: string }> = [];
    
    // Look for question patterns
    const questionPatterns = [
      /What is (.+?)\?/gi,
      /Define (.+?)[\?\.]/gi,
      /Explain (.+?)[\?\.]/gi,
      /How does (.+?)\?/gi,
      /Why (.+?)\?/gi
    ];
    
    questionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const question = match[0].trim();
        const answer = this.findAnswerForQuestion(question, text);
        if (answer) {
          pairs.push({ question, answer });
        }
      }
    });
    
    return pairs;
  }

  // Find answer for a question in the text
  private findAnswerForQuestion(question: string, text: string): string {
    // Simple heuristic to find related content
    const questionWords = question.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const sentenceWords = sentence.toLowerCase().split(/\s+/);
      const commonWords = questionWords.filter(word => 
        word.length > 3 && sentenceWords.includes(word)
      );
      
      if (commonWords.length >= 2) {
        return sentence.trim();
      }
    }
    
    return '';
  }

  // Estimate token usage for monitoring
  private estimateTokenUsage(context: string): number {
    return Math.ceil(context.length / 4); // Rough estimation
  }

  // Estimate token count for a given text
  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4); // Rough estimation: 1 token ≈ 4 characters
  }

  // Batch processing for multiple documents
  async batchGenerateFlashcards(
    documents: Array<{ text: string; fileName: string; filters: FlashcardFilters; totalPages?: number }>,
    onProgress?: (progress: number, status: string) => void
  ): Promise<RAGResult[]> {
    const results: RAGResult[] = [];
    const totalDocs = documents.length;
    
    for (let i = 0; i < totalDocs; i++) {
      const doc = documents[i];
      const docProgress = (i / totalDocs) * 100;
      
      onProgress?.(docProgress, `Processing ${doc.fileName}...`);
      
      try {
        const result = await this.generateFlashcards(
          doc.text,
          doc.fileName,
          doc.filters,
          doc.totalPages || 1,
          (progress, status) => {
            const totalProgress = docProgress + (progress * (1 / totalDocs));
            onProgress?.(totalProgress, status);
          }
        );
        results.push(result);
      } catch (error) {
        console.error(`Error processing ${doc.fileName}:`, error);
        // Continue with other documents
        results.push({
          flashcards: [],
          metadata: {
            chunksUsed: 0,
            totalChunks: 0,
            processingTime: 0,
            tokensUsed: 0
          }
        });
      }
    }
    
    return results;
  }

  // Clear cache for a specific document
  clearDocumentCache(fileName: string): void {
    embeddingService.clearCache(fileName);
  }

  // Get processing statistics
  getProcessingStats(): {
    cachedChunks: number;
    cachedEmbeddings: number;
  } {
    return {
      cachedChunks: embeddingService['chunkCache'].size,
      cachedEmbeddings: embeddingService['embeddingCache'].size
    };
  }
}

export const ragPipeline = RAGPipeline.getInstance();
