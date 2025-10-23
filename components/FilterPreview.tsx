import React from 'react';
import { XIcon } from './icons/AppIcons';
import { FlashcardFilters, STUDY_GOALS, CONTENT_TYPES, DEPTH_OPTIONS, ORGANIZATION_OPTIONS } from '../types/filters';

interface FilterPreviewProps {
  filters: FlashcardFilters;
  onRemoveFilter: (filterType: keyof FlashcardFilters) => void;
  onClearAll: () => void;
}

const FilterPreview: React.FC<FilterPreviewProps> = ({ filters, onRemoveFilter, onClearAll }) => {
  const getFilterLabel = (type: keyof FlashcardFilters, value: any) => {
    switch (type) {
      case 'studyGoal':
        return STUDY_GOALS.find(g => g.value === value)?.label || value;
      case 'contentType':
        return value.map((v: string) => CONTENT_TYPES.find(t => t.value === v)?.label || v).join(', ');
      case 'depth':
        return DEPTH_OPTIONS.find(d => d.value === value)?.label || value;
      case 'organization':
        return ORGANIZATION_OPTIONS.find(o => o.value === value)?.label || value;
      case 'limitPerChapter':
        return `${value} cards/chapter`;
      case 'pageRange':
        return value ? `Pages ${value.from}-${value.to}` : '';
      default:
        return value;
    }
  };

  const hasNonDefaultFilters = () => {
    return filters.studyGoal !== 'concept-mastery' ||
           !filters.contentType.includes('full-detail') ||
           filters.contentType.length !== 1 ||
           filters.depth !== 'moderate' ||
           filters.organization !== 'chapter-wise' ||
           filters.limitPerChapter !== 15 ||
           filters.pageRange;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.studyGoal !== 'concept-mastery') count++;
    if (!filters.contentType.includes('full-detail') || filters.contentType.length !== 1) count++;
    if (filters.depth !== 'moderate') count++;
    if (filters.organization !== 'chapter-wise') count++;
    if (filters.limitPerChapter !== 15) count++;
    if (filters.pageRange) count++;
    return count;
  };

  if (!hasNonDefaultFilters()) {
    return null;
  }

  return (
    <div className="mb-6 p-5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Active Filters</h3>
          <span className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-2 py-1 rounded-full">
            {getActiveFilterCount()}
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors duration-200 hover:bg-white dark:hover:bg-slate-600 px-3 py-1 rounded-lg"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.studyGoal !== 'concept-mastery' && (
          <ModernFilterChip
            label={`Study Goal: ${getFilterLabel('studyGoal', filters.studyGoal)}`}
            onRemove={() => onRemoveFilter('studyGoal')}
            color="blue"
          />
        )}
        
        {(!filters.contentType.includes('full-detail') || filters.contentType.length !== 1) && (
          <ModernFilterChip
            label={`Content: ${getFilterLabel('contentType', filters.contentType)}`}
            onRemove={() => onRemoveFilter('contentType')}
            color="green"
          />
        )}
        
        {filters.depth !== 'moderate' && (
          <ModernFilterChip
            label={`Depth: ${getFilterLabel('depth', filters.depth)}`}
            onRemove={() => onRemoveFilter('depth')}
            color="purple"
          />
        )}
        
        {filters.organization !== 'chapter-wise' && (
          <ModernFilterChip
            label={`Organization: ${getFilterLabel('organization', filters.organization)}`}
            onRemove={() => onRemoveFilter('organization')}
            color="orange"
          />
        )}
        
        {filters.limitPerChapter !== 15 && (
          <ModernFilterChip
            label={getFilterLabel('limitPerChapter', filters.limitPerChapter)}
            onRemove={() => onRemoveFilter('limitPerChapter')}
            color="teal"
          />
        )}
        
        {filters.pageRange && (
          <ModernFilterChip
            label={getFilterLabel('pageRange', filters.pageRange)}
            onRemove={() => onRemoveFilter('pageRange')}
            color="indigo"
          />
        )}
      </div>
    </div>
  );
};

const ModernFilterChip: React.FC<{ label: string; onRemove: () => void; color: string }> = ({ label, onRemove, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
  };

  return (
    <div className={`inline-flex items-center gap-2 ${colorClasses[color as keyof typeof colorClasses]} px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:shadow-md group`}>
      <span className="truncate max-w-[200px]">{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-1 transition-all duration-200 group-hover:scale-110"
      >
        <XIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

const FilterChip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm border border-slate-200 dark:border-slate-600">
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full p-0.5 transition-colors"
    >
      <XIcon className="w-3 h-3" />
    </button>
  </div>
);

export default FilterPreview;
