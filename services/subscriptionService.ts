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
    const userEmail = localStorage.getItem('userEmail') || '';
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
      
      // Downgrade if non-owner has owner tier
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
      
      // Reset daily/monthly counters
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

  getSubscription(): UserSubscription {
    return this.subscription;
  }

  getCurrentTier(): PricingTier {
    return this.subscription.tier;
  }

  isCurrentUserOwner(): boolean {
    return this.isOwner();
  }

  hasFeature(feature: keyof typeof PRICING_TIERS.free.limits): boolean {
    if (this.isOwner()) return true;
    
    const tierConfig = this.subscription.tier === 'owner'
      ? OWNER_TIER_CONFIG
      : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    if (!tierConfig) return false;

    return tierConfig.limits[feature] === true;
  }

  canPerformAction(action: 'uploadPdf' | 'generateFlashcards' | 'saveToRevisionHub'): boolean {
    if (this.isOwner()) return true;

    const tierConfig = this.subscription.tier === 'owner'
      ? OWNER_TIER_CONFIG
      : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    if (!tierConfig) return false;

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

  getRemainingQuota(action: 'uploadPdf' | 'generateFlashcards' | 'saveToRevisionHub'): number {
    if (this.isOwner()) return -1;

    const tierConfig = this.subscription.tier === 'owner'
      ? OWNER_TIER_CONFIG
      : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    if (!tierConfig) return -1;

    switch (action) {
      case 'uploadPdf':
        if (tierConfig.limits.hasUnlimitedUploads) return -1;
        return Math.max(0, tierConfig.limits.maxPdfUploadsPerDay - this.subscription.usage.pdfUploadsToday);
      case 'generateFlashcards':
        if (tierConfig.limits.hasUnlimitedFlashcards) return -1;
        return Math.max(0, tierConfig.limits.maxFlashcardsPerMonth - this.subscription.usage.flashcardsThisMonth);
      case 'saveToRevisionHub':
        if (tierConfig.limits.maxRevisionHubCards === -1) return -1;
        return Math.max(0, tierConfig.limits.maxRevisionHubCards - this.subscription.usage.revisionHubCards);
      default:
        return 0;
    }
  }

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

  onPdfDeleted(): void {
    console.log('PDF deleted - daily upload count remains unchanged');
  }

  updateCurrentPdfCount(currentCount: number): void {
    this.subscription.usage.currentPdfCount = currentCount;
    this.saveSubscription(this.subscription);
  }

  syncCurrentPdfCount(actualDeckCount: number): void {
    if (this.subscription.usage.currentPdfCount !== actualDeckCount) {
      console.log(`Syncing PDF count: subscription has ${this.subscription.usage.currentPdfCount}, actual decks: ${actualDeckCount}`);
      this.subscription.usage.currentPdfCount = actualDeckCount;
      this.saveSubscription(this.subscription);
    }
  }

  canUploadPdf(pageCount: number): boolean {
    if (this.isOwner()) return true;
    
    const tierConfig = this.subscription.tier === 'owner'
      ? OWNER_TIER_CONFIG
      : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    if (!tierConfig) return true;
    
    if (tierConfig.limits.hasUnlimitedUploads) return true;
    if (tierConfig.limits.maxPagesPerPdf === -1) return true;
    
    return pageCount <= tierConfig.limits.maxPagesPerPdf;
  }

  getUpgradeSuggestions(): string[] {
    const suggestions: string[] = [];
    const tierConfig = this.subscription.tier === 'owner'
      ? OWNER_TIER_CONFIG
      : PRICING_TIERS[this.subscription.tier as keyof typeof PRICING_TIERS];
    
    if (this.isOwner() || !tierConfig) return suggestions;
    
    if (!tierConfig.limits.hasUnlimitedUploads) {
      const remaining = this.getRemainingQuota('uploadPdf');
      if (remaining <= 1) suggestions.push('Upgrade to upload more PDFs per day');
    }
    
    if (tierConfig.limits.maxPagesPerPdf !== -1 && tierConfig.limits.maxPagesPerPdf < 100) {
      suggestions.push('Upgrade to upload larger PDFs (up to 80+ pages)');
    }
    
    if (!tierConfig.limits.hasUnlimitedFlashcards) {
      const remaining = this.getRemainingQuota('generateFlashcards');
      if (remaining <= 50) suggestions.push('Upgrade to generate unlimited flashcards');
    }
    
    if (!tierConfig.limits.hasSmartFilters) {
      suggestions.push('Upgrade to access Smart Filters');
    }
    
    if (!tierConfig.limits.hasAnalytics) {
      suggestions.push('Upgrade to access analytics');
    }
    
    return suggestions;
  }

  upgradeToTier(tier: PricingTier, billingCycle: 'monthly' | 'yearly' = 'monthly'): void {
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    // Calculate end date based on billing cycle
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }
    
    this.subscription = {
      ...this.subscription,
      tier,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
    };
    this.saveSubscription(this.subscription);
    console.log(`Upgraded to ${tier} tier (${billingCycle}), expires: ${endDate.toISOString()}`);
  }

  isSubscriptionActive(): boolean {
    if (this.isOwner()) return true;
    if (!this.subscription.endDate) return this.subscription.tier === 'free';
    
    const now = new Date();
    const expiryDate = new Date(this.subscription.endDate);
    
    if (now > expiryDate) {
      // Subscription expired, downgrade to free
      this.subscription = {
        ...DEFAULT_SUBSCRIPTION,
        usage: this.subscription.usage,
      };
      this.saveSubscription(this.subscription);
      return false;
    }
    
    return this.subscription.isActive;
  }

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

