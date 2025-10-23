import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import type { Flashcard as FlashcardType } from '../types';
import Flashcard from './Flashcard';
import { XIcon, CheckIcon } from './icons/AppIcons';
import { soundManager } from '../utils/sounds';

interface FlashcardStackProps {
  cards: FlashcardType[];
  onSwipeLeft: (card: FlashcardType) => void;
  onSwipeRight: (card: FlashcardType) => void;
}

export interface FlashcardStackRef {
  swipe: (direction: 'left' | 'right') => void;
}

const SWIPE_THRESHOLD = 100;

const FlashcardStack = forwardRef<FlashcardStackRef, FlashcardStackProps>(({ cards, onSwipeLeft, onSwipeRight }, ref) => {
  const [activeCards, setActiveCards] = useState(cards);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cardTransition, setCardTransition] = useState('none');
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setActiveCards(cards);
  }, [cards]);

  const currentCard = activeCards.length > 0 ? activeCards[activeCards.length - 1] : null;

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!currentCard) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(false);
    setCardTransition('none');
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!currentCard) return;
    e.preventDefault();
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    // Start dragging if moved more than 3 pixels in any direction
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setIsDragging(true);
    }
    
    // Always update position when we detect movement
    if (isDragging || Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setPosition({ x: dx, y: dy });
    }
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!currentCard) return;
    e.preventDefault();
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const dx = e.clientX - dragStartPos.current.x;
    
    if (isDragging && Math.abs(dx) > SWIPE_THRESHOLD) {
      swipe(dx > 0 ? 'right' : 'left');
    } else {
      resetPosition();
    }
    
    setIsDragging(false);
  };

  const resetPosition = () => {
    setCardTransition('transform 0.3s ease-out');
    setPosition({ x: 0, y: 0 });
  };

  const swipe = async (direction: 'left' | 'right') => {
    if (!currentCard) return;
    setCardTransition('transform 0.5s ease-in');
    
    // Play sound effect
    if (direction === 'left') {
      await soundManager.playSwipeLeft();
    } else {
      await soundManager.playSwipeRight();
    }
    
    const outX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    const outY = position.y;

    setPosition({ x: outX, y: outY });

    setTimeout(() => {
      setActiveCards(prev => prev.slice(0, prev.length - 1));
      if (direction === 'left') onSwipeLeft(currentCard); // Revise
      if (direction === 'right') onSwipeRight(currentCard); // Know it
      
      setPosition({ x: 0, y: 0 });
      setCardTransition('none');
    }, 500);
  };

  useImperativeHandle(ref, () => ({
    swipe,
  }));
  
  if (activeCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-slate-100 dark:bg-brand-surface rounded-xl text-slate-500 dark:text-slate-400 p-8">
        <CheckIcon className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold">Deck Complete!</h3>
        <p>You've gone through all the cards in this chapter.</p>
      </div>
    );
  }

  const rotation = position.x / 20;

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {activeCards.slice(-3).map((card, index) => {
        const isTopCard = index === activeCards.slice(-3).length - 1;
        
        let style: React.CSSProperties = { zIndex: activeCards.length - index };

        if (isTopCard) {
            style = {
                ...style,
                transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
                transition: cardTransition,
                touchAction: 'none',
            };
        } else {
            const offset = activeCards.slice(-3).length - 1 - index;
            style = {
                ...style,
                transform: `translateY(${offset * -6}px) scale(${1 - offset * 0.04})`,
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                opacity: 1 - offset * 0.2,
                pointerEvents: 'none'
            };
        }

        return (
          <div
            key={card.id}
            className="absolute w-full max-w-sm h-full"
            style={{ perspective: '1000px' }}
          >
            <div
              className="absolute w-full h-full cursor-grab active:cursor-grabbing"
              onPointerDown={isTopCard ? handleDragStart : undefined}
              onPointerMove={isTopCard ? handleDragMove : undefined}
              onPointerUp={isTopCard ? handleDragEnd : undefined}
              onPointerLeave={isTopCard ? handleDragEnd : undefined}
              onPointerCancel={isTopCard ? handleDragEnd : undefined}
              onMouseDown={isTopCard ? handleDragStart : undefined}
              onMouseMove={isTopCard ? handleDragMove : undefined}
              onMouseUp={isTopCard ? handleDragEnd : undefined}
              onMouseLeave={isTopCard ? handleDragEnd : undefined}
              style={{ touchAction: 'none', userSelect: 'none' }}
            />
            <Flashcard 
              card={card} 
              style={style} 
              className={''} 
              isDragging={isTopCard ? isDragging : false}
            />
          </div>
        );
      })}
      
      {/* Swipe Indicators */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-sm h-full flex justify-between items-center pointer-events-none px-4 z-20">
        <div 
          className="p-4 bg-orange-500/20 rounded-full transition-opacity duration-300"
          style={{ opacity: position.x < -20 ? Math.min(Math.abs(position.x) / SWIPE_THRESHOLD, 1) : 0 }}
        >
          <XIcon className="w-10 h-10 text-orange-400" />
        </div>
        <div 
          className="p-4 bg-green-500/20 rounded-full transition-opacity duration-300"
          style={{ opacity: position.x > 20 ? Math.min(position.x / SWIPE_THRESHOLD, 1) : 0 }}
        >
           <CheckIcon className="w-10 h-10 text-green-400" />
        </div>
      </div>
    </div>
  );
});

export default FlashcardStack;
