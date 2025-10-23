import React, { useState } from "react";
import { PricingSection } from "./pricing-section";
import { PAYMENT_FREQUENCIES, TIERS } from "./pricing-data";
import UpgradeModal from "../UpgradeModal";
import { PricingTier } from "../../types/pricing";
import { openRazorpayCheckout } from "../../services/subscriptionService"; // Make sure path is correct

interface PricingSectionDemoProps {
  onFreePlanClick?: () => void;
}

export function PricingSectionDemo({ onFreePlanClick }: PricingSectionDemoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTier, setCurrentTier] = useState<PricingTier>("free");
  const [targetTier, setTargetTier] = useState<PricingTier | undefined>(undefined);
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');

  // 🔹 Handle Upgrade Button Click
  const handleUpgradeClick = (tierId: PricingTier) => {
    if (tierId === "free") {
      onFreePlanClick?.();
    } else {
      setTargetTier(tierId);
      setIsModalOpen(true);
    }
  };

  // 🔹 Handle Razorpay Checkout
  const handlePayment = (tierId: PricingTier, currentFrequency: 'monthly' | 'yearly') => {
    const tier = TIERS.find((t) => t.id === tierId);
    if (!tier) return;

    let amount: number;
    
    if (currentFrequency === 'yearly' && tier.yearlyTotal) {
      // Use yearly total for payment
      amount = tier.yearlyTotal;
    } else {
      // Use monthly price
      amount = parseInt(tier.price.monthly.replace(/₹|,/g, "")); 
    }
    
    openRazorpayCheckout(amount, tierId);
    setIsModalOpen(false); // Close modal once checkout opens
  };

  return (
    <div className="relative flex justify-center items-center w-full scale-80">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#6366f11a_1px,transparent_1px),linear-gradient(to_bottom,#6366f11a_1px,transparent_1px)] bg-[size:35px_35px] opacity-40 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Pricing Cards */}
      <PricingSection
  title="Simple Pricing"
  subtitle="Choose the best plan for your goals"
  frequencies={PAYMENT_FREQUENCIES}
  tiers={TIERS.map((tier) => ({
    ...tier,
    onClick: async () => {
      if (tier.id === "free") {
        onFreePlanClick?.();
      } else {
        // Check if user is signed in before allowing payment
        const { auth } = await import('../../services/firebase');
        const user = auth.currentUser;
        
        if (!user) {
          // Store the intended action for after login
          localStorage.setItem('pendingUpgrade', JSON.stringify({
            tierId: tier.id,
            frequency: frequency
          }));
          
          alert('Please sign in first to purchase a plan!\n\nYou will be redirected to the subscription page after signing in.');
          onFreePlanClick?.(); // Redirect to sign in
          return;
        }
        
        let amount: number;
        if (frequency === 'yearly' && tier.yearlyTotal) {
          amount = tier.yearlyTotal;
        } else {
          amount = parseInt(tier.price.monthly.replace(/₹|,/g, ""));
        }
        openRazorpayCheckout(amount, tier.id, frequency);
      }
    },
  }))}
  onFrequencyChange={setFrequency}
/>


      {/* 💳 Upgrade Modal */}
      <UpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentTier={currentTier}
        targetTier={targetTier}
        reason={
          targetTier
            ? `Upgrade to ${targetTier?.toUpperCase()} to unlock premium features`
            : undefined
        }
        onUpgrade={() => targetTier && handlePayment(targetTier, frequency)}
      />
    </div>
  );
}
