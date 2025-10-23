import React, { useState } from 'react';
import ComingSoonModal from '../ComingSoonModal';
import { subscriptionService } from '../../services/subscriptionService';

export interface PricingTier {
  id: string;
  name: string;
  price: {
    monthly: string;
    yearly: string;
  };
  yearlyTotal?: number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
}

interface PricingSectionProps {
  title: string;
  subtitle: string;
  frequencies: string[];
  tiers: PricingTier[];
  onFreePlanClick?: () => void;
  onFrequencyChange?: (frequency: 'monthly' | 'yearly') => void;
}

export function PricingSection({ title, subtitle, frequencies, tiers, onFreePlanClick, onFrequencyChange }: PricingSectionProps) {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('');

  const handleFrequencyChange = (freq: string) => {
    setFrequency(freq);
    if (onFrequencyChange) {
      onFrequencyChange(freq as 'monthly' | 'yearly');
    }
  };

  const handleTierClick = (tier: PricingTier) => {
    // Don't allow clicking current plan
    if (tier.id === subscriptionService.getCurrentTier()) {
      return;
    }
    
    if (tier.id === 'free') {
      onFreePlanClick?.();
    } else {
     tier.onClick?.();
    }
  };
  
  const isCurrentPlan = (tierId: string) => {
    return tierId === subscriptionService.getCurrentTier();
  };

  return (
    <div className="py-8 bg-slate-100 dark:bg-brand-surface">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>
        </div>

        {/* Frequency Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
            {frequencies.map((freq) => (
              <button
                key={freq}
                onClick={() => handleFrequencyChange(freq)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  frequency === freq
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white dark:bg-brand-surface rounded-xl border-2 p-4 flex flex-col ${
                tier.popular
                  ? 'border-brand-primary shadow-lg'
                  : tier.highlighted
                  ? 'border-purple-500 shadow-lg'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Enterprise
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{tier.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{tier.description}</p>
                <div className="mb-3">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                    {frequency === 'monthly' ? tier.price.monthly : tier.price.yearly}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">
                    /month
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mb-6 flex-grow">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

             <button
  onClick={() => handleTierClick(tier)}
  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors text-base mt-auto ${
    isCurrentPlan(tier.id)
      ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
      : tier.popular
      ? 'bg-brand-primary text-white hover:bg-teal-500'
      : tier.highlighted
      ? 'bg-purple-500 text-white hover:bg-purple-600'
      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
  }`}
  disabled={isCurrentPlan(tier.id)}
>
  {isCurrentPlan(tier.id) ? 'Current Plan' : tier.cta}
</button>

            </div>
          ))}
        </div>
      </div>
      
      {/* Coming Soon Modal */}
     
    </div>
  );
}
