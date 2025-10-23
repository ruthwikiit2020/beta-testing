// src/components/UpgradeModal.tsx

import React, { useState } from 'react';
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
  reason,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const currentTierConfig = PRICING_TIERS[currentTier];
  const targetTierConfig = targetTier ? PRICING_TIERS[targetTier] : null;

  const handleUpgrade = async (tierId: PricingTier) => {
    if (tierId === currentTier || isLoading) return;

    setIsLoading(true);
    const selectedTier = PRICING_TIERS[tierId];
    const amount = parseInt(selectedTier.price.monthly.replace(/₹|,/g, ''));

    try {
      // Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: amount * 100, // in paise
        currency: 'INR',
        name: 'OG App',
        description: `Upgrade to ${selectedTier.name} Plan`,
        handler: function (paymentResponse: any) {
          alert('✅ Payment Successful!');
          console.log('Payment Response:', paymentResponse);
          onClose();
        },
        prefill: {
          name: localStorage.getItem('userName') || 'OG User',
          email: localStorage.getItem('userEmail') || 'user@example.com',
        },
        theme: { color: '#3b82f6' },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('⚠️ Payment initialization failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUpgradeReason = () => {
    if (reason) return reason;
    if (targetTier) return `Upgrade to ${targetTierConfig?.name} to unlock this feature.`;
    return 'Upgrade to unlock more features.';
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Unlock Premium Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{getUpgradeReason()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Current Tier Info */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Current Plan: {currentTierConfig.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentTierConfig.description}</p>
          </div>
        </div>

        {/* Upgrade Options */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Choose Your New Plan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(PRICING_TIERS).map((tier) => {
              const isCurrentTier = tier.id === currentTier;
              return (
                <div
                  key={tier.id}
                  className={`relative p-6 rounded-xl border-2 transition-all ${
                    isCurrentTier
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">{tier.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tier.description}</p>
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                      {tier.price.monthly}
                      <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                        /month
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {tier.features.slice(0, 4).map((feature) => (
                      <li key={feature.id} className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature.description}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={isCurrentTier || isLoading}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all text-white ${
                      isCurrentTier
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } ${isLoading && !isCurrentTier ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {isLoading && !isCurrentTier
                      ? 'Processing...'
                      : isCurrentTier
                      ? 'Current Plan'
                      : 'Upgrade'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
