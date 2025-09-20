# RAG Pipeline Architecture Documentation

## Overview

The RAG (Retrieval-Augmented Generation) pipeline in ReWise AI is designed to optimize flashcard generation by processing only the most relevant content from PDFs, reducing API costs and improving response times.

## Architecture Diagram

```
PDF Upload → Text Extraction → Semantic Chunking → Embedding Generation → Vector Storage
     ↓
User Filters → Query Generation → Vector Search → Context Retrieval → LLM Generation
     ↓
Response Processing → Flashcard Parsing → Chapter Organization → User Interface
```

## Core Components

### 1. Embedding Service (`services/embeddingService.ts`)

**Purpose**: Generates semantic embeddings for PDF content chunks

**Key Features**:
- **Semantic Chunking**: Splits content into 200-400 token chunks with 12.5% overlap
- **Deduplication**: Removes redundant chunks to optimize storage
- **Embedding Generation**: Creates vector representations using text-embedding-ada-002
- **Caching**: Stores embeddings for faster retrieval

**Configuration**:
```typescript
const CHUNK_SIZE = 400;
const OVERLAP = 50; // 12.5% overlap
const MAX_CHUNKS_PER_CHAPTER = 20;
```

### 2. RAG Pipeline (`services/ragPipeline.ts`)

**Purpose**: Orchestrates the entire RAG process from query to response

**Key Features**:
- **Dynamic Configuration**: Adjusts settings based on document size
- **Query Optimization**: Generates context-aware queries from user filters
- **Context Retrieval**: Retrieves top-K most relevant chunks
- **Response Generation**: Uses LLM to generate flashcards from context

**Configuration Tiers**:

#### Small Documents (< 50 pages)
```typescript
const defaultConfig = {
  topK: 3,                    // Retrieve 3 most relevant chunks
  maxTokens: 2000,           // Max context window
  batchSize: 5,              // Process 5 chunks at once
  maxChunksPerChapter: 10,   // Max chunks per chapter
  enablePagination: false,   // No pagination needed
  maxMemoryChunks: 50,       // Max chunks in memory
  enableProgressiveLoading: false
};
```

#### Large Documents (≥ 50 pages)
```typescript
const largeDocumentConfig = {
  topK: 5,                    // Retrieve 5 most relevant chunks
  maxTokens: 4000,           // Larger context window
  batchSize: 10,             // Process 10 chunks at once
  maxChunksPerChapter: 20,   // More chunks per chapter
  enablePagination: true,    // Enable pagination
  maxMemoryChunks: 100,      // More chunks in memory
  enableProgressiveLoading: true
};
```

### 3. Performance Monitor (`services/performanceMonitor.ts`)

**Purpose**: Tracks and optimizes pipeline performance

**Metrics Tracked**:
- **Processing Time**: Total time for flashcard generation
- **Token Usage**: Input and output tokens consumed
- **Cache Hit Rate**: Percentage of cached responses
- **Chunk Efficiency**: Chunks processed vs. chunks used
- **Memory Usage**: Memory consumption during processing

## Optimization Strategies

### 1. Content Filtering
- **Relevance Scoring**: Chunks are scored based on query relevance
- **Context Ranking**: Higher-ranked chunks are prioritized
- **Duplicate Removal**: Redundant content is filtered out

### 2. Query Optimization
- **Filter-Based Queries**: Queries are generated based on user-selected filters
- **Context-Aware Search**: Queries consider document structure and content type
- **Semantic Matching**: Uses vector similarity for content retrieval

### 3. Memory Management
- **Chunk Streaming**: Large documents are processed in chunks
- **Memory Cleanup**: Unused chunks are removed from memory
- **Progressive Loading**: Content is loaded as needed

### 4. Caching Strategy
- **Embedding Cache**: Embeddings are cached for reuse
- **Response Cache**: Similar queries return cached responses
- **Context Cache**: Frequently accessed contexts are cached

## Performance Metrics

### Current Performance
- **Small PDF (10 pages)**: 5-10 seconds, ~6,500 tokens
- **Medium PDF (50 pages)**: 10-20 seconds, ~32,500 tokens
- **Large PDF (200 pages)**: 20-40 seconds, ~130,000 tokens

### Optimization Targets
- **Small PDF**: < 5 seconds, < 5,000 tokens
- **Medium PDF**: < 10 seconds, < 25,000 tokens
- **Large PDF**: < 20 seconds, < 100,000 tokens

## Cost Analysis

### Token Usage by Document Size
- **10 pages**: ~6,500 input + 2,000 output = $0.0005
- **50 pages**: ~32,500 input + 5,000 output = $0.0025
- **200 pages**: ~130,000 input + 10,000 output = $0.01

### Scaling Projections
- **1,000 users (Free)**: ~$20/day, ~$600/month
- **500 users (Pro)**: ~$25/day, ~$750/month
- **100 users (Flash)**: ~$15/day, ~$450/month

## Future Improvements

### 1. Advanced Caching
- **Redis Integration**: Distributed caching for better performance
- **CDN Integration**: Global content delivery
- **Smart Prefetching**: Predict and cache likely queries

### 2. Model Optimization
- **Fine-tuned Models**: Custom models for flashcard generation
- **Quantization**: Reduce model size and inference time
- **Distillation**: Smaller, faster models with similar quality

### 3. Infrastructure Scaling
- **Horizontal Scaling**: Multiple processing nodes
- **Load Balancing**: Distribute processing across servers
- **Auto-scaling**: Dynamic resource allocation based on demand

## Troubleshooting

### Common Issues
1. **Memory Overflow**: Reduce `maxMemoryChunks` or enable `enableProgressiveLoading`
2. **Timeout Errors**: Increase `maxTokens` or reduce `batchSize`
3. **Poor Quality**: Increase `topK` or improve query generation
4. **Slow Processing**: Enable caching or reduce chunk size

### Debug Tools
- **Performance Logs**: Detailed timing and token usage
- **Cache Statistics**: Hit rates and cache efficiency
- **Memory Monitoring**: Real-time memory usage tracking
- **Error Tracking**: Comprehensive error logging and reporting
