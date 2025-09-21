import React, { useState } from 'react';
import type { UserDeck } from '../types';
import FileUpload from './FileUpload';
import UsageIndicator from './UsageIndicator';
import { BookOpenIcon, UploadIcon, ArrowRightIcon } from './icons/AppIcons';

// Reset icon component
const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Delete icon component
const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

interface MyDecksViewProps {
  decks: UserDeck[];
  onSelectDeck: (deckId: string) => void;
  onGenerate: (text: string, fileName: string, filters: any, totalPages: number, onProgress: (p: number, s: string) => void) => void;
  onResetDeck: (deckId: string) => void;
  onDeleteDeck: (deckId: string) => void;
  isLoading: boolean;
  error: string | null;
  isFromCache?: boolean;
}

const MyDecksView: React.FC<MyDecksViewProps> = ({ decks, onSelectDeck, onGenerate, onResetDeck, onDeleteDeck, isLoading, error, isFromCache }) => {
  const [showUpload, setShowUpload] = useState(false);
  
  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
      });
  }

  if (showUpload || decks.length === 0) {
      return (
          <div className="min-h-full flex flex-col items-center justify-center p-4">
              {!isLoading && <FileUpload onGenerate={(text, fileName, filters, totalPages, onProgress) => onGenerate(text, fileName, filters, totalPages, onProgress)} isLoading={isLoading} />}
              {isLoading && (
                  <div className="text-center">
                      <div className="animate-spin h-8 w-8 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">
                        {isFromCache ? '⚡ Loading from cache...' : '🧠 Processing with RAG pipeline...'}
                      </p>
                  </div>
              )}
              {error && <p className="text-red-500 dark:text-red-400 mt-4 text-center">{error}</p>}
              {decks.length > 0 && !isLoading && (
                  <button onClick={() => setShowUpload(false)} className="mt-4 text-sm font-semibold text-brand-primary hover:underline">
                      Back to My Decks
                  </button>
              )}
          </div>
      )
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">My Decks</h1>
            <p className="text-slate-500 dark:text-slate-400">Select a deck to study or upload a new one.</p>
        </div>
        <button 
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-brand-primary hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md"
        >
          <UploadIcon className="w-5 h-5" />
          Add New Deck
        </button>
      </header>

      {/* Usage Indicators */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <UsageIndicator type="pdfUploads" />
        <UsageIndicator type="flashcards" />
        <UsageIndicator type="revisionHub" />
      </div>
      
      <div className="space-y-4">
        {decks.map(deck => (
            <div 
              key={deck.id} 
              className="w-full bg-white dark:bg-brand-surface rounded-lg shadow p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 hover:border-brand-primary dark:hover:border-brand-primary transition-colors"
            >
              <button 
                onClick={() => onSelectDeck(deck.id)}
                className="flex items-center gap-4 flex-1 text-left"
              >
                <BookOpenIcon className="w-8 h-8 text-brand-primary flex-shrink-0" />
                <div>
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-200 truncate" title={deck.pdfName}>{deck.pdfName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Created on {formatDate(deck.createdAt)}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {deck.knownCards.length + deck.reviseCards.length > 0 
                        ? `${deck.knownCards.length} known, ${deck.reviseCards.length} to revise`
                        : 'Ready to study'
                      }
                    </p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Reset button clicked for deck:', deck.id);
                    onResetDeck(deck.id);
                  }}
                  className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                  title="Reset deck progress"
                >
                  <ResetIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete "${deck.pdfName}"? This action cannot be undone.`)) {
                      console.log('Delete button clicked for deck:', deck.id);
                      onDeleteDeck(deck.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete deck"
                >
                  <DeleteIcon className="w-5 h-5" />
                </button>
                <ArrowRightIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default MyDecksView;
