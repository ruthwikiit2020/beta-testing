// Embedding Service for RAG Pipeline
// Handles PDF text chunking, embedding generation, and vector storage

export interface Chunk {
  id: string;
  content: string;
  metadata: {
    chapter?: string;
    page?: number;
    startIndex: number;
    endIndex: number;
    tokenCount: number;
    topic?: string;
    type?: 'formula' | 'definition' | 'concept' | 'example' | 'summary';
  };
  embedding?: number[];
}

export interface VectorSearchResult {
  chunk: Chunk;
  similarity: number;
  score: number;
}

export class EmbeddingService {
  private static instance: EmbeddingService;
  private chunkCache = new Map<string, Chunk[]>();
  private embeddingCache = new Map<string, number[]>();

  static getInstance(): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
    }
    return EmbeddingService.instance;
  }

  // Semantic chunking strategy (200-400 tokens)
  async chunkPDFText(text: string, fileName: string): Promise<Chunk[]> {
    const cacheKey = `chunks_${fileName}`;
    
    console.log('📦 Embedding Service: Starting chunking for', fileName);
    console.log('📦 Text length:', text.length);
    
    // Return cached chunks if available
    if (this.chunkCache.has(cacheKey)) {
      console.log('📦 Using cached chunks for', fileName);
      return this.chunkCache.get(cacheKey)!;
    }

    const chunks: Chunk[] = [];
    const sentences = this.splitIntoSentences(text);
    console.log('📦 Split into', sentences.length, 'sentences');
    let currentChunk = '';
    let currentStartIndex = 0;
    let chunkIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;
      const tokenCount = this.estimateTokenCount(potentialChunk);

      // If adding this sentence would exceed 400 tokens, finalize current chunk
      if (tokenCount > 400 && currentChunk) {
        chunks.push(this.createChunk(
          currentChunk.trim(),
          chunkIndex++,
          currentStartIndex,
          currentStartIndex + currentChunk.length,
          fileName
        ));
        currentChunk = sentence;
        currentStartIndex += currentChunk.length;
      } else if (tokenCount >= 200 && tokenCount <= 400) {
        // Perfect size chunk
        chunks.push(this.createChunk(
          potentialChunk.trim(),
          chunkIndex++,
          currentStartIndex,
          currentStartIndex + potentialChunk.length,
          fileName
        ));
        currentChunk = '';
        currentStartIndex += potentialChunk.length;
      } else {
        // Continue building chunk
        currentChunk = potentialChunk;
      }
    }

    // Add remaining content as final chunk
    if (currentChunk.trim()) {
      chunks.push(this.createChunk(
        currentChunk.trim(),
        chunkIndex++,
        currentStartIndex,
        currentStartIndex + currentChunk.length,
        fileName
      ));
    }

    // Deduplicate overlapping chunks
    const deduplicatedChunks = this.deduplicateChunks(chunks);
    console.log('📦 Created', chunks.length, 'chunks,', deduplicatedChunks.length, 'after deduplication');
    
    // Cache the chunks
    this.chunkCache.set(cacheKey, deduplicatedChunks);
    console.log('📦 Cached chunks for', fileName);
    
    return deduplicatedChunks;
  }

  private splitIntoSentences(text: string): string[] {
    // Split by sentence boundaries while preserving context
    return text
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .filter(sentence => sentence.trim().length > 10)
      .map(sentence => sentence.trim());
  }

  private estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  private createChunk(
    content: string, 
    index: number, 
    startIndex: number, 
    endIndex: number, 
    fileName: string
  ): Chunk {
    const tokenCount = this.estimateTokenCount(content);
    
    // Extract chapter information if available
    const chapterMatch = content.match(/(?:chapter|section|part)\s+(\d+|[ivx]+)/i);
    const chapter = chapterMatch ? chapterMatch[1] : undefined;
    
    // Determine content type based on patterns
    let type: Chunk['metadata']['type'] = 'concept';
    if (content.includes('=') || content.includes('formula') || content.includes('equation')) {
      type = 'formula';
    } else if (content.match(/\b(?:is|are|means?|refers to|defined as)\b/i)) {
      type = 'definition';
    } else if (content.match(/\b(?:for example|e\.g\.|such as)\b/i)) {
      type = 'example';
    } else if (content.match(/\b(?:summary|conclusion|overview)\b/i)) {
      type = 'summary';
    }

    return {
      id: `${fileName}_chunk_${index}`,
      content,
      metadata: {
        chapter,
        page: Math.floor(startIndex / 2000) + 1, // Rough page estimation
        startIndex,
        endIndex,
        tokenCount,
        type
      }
    };
  }

  private deduplicateChunks(chunks: Chunk[]): Chunk[] {
    const uniqueChunks: Chunk[] = [];
    const seenContent = new Set<string>();

    for (const chunk of chunks) {
      const normalizedContent = chunk.content.toLowerCase().trim();
      if (!seenContent.has(normalizedContent)) {
        seenContent.add(normalizedContent);
        uniqueChunks.push(chunk);
      }
    }

    return uniqueChunks;
  }

  // Generate embeddings using a simple text-based approach
  // In production, this would use OpenAI, Cohere, or similar service
  async generateEmbedding(text: string): Promise<number[]> {
    const cacheKey = `embedding_${text.slice(0, 100)}`;
    
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey)!;
    }

    // Simple hash-based embedding for demo purposes
    // In production, use actual embedding service
    const embedding = this.simpleTextEmbedding(text);
    
    this.embeddingCache.set(cacheKey, embedding);
    return embedding;
  }

  private simpleTextEmbedding(text: string): number[] {
    // Simple hash-based embedding (not production-ready)
    // In production, use OpenAI text-embedding-ada-002 or similar
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0); // Standard embedding dimension
    
    words.forEach(word => {
      const hash = this.simpleHash(word);
      const index = hash % 384;
      embedding[index] += 1;
    });
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
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

  // Vector similarity search
  async searchSimilarChunks(
    query: string, 
    chunks: Chunk[], 
    topK: number = 5,
    filters?: {
      chapter?: string;
      type?: string;
      pageRange?: { from: number; to: number };
    }
  ): Promise<VectorSearchResult[]> {
    console.log('🔍 Embedding Service: Searching for query:', query);
    console.log('🔍 Searching in', chunks.length, 'chunks, topK:', topK);
    console.log('🔍 Filters:', filters);
    
    const queryEmbedding = await this.generateEmbedding(query);
    const results: VectorSearchResult[] = [];

    for (const chunk of chunks) {
      // Apply filters
      if (filters) {
        if (filters.chapter && chunk.metadata.chapter !== filters.chapter) continue;
        if (filters.type && chunk.metadata.type !== filters.type) continue;
        if (filters.pageRange) {
          const page = chunk.metadata.page || 1;
          if (page < filters.pageRange.from || page > filters.pageRange.to) continue;
        }
      }

      // Generate embedding for chunk if not already cached
      if (!chunk.embedding) {
        chunk.embedding = await this.generateEmbedding(chunk.content);
      }

      // Calculate cosine similarity
      const similarity = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      
      results.push({
        chunk,
        similarity,
        score: similarity
      });
    }

    // Sort by similarity and return top-K
    const sortedResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    console.log('🔍 Found', sortedResults.length, 'relevant chunks');
    console.log('🔍 Top similarities:', sortedResults.map(r => r.similarity.toFixed(3)));
    
    return sortedResults;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Clear cache for a specific document
  clearCache(fileName: string): void {
    this.chunkCache.delete(`chunks_${fileName}`);
    // Clear related embeddings
    for (const [key, value] of this.embeddingCache.entries()) {
      if (key.includes(fileName)) {
        this.embeddingCache.delete(key);
      }
    }
  }

  // Get cached chunks for a document
  getCachedChunks(fileName: string): Chunk[] | null {
    return this.chunkCache.get(`chunks_${fileName}`) || null;
  }
}

export const embeddingService = EmbeddingService.getInstance();
