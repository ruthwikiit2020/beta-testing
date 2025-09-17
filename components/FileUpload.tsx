import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/AppIcons';

interface FileUploadProps {
  onGenerate: (text: string, fileName: string, onProgress: (progress: number, status: string) => void) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onGenerate, isLoading }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

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
      onGenerate(extractedText, fileName, () => {}); // onProgress is handled by the parent
    }
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
        
        <button
          onClick={handleGenerateClick}
          disabled={!extractedText || isLoading}
          className="w-full bg-brand-primary hover:bg-teal-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Preparing...
            </>
          ) : (
            'Generate Flashcards'
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;