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
      "5 PDF uploads/day (max 20 pages each)",
      "80 flashcards/month",
      "Revision Hub: 10 cards saved",
      "Basic spaced repetition",
      "Light/Dark mode",
    ],
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      monthly: "₹199",
      yearly: "₹99",
    },
    yearlyTotal: 1188, // Yearly total for payment (99 * 12 = 1188)
    description: "Most Popular – Perfect for students",
    features: [
      "12 PDF uploads/day (max 80 pages each)",
      "400 flashcards/month",
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
    yearlyTotal: 4788, // Yearly total for payment (399 * 12 = 4788)
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