// ----------------- Razorpay Integration -----------------
declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Opens Razorpay checkout popup
 * @param amount - Amount in INR
 * @param plan - Plan name (Pro, Flash, Institution)
 * @param billingCycle - Monthly or Yearly
 * @param onSuccess - Callback after successful payment
 */
export const openRazorpayCheckout = async (
  amount: number, 
  plan: string, 
  billingCycle: 'monthly' | 'yearly' = 'monthly',
  onSuccess?: () => void
) => {
  // Check if user is logged in first
  const { auth } = await import('./firebase');
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    alert("⚠️ Please sign in first to purchase a plan!\n\nYou need to be logged in so we can activate your subscription.");
    return;
  }

  if (typeof window === "undefined" || !window.Razorpay) {
    alert("Razorpay SDK not loaded. Please refresh the page.");
    return;
  }

  const options = {
    key: "rzp_live_RTo6jwSzYlmteQ", // 🔑 Replace with your Razorpay test/live key
    amount: amount * 100,
    currency: "INR",
    name: "ReWise AI",
    description: `Payment for ${plan} Plan (${billingCycle})`,
    image: "/logo.png",
    handler: async function (response: any) {
      console.log("Razorpay response:", response);

      // Verify user is still logged in
      const user = auth.currentUser;
      if (!user) {
        alert("❌ Error: You were logged out during payment. Please sign in again and contact support with payment ID: " + response.razorpay_payment_id);
        return;
      }

      // Automatically upgrade plan on successful payment
      const service = SubscriptionService.getInstance();
      service.upgradeToTier(plan.toLowerCase() as PricingTier, billingCycle);
      
      // Save to Firebase
      await saveSubscriptionToFirebase(
        plan.toLowerCase() as PricingTier, 
        billingCycle, 
        response.razorpay_payment_id
      );
      
      alert(`✅ Payment Successful! Welcome to ${plan} plan!`);
      
      // Redirect to dashboard
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    },
    prefill: {
      name: currentUser.displayName || localStorage.getItem("userName") || "Guest User",
      email: currentUser.email || localStorage.getItem("userEmail") || "guest@example.com",
      contact: "9999999999",
    },
    theme: {
      color: "#429E9D",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

/**
 * Save subscription to Firebase
 */
async function saveSubscriptionToFirebase(
  tier: PricingTier, 
  billingCycle: 'monthly' | 'yearly',
  paymentId: string
) {
  try {
    const { auth, db } = await import('./firebase');
    const { doc, setDoc } = await import('firebase/firestore');
    
    const user = auth.currentUser;
    if (!user) {
      console.error('No user logged in');
      return;
    }
    
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }
    
    const subscriptionData = {
      tier,
      billingCycle,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
      paymentId,
      updatedAt: new Date().toISOString(),
    };
    
    // Save to user document
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { subscription: subscriptionData }, { merge: true });
    
    console.log('Subscription saved to Firebase:', subscriptionData);
  } catch (error) {
    console.error('Error saving subscription to Firebase:', error);
  }
}

/**
 * Load subscription from Firebase on login
 */
export async function loadSubscriptionFromFirebase(userId: string): Promise<UserSubscription | null> {
  try {
    const { db } = await import('./firebase');
    const { doc, getDoc } = await import('firebase/firestore');
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.subscription) {
        const sub = data.subscription;
        
        // Check if subscription is still active
        const now = new Date();
        const expiryDate = new Date(sub.endDate);
        
        if (now > expiryDate && sub.tier !== 'free') {
          // Subscription expired, return free tier
          return { ...DEFAULT_SUBSCRIPTION };
        }
        
        // Return active subscription
        const subscription: UserSubscription = {
          tier: sub.tier,
          startDate: sub.startDate,
          endDate: sub.endDate,
          isActive: sub.isActive && now <= expiryDate,
          usage: {
            pdfUploadsToday: 0,
            currentPdfCount: 0,
            flashcardsThisMonth: 0,
            revisionHubCards: 0,
          },
        };
        
        // Save to localStorage
        localStorage.setItem('userSubscription', JSON.stringify(subscription));
        
        return subscription;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error loading subscription from Firebase:', error);
    return null;
  }
}
