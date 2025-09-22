import React from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { PRICING_TIERS, PricingTierConfig, UserSubscription, OWNER_TIER_CONFIG } from '../types/pricing';

interface UsageIndicatorProps {
  type: 'pdfUploads' | 'flashcards' | 'revisionHub';
  className?: string;
}

interface UsageIndicatorContentProps {
  type: 'pdfUploads' | 'flashcards' | 'revisionHub';
  className: string;
  tierConfig: PricingTierConfig;
  subscription: UserSubscription;
}

const UsageIndicatorContent: React.FC<UsageIndicatorContentProps> = ({ type, className, tierConfig, subscription }) => {
  const getUsageData = () => {
    switch (type) {
      case 'pdfUploads':
        const pdfLimit = tierConfig.limits.maxPdfUploadsPerDay;
        const pdfUsed = subscription.usage.pdfUploadsToday;
        const pdfRemaining = pdfLimit === -1 ? -1 : Math.max(0, pdfLimit - pdfUsed);
        
        return {
          label: 'PDF Uploads Today',
          used: pdfUsed,
          limit: pdfLimit,
          remaining: pdfRemaining,
          isUnlimited: pdfLimit === -1,
          icon: '📄',
          color: pdfRemaining === 0 ? 'text-red-500' : pdfRemaining <= 1 ? 'text-yellow-500' : 'text-green-500'
        };
      
      case 'flashcards':
        const flashcardLimit = tierConfig.limits.maxFlashcardsPerMonth;
        const flashcardUsed = subscription.usage.flashcardsThisMonth;
        const flashcardRemaining = flashcardLimit === -1 ? -1 : Math.max(0, flashcardLimit - flashcardUsed);
        
        return {
          label: 'Flashcards This Month',
          used: flashcardUsed,
          limit: flashcardLimit,
          remaining: flashcardRemaining,
          isUnlimited: flashcardLimit === -1,
          icon: '🎴',
          color: flashcardRemaining === 0 ? 'text-red-500' : flashcardRemaining <= 50 ? 'text-yellow-500' : 'text-green-500'
        };
      
      case 'revisionHub':
        const revisionLimit = tierConfig.limits.maxRevisionHubCards;
        const revisionUsed = subscription.usage.revisionHubCards;
        const revisionRemaining = revisionLimit === -1 ? -1 : Math.max(0, revisionLimit - revisionUsed);
        
        return {
          label: 'Revision Hub Cards',
          used: revisionUsed,
          limit: revisionLimit,
          remaining: revisionRemaining,
          isUnlimited: revisionLimit === -1,
          icon: '💾',
          color: revisionRemaining === 0 ? 'text-red-500' : revisionRemaining <= 3 ? 'text-yellow-500' : 'text-green-500'
        };
      
      default:
        return {
          label: 'Unknown',
          used: 0,
          limit: 0,
          remaining: 0,
          isUnlimited: false,
          icon: '❓',
          color: 'text-gray-500'
        };
    }
  };

  const usageData = getUsageData();
  const percentage = usageData.isUnlimited ? 0 : usageData.limit > 0 ? (usageData.used / usageData.limit) * 100 : 0;

  return (
    <div className={`bg-slate-50 dark:bg-slate-800 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{usageData.icon}</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {usageData.label}
          </span>
        </div>
        <span className={`text-sm font-semibold ${usageData.color}`}>
          {usageData.isUnlimited ? 'Unlimited' : `${usageData.remaining} left`}
        </span>
      </div>
      
      {!usageData.isUnlimited && (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
      
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
        <span>{usageData.used} used</span>
        {!usageData.isUnlimited && <span>{usageData.limit} limit</span>}
      </div>
    </div>
  );
};

const UsageIndicator: React.FC<UsageIndicatorProps> = ({ type, className = '' }) => {
  const subscription = subscriptionService.getSubscription();
  const tierConfig = subscription.tier === 'owner' ? OWNER_TIER_CONFIG : PRICING_TIERS[subscription.tier as keyof typeof PRICING_TIERS];
  
  // Fallback to free tier if tierConfig is undefined
  if (!tierConfig) {
    console.warn(`Unknown tier: ${subscription.tier}, falling back to free tier`);
    const fallbackConfig = PRICING_TIERS.free;
    return <UsageIndicatorContent type={type} className={className} tierConfig={fallbackConfig} subscription={subscription} />;
  }
  
  return <UsageIndicatorContent type={type} className={className} tierConfig={tierConfig} subscription={subscription} />;
};

export default UsageIndicator;
