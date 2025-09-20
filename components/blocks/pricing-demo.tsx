import { PricingSection } from "./pricing-section";
import { PAYMENT_FREQUENCIES, TIERS } from "./pricing-data";

interface PricingSectionDemoProps {
  onFreePlanClick?: () => void;
}

export function PricingSectionDemo({ onFreePlanClick }: PricingSectionDemoProps) {
  return (
    <div className="relative flex justify-center items-center w-full mt-20 scale-90">
      <div className="absolute inset-0 -z-10">
        {/* ReWise AI Grid Background */}
        <div className="h-full w-full bg-[linear-gradient(to_right,#6366f11a_1px,transparent_1px),linear-gradient(to_bottom,#6366f11a_1px,transparent_1px)] bg-[size:35px_35px] opacity-40 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
      <PricingSection
        title="Simple Pricing"
        subtitle="Choose the best plan for your study goals"
        frequencies={PAYMENT_FREQUENCIES}
        tiers={TIERS}
        onFreePlanClick={onFreePlanClick}
      />
    </div>
  );
}
