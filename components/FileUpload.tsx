import React, { useState, useCallback } from 'react';
import { UploadIcon, FilterIcon } from './icons/AppIcons';
import FilterPanel from './FilterPanel';
import FilterPreview from './FilterPreview';
import { FlashcardFilters, DEFAULT_FILTERS, NO_FILTERS } from '../types/filters';

interface FileUploadProps {
  onGenerate: (text: string, fileName: string, filters: FlashcardFilters, totalPages: number, onProgress: (progress: number, status: string) => void) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onGenerate, isLoading }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [filters, setFilters] = useState<FlashcardFilters>(NO_FILTERS);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);
    setExtractedText('');

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    // Check if PDF.js is loaded
    if (typeof (window as any).pdfjsLib === 'undefined') {
      setError('PDF processing library is not loaded. Please refresh the page and try again.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        console.log('Starting PDF processing...');
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdf = await (window as any).pdfjsLib.getDocument(typedarray).promise;
        console.log('PDF loaded, processing pages...');
        
        setTotalPages(pdf.numPages);
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        
        console.log('PDF processing complete, extracted text length:', fullText.length);
        if (fullText.trim().length === 0) {
          setError('No text could be extracted from this PDF. It might be image-based or protected.');
          return;
        }
        
        setExtractedText(fullText);
      } catch (err) {
        console.error("Error parsing PDF:", err);
        setError(`Failed to extract text from PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleGenerateClick = () => {
    if (extractedText && !isLoading && fileName) {
      console.log('🚀 FileUpload: Starting generation with filters:', filters);
      console.log('📊 FileUpload: Total pages:', totalPages);
      console.log('📝 FileUpload: Text length:', extractedText.length);
      
      onGenerate(extractedText, fileName, filters, totalPages, () => {}); // onProgress is handled by the parent
    }
  };

  const handleFiltersChange = (newFilters: FlashcardFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (filterType: keyof FlashcardFilters) => {
    const newFilters = { ...filters };
    
    switch (filterType) {
      case 'studyGoal':
        newFilters.studyGoal = 'concept-mastery';
        break;
      case 'contentType':
        newFilters.contentType = ['full-detail'];
        break;
      case 'depth':
        newFilters.depth = 'moderate';
        break;
      case 'organization':
        newFilters.organization = 'chapter-wise';
        break;
      case 'limitPerChapter':
        newFilters.limitPerChapter = 15;
        break;
      case 'pageRange':
        newFilters.pageRange = undefined;
        break;
    }
    
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters(NO_FILTERS);
  };

  const hasActiveFilters = () => {
    // Check if any filter has been modified from the default state
    return filters.studyGoal !== 'concept-mastery' ||
           !filters.contentType.includes('full-detail') ||
           filters.contentType.length !== 1 ||
           filters.depth !== 'moderate' ||
           filters.organization !== 'chapter-wise' ||
           filters.limitPerChapter !== 15 ||
           filters.pageRange;
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center p-8 bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-3xl font-bold text-brand-primary mb-2">Create a New Deck</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Upload your PDF study material to get started.</p>

      <div className="flex flex-col items-center gap-4">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 w-full flex items-center justify-center gap-3 border-2 border-dashed border-slate-300 dark:border-slate-600"
        >
          <UploadIcon className="w-6 h-6" />
          <span>{fileName || 'Choose a PDF file'}</span>
        </label>
        <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" disabled={isLoading} />

        {error && <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>}
        
        {/* Filter Preview */}
        {extractedText && (
          <FilterPreview
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => setIsFilterPanelOpen(true)}
            disabled={!extractedText || isLoading}
            className="flex-1 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-800 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:shadow-none group"
          >
            <FilterIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Smart Filters</span>
            {hasActiveFilters() && (
              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            )}
          </button>
          
          <button
            onClick={handleGenerateClick}
            disabled={!extractedText || isLoading}
            className="flex-1 bg-gradient-to-r from-brand-primary to-teal-600 hover:from-teal-600 hover:to-brand-primary disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparing...
              </>
            ) : (
              <>
                <span>Generate Flashcards</span>
                <div className="w-2 h-2 bg-white/30 rounded-full"></div>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default FileUpload;