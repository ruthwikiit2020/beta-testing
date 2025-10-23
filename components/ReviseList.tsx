
import React, { useState } from 'react';
import type { Flashcard as FlashcardType } from '../types';
import CheckIcon from './icons/CheckIcon';

interface ReviseListProps {
  cards: FlashcardType[];
  onMarkAsKnown: (cardId: string) => void;
}

const ReviseCard: React.FC<{ card: FlashcardType; onMarkAsKnown: (cardId: string) => void; }> = ({ card, onMarkAsKnown }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 border border-slate-700 flex flex-col gap-4">
      <div 
        className="cursor-pointer flex-grow min-h-[100px] flex items-center justify-center text-center"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <p className="text-lg">{isFlipped ? card.answer : card.question}</p>
      </div>
      <button 
        onClick={() => onMarkAsKnown(card.id)}
        className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        <CheckIcon className="w-5 h-5" />
        Mark as Known
      </button>
    </div>
  );
};

const ReviseList: React.FC<ReviseListProps> = ({ cards, onMarkAsKnown }) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <h3 className="text-2xl font-bold mb-2">Nothing to Revise!</h3>
        <p>You haven't saved any cards for revision yet. Great job!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map(card => (
        <ReviseCard key={card.id} card={card} onMarkAsKnown={onMarkAsKnown} />
      ))}
    </div>
  );
};

export default ReviseList;
