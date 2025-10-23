import { PricingTier } from "./pricing-section";

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

export const TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: {
      monthly: "₹0",
      yearly: "₹0",
    },
    description: "Forever free, with daily limits",
    features: [
      "10 PDF uploads/day (max 20 pages each)",
      "100 flashcards/month",
      "Revision Hub: 15 cards saved",
      "Basic spaced repetition",
      "Light/Dark mode",
    ],
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      monthly: "₹1",
      yearly: "₹1",
    },
    yearlyTotal: 12, // Yearly total for payment
    description: "Most Popular – Perfect for students",
    features: [
      "40 PDF uploads/day (max 80 pages each)",
      "1,000 flashcards/month",
      "Unlimited Revision Hub storage",
      "Smart filters (Formulas, Key Concepts, Summaries)",
      "Analytics dashboard",
      "Exam mode quizzes",
    ],
    cta: "Upgrade",
    popular: true,
  },
  {
    id: "flash",
    name: "Flash",
    price: {
      monthly: "₹499",
      yearly: "₹399",
    },
    yearlyTotal: 4800, // Yearly total for payment (399 * 12 = 4788, rounded to 4800)
    description: "For power users & researchers",
    features: [
      "Unlimited PDF uploads (no page limit)",
      "Unlimited flashcards & Revision Hub",
      "Priority AI processing (fastest queue)",
      "Offline mode (download flashcards)",
      "Personal AI tutor",
    ],
    cta: "Upgrade",
  },
  {
    id: "institution",
    name: "Institution",
    price: {
      monthly: "₹15,000",
      yearly: "₹10,000",
    },
    yearlyTotal: 120000, // Yearly total for payment (10,000 * 12 = 120,000)
    description: "For schools, colleges & coaching centers",
    features: [
      "Unlimited uploads & flashcards for all students",
      "Centralized teacher/admin dashboard",
      "Bulk student management (SSO/class codes)",
      "Shared flashcard libraries (per subject/course)",
      "Dedicated support & training",
      "Custom branding (institution logo)",
    ],
    cta: "Contact Sales",
    highlighted: true,
  },
];
