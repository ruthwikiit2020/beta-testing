
import React from 'react';
import type { ChapterDeck } from '../types';
import DeckIcon from './icons/DeckIcon';
import SaveIcon from './icons/SaveIcon';

interface DashboardProps {
  decks: ChapterDeck[];
  knownCount: number;
  reviseCount: number;
  activeView: 'deck' | 'revise';
  setActiveView: (view: 'deck' | 'revise') => void;
  currentDeckIndex: number;
  setCurrentDeckIndex: (index: number) => void;
}

const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="bg-slate-800 p-4 rounded-lg flex-1 text-center border border-slate-700">
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({
  decks,
  knownCount,
  reviseCount,
  activeView,
  setActiveView,
  currentDeckIndex,
  setCurrentDeckIndex,
}) => {
  const totalCards = decks.reduce((sum, deck) => sum + deck.flashcards.length, 0);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Stats */}
      <div className="flex flex-col md:flex-row gap-4">
        <StatCard label="Total Flashcards" value={totalCards} color="text-cyan-400" />
        <StatCard label="Known" value={knownCount} color="text-slate-300" />
        <StatCard label="To Revise" value={reviseCount} color="text-amber-400" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800 p-2 rounded-lg border border-slate-700">
         {/* Deck Selector */}
        <div className="flex-grow">
            <select
              value={currentDeckIndex}
              onChange={(e) => setCurrentDeckIndex(Number(e.target.value))}
              className="bg-slate-700 text-white w-full md:w-auto p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              {decks.map((deck, index) => (
                <option key={index} value={index}>
                  {deck.chapterTitle} ({deck.flashcards.length} cards)
                </option>
              ))}
            </select>
        </div>
        
        {/* View Toggles */}
        <div className="flex bg-slate-700 rounded-md p-1">
          <button
            onClick={() => setActiveView('deck')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              activeView === 'deck' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600'
            }`}
          >
            <DeckIcon className="w-5 h-5"/> Deck
          </button>
          <button
            onClick={() => setActiveView('revise')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              activeView === 'revise' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-600'
            }`}
          >
             <SaveIcon className="w-5 h-5"/> Revise
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
