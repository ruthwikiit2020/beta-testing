import React, { useEffect } from 'react';
import { XIcon } from './icons/AppIcons';

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookiePolicyModal: React.FC<CookiePolicyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sections = [
    {
      title: "1. What Are Cookies?",
      points: [
        "Cookies are small text files that are placed on your device when you visit our website",
        "They help us remember your preferences and improve your experience",
        "Cookies can be 'session' cookies (temporary) or 'persistent' cookies (stored longer)",
        "You can control cookies through your browser settings"
      ]
    },
    {
      title: "2. How We Use Cookies",
      points: [
        "Essential Cookies: Required for authentication and basic functionality",
        "Preference Cookies: Remember your settings (theme, language, etc.)",
        "Analytics Cookies: Help us understand how you use our Service (Google Analytics)",
        "Advertising Cookies: Used by Google AdSense to show relevant ads"
      ]
    },
    {
      title: "3. Types of Cookies We Use",
      subsections: [
        {
          subtitle: "Essential Cookies",
          points: [
            "Authentication tokens (Firebase Auth)",
            "Session management",
            "Security features",
            "These cookies are necessary for the Service to function"
          ]
        },
        {
          subtitle: "Analytics Cookies",
          points: [
            "Google Analytics: Tracks page views, user behavior, and demographics",
            "Performance monitoring: Helps us identify and fix issues",
            "Usage statistics: Understand which features are most popular"
          ]
        },
        {
          subtitle: "Advertising Cookies",
          points: [
            "Google AdSense: Delivers personalized advertisements",
            "Remarketing: Shows relevant ads based on your interests",
            "Ad performance: Measures effectiveness of advertisements",
            "Third-party cookies: Set by advertising partners"
          ]
        }
      ]
    },
    {
      title: "4. LocalStorage and Similar Technologies",
      points: [
        "We use browser LocalStorage to save your preferences and data",
        "This includes theme settings, study progress, and cached flashcards",
        "LocalStorage data remains on your device until you clear it",
        "We use session storage for temporary data during your session"
      ]
    },
    {
      title: "5. Third-Party Cookies",
      points: [
        "Google Analytics: Collects anonymous usage data",
        "Google AdSense: Delivers and tracks advertisements",
        "Firebase: Authentication and data synchronization",
        "These services may set their own cookies subject to their privacy policies"
      ]
    },
    {
      title: "6. Google AdSense and Advertising",
      points: [
        "We use Google AdSense to display advertisements on our Service",
        "Google may use cookies to show personalized ads based on your interests",
        "You can opt out of personalized advertising at https://www.google.com/settings/ads",
        "Ads displayed are family-safe and educational in nature",
        "We do not control the content of third-party advertisements"
      ]
    },
    {
      title: "7. Managing Cookies",
      points: [
        "You can control and delete cookies through your browser settings",
        "Most browsers allow you to block third-party cookies",
        "Disabling cookies may affect the functionality of our Service",
        "Essential cookies cannot be disabled without affecting core features"
      ]
    },
    {
      title: "8. Browser Controls",
      subsections: [
        {
          subtitle: "How to Manage Cookies",
          points: [
            "Chrome: Settings > Privacy and Security > Cookies",
            "Firefox: Settings > Privacy & Security > Cookies and Site Data",
            "Safari: Preferences > Privacy > Cookies and website data",
            "Edge: Settings > Cookies and site permissions"
          ]
        }
      ]
    },
    {
      title: "9. Do Not Track Signals",
      points: [
        "Some browsers offer 'Do Not Track' (DNT) settings",
        "We honor DNT signals where technically feasible",
        "However, some third-party services may not honor DNT signals",
        "You can opt out of Google Analytics and AdSense separately"
      ]
    },
    {
      title: "10. Cookie Consent",
      points: [
        "By using our Service, you consent to our use of cookies as described in this policy",
        "You can withdraw consent by clearing cookies and ceasing use of the Service",
        "Essential cookies are required for the Service to function properly"
      ]
    },
    {
      title: "11. Updates to Cookie Policy",
      points: [
        "We may update this Cookie Policy to reflect changes in our practices",
        "The updated version will be posted with the new 'Last Updated' date",
        "Continued use of the Service constitutes acceptance of updates"
      ]
    },
    {
      title: "12. Contact Us",
      points: [
        "For questions about cookies or to exercise your rights:",
        "📧 Email: rewiseai@gmail.com",
        "🌐 Website: https://rewiseai.com",
        "📱 WhatsApp: +919182127853"
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Cookie Policy</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">How we use cookies and similar technologies</p>
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
                  This Cookie Policy explains how Rewise AI uses cookies and similar technologies to recognize you when you visit our Service. It explains what these technologies are, why we use them, and your rights to control our use of them.
                </p>
              </div>

              {/* Cookie Sections */}
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

export default CookiePolicyModal;

