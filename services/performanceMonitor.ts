// Performance Monitor for RAG Pipeline
// Tracks latency, API calls, and optimization metrics

export interface PerformanceMetrics {
  totalTime: number;
  chunkingTime: number;
  embeddingTime: number;
  retrievalTime: number;
  generationTime: number;
  tokensUsed: number;
  chunksProcessed: number;
  chunksRetrieved: number;
  cacheHits: number;
  cacheMisses: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private currentSession: Partial<PerformanceMetrics> = {};

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startSession(): void {
    this.currentSession = {
      totalTime: Date.now(),
      tokensUsed: 0,
      chunksProcessed: 0,
      chunksRetrieved: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }

  recordChunkingTime(time: number): void {
    this.currentSession.chunkingTime = time;
  }

  recordEmbeddingTime(time: number): void {
    this.currentSession.embeddingTime = time;
  }

  recordRetrievalTime(time: number): void {
    this.currentSession.retrievalTime = time;
  }

  recordGenerationTime(time: number): void {
    this.currentSession.generationTime = time;
  }

  recordTokensUsed(tokens: number): void {
    this.currentSession.tokensUsed = (this.currentSession.tokensUsed || 0) + tokens;
  }

  recordChunksProcessed(chunks: number): void {
    this.currentSession.chunksProcessed = (this.currentSession.chunksProcessed || 0) + chunks;
  }

  recordChunksRetrieved(chunks: number): void {
    this.currentSession.chunksRetrieved = (this.currentSession.chunksRetrieved || 0) + chunks;
  }

  recordCacheHit(): void {
    this.currentSession.cacheHits = (this.currentSession.cacheHits || 0) + 1;
  }

  recordCacheMiss(): void {
    this.currentSession.cacheMisses = (this.currentSession.cacheMisses || 0) + 1;
  }

  endSession(): PerformanceMetrics {
    const endTime = Date.now();
    const totalTime = endTime - (this.currentSession.totalTime || endTime);
    
    const metrics: PerformanceMetrics = {
      totalTime,
      chunkingTime: this.currentSession.chunkingTime || 0,
      embeddingTime: this.currentSession.embeddingTime || 0,
      retrievalTime: this.currentSession.retrievalTime || 0,
      generationTime: this.currentSession.generationTime || 0,
      tokensUsed: this.currentSession.tokensUsed || 0,
      chunksProcessed: this.currentSession.chunksProcessed || 0,
      chunksRetrieved: this.currentSession.chunksRetrieved || 0,
      cacheHits: this.currentSession.cacheHits || 0,
      cacheMisses: this.currentSession.cacheMisses || 0
    };

    this.metrics.push(metrics);
    this.currentSession = {};
    
    console.log('Performance Metrics:', metrics);
    return metrics;
  }

  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {};

    const totals = this.metrics.reduce((acc, metric) => {
      Object.keys(metric).forEach(key => {
        acc[key] = (acc[key] || 0) + metric[key as keyof PerformanceMetrics];
      });
      return acc;
    }, {} as any);

    const averages: Partial<PerformanceMetrics> = {};
    Object.keys(totals).forEach(key => {
      averages[key as keyof PerformanceMetrics] = totals[key] / this.metrics.length;
    });

    return averages;
  }

  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const avg = this.getAverageMetrics();

    if (avg.embeddingTime && avg.embeddingTime > 2000) {
      suggestions.push('Consider caching embeddings to reduce embedding time');
    }

    if (avg.retrievalTime && avg.retrievalTime > 1000) {
      suggestions.push('Consider optimizing vector search with better indexing');
    }

    if (avg.tokensUsed && avg.tokensUsed > 10000) {
      suggestions.push('Consider using more aggressive chunk filtering to reduce token usage');
    }

    if (avg.cacheHits && avg.cacheMisses) {
      const hitRate = avg.cacheHits / (avg.cacheHits + avg.cacheMisses);
      if (hitRate < 0.5) {
        suggestions.push('Low cache hit rate - consider improving caching strategy');
      }
    }

    return suggestions;
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
