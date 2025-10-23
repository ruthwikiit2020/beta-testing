import React from 'react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, tierName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-primary/10 mb-4">
            <svg className="h-8 w-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Coming Soon!
          </h3>
          
          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            We're working hard to bring you the <span className="font-semibold text-brand-primary">{tierName}</span> plan. 
            It will be launched soon with amazing features!
          </p>
          
          {/* Features Preview */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-semibold">What to expect:</span>
            </p>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <li>• Enhanced AI capabilities</li>
              <li>• Advanced study analytics</li>
              <li>• Priority support</li>
              <li>• And much more!</li>
            </ul>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition-colors font-semibold"
            >
              Get Notified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
