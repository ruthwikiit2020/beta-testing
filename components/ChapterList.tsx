import React from 'react';
import type { ChapterDeck } from '../types';

interface ChapterListProps {
  decks: ChapterDeck[];
  currentDeckIndex: number;
  onSelectChapter: (index: number) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({ decks, currentDeckIndex, onSelectChapter }) => {
  return (
    <nav className="flex flex-col gap-2">
      {decks.map((deck, index) => (
        <button
          key={index}
          onClick={() => onSelectChapter(index)}
          className={`w-full text-left p-3 rounded-lg transition-colors text-sm font-semibold truncate ${
            index === currentDeckIndex
              ? 'bg-green-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          {deck.chapterTitle}
        </button>
      ))}
    </nav>
  );
};

export default ChapterList;
