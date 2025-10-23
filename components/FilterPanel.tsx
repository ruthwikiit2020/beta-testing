import React, { useEffect } from 'react';
import { XIcon, CheckIcon } from './icons/AppIcons';
import { FlashcardFilters, STUDY_GOALS, CONTENT_TYPES, DEPTH_OPTIONS, ORGANIZATION_OPTIONS } from '../types/filters';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FlashcardFilters;
  onFiltersChange: (filters: FlashcardFilters) => void;
  totalPages?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  totalPages = 0 
}) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { 
      document.body.style.overflow = 'auto'; 
    };
  }, [isOpen]);
  
  if (!isOpen) return null;

  const handleStudyGoalChange = (value: FlashcardFilters['studyGoal']) => {
    console.log('🎯 Study Goal changed to:', value);
    onFiltersChange({ ...filters, studyGoal: value });
  };

  const handleContentTypeChange = (value: FlashcardFilters['contentType'][0], checked: boolean) => {
    console.log('🎯 Content Type changed:', value, 'checked:', checked);
    if (checked) {
      onFiltersChange({ 
        ...filters, 
        contentType: [...filters.contentType, value] 
      });
    } else {
      onFiltersChange({ 
        ...filters, 
        contentType: filters.contentType.filter(type => type !== value) 
      });
    }
  };

  const handleDepthChange = (value: FlashcardFilters['depth']) => {
    console.log('🎯 Depth changed to:', value);
    onFiltersChange({ ...filters, depth: value });
  };

  const handleOrganizationChange = (value: FlashcardFilters['organization']) => {
    console.log('🎯 Organization changed to:', value);
    onFiltersChange({ ...filters, organization: value });
  };

  const handleLimitPerChapterChange = (value: number) => {
    onFiltersChange({ ...filters, limitPerChapter: value });
  };

  const handlePageRangeChange = (type: 'start' | 'end', value: number) => {
    onFiltersChange({ 
      ...filters, 
      pageRange: { 
        ...filters.pageRange, 
        [type]: value 
      } 
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-brand-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary to-teal-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Smart Filters</h2>
              <p className="text-teal-100 text-sm mt-1">Customize your flashcard generation</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 pb-24">
          {/* Study Goal */}
          <FilterSection title="Study Goal" description="Choose your learning objective">
            {STUDY_GOALS.map(option => (
              <ModernRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                checked={filters.studyGoal === option.value}
                onChange={() => handleStudyGoalChange(option.value)}
              />
            ))}
          </FilterSection>

          {/* Content Type */}
          <FilterSection 
            title="Content Type" 
            description="Select what to focus on"
          >
            {CONTENT_TYPES.map(option => (
              <ModernCheckboxOption
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                checked={filters.contentType.includes(option.value)}
                onChange={(checked) => handleContentTypeChange(option.value, checked)}
              />
            ))}
          </FilterSection>

          {/* Depth of Cards */}
          <FilterSection 
            title="Depth of Cards" 
            description="Choose detail level"
          >
            {DEPTH_OPTIONS.map(option => (
              <ModernRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                checked={filters.depth === option.value}
                onChange={() => handleDepthChange(option.value)}
              />
            ))}
          </FilterSection>

          {/* Organization */}
          <FilterSection 
            title="Organization" 
            description="How to structure cards"
          >
            {ORGANIZATION_OPTIONS.map(option => (
              <ModernRadioOption
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                checked={filters.organization === option.value}
                onChange={() => handleOrganizationChange(option.value)}
              />
            ))}
          </FilterSection>

          {/* Smart Controls */}
          <FilterSection 
            title="Smart Controls" 
            description="Fine-tune generation"
          >
            <div className="space-y-4">
              {/* Cards per Chapter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Cards per Chapter: {filters.limitPerChapter}
                </label>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={filters.limitPerChapter}
                  onChange={(e) => handleLimitPerChapterChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>3</span>
                  <span>20</span>
                </div>
              </div>

              {/* Page Range */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Page Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={filters.pageRange?.start || 1}
                    onChange={(e) => handlePageRangeChange('start', parseInt(e.target.value))}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Start"
                  />
                  <span className="flex items-center text-slate-500 dark:text-slate-400">to</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={filters.pageRange?.end || totalPages}
                    onChange={(e) => handlePageRangeChange('end', parseInt(e.target.value))}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="End"
                  />
                </div>
              </div>
            </div>
          </FilterSection>
        </div>

        {/* Apply Button */}
        <div className="flex-shrink-0 p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-dark">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-brand-primary to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-brand-primary/90 hover:to-teal-600/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply Filters
          </button>
        </div>
      </div>

    </>
  );
};

// Filter Section Component
const FilterSection: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="space-y-3">
    <div>
      <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

// Modern Radio Option Component
const ModernRadioOption: React.FC<{
  value: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ value, label, description, checked, onChange, disabled = false }) => (
  <label 
    onClick={() => !disabled && onChange()}
    className={`group flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
    checked 
      ? 'border-brand-primary bg-brand-primary/5' 
      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
      checked 
        ? 'border-brand-primary bg-brand-primary' 
        : 'border-slate-300 dark:border-slate-500 group-hover:border-slate-400'
    } ${disabled ? 'cursor-not-allowed' : ''}`}>
      {checked && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className={`font-semibold transition-colors duration-200 ${
        checked 
          ? 'text-brand-primary' 
          : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100'
      }`}>
        {label}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
        {description}
      </div>
    </div>
  </label>
);

// Modern Checkbox Option Component
const ModernCheckboxOption: React.FC<{
  value: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ value, label, description, checked, onChange, disabled = false }) => (
  <label 
    onClick={() => !disabled && onChange(!checked)}
    className={`group flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
    checked 
      ? 'border-brand-primary bg-brand-primary/5' 
      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
      checked 
        ? 'border-brand-primary bg-brand-primary' 
        : 'border-slate-300 dark:border-slate-500 group-hover:border-slate-400'
    }`}>
      {checked && (
        <div className="w-full h-full flex items-center justify-center">
          <CheckIcon className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className={`font-semibold transition-colors duration-200 ${
        checked 
          ? 'text-brand-primary' 
          : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100'
      }`}>
        {label}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
        {description}
      </div>
    </div>
  </label>
);

export default FilterPanel;