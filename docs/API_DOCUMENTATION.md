# API Documentation

## Overview

ReWise AI uses several APIs for different functionalities. This document provides comprehensive information about all API integrations, endpoints, and usage patterns.

## Google Gemini AI API

### Base Configuration
```typescript
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-1.5-flash';
```

### Authentication
```typescript
const headers = {
  'Content-Type': 'application/json',
  'x-goog-api-key': process.env.VITE_GEMINI_API_KEY
};
```

### Endpoints

#### 1. Generate Flashcards
```typescript
POST /v1beta/models/gemini-1.5-flash:generateContent
```

**Request Body:**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Generate flashcards from the following content: [PDF_TEXT]"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 2048
  }
}
```

**Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Generated flashcards in JSON format"
          }
        ]
      }
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 1500,
    "candidatesTokenCount": 500,
    "totalTokenCount": 2000
  }
}
```

#### 2. Chat with AI Tutor
```typescript
POST /v1beta/models/gemini-1.5-flash:generateContent
```

**Request Body:**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "You are an AI tutor. User question: [USER_QUESTION]"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.8,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 1024
  }
}
```

### Rate Limits
- **Requests per minute**: 60
- **Tokens per minute**: 32,000
- **Daily quota**: 1,500 requests

### Error Handling
```typescript
interface GeminiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

// Common error codes:
// 400: Bad Request
// 401: Unauthorized
// 403: Forbidden (quota exceeded)
// 429: Too Many Requests
// 500: Internal Server Error
```

## Firebase API

### Authentication

#### Google Sign-In
```typescript
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
```

#### Sign Out
```typescript
import { signOut } from 'firebase/auth';

await signOut(auth);
```

### Firestore Database

#### User Data Structure
```typescript
interface UserData {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  decks: Deck[];
  progress: ProgressData;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Deck {
  id: string;
  pdfName: string;
  pdfUrl: string;
  totalPages: number;
  flashcardDecks: ChapterDeck[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ChapterDeck {
  chapterTitle: string;
  flashcards: Flashcard[];
  knownCards: string[];
  reviseCards: string[];
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}
```

#### CRUD Operations

**Create User Document:**
```typescript
import { doc, setDoc } from 'firebase/firestore';

await setDoc(doc(db, 'users', userId), userData);
```

**Read User Document:**
```typescript
import { doc, getDoc } from 'firebase/firestore';

const userDoc = await getDoc(doc(db, 'users', userId));
const userData = userDoc.data();
```

**Update User Document:**
```typescript
import { doc, updateDoc } from 'firebase/firestore';

await updateDoc(doc(db, 'users', userId), {
  updatedAt: serverTimestamp(),
  // ... other fields
});
```

**Delete User Document:**
```typescript
import { doc, deleteDoc } from 'firebase/firestore';

await deleteDoc(doc(db, 'users', userId));
```

### Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for app configuration
    match /config/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## RAG Pipeline API

### Internal API Endpoints

#### 1. Process PDF
```typescript
POST /api/process-pdf
```

**Request:**
```typescript
interface ProcessPDFRequest {
  pdfText: string;
  fileName: string;
  filters: FlashcardFilters;
  totalPages: number;
}
```

**Response:**
```typescript
interface ProcessPDFResponse {
  success: boolean;
  data?: {
    chapters: ChapterDeck[];
    processingTime: number;
    tokensUsed: number;
  };
  error?: string;
}
```

#### 2. Generate Query
```typescript
POST /api/generate-query
```

**Request:**
```typescript
interface GenerateQueryRequest {
  filters: FlashcardFilters;
  documentType: string;
  contentLength: number;
}
```

**Response:**
```typescript
interface GenerateQueryResponse {
  query: string;
  context: string;
  targetCards: number;
}
```

#### 3. Retrieve Context
```typescript
POST /api/retrieve-context
```

**Request:**
```typescript
interface RetrieveContextRequest {
  query: string;
  documentId: string;
  topK: number;
}
```

**Response:**
```typescript
interface RetrieveContextResponse {
  chunks: Chunk[];
  relevanceScores: number[];
  totalChunks: number;
}
```

### Performance Monitoring

#### Metrics Endpoint
```typescript
GET /api/metrics
```

**Response:**
```typescript
interface MetricsResponse {
  totalRequests: number;
  averageProcessingTime: number;
  cacheHitRate: number;
  errorRate: number;
  tokensUsed: number;
  costEstimate: number;
}
```

## Subscription Service API

### Internal Service Methods

#### 1. Check Feature Access
```typescript
subscriptionService.canUseFeature(feature: string): boolean
```

**Features:**
- `uploadPdf`: PDF upload functionality
- `generateFlashcards`: Flashcard generation
- `saveToRevisionHub`: Revision hub access
- `useSmartFilters`: Smart filter access

#### 2. Record Usage
```typescript
subscriptionService.recordUsage(action: string, count: number): void
```

**Actions:**
- `uploadPdf`: PDF upload
- `generateFlashcards`: Flashcard generation
- `saveToRevisionHub`: Revision hub usage

#### 3. Get Usage Stats
```typescript
subscriptionService.getUsageStats(): UsageStats
```

**Response:**
```typescript
interface UsageStats {
  pdfUploadsToday: number;
  flashcardsThisMonth: number;
  revisionHubCards: number;
  currentPdfCount: number;
}
```

## Error Handling

### Standard Error Response
```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId: string;
}
```

### Error Codes
```typescript
enum ErrorCodes {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // Resource
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // External Services
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  API_KEY_INVALID = 'API_KEY_INVALID',
  
  // Internal
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  PROCESSING_ERROR = 'PROCESSING_ERROR'
}
```

## Rate Limiting

### Client-Side Rate Limiting
```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(key: string, limit: number, window: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < window);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}
```

### Server-Side Rate Limiting
```typescript
// Using Firebase Functions with rate limiting
import { onCall, HttpsError } from 'firebase-functions/v2/https';

export const processPDF = onCall({
  rateLimit: {
    maxRequests: 10,
    periodSeconds: 60
  }
}, async (request) => {
  // Implementation
});
```

## Testing

### Unit Tests
```typescript
// Example test for API service
describe('GeminiService', () => {
  it('should generate flashcards successfully', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{ text: '{"flashcards": []}' }]
        }
      }]
    };
    
    // Mock API call
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(mockResponse)
    });
    
    const result = await generateFlashcards('test content');
    expect(result).toBeDefined();
  });
});
```

### Integration Tests
```typescript
// Example integration test
describe('PDF Processing Flow', () => {
  it('should process PDF end-to-end', async () => {
    const pdfText = 'Sample PDF content';
    const filters = { contentType: ['definitions'] };
    
    const result = await processPDF(pdfText, 'test.pdf', filters);
    
    expect(result.success).toBe(true);
    expect(result.data.chapters).toBeDefined();
  });
});
```

## Monitoring & Logging

### Request Logging
```typescript
interface RequestLog {
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  requestId: string;
}
```

### Error Logging
```typescript
interface ErrorLog {
  timestamp: string;
  error: APIError;
  requestId: string;
  userId?: string;
  stackTrace?: string;
}
```

### Performance Metrics
```typescript
interface PerformanceMetrics {
  endpoint: string;
  averageResponseTime: number;
  p95ResponseTime: number;
  errorRate: number;
  requestsPerMinute: number;
}
```

---

*This API documentation is updated regularly to reflect current implementations and changes.*
