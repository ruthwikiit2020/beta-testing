import React, { useEffect, useState } from 'react';
import { XIcon, CheckIcon, ArrowRightIcon } from './icons/AppIcons';
import { subscriptionService } from '../services/subscriptionService';
import { PRICING_TIERS } from '../types/pricing';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'subscription'>('general');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const currentTier = subscriptionService.getCurrentTier();
  const subscription = subscriptionService.getSubscription();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgrade = (tier: string) => {
    if (tier === 'free') {
      onClose();
      return;
    }
    alert(`🚀 ${PRICING_TIERS[tier as keyof typeof PRICING_TIERS].name} tier will be unlocked shortly! We're working hard to bring you premium features.`);
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const SettingItem: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
    rightElement?: React.ReactNode;
  }> = ({ title, description, icon, onClick, rightElement }) => (
    <div 
      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
        onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700' : 'border-slate-100 dark:border-slate-800'
      }`}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {rightElement || (onClick && <ArrowRightIcon className="w-5 h-5 text-slate-400" />)}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-brand-dark rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <XIcon className="w-6 h-6 text-slate-600 dark:text-slate-300"/>
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
          <div className="flex px-6">
            {[
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'subscription', label: 'Subscription', icon: '💳' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">General Settings</h3>
              
              <SettingItem
                title="Theme"
                description="Switch between light and dark mode"
                icon={<span>🌙</span>}
                onClick={toggleTheme}
                rightElement={
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Light</span>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-brand-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isDarkMode ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                    <span className="text-sm text-slate-500">Dark</span>
                  </div>
                }
              />

              <SettingItem
                title="Notifications"
                description="Manage your notification preferences"
                icon={<span>🔔</span>}
                rightElement={
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">On</span>
                    <div className="w-12 h-6 bg-brand-primary rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                    </div>
                  </div>
                }
              />

              <SettingItem
                title="Data & Privacy"
                description="Manage your data and privacy settings"
                icon={<span>🔒</span>}
              />

              <SettingItem
                title="About"
                description="App version and information"
                icon={<span>ℹ️</span>}
                rightElement={<span className="text-sm text-slate-500">v1.0.0</span>}
              />
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Subscription</h3>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Current Plan: <span className="font-semibold text-brand-primary">{PRICING_TIERS[currentTier].name}</span>
                </div>
              </div>

              {/* Current Plan Card */}
              <div className="bg-gradient-to-r from-brand-primary to-teal-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold">{PRICING_TIERS[currentTier].name} Plan</h4>
                    <p className="text-teal-100">{PRICING_TIERS[currentTier].description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{PRICING_TIERS[currentTier].price.monthly}</div>
                    <div className="text-teal-100 text-sm">per month</div>
                  </div>
                </div>
                
                {/* Usage Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{subscription.usage.pdfUploadsToday}</div>
                    <div className="text-xs text-teal-100">PDFs Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{subscription.usage.flashcardsThisMonth}</div>
                    <div className="text-xs text-teal-100">Cards This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{subscription.usage.revisionHubCards}</div>
                    <div className="text-xs text-teal-100">Revision Cards</div>
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Your Plan Includes:</h4>
                <div className="space-y-2">
                  {PRICING_TIERS[currentTier].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade Options */}
              {currentTier !== 'institution' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Upgrade Options:</h4>
                  <div className="grid gap-3">
                    {Object.entries(PRICING_TIERS).map(([tierId, tier]) => {
                      if (tierId === currentTier) return null;
                      return (
                        <div key={tierId} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div>
                            <h5 className="font-semibold text-slate-800 dark:text-slate-200">{tier.name}</h5>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{tier.description}</p>
                          </div>
                          <button
                            onClick={() => handleUpgrade(tierId)}
                            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
                          >
                            {tier.cta}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Beta Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-lg">🚀</span>
                  <div>
                    <h5 className="font-semibold text-blue-800 dark:text-blue-200">Beta Version</h5>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                      You're using the beta version with all features unlocked! Premium features will be available soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;