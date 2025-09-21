export interface FlashcardFilters {
  studyGoal: 'exam-revision' | 'concept-mastery' | 'quick-review';
  contentType: ('formulas' | 'definitions' | 'full-detail')[];
  depth: 'short' | 'moderate' | 'in-depth';
  organization: 'chapter-wise' | 'topic-clusters' | 'custom-tags';
  limitPerChapter: number;
  pageRange?: {
    from: number;
    to: number;
  };
}

export const DEFAULT_FILTERS: FlashcardFilters = {
  studyGoal: 'concept-mastery',
  contentType: ['full-detail'],
  depth: 'moderate',
  organization: 'chapter-wise',
  limitPerChapter: 15,
};

// This represents truly no filters applied - will use original LLM behavior
export const NO_FILTERS: FlashcardFilters = {
  studyGoal: 'concept-mastery',
  contentType: ['full-detail'],
  depth: 'moderate',
  organization: 'chapter-wise',
  limitPerChapter: 15,
};

export const STUDY_GOALS = [
  { value: 'exam-revision', label: 'Exam Revision Mode', description: 'Focus on key facts and quick recall' },
  { value: 'concept-mastery', label: 'Concept Mastery Mode', description: 'Deep understanding and connections' },
  { value: 'quick-review', label: 'Quick Review Mode', description: 'Brief overview and summaries' },
] as const;

export const CONTENT_TYPES = [
  { value: 'formulas', label: 'Formulas & Equations', description: 'Mathematical formulas and equations' },
  { value: 'definitions', label: 'Definitions & Key Terms', description: 'Important terms and definitions' },
  { value: 'full-detail', label: 'Full Detail', description: 'Comprehensive content coverage' },
] as const;

export const DEPTH_OPTIONS = [
  { value: 'short', label: 'Short & Crisp', description: 'Concise, essential information only' },
  { value: 'moderate', label: 'Moderate', description: 'Balanced detail and brevity' },
  { value: 'in-depth', label: 'In-Depth', description: 'Comprehensive and detailed' },
] as const;

export const ORGANIZATION_OPTIONS = [
  { value: 'chapter-wise', label: 'Chapter-wise', description: 'Organized by chapters' },
  { value: 'topic-clusters', label: 'Topic-wise Clusters', description: 'Grouped by related topics' },
  { value: 'custom-tags', label: 'Custom Tags', description: 'User-defined categorization' },
] as const;
