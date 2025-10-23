import React from 'react';
import type { Flashcard } from '../types';
import { WarningIcon, ChatBubbleIcon, CheckIcon } from './icons/AppIcons';

interface RevisionViewProps {
  reviseCards: Flashcard[];
  onStartChat: (card: Flashcard) => void;
  onMarkAsKnown: (cardId: string) => void;
}

const RevisionView: React.FC<RevisionViewProps> = ({ reviseCards, onStartChat, onMarkAsKnown }) => {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Revision Hub</h1>
        <p className="text-slate-500 dark:text-slate-400">Review your weak spots and chat with an AI tutor to understand them better.</p>
      </header>
      
      <section>
        <div className="flex items-center mb-4">
          <WarningIcon className={`w-8 h-8 mr-3 text-yellow-400`} />
          <h2 className="text-2xl font-bold">Weak Spots</h2>
          <span className="ml-auto text-lg font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full px-3 py-1">
            {reviseCards.length}
          </span>
        </div>
        
        {reviseCards.length === 0 ? (
          <div className="text-center py-10 px-6 bg-white dark:bg-brand-surface rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">Cards you swipe left will appear here. Great job keeping this list empty!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviseCards.map(card => (
              <div key={card.id} className="bg-white dark:bg-brand-surface rounded-lg shadow p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 flex-wrap">
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex-1 min-w-[150px]">{card.question}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={() => onStartChat(card)}
                    className="flex-shrink-0 flex items-center gap-2 bg-brand-primary hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    <ChatBubbleIcon className="w-5 h-5" />
                    Discuss
                  </button>
                   <button 
                    onClick={() => onMarkAsKnown(card.id)}
                    className="flex-shrink-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Gotcha!
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RevisionView;
