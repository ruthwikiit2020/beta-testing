import React, { useRef, useEffect } from 'react';
import FlashcardStack, { FlashcardStackRef } from './FlashcardStack';
import type { Flashcard, ChapterDeck } from '../types';
import { XIcon, CheckIcon, UndoIcon } from './icons/AppIcons';
import ChapterList from './ChapterList';
import { soundManager } from '../utils/sounds';

interface StudyViewProps {
  pdfName: string;
  decks: ChapterDeck[];
  currentDeck: ChapterDeck;
  currentDeckIndex: number;
  onSelectChapter: (index: number) => void;
  onSwipeLeft: (card: Flashcard) => void;
  onSwipeRight: (card: Flashcard) => void;
  lastAction: { card: any; type: string } | null;
  onUndo: () => void;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; className: string; label: string }> = ({ onClick, children, className, label }) => (
    <div className="flex flex-col items-center gap-2">
      <button onClick={onClick} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${className}`}>
        {children}
      </button>
      <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    </div>
);


const StudyView: React.FC<StudyViewProps> = ({ 
  pdfName,
  decks, 
  currentDeck, 
  currentDeckIndex, 
  onSelectChapter,
  onSwipeLeft, 
  onSwipeRight, 
  lastAction, 
  onUndo,
}) => {
  const stackRef = useRef<FlashcardStackRef>(null);
  
  if (!currentDeck) {
    return (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <h2 className="text-2xl font-semibold">No Deck Selected</h2>
            <p className="mt-2">Please go to "My Decks" to choose a deck to study.</p>
        </div>
    );
  }

  // Removed shuffle sound for chapter selection

  const handleActionClick = async (direction: 'left' | 'right') => {
      // Play sound effect
      if (direction === 'left') {
        await soundManager.playSwipeLeft();
      } else {
        await soundManager.playSwipeRight();
      }
      stackRef.current?.swipe(direction);
  }

  return (
    <div className="grid md:grid-cols-12 gap-x-8 max-w-screen-xl mx-auto px-4 min-h-screen">
      {/* Integrated Chapter Sidebar for Desktop */}
      <aside className="hidden md:block md:col-span-4 lg:col-span-3">
         <div className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-slate-800 rounded-xl p-4 h-screen flex flex-col sticky top-4">
           <h2 className="text-xl font-bold mb-1 truncate text-slate-800 dark:text-slate-200" title={pdfName}>{pdfName}</h2>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Chapters</p>
           <div className="overflow-y-auto pr-2 flex-grow min-h-0">
            <ChapterList 
                decks={decks}
                currentDeckIndex={currentDeckIndex}
                onSelectChapter={onSelectChapter}
            />
           </div>
         </div>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-8 lg:col-span-9 flex flex-col items-center min-h-screen">
        {/* Mobile Chapter Selector Dropdown */}
        <div className="w-full max-w-sm md:hidden mb-4">
            <select
              value={currentDeckIndex}
              onChange={(e) => onSelectChapter(Number(e.target.value))}
              className="w-full bg-white dark:bg-brand-surface border border-slate-300 dark:border-slate-700 rounded-lg p-3 font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-primary focus:outline-none"
            >
              {decks.map((deck, index) => (
                <option key={index} value={index}>
                  {deck.chapterTitle}
                </option>
              ))}
            </select>
        </div>

        <div className="flex justify-between items-center w-full max-w-sm">
            <button
                onClick={onUndo}
                disabled={!lastAction}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-slate-200 dark:hover:enabled:bg-slate-700 transition-colors"
                aria-label="Undo last swipe"
            >
                <UndoIcon className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-bold hidden md:block">{currentDeck.chapterTitle}</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{currentDeck.flashcards.length} cards remaining</p>
            </div>
             <div className="w-10 h-10"></div> {/* Spacer */}
        </div>
            
        <div className="flex-1 flex items-center justify-center w-full mt-4 max-h-[60vh]">
            <FlashcardStack
                ref={stackRef}
                key={currentDeckIndex} 
                cards={currentDeck.flashcards}
                onSwipeLeft={onSwipeLeft}
                onSwipeRight={onSwipeRight}
            />
        </div>

        <div className="mt-6 flex justify-center items-center w-full max-w-sm mx-auto gap-8 pb-8">
            <ActionButton onClick={() => handleActionClick('left')} className="bg-brand-secondary" label="Revise">
                <XIcon className="w-8 h-8 text-white" />
            </ActionButton>
            <ActionButton onClick={() => handleActionClick('right')} className="bg-brand-primary" label="Know it">
                <CheckIcon className="w-8 h-8 text-white" />
            </ActionButton>
        </div>
      </main>
    </div>
  );
};

export default StudyView;
