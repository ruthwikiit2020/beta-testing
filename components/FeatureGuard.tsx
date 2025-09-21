import React, { useState } from 'react';
import { PricingTier } from '../types/pricing';
import { subscriptionService } from '../services/subscriptionService';
import UpgradeModal from './UpgradeModal';

interface FeatureGuardProps {
  children: React.ReactNode;
  requiredTier: PricingTier;
  feature: string;
  reason?: string;
  fallback?: React.ReactNode;
  showUpgradeModal?: boolean;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({
  children,
  requiredTier,
  feature,
  reason,
  fallback,
  showUpgradeModal = true
}) => {
  const [showModal, setShowModal] = useState(false);
  const currentTier = subscriptionService.getCurrentTier();
  
  // Check if user has access to the required tier
  const hasAccess = checkTierAccess(currentTier, requiredTier);
  
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback or upgrade modal
  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgradeModal) {
    return (
      <>
        <div
          onClick={() => setShowModal(true)}
          className="cursor-pointer opacity-50 hover:opacity-75 transition-opacity"
        >
          {children}
        </div>
        <UpgradeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          currentTier={currentTier}
          targetTier={requiredTier}
          reason={reason || `Upgrade to ${requiredTier} to access ${feature}`}
        />
      </>
    );
  }

  return null;
};

// Helper function to check tier access
const checkTierAccess = (currentTier: PricingTier, requiredTier: PricingTier): boolean => {
  // Owner always has access to everything
  if (currentTier === 'owner') {
    return true;
  }
  
  const tierOrder: PricingTier[] = ['free', 'pro', 'flash', 'institution', 'owner'];
  const currentIndex = tierOrder.indexOf(currentTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  
  return currentIndex >= requiredIndex;
};

export default FeatureGuard;
