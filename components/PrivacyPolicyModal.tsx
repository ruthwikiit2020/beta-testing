import React, { useEffect } from 'react';
import { XIcon } from './icons/AppIcons';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sections = [
    {
      title: "1. Information We Collect",
      points: [
        "Personal information: Name, email address, and profile picture from Google authentication",
        "Study data: PDF documents you upload, generated flashcards, and study progress",
        "Usage information: Study sessions, card interactions, and feature usage statistics",
        "Device information: Browser type, device type, and operating system for optimization"
      ]
    },
    {
      title: "2. How We Use Your Information",
      points: [
        "To provide and improve our AI-powered flashcard generation service",
        "To personalize your learning experience and track your progress",
        "To send notifications and reminders based on your preferences",
        "To analyze usage patterns and improve our platform's performance",
        "To process payments and manage your subscription",
        "To communicate important updates about your account"
      ]
    },
    {
      title: "3. Data Storage & Security",
      points: [
        "All data is stored securely on Firebase Cloud (Google Cloud Platform)",
        "We use AES-256 encryption to protect your data at rest and in transit",
        "Authentication is handled through Google OAuth 2.0 for maximum security",
        "Your data is stored across multiple regions for redundancy and reliability",
        "We implement regular security audits and updates to protect your information"
      ]
    },
    {
      title: "4. Data Sharing & Third Parties",
      points: [
        "We do NOT sell your personal information to third parties",
        "Google Gemini AI processes your PDFs to generate flashcards (data is not stored by Google)",
        "Razorpay handles payment processing securely (we don't store payment details)",
        "We may share aggregated, anonymized data for research and improvement purposes",
        "We will only share your data if required by law or to protect our rights"
      ]
    },
    {
      title: "5. Your Rights & Control",
      points: [
        "You can access all your data at any time through your account",
        "You can delete your account and all associated data permanently",
        "You can opt out of notifications and marketing communications",
        "You can request a copy of your data for export",
        "You have the right to correct any inaccurate information"
      ]
    },
    {
      title: "6. Data Retention",
      points: [
        "Active accounts: Data is retained as long as your account is active",
        "Inactive accounts: Data may be deleted after 2 years of inactivity",
        "Deleted accounts: Data is permanently deleted within 30 days of account deletion",
        "Subscription data: Payment records retained for 7 years for compliance",
        "You can request immediate data deletion by contacting support"
      ]
    },
    {
      title: "7. Cookies & Tracking",
      points: [
        "We use essential cookies for authentication and session management",
        "LocalStorage is used to save your preferences and improve performance",
        "We do not use third-party tracking or advertising cookies",
        "You can clear cookies and local data through your browser settings"
      ]
    },
    {
      title: "8. Children's Privacy",
      points: [
        "Our service is designed for students of all ages, including minors",
        "For users under 18, we recommend parental guidance",
        "We comply with applicable children's privacy laws",
        "Parents can request deletion of their child's account at any time"
      ]
    },
    {
      title: "9. International Users",
      points: [
        "ReWise AI is available globally and complies with GDPR requirements",
        "Data may be transferred and stored in different countries",
        "We ensure appropriate safeguards for international data transfers",
        "You consent to international data processing by using our service"
      ]
    },
    {
      title: "10. Changes to Privacy Policy",
      points: [
        "We may update this policy to reflect changes in our practices",
        "Users will be notified of significant changes via email",
        "Continued use of the service constitutes acceptance of updates",
        "Last updated: October 2025"
      ]
    },
    {
      title: "11. Contact Us",
      points: [
        "Email: rewiseai@gmail.com",
        "For privacy concerns or data requests, contact our support team",
        "We will respond to all inquiries within 48 hours",
        "You can also reach us via WhatsApp at +919182127853"
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Privacy Policy</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How we protect and use your data</p>
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
                  At ReWise AI, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, store, and protect your data when you use our service.
                </p>
              </div>

              {/* Policy Sections */}
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
              Last Updated: October 23, 2025
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-sm"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;

