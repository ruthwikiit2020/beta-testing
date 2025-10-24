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
      title: "Interpretation and Definitions",
      subsections: [
        {
          subtitle: "Interpretation",
          points: [
            "Words with capitalized initial letters have meanings defined under the following conditions."
          ]
        },
        {
          subtitle: "Definitions",
          points: [
            'Company ("Rewise AI", "we", "us", or "our") refers to Rewise AI, Hyderabad, Telangana, India (Postal Code 501505)',
            "Service refers to the website and related services, accessible from https://rewiseai.com",
            "Account means a unique account created for you to access our Service",
            "Device means any device that can access the Service, such as a computer, smartphone, or tablet",
            "Personal Data refers to any information that relates to an identified or identifiable individual",
            "Usage Data means data collected automatically from use of the Service (e.g., browser type, IP address, time spent on pages, etc.)",
            "Cookies are small text files placed on your device by a website to store certain information",
            "Service Provider means any third-party entity that processes data on behalf of the Company"
          ]
        }
      ]
    },
    {
      title: "Collecting and Using Your Personal Data",
      subsections: [
        {
          subtitle: "Types of Data Collected - Personal Data",
          points: [
            "Name",
            "Email address",
            "Phone number",
            "Billing details (for paid services)",
            "Usage Data (as defined below)"
          ]
        },
        {
          subtitle: "Usage Data",
          points: [
            "IP address",
            "Browser type and version",
            "Pages visited and time spent",
            "Referring/exit pages",
            "Device information"
          ]
        },
        {
          subtitle: "Tracking and Analytics Tools",
          points: [
            "Google Analytics for traffic and behavior analysis",
            "Google Ads and other advertising services to display personalized or contextual ads",
            "Cookies and similar technologies (pixels, web beacons, scripts)",
            "You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on"
          ]
        }
      ]
    },
    {
      title: "Use of Personal Data",
      points: [
        "To provide, maintain, and improve our Service",
        "To process payments (for paid plans and features)",
        "To personalize user experience and recommendations",
        "To show contextual and non-explicit ads (age-safe and educational)",
        "To communicate updates, offers, and support",
        "To analyze usage and improve performance",
        "To comply with legal obligations"
      ]
    },
    {
      title: "Educational and Age-Safe Policy",
      points: [
        "Rewise AI is designed for educational purposes only",
        "We do not host or promote explicit, harmful, or age-restricted content",
        "All ads displayed (if any) are family-safe and educational in nature",
        "Our Service is suitable for all age groups"
      ]
    },
    {
      title: "Your Privacy Rights - Under the GDPR (EU & UK)",
      points: [
        "Right to access, correct, or delete your data",
        "Right to restrict or object to processing",
        "Right to data portability",
        "Right to withdraw consent at any time",
        "Right to lodge a complaint with a Data Protection Authority",
        "We process your data when: You have given consent, It is necessary to fulfill a contract, It is required by law, It is in our legitimate business interest"
      ]
    },
    {
      title: "Under CCPA & CPRA (California Residents)",
      points: [
        "Right to know what personal data we collect and how it's used",
        "Right to request deletion of your personal data",
        "Right to opt-out of the sale or sharing of your personal data",
        "Right to non-discrimination for exercising privacy rights",
        "We do not sell user data for profit. However, some analytics and advertising partners may process data under their terms",
        "You can exercise your rights by contacting rewiseai@gmail.com"
      ]
    },
    {
      title: "Under CalOPPA (California Online Privacy Protection Act)",
      points: [
        "Displaying a clear Privacy Policy link on our homepage",
        "Allowing users to visit our site anonymously",
        "Notifying users of any Privacy Policy changes via this page",
        'Honoring "Do Not Track" signals (where applicable)'
      ]
    },
    {
      title: "Retention and Deletion of Data",
      points: [
        "We retain personal data only as long as necessary for the purposes stated in this Privacy Policy",
        "You may request deletion at any time by contacting us",
        "Deleted accounts: Data permanently deleted within 30 days",
        "Payment records: Retained for 7 years for compliance"
      ]
    },
    {
      title: "Security of Data",
      points: [
        "We use commercially reasonable security measures to protect your data",
        "AES-256 encryption for data at rest and in transit",
        "Google OAuth 2.0 for secure authentication",
        "However, no system is 100% secure"
      ]
    },
    {
      title: "Children's Privacy",
      points: [
        "Our Service is suitable for all age groups and does not target children under 13 specifically",
        "If you believe a child under 13 has provided personal data without parental consent, contact us to remove it"
      ]
    },
    {
      title: "Changes to This Privacy Policy",
      points: [
        "We may update this Privacy Policy periodically",
        "The updated version will be posted on this page with the new 'Last updated' date",
        "Continued use of the Service constitutes acceptance of updates"
      ]
    },
    {
      title: "Contact Us",
      points: [
        "📧 Email: rewiseai@gmail.com",
        "🌐 Website: https://rewiseai.com",
        "📱 WhatsApp: +919182127853",
        "We will respond to all inquiries within 48 hours"
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
                  This Privacy Policy describes our policies and procedures on the collection, use, and disclosure of your information when you use the Service, and tells you about your privacy rights and how applicable privacy laws (GDPR, CCPA/CPRA, CalOPPA, and others) protect you.
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                  By using Rewise AI, you agree to the collection and use of information in accordance with this Privacy Policy.
                </p>
              </div>

              {/* Policy Sections */}
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{section.title}</h3>
                  
                  {section.subsections ? (
                    section.subsections.map((subsection, subIdx) => (
                      <div key={subIdx} className="ml-4 space-y-2">
                        {subsection.subtitle && (
                          <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">{subsection.subtitle}</h4>
                        )}
                        <ul className="space-y-2">
                          {subsection.points.map((point, pointIdx) => (
                            <li key={pointIdx} className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <ul className="space-y-2">
                      {section.points?.map((point, pointIdx) => (
                        <li key={pointIdx} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
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
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;

