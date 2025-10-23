// Pricing and Subscription Types

export type PricingTier = 'free' | 'pro' | 'flash' | 'institution' | 'owner';
export type UIPricingTier = 'free' | 'pro' | 'flash' | 'institution';

export interface PricingFeature {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface PricingLimits {
  maxPdfUploadsPerDay: number;
  maxPagesPerPdf: number;
  maxFlashcardsPerMonth: number;
  maxRevisionHubCards: number;
  hasSmartFilters: boolean;
  hasAnalytics: boolean;
  hasExamMode: boolean;
  hasOfflineMode: boolean;
  hasPersonalTutor: boolean;
  hasPriorityProcessing: boolean;
  hasUnlimitedUploads: boolean;
  hasUnlimitedFlashcards: boolean;
  hasBulkManagement: boolean;
  hasCustomBranding: boolean;
  hasDedicatedSupport: boolean;
}

export interface PricingTierConfig {
  id: PricingTier;
  name: string;
  description: string;
  price: {
    monthly: string;
    yearly: string;
  };
  features: PricingFeature[];
  limits: PricingLimits;
  isPopular?: boolean;
  isHighlighted?: boolean;
  cta: string;
}

export const PRICING_TIERS: Record<UIPricingTier, PricingTierConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Forever free, with daily limits',
    price: {
      monthly: '₹0',
      yearly: '₹0',
    },
    features: [
      { id: 'pdf-uploads', name: 'PDF Uploads', description: '10 PDF uploads/day (max 20 pages each)' },
      { id: 'flashcards', name: 'Flashcards', description: '100 flashcards/month' },
      { id: 'revision-hub', name: 'Revision Hub', description: '15 cards saved' },
      { id: 'spaced-repetition', name: 'Spaced Repetition', description: 'Basic spaced repetition' },
      { id: 'smart-filters', name: 'Smart Filters', description: 'Customize flashcard generation' },
      { id: 'themes', name: 'Themes', description: 'Light/Dark mode' },
    ],
    limits: {
      maxPdfUploadsPerDay: 10,
      maxPagesPerPdf: 20,
      maxFlashcardsPerMonth: 100,
      maxRevisionHubCards: 15,
      hasSmartFilters: true,
      hasAnalytics: false,
      hasExamMode: false,
      hasOfflineMode: false,
      hasPersonalTutor: false,
      hasPriorityProcessing: false,
      hasUnlimitedUploads: false,
      hasUnlimitedFlashcards: false,
      hasBulkManagement: false,
      hasCustomBranding: false,
      hasDedicatedSupport: false,
    },
    cta: 'Get Started',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Most Popular - Perfect for students',
    price: {
      monthly: '₹1',
      yearly: '₹1',
    },
    features: [
      { id: 'pdf-uploads', name: 'PDF Uploads', description: '40 PDF uploads/day (max 80 pages each)' },
      { id: 'flashcards', name: 'Flashcards', description: '1,000 flashcards/month' },
      { id: 'revision-hub', name: 'Revision Hub', description: 'Unlimited storage' },
      { id: 'smart-filters', name: 'Smart Filters', description: 'Formulas, Key Concepts, Summaries' },
      { id: 'analytics', name: 'Analytics', description: 'Analytics dashboard' },
      { id: 'exam-mode', name: 'Exam Mode', description: 'Exam mode quizzes' },
    ],
    limits: {
      maxPdfUploadsPerDay: 40,
      maxPagesPerPdf: 80,
      maxFlashcardsPerMonth: 1000,
      maxRevisionHubCards: -1, // Unlimited
      hasSmartFilters: true,
      hasAnalytics: true,
      hasExamMode: true,
      hasOfflineMode: false,
      hasPersonalTutor: false,
      hasPriorityProcessing: false,
      hasUnlimitedUploads: false,
      hasUnlimitedFlashcards: false,
      hasBulkManagement: false,
      hasCustomBranding: false,
      hasDedicatedSupport: false,
    },
    isPopular: true,
    cta: 'Upgrade',
  },
  flash: {
    id: 'flash',
    name: 'Flash',
    description: 'For power users & researchers',
    price: {
      monthly: '₹499',
      yearly: '₹399',
    },
    features: [
      { id: 'unlimited-uploads', name: 'Unlimited Uploads', description: 'No page limit' },
      { id: 'unlimited-flashcards', name: 'Unlimited Flashcards', description: 'Unlimited flashcards & Revision Hub' },
      { id: 'priority-processing', name: 'Priority Processing', description: 'Fastest AI processing queue' },
      { id: 'offline-mode', name: 'Offline Mode', description: 'Download flashcards' },
      { id: 'personal-tutor', name: 'Personal Tutor', description: 'Personal AI tutor' },
    ],
    limits: {
      maxPdfUploadsPerDay: -1, // Unlimited
      maxPagesPerPdf: -1, // Unlimited
      maxFlashcardsPerMonth: -1, // Unlimited
      maxRevisionHubCards: -1, // Unlimited
      hasSmartFilters: true,
      hasAnalytics: true,
      hasExamMode: true,
      hasOfflineMode: true,
      hasPersonalTutor: true,
      hasPriorityProcessing: true,
      hasUnlimitedUploads: true,
      hasUnlimitedFlashcards: true,
      hasBulkManagement: false,
      hasCustomBranding: false,
      hasDedicatedSupport: false,
    },
    cta: 'Upgrade',
  },
  institution: {
    id: 'institution',
    name: 'Institution',
    description: 'For schools, colleges & coaching centers',
    price: {
      monthly: '₹15,000',
      yearly: '₹12,000',
    },
    features: [
      { id: 'unlimited-everything', name: 'Unlimited Everything', description: 'Unlimited uploads & flashcards for all students' },
      { id: 'admin-dashboard', name: 'Admin Dashboard', description: 'Centralized teacher/admin dashboard' },
      { id: 'bulk-management', name: 'Bulk Management', description: 'SSO/class codes' },
      { id: 'shared-libraries', name: 'Shared Libraries', description: 'Per subject/course' },
      { id: 'dedicated-support', name: 'Dedicated Support', description: 'Dedicated support & training' },
      { id: 'custom-branding', name: 'Custom Branding', description: 'Institution logo' },
    ],
    limits: {
      maxPdfUploadsPerDay: -1,
      maxPagesPerPdf: -1,
      maxFlashcardsPerMonth: -1,
      maxRevisionHubCards: -1,
      hasSmartFilters: true,
      hasAnalytics: true,
      hasExamMode: true,
      hasOfflineMode: true,
      hasPersonalTutor: true,
      hasPriorityProcessing: true,
      hasUnlimitedUploads: true,
      hasUnlimitedFlashcards: true,
      hasBulkManagement: true,
      hasCustomBranding: true,
      hasDedicatedSupport: true,
    },
    isHighlighted: true,
    cta: 'Contact Sales',
  },
};

