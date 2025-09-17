import React, { useState, useEffect, useRef } from 'react';
import type { Flashcard as FlashcardType } from '../types';
import { soundManager } from '../utils/sounds';

interface FlashcardProps {
  card: FlashcardType;
  style: React.CSSProperties;
  className: string;
  isDragging?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, style, className, isDragging = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const backContentRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  useEffect(() => {
    if (backContentRef.current) {
        setIsScrollable(backContentRef.current.scrollHeight > backContentRef.current.clientHeight);
    }
  }, [card.answer, isFlipped]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Card clicked, isDragging:', isDragging);
    
    // Only flip if we're not dragging
    if (!isDragging) {
      setIsFlipped(!isFlipped);
      await soundManager.playCardFlip();
    }
  };

  return (
    <div
      style={style}
      className={`absolute w-full h-full cursor-pointer select-none ${className}`}
      onClick={handleClick}
    >
      <div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s' , transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}
      >
        {/* Front of Card */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-2xl p-6 flex items-center justify-center text-center" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', zIndex: 2 }}>
          <p className="text-2xl font-semibold text-slate-800">{card.question}</p>
        </div>
        
        {/* Back of Card */}
        <div 
            className="absolute w-full h-full bg-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-center" 
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: 1 }}
        >
          <div ref={backContentRef} className="overflow-y-auto max-h-full">
            <p className="text-xl text-slate-200">{card.answer}</p>
          </div>
          {isScrollable && (
            <div className="absolute bottom-2 text-xs text-slate-500 animate-pulse">
                scroll to see more
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
