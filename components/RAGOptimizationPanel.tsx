// RAG Optimization Panel
// Shows performance metrics and optimization suggestions

import React, { useState, useEffect } from 'react';
import { performanceMonitor } from '../services/performanceMonitor';

interface RAGOptimizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const RAGOptimizationPanel: React.FC<RAGOptimizationPanelProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const avgMetrics = performanceMonitor.getAverageMetrics();
      const optimizationSuggestions = performanceMonitor.getOptimizationSuggestions();
      
      setMetrics(avgMetrics);
      setSuggestions(optimizationSuggestions);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl transform transition-all duration-300 ease-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">RAG Performance</h2>
                <p className="text-blue-100 text-xs mt-0.5">Optimization metrics and suggestions</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-800 p-6">
            {metrics && (
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {metrics.totalTime ? `${Math.round(metrics.totalTime)}ms` : 'N/A'}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Total Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {metrics.tokensUsed ? Math.round(metrics.tokensUsed) : 'N/A'}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Tokens Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {metrics.chunksProcessed || 0}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Chunks Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {metrics.chunksRetrieved || 0}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Chunks Retrieved</div>
                    </div>
                  </div>
                </div>

                {/* Timing Breakdown */}
                <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
                    Timing Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Chunking</span>
                      <span className="font-mono text-sm">
                        {metrics.chunkingTime ? `${Math.round(metrics.chunkingTime)}ms` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Embedding</span>
                      <span className="font-mono text-sm">
                        {metrics.embeddingTime ? `${Math.round(metrics.embeddingTime)}ms` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Retrieval</span>
                      <span className="font-mono text-sm">
                        {metrics.retrievalTime ? `${Math.round(metrics.retrievalTime)}ms` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Generation</span>
                      <span className="font-mono text-sm">
                        {metrics.generationTime ? `${Math.round(metrics.generationTime)}ms` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optimization Suggestions */}
                {suggestions.length > 0 && (
                  <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
                      Optimization Suggestions
                    </h3>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cache Performance */}
                {(metrics.cacheHits || metrics.cacheMisses) && (
                  <div className="bg-white dark:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
                      Cache Performance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Cache Hits</span>
                        <span className="font-mono text-sm text-green-600">{metrics.cacheHits || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Cache Misses</span>
                        <span className="font-mono text-sm text-red-600">{metrics.cacheMisses || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Hit Rate</span>
                        <span className="font-mono text-sm">
                          {metrics.cacheHits && metrics.cacheMisses 
                            ? `${Math.round((metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100)}%`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-3">
              <button
                onClick={() => performanceMonitor.clearMetrics()}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-3 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Clear Metrics
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGOptimizationPanel;
