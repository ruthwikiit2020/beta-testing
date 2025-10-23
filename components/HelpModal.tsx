import React, { useEffect } from 'react';
import { XIcon } from './icons/AppIcons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-brand-dark rounded-2xl shadow-2xl w-full max-w-lg flex flex-col border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Help & Support</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <XIcon className="w-6 h-6 text-slate-600 dark:text-slate-300"/>
          </button>
        </header>
        <div className="p-6">
            <h3 className="font-semibold mb-2">How to Use ReWise AI</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
                <li>Go to "My Decks" and upload a PDF of your study notes.</li>
                <li>Our AI will generate flashcards, sorted by chapter.</li>
                <li>Click on a deck to start your study session.</li>
                <li>Swipe left for cards you need to revise, and right for cards you've mastered.</li>
                <li>Visit the "Revision" tab to review tricky cards with our AI tutor.</li>
                <li>Track your learning journey on the "Progress" page.</li>
            </ol>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">For further assistance, please contact support@rewiseai.com.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
