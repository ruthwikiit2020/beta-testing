// PDF Cache Service for storing and retrieving processed PDFs
import { db } from './firebase';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';

export interface PDFCacheEntry {
  id: string;
  contentHash: string;
  fileName: string;
  totalPages: number;
  textLength: number;
  chapterDecks: any[];
  processedAt: string;
  userId: string;
  filtersKey: string;
  metadata: {
    filters: any;
    processingTime: number;
    chunkCount: number;
  };
}

export interface PDFProcessingResult {
  chapterDecks: any[];
  isFromCache: boolean;
  processingTime: number;
  metadata: any;
}

class PDFCacheService {
  private cache = new Map<string, PDFCacheEntry>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.loadCacheFromStorage();
  }

  // Generate a content hash for PDF text
  generateContentHash(text: string, fileName: string, filters?: any): string {
    const content = `${fileName}:${text.length}:${text.slice(0, 1000)}:${text.slice(-1000)}`;
    let hashContent = content;
    
    // Include filters in hash if provided
    if (filters) {
      const filtersString = JSON.stringify(filters, Object.keys(filters).sort());
      hashContent += `:${filtersString}`;
    }
    
    return this.simpleHash(hashContent);
  }

  // Simple hash function
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Check if PDF is already processed
  async checkCache(
    contentHash: string, 
    userId: string, 
    filters: any
  ): Promise<PDFCacheEntry | null> {
    try {
      // Check memory cache first (include filters in key)
      const filtersKey = filters ? JSON.stringify(filters, Object.keys(filters).sort()) : 'default';
      const memoryKey = `${userId}:${contentHash}:${filtersKey}`;
      const memoryEntry = this.cache.get(memoryKey);
      
      if (memoryEntry && this.isCacheValid(memoryEntry)) {
        console.log('📋 PDF found in memory cache with filters:', memoryEntry.metadata.filters);
        return memoryEntry;
      }

      // Check Firestore cache (with error handling)
      try {
        const cacheQuery = query(
          collection(db, 'pdfCache'),
          where('contentHash', '==', contentHash),
          where('userId', '==', userId),
          where('filtersKey', '==', filtersKey)
        );

        const snapshot = await getDocs(cacheQuery);
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const entry = doc.data() as PDFCacheEntry;
          
          if (this.isCacheValid(entry)) {
            console.log('📋 PDF found in Firestore cache with filters:', entry.metadata.filters);
            // Store in memory cache for faster access
            this.cache.set(memoryKey, entry);
            return entry;
          } else {
            // Remove expired entry
            await this.removeCacheEntry(doc.id);
          }
        }
      } catch (firestoreError) {
        console.warn('⚠️ Firestore cache check failed, using memory cache only:', firestoreError);
        // Continue with memory cache only
      }

      return null;
    } catch (error) {
      console.error('Error checking cache:', error);
      return null;
    }
  }

  // Store processed PDF in cache
  async storeCache(
    contentHash: string,
    userId: string,
    fileName: string,
    totalPages: number,
    textLength: number,
    chapterDecks: any[],
    filters: any,
    processingTime: number
  ): Promise<void> {
    try {
      const filtersKey = filters ? JSON.stringify(filters, Object.keys(filters).sort()) : 'default';
      const entry: PDFCacheEntry = {
        id: `${userId}:${contentHash}:${filtersKey}`,
        contentHash,
        fileName,
        totalPages,
        textLength,
        chapterDecks,
        processedAt: new Date().toISOString(),
        userId,
        filtersKey,
        metadata: {
          filters,
          processingTime,
          chunkCount: chapterDecks.reduce((sum, deck) => sum + deck.flashcards.length, 0)
        }
      };

      // Store in memory cache (include filters in key)
      const memoryKey = `${userId}:${contentHash}:${filtersKey}`;
      this.cache.set(memoryKey, entry);

      // Store in Firestore (with error handling)
      try {
        await setDoc(doc(db, 'pdfCache', entry.id), entry);
        console.log('💾 PDF cached successfully in Firestore');
      } catch (firestoreError) {
        console.warn('⚠️ Failed to store in Firestore, using memory cache only:', firestoreError);
        // Continue with memory cache only
      }

      // Save to localStorage as backup
      this.saveCacheToStorage();
      
    } catch (error) {
      console.error('Error storing cache:', error);
    }
  }

  // Check if cache entry is still valid
  private isCacheValid(entry: PDFCacheEntry): boolean {
    const now = new Date().getTime();
    const processedAt = new Date(entry.processedAt).getTime();
    return (now - processedAt) < this.CACHE_TTL;
  }

  // Remove expired cache entry
  private async removeCacheEntry(docId: string): Promise<void> {
    try {
      // Note: In a real implementation, you'd delete from Firestore
      // For now, we'll just log it
      console.log('🗑️ Removing expired cache entry:', docId);
    } catch (error) {
      console.error('Error removing cache entry:', error);
    }
  }

  // Load cache from localStorage on initialization
  private loadCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem('pdfCache');
      if (stored) {
        const entries = JSON.parse(stored);
        Object.entries(entries).forEach(([key, entry]) => {
          if (this.isCacheValid(entry as PDFCacheEntry)) {
            this.cache.set(key, entry as PDFCacheEntry);
          }
        });
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  }

  // Save cache to localStorage
  private saveCacheToStorage(): void {
    try {
      const entries = Object.fromEntries(this.cache);
      localStorage.setItem('pdfCache', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  // Get cache statistics
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }

  // Clear all cache
  clearCache(): void {
    this.cache.clear();
    localStorage.removeItem('pdfCache');
  }
}

export const pdfCacheService = new PDFCacheService();
