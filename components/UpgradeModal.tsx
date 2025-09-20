import React from 'react';
import { XIcon } from './icons/AppIcons';
import { PricingTier, PRICING_TIERS } from '../types/pricing';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: PricingTier;
  targetTier?: PricingTier;
  reason?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  targetTier,
  reason
}) => {
  if (!isOpen) return null;

  const currentTierConfig = PRICING_TIERS[currentTier];
  const targetTierConfig = targetTier ? PRICING_TIERS[targetTier] : null;

  const handleUpgrade = (tier: PricingTier) => {
    if (tier === 'free') {
      // Already on free tier
      onClose();
      return;
    }

    // Show "unlocking shortly" message for paid tiers
    alert(`🚀 ${PRICING_TIERS[tier].name} tier will be unlocked shortly! We're working hard to bring you premium features.`);
    onClose();
  };

  const getUpgradeReason = () => {
    if (reason) return reason;
    if (targetTier) return `Upgrade to ${targetTierConfig?.name} to unlock this feature`;
    return 'Upgrade to unlock more features';
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-brand-dark rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Unlock Premium Features
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {getUpgradeReason()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <XIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Current Tier Info */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Current Plan: {currentTierConfig.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {currentTierConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Choose Your Plan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(PRICING_TIERS).map((tier) => {
              const isCurrentTier = tier.id === currentTier;
              const isHighlighted = tier.isPopular || tier.isHighlighted;
              
              return (
                <div
                  key={tier.id}
                  className={`relative p-6 rounded-xl border-2 transition-all ${
                    isCurrentTier
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isHighlighted
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {/* Popular/Highlighted Badge */}
                  {isHighlighted && !isCurrentTier && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {tier.isPopular ? 'Most Popular' : 'Enterprise'}
                      </span>
                    </div>
                  )}

                  {/* Current Tier Badge */}
                  {isCurrentTier && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Current Plan
                      </span>
                    </div>
                  )}

                  {/* Tier Header */}
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      {tier.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {tier.description}
                    </p>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                      {tier.price.monthly}
                      <span className="text-sm font-normal text-slate-600 dark:text-slate-400">/month</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {tier.features.slice(0, 4).map((feature) => (
                      <div key={feature.id} className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature.description}
                        </span>
                      </div>
                    ))}
                    {tier.features.length > 4 && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        +{tier.features.length - 4} more features
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={isCurrentTier}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                      isCurrentTier
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        : isHighlighted
                        ? 'bg-teal-500 hover:bg-teal-600 text-white'
                        : 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white'
                    }`}
                  >
                    {isCurrentTier ? 'Current Plan' : tier.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              🚀 <strong>Beta Version:</strong> All paid features will be unlocked shortly as we finalize our payment system!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              For now, enjoy the free tier with all current features available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
