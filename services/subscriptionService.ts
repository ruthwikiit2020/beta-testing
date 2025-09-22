// Subscription Service for managing user tiers and feature access

import { PricingTier, UserSubscription, PRICING_TIERS, DEFAULT_SUBSCRIPTION, OWNER_TIER_CONFIG } from '../types/pricing';

export class SubscriptionService {
  private static instance: SubscriptionService;
  private subscription: UserSubscription;

  constructor() {
    this.subscription = this.loadSubscription();
  }

  // Check if current user is the owner
  private isOwner(): boolean {
    // Only grant owner status to the specific email: ruthwikiit2020@gmail.com
    const userEmail = localStorage.getItem('userEmail') || '';
    
    // Strict owner identification - only this specific email gets owner access
    return userEmail.toLowerCase() === 'ruthwikiit2020@gmail.com';
  }

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  // Load subscription from localStorage
  private loadSubscription(): UserSubscription {
    try {
      const stored = localStorage.getItem('userSubscription');
      let subscription: UserSubscription;
      
      if (stored) {
        subscription = JSON.parse(stored);
      } else {
        subscription = { ...DEFAULT_SUBSCRIPTION };
      }
      
      // Check if user is owner and upgrade automatically
      if (this.isOwner() && subscription.tier !== 'owner') {
        console.log('Owner detected - upgrading to owner tier');
        subscription = {
          ...subscription,
          tier: 'owner',
          startDate: new Date().toISOString(),
          isActive: true,
        };
        this.saveSubscription(subscription);
      }
      
      // Ensure non-owner users are downgraded to free if they somehow have owner status
      if (!this.isOwner() && subscription.tier === 'owner') {
        console.log('Non-owner user detected with owner status - downgrading to free');
        subscription = {
          ...DEFAULT_SUBSCRIPTION,
          startDate: new Date().toISOString(),
          isActive: true,
          usage: {
            ...DEFAULT_SUBSCRIPTION.usage,
            currentPdfCount: 0,
          },
        };
        this.saveSubscription(subscription);
      }
      
      // Reset daily/monthly counters if needed
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem('lastUsageReset');
      
      if (lastReset !== today) {
        subscription.usage.pdfUploadsToday = 0;
        if (new Date().getDate() === 1) {
          subscription.usage.flashcardsThisMonth = 0;
        }
        localStorage.setItem('lastUsageReset', today);
        this.saveSubscription(subscription);
      }
      
      return subscription;
    } catch (error) {
      console.error('Error loading subscription:', error);
      return { ...DEFAULT_SUBSCRIPTION };
    }
  }

