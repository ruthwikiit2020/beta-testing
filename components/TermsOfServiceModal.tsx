import React, { useEffect } from 'react';
import { XIcon } from './icons/AppIcons';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sections = [
    {
      title: "1. Acceptance of Terms",
      points: [
        "By accessing and using Rewise AI (the 'Service'), you accept and agree to be bound by these Terms of Service",
        "If you do not agree to these terms, please do not use our Service",
        "We reserve the right to modify these terms at any time. Continued use constitutes acceptance of changes"
      ]
    },
    {
      title: "2. Description of Service",
      points: [
        "Rewise AI provides AI-powered flashcard generation from PDF study materials",
        "The Service uses Google Gemini AI to analyze and create study materials",
        "We offer various subscription tiers with different features and limits",
        "The Service is provided 'as is' and 'as available' without warranties"
      ]
    },
    {
      title: "3. User Accounts",
      points: [
        "You must create an account using Google authentication to access the Service",
        "You are responsible for maintaining the confidentiality of your account",
        "You agree to provide accurate, current, and complete information",
        "You must be at least 13 years old to create an account",
        "We reserve the right to suspend or terminate accounts that violate these terms"
      ]
    },
    {
      title: "4. Subscription Plans and Payments",
      points: [
        "We offer Free, Pro, Flash, and Institution subscription plans",
        "Paid subscriptions are billed monthly or yearly based on your selection",
        "Payments are processed securely through Razorpay",
        "Subscription fees are non-refundable except as required by law",
        "You can cancel your subscription at any time through Settings",
        "Upon cancellation, you retain access until the end of the billing period"
      ]
    },
    {
      title: "5. Usage Limits and Fair Use",
      points: [
        "Each plan has specific limits on PDF uploads, pages, and flashcards",
        "Free Plan: 5 PDFs/day (20 pages max), 80 cards/month",
        "Pro Plan: 12 PDFs/day (80 pages max), 400 cards/month",
        "Flash Plan: Unlimited uploads and flashcards",
        "We reserve the right to enforce limits to prevent abuse",
        "Excessive usage that impacts service performance may result in account suspension"
      ]
    },
    {
      title: "6. Intellectual Property",
      points: [
        "You retain all rights to the content you upload (PDFs and study materials)",
        "You grant us a license to process your content to provide the Service",
        "Generated flashcards are your property and can be exported",
        "The Rewise AI platform, design, and AI models are our intellectual property",
        "You may not copy, modify, or reverse engineer our Service"
      ]
    },
    {
      title: "7. User Conduct and Acceptable Use",
      points: [
        "You agree to use the Service only for lawful, educational purposes",
        "You will not upload copyrighted materials without permission",
        "You will not attempt to hack, spam, or abuse the Service",
        "You will not share your account credentials with others",
        "Violation of these terms may result in account termination"
      ]
    },
    {
      title: "8. Content and Data",
      points: [
        "We do not claim ownership of your uploaded content",
        "You are responsible for the content you upload and share",
        "We may remove content that violates our policies or applicable laws",
        "We are not responsible for the accuracy of AI-generated flashcards",
        "You should verify all generated content for accuracy"
      ]
    },
    {
      title: "9. Third-Party Services",
      points: [
        "We use Google Gemini AI for flashcard generation",
        "We use Firebase for data storage and authentication",
        "We use Razorpay for payment processing",
        "We may display Google Ads and other advertisements",
        "Third-party services have their own terms and privacy policies"
      ]
    },
    {
      title: "10. Advertising",
      points: [
        "We may display advertisements through Google AdSense and other networks",
        "Ads are educational, age-appropriate, and non-explicit",
        "We do not control the content of third-party advertisements",
        "Clicking on ads is at your own discretion"
      ]
    },
    {
      title: "11. Disclaimer of Warranties",
      points: [
        "The Service is provided 'AS IS' without warranties of any kind",
        "We do not guarantee uninterrupted or error-free service",
        "AI-generated content may contain errors or inaccuracies",
        "We are not responsible for any loss of data or academic performance",
        "Use of the Service is at your own risk"
      ]
    },
    {
      title: "12. Limitation of Liability",
      points: [
        "We are not liable for any indirect, incidental, or consequential damages",
        "Our total liability shall not exceed the amount you paid in the last 12 months",
        "We are not responsible for third-party content or services",
        "This limitation applies to the fullest extent permitted by law"
      ]
    },
    {
      title: "13. Indemnification",
      points: [
        "You agree to indemnify and hold harmless Rewise AI from any claims arising from your use of the Service",
        "This includes claims related to content you upload or share",
        "You are responsible for any violations of intellectual property rights"
      ]
    },
    {
      title: "14. Termination",
      points: [
        "We may terminate or suspend your account at any time for violations of these terms",
        "You may terminate your account at any time through Settings",
        "Upon termination, your right to use the Service immediately ceases",
        "Certain provisions of these terms survive termination"
      ]
    },
    {
      title: "15. Governing Law",
      points: [
        "These terms are governed by the laws of India",
        "Any disputes shall be resolved in the courts of Hyderabad, Telangana",
        "If any provision is found unenforceable, the remaining provisions continue in effect"
      ]
    },
    {
      title: "16. Contact Information",
      points: [
        "For questions about these Terms of Service:",
        "📧 Email: rewiseai@gmail.com",
        "🌐 Website: https://rewiseai.com",
        "📱 WhatsApp: +919182127853",
        "📍 Address: Hyderabad, Telangana, India - 501505"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-brand-dark rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Terms of Service</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please read these terms carefully</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <XIcon className="w-6 h-6 text-slate-600 dark:text-slate-300"/>
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Welcome to Rewise AI. These Terms of Service govern your use of our AI-powered flashcard generation platform. By using our Service, you agree to these terms.
                </p>
              </div>

              {/* Terms Sections */}
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last Updated: October 24, 2025
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-sm"
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;