// Internal owner tier configuration (not shown in UI)
export const OWNER_TIER_CONFIG: PricingTierConfig = {
  id: 'owner',
  name: 'Owner',
  description: 'Full access with unlimited everything',
  price: {
    monthly: '₹0',
    yearly: '₹0',
  },
  features: [
    { id: 'unlimited-everything', name: 'Unlimited Everything', description: 'Unlimited uploads, flashcards, and all features' },
    { id: 'priority-processing', name: 'Priority Processing', description: 'Fastest AI processing queue' },
    { id: 'all-features', name: 'All Features', description: 'Access to all premium features' },
  ],
  limits: {
    maxPdfUploadsPerDay: -1,
    maxPagesPerPdf: -1,
    maxFlashcardsPerMonth: -1,
    maxRevisionHubCards: -1,
    hasSmartFilters: true,
    hasAnalytics: true,
    hasExamMode: true,
    hasOfflineMode: true,
    hasPersonalTutor: true,
    hasPriorityProcessing: true,
    hasUnlimitedUploads: true,
    hasUnlimitedFlashcards: true,
    hasBulkManagement: true,
    hasCustomBranding: true,
    hasDedicatedSupport: true,
  },
  cta: 'Owner Access',
};

export interface UserSubscription {
  tier: PricingTier;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  usage: {
    pdfUploadsToday: number;
    currentPdfCount: number;
    flashcardsThisMonth: number;
    revisionHubCards: number;
  };
}

// ✅ Default subscription export added here
export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  tier: 'free',
  startDate: new Date().toISOString(),
  isActive: true,
  usage: {
    pdfUploadsToday: 0,
    currentPdfCount: 0,
    flashcardsThisMonth: 0,
    revisionHubCards: 0,
  },
};
