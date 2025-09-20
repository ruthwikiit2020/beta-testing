import React, { useState, useEffect, useRef } from 'react';
import type { Flashcard } from '../types';
import { getDetailedExplanation, startCardChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { XIcon } from './icons/AppIcons';
import MarkdownRenderer from './MarkdownRenderer';

interface RevisionChatModalProps {
  card: Flashcard;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const RevisionChatModal: React.FC<RevisionChatModalProps> = ({ card, isOpen, onClose }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(true);
  
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);
  
  useEffect(() => {
    if (card) {
      // Reset state for new card
      setChatHistory([]);
      setUserInput('');
      setIsLoadingExplanation(true);
      
      // Fetch new explanation
      getDetailedExplanation(card).then(exp => {
        setExplanation(exp);
        setIsLoadingExplanation(false);
      });

      // Start new chat session
      const newChat = startCardChat(card);
      setChat(newChat);
    }
  }, [card]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive or bot is typing
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        const container = chatContainerRef.current;
        console.log('🔄 Attempting to scroll to bottom...', {
          scrollHeight: container.scrollHeight,
          scrollTop: container.scrollTop,
          clientHeight: container.clientHeight
        });
        
        // Use both methods to ensure scrolling works
        container.scrollTop = container.scrollHeight;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
        
        console.log('✅ Scroll completed', {
          newScrollTop: container.scrollTop,
          newScrollHeight: container.scrollHeight
        });
      } else {
        console.log('❌ No chat container found');
      }
    };
    
    // Immediate scroll
    scrollToBottom();
    
    // Multiple attempts to ensure scrolling works
    const timeoutId1 = setTimeout(scrollToBottom, 50);
    const timeoutId2 = setTimeout(scrollToBottom, 150);
    const timeoutId3 = setTimeout(scrollToBottom, 300);
    const timeoutId4 = setTimeout(scrollToBottom, 500);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
    };
  }, [chatHistory, isBotTyping]);

  // Handle scroll detection for scroll-to-bottom button
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    // Initial check
    handleScroll();
    
    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, [chatHistory]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Force scroll to bottom function
  const forceScrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput.trim() || !chat || isBotTyping) return;
    
    const text = userInput;
    setUserInput('');
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    
    // Force scroll to bottom immediately after adding user message
    setTimeout(() => {
      if (chatContainerRef.current) {
        const container = chatContainerRef.current;
        console.log('🔄 User message scroll attempt...', {
          scrollHeight: container.scrollHeight,
          scrollTop: container.scrollTop
        });
        container.scrollTop = container.scrollHeight;
      }
    }, 10);
    
    // Also try smooth scroll
    setTimeout(() => {
      if (chatContainerRef.current) {
        const container = chatContainerRef.current;
        console.log('🔄 User message smooth scroll attempt...', {
          scrollHeight: container.scrollHeight,
          scrollTop: container.scrollTop
        });
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 50);
    
    setIsBotTyping(true);

    try {
      const stream = await chat.sendMessageStream({ message: text });
      let fullResponse = '';
      setChatHistory(prev => [...prev, { role: 'model', text: '...' }]);
      
      // Scroll when bot starts typing
      setTimeout(() => {
        if (chatContainerRef.current) {
          const container = chatContainerRef.current;
          container.scrollTop = container.scrollHeight;
        }
      }, 20);
      
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = fullResponse;
          return newHistory;
        });
        
        // Auto-scroll during streaming - more aggressive
        setTimeout(() => {
          if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            console.log('🔄 Streaming scroll attempt...', {
              scrollHeight: container.scrollHeight,
              scrollTop: container.scrollTop,
              fullResponse: fullResponse.substring(0, 50) + '...'
            });
            container.scrollTop = container.scrollHeight;
          }
        }, 5);
        
        // Also try smooth scroll
        setTimeout(() => {
          if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            });
          }
        }, 15);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsBotTyping(false);
      
      // Final scroll when bot finishes typing
      setTimeout(() => {
        if (chatContainerRef.current) {
          const container = chatContainerRef.current;
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-brand-dark rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{card.question}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">AI-Powered Discussion</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <XIcon className="w-6 h-6 text-slate-600 dark:text-slate-300"/>
          </button>
        </header>

        <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
          {/* Initial Explanation */}
          <div className="bg-slate-100 dark:bg-brand-surface p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-brand-primary">Detailed Explanation</h3>
            {isLoadingExplanation ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            ) : (
              <MarkdownRenderer 
                text={explanation} 
                className="text-slate-700 dark:text-slate-300" 
              />
            )}
          </div>
          
          {/* Chat History */}
          <div className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-md p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-brand-primary text-white rounded-br-none' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  <MarkdownRenderer 
                    text={msg.text} 
                    className="whitespace-pre-wrap" 
                  />
                </div>
              </div>
            ))}
             {isBotTyping && (
                <div className="flex items-end gap-2">
                    <div className="max-w-md p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">AI is thinking</span>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce delay-150"></span>
                                <span className="w-2 h-2 bg-brand-primary rounded-full animate-bounce delay-300"></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={forceScrollToBottom}
            className="absolute bottom-20 right-4 bg-brand-primary hover:bg-teal-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            title="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}

        <footer className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a clarifying question..."
              className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
              disabled={isBotTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isBotTyping}
              className="px-4 py-2 bg-brand-primary hover:bg-teal-500 text-white font-semibold rounded-lg disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RevisionChatModal;