  // Save subscription to localStorage
  private saveSubscription(subscription: UserSubscription): void {
    try {
      localStorage.setItem('userSubscription', JSON.stringify(subscription));
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  }

  // Get current subscription
  getSubscription(): UserSubscription {
    return this.subscription;
  }

  // Get current tier
  getCurrentTier(): PricingTier {
    return this.subscription.tier;
  }

  // Check if current user is owner (public method for debugging)
  isCurrentUserOwner(): boolean {
    return this.isOwner();
  }

  // Check if user has access to a feature
  hasFeature(feature: keyof typeof PRICING_TIERS.free.limits): boolean {
    // Owner always has access to all features
    if (this.isOwner()) {
      return true;
    }
    
    const tierConfig = this.subscription.tier === 'owner' ? OWNER_TIER_CONFIG : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    if (!tierConfig) {
      // Fallback for unknown tiers
      return false;
    }
    return tierConfig.limits[feature] === true;
  }

  // Check if user can perform an action (with limits)
  canPerformAction(action: 'uploadPdf' | 'generateFlashcards' | 'saveToRevisionHub'): boolean {
    // Owner always has unlimited access
    if (this.isOwner()) {
      return true;
    }
    
    const tierConfig = this.subscription.tier === 'owner' ? OWNER_TIER_CONFIG : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    if (!tierConfig) {
      // Fallback for unknown tiers
      return false;
    }
    
    switch (action) {
      case 'uploadPdf':
        if (tierConfig.limits.hasUnlimitedUploads) return true;
        return this.subscription.usage.pdfUploadsToday < tierConfig.limits.maxPdfUploadsPerDay;
      
      case 'generateFlashcards':
        if (tierConfig.limits.hasUnlimitedFlashcards) return true;
        return this.subscription.usage.flashcardsThisMonth < tierConfig.limits.maxFlashcardsPerMonth;
      
      case 'saveToRevisionHub':
        if (tierConfig.limits.maxRevisionHubCards === -1) return true;
        return this.subscription.usage.revisionHubCards < tierConfig.limits.maxRevisionHubCards;
      
      default:
        return false;
    }
  }

  // Get remaining quota for an action
  getRemainingQuota(action: 'uploadPdf' | 'generateFlashcards' | 'saveToRevisionHub'): number {
    // Owner always has unlimited quota
    if (this.isOwner()) {
      return -1; // Unlimited
    }
    
    const tierConfig = this.subscription.tier === 'owner' ? OWNER_TIER_CONFIG : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    if (!tierConfig) {
      // Fallback for unknown tiers
      return -1; // Unlimited for unknown tiers
    }
    
    switch (action) {
      case 'uploadPdf':
        if (tierConfig.limits.hasUnlimitedUploads) return -1; // Unlimited
        return Math.max(0, tierConfig.limits.maxPdfUploadsPerDay - this.subscription.usage.pdfUploadsToday);
      
      case 'generateFlashcards':
        if (tierConfig.limits.hasUnlimitedFlashcards) return -1; // Unlimited
        return Math.max(0, tierConfig.limits.maxFlashcardsPerMonth - this.subscription.usage.flashcardsThisMonth);
      
      case 'saveToRevisionHub':
        if (tierConfig.limits.maxRevisionHubCards === -1) return -1; // Unlimited
        return Math.max(0, tierConfig.limits.maxRevisionHubCards - this.subscription.usage.revisionHubCards);
      
      default:
        return 0;
    }
  }

  // Record usage of a feature
  recordUsage(action: 'uploadPdf' | 'generateFlashcards' | 'saveToRevisionHub', count: number = 1): void {
    switch (action) {
      case 'uploadPdf':
        this.subscription.usage.pdfUploadsToday += count;
        this.subscription.usage.currentPdfCount += count;
        break;
      case 'generateFlashcards':
        this.subscription.usage.flashcardsThisMonth += count;
        break;
      case 'saveToRevisionHub':
        this.subscription.usage.revisionHubCards += count;
        break;
    }
    
    this.saveSubscription(this.subscription);
  }

  // Handle PDF deletion - this should NOT decrease the daily upload count
  // because the user already used their daily quota when they uploaded it
  onPdfDeleted(): void {
    // PDF deletion doesn't affect daily upload limits
    // The user already consumed their daily quota when they uploaded the PDF
    // We don't decrease the counter to prevent abuse
    console.log('PDF deleted - daily upload count remains unchanged to prevent quota abuse');
  }

  // Update current PDF count (called when PDFs are added or deleted)
  updateCurrentPdfCount(currentCount: number): void {
    this.subscription.usage.currentPdfCount = currentCount;
    this.saveSubscription(this.subscription);
  }

  // Sync current PDF count with actual deck count (called on app initialization)
  syncCurrentPdfCount(actualDeckCount: number): void {
    if (this.subscription.usage.currentPdfCount !== actualDeckCount) {
      console.log(`Syncing PDF count: subscription has ${this.subscription.usage.currentPdfCount}, actual decks: ${actualDeckCount}`);
      this.subscription.usage.currentPdfCount = actualDeckCount;
      this.saveSubscription(this.subscription);
    }
  }

  // Check if PDF size is within limits
  canUploadPdf(pageCount: number): boolean {
    // Owner can upload PDFs of any size
    if (this.isOwner()) {
      return true;
    }
    
    const tierConfig = this.subscription.tier === 'owner' ? OWNER_TIER_CONFIG : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    if (!tierConfig) {
      // Fallback for unknown tiers
      return true; // Allow unlimited for unknown tiers
    }
    
    if (tierConfig.limits.hasUnlimitedUploads) return true;
    if (tierConfig.limits.maxPagesPerPdf === -1) return true;
    
    return pageCount <= tierConfig.limits.maxPagesPerPdf;
  }

  // Get upgrade suggestions based on current usage
  getUpgradeSuggestions(): string[] {
    const suggestions: string[] = [];
    const tierConfig = this.subscription.tier === 'owner' ? OWNER_TIER_CONFIG : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    
    // Owner doesn't need upgrade suggestions
    if (this.isOwner() || !tierConfig) {
      return suggestions;
    }
    
    // Check PDF upload limits
    if (!tierConfig.limits.hasUnlimitedUploads) {
      const remaining = this.getRemainingQuota('uploadPdf');
      if (remaining <= 1) {
        suggestions.push('Upgrade to upload more PDFs per day');
      }
    }
    
    // Check page limits
    if (tierConfig.limits.maxPagesPerPdf !== -1 && tierConfig.limits.maxPagesPerPdf < 100) {
      suggestions.push('Upgrade to upload larger PDFs (up to 80+ pages)');
    }
    
    // Check flashcard limits
    if (!tierConfig.limits.hasUnlimitedFlashcards) {
      const remaining = this.getRemainingQuota('generateFlashcards');
      if (remaining <= 50) {
        suggestions.push('Upgrade to generate unlimited flashcards');
      }
    }
    
    // Check smart filters
    if (!tierConfig.limits.hasSmartFilters) {
      suggestions.push('Upgrade to access Smart Filters for better content selection');
    }
    
    // Check analytics
    if (!tierConfig.limits.hasAnalytics) {
      suggestions.push('Upgrade to access detailed analytics and progress tracking');
    }
    
    return suggestions;
  }

  // Simulate upgrade (for demo purposes)
  upgradeToTier(tier: PricingTier): void {
    this.subscription = {
      ...this.subscription,
      tier,
      startDate: new Date().toISOString(),
      isActive: true,
    };
    
    this.saveSubscription(this.subscription);
    console.log(`Upgraded to ${tier} tier`);
  }

  // Reset usage (for testing)
  resetUsage(): void {
    this.subscription.usage = {
      pdfUploadsToday: 0,
      currentPdfCount: 0,
      flashcardsThisMonth: 0,
      revisionHubCards: 0,
    };
    this.saveSubscription(this.subscription);
  }
}

export const subscriptionService = SubscriptionService.getInstance();
