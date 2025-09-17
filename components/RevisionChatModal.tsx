import React, { useState, useEffect, useRef } from 'react';
import type { Flashcard } from '../types';
import { getDetailedExplanation, startCardChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { XIcon } from './icons/AppIcons';

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
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [chatHistory, isBotTyping]);
  
  const handleSendMessage = async () => {
    if (!userInput.trim() || !chat || isBotTyping) return;
    
    const text = userInput;
    setUserInput('');
    setChatHistory(prev => [...prev, { role: 'user', text }]);
    setIsBotTyping(true);

    try {
      const stream = await chat.sendMessageStream({ message: text });
      let fullResponse = '';
      setChatHistory(prev => [...prev, { role: 'model', text: '...' }]);
      
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = fullResponse;
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsBotTyping(false);
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

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
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
              <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{explanation}</p>
            )}
          </div>
          
          {/* Chat History */}
          <div ref={chatContainerRef} className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-md p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-brand-primary text-white rounded-br-none' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
             {isBotTyping && (
                <div className="flex items-end gap-2">
                    <div className="max-w-md p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>

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