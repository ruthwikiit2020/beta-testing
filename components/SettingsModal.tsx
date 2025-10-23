import React, { useEffect, useState } from 'react';
import { XIcon, CheckIcon, ArrowRightIcon } from './icons/AppIcons';
import { subscriptionService, openRazorpayCheckout } from '../services/subscriptionService';
import { notificationService } from '../services/notificationService';
import { PRICING_TIERS } from '../types/pricing';
import { TIERS } from './blocks/pricing-data';
import PrivacyPolicyModal from './PrivacyPolicyModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  initialTab?: 'general' | 'subscription';
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, theme, onThemeChange, initialTab = 'general' }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'subscription'>('general');
  
  // Update activeTab when modal opens or initialTab changes
  React.useEffect(() => {
    if (isOpen) {
      console.log('Settings modal opened with initialTab:', initialTab);
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  const isDarkMode = theme === 'dark';
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return notificationService.getSettings().isEnabled;
  });
  const [notificationTime, setNotificationTime] = useState(() => {
    return notificationService.getSettings().dailyNotificationTime;
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [billingFrequency, setBillingFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [showDataPrivacy, setShowDataPrivacy] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const currentTier = subscriptionService.getCurrentTier();
  const subscription = subscriptionService.getSubscription();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  if (!isOpen) return null;

  const handleUpgrade = (tierId: string) => {
    if (tierId === 'free') {
      onClose();
      return;
    }
    
    // Find the tier data with pricing info
    const tierData = TIERS.find(t => t.id === tierId);
    if (!tierData) return;
    
    // Calculate amount based on billing frequency
    let amount: number;
    if (billingFrequency === 'yearly' && tierData.yearlyTotal) {
      amount = tierData.yearlyTotal;
    } else {
      amount = parseInt(tierData.price.monthly.replace(/₹|,/g, ""));
    }
    
    // Open Razorpay checkout
    openRazorpayCheckout(amount, tierId, billingFrequency, () => {
      // Close modal and reload after successful payment
      onClose();
      window.location.reload();
    });
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    onThemeChange(newTheme);
  };

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      notificationService.disableNotifications();
      setNotificationsEnabled(false);
    } else {
      const success = await notificationService.enableNotifications();
      if (success) {
        setNotificationsEnabled(true);
        setNotificationPermission(Notification.permission);
      } else {
        alert('Unable to enable notifications. Please check your browser settings and allow notifications for this site.');
      }
    }
  };

  const handleNotificationTimeChange = (time: string) => {
    setNotificationTime(time);
    notificationService.setDailyNotificationTime(time);
  };

  const testNotification = async () => {
    const success = await notificationService.testNotification();
    if (!success) {
      alert('Unable to send test notification. Please check your browser settings.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including flashcards, progress, and subscription information.'
    );
    
    if (!confirmDelete) return;
    
    const confirmAgain = window.confirm(
      'FINAL WARNING: This will permanently delete everything. Type your email to confirm you want to proceed.'
    );
    
    if (!confirmAgain) return;
    
    try {
      const { auth, db } = await import('../services/firebase');
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { deleteUser } = await import('firebase/auth');
      
      const user = auth.currentUser;
      if (!user) {
        alert('No user logged in');
        return;
      }
      
      // Delete user data from Firestore
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);
      
      // Delete authentication account
      await deleteUser(user);
      
      // Clear local storage
      localStorage.clear();
      
      alert('Your account has been permanently deleted.');
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again or contact support.');
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
                description="Get daily study reminders"
                icon={<span>🔔</span>}
                rightElement={
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Off</span>
                    <div 
                      className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                        notificationsEnabled ? 'bg-brand-primary' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNotifications();
                      }}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        notificationsEnabled ? 'right-0.5' : 'left-0.5'
                      }`}></div>
                    </div>
                    <span className="text-sm text-slate-500">On</span>
                  </div>
                }
              />

              {/* Notification Time Setting - Only show if notifications are enabled */}
              {notificationsEnabled && (
                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <span>⏰</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Daily Reminder Time</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose when to receive your daily study reminder</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={notificationTime}
                      onChange={(e) => handleNotificationTimeChange(e.target.value)}
                      className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                    <button
                      onClick={testNotification}
                      className="px-3 py-2 text-sm bg-brand-primary text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Test
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Permission Status */}
              {notificationPermission === 'denied' && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-lg">⚠️</span>
                    <div>
                      <h5 className="font-semibold text-red-800 dark:text-red-200">Notifications Blocked</h5>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                        Notifications are blocked by your browser. Please enable them in your browser settings to receive daily reminders.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Privacy Collapsible Section */}
              <div className="space-y-4 mt-6">
                <button
                  onClick={() => setShowDataPrivacy(!showDataPrivacy)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">Data & Privacy</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Manage your data and privacy settings</p>
                    </div>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-slate-400 transition-transform ${showDataPrivacy ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDataPrivacy && (
                  <div className="space-y-4 pl-4 pr-4 pb-4">
                    {/* Security Information */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Security & Data Protection</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Your study materials and flashcards are encrypted and stored securely. We use industry-standard security measures to protect your information.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Storage</span>
                          <span className="text-sm text-slate-500">Firebase Cloud (Google)</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Encryption Standard</span>
                          <span className="text-sm text-slate-500">AES-256 Encryption</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Authentication Method</span>
                          <span className="text-sm text-slate-500">Google OAuth 2.0</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Location</span>
                          <span className="text-sm text-slate-500">Multi-region Cloud</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Privacy Policy Link */}
                    <button 
                      onClick={() => setShowPrivacyPolicy(true)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Privacy Policy</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Read our complete privacy policy</p>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-slate-400" />
                    </button>
                    
                    {/* Delete Account */}
                    <button 
                      onClick={handleDeleteAccount}
                      className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Delete Account</p>
                        <p className="text-xs text-red-500 dark:text-red-400">Permanently delete your account and all data</p>
                      </div>
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

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
                  Current Plan: <span className="font-semibold text-brand-primary">{PRICING_TIERS[currentTier]?.name || currentTier.toUpperCase()}</span>
                </div>
              </div>

              {/* Current Plan Card */}
              <div className="bg-gradient-to-r from-brand-primary to-teal-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold">{PRICING_TIERS[currentTier]?.name || currentTier.toUpperCase()} Plan</h4>
                    <p className="text-teal-100">{PRICING_TIERS[currentTier]?.description || 'Your active subscription plan'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{PRICING_TIERS[currentTier]?.price.monthly || '₹0'}</div>
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
                  {(PRICING_TIERS[currentTier]?.features || []).map((feature, index) => (
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
                  <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Upgrade Options:</h4>
                    
                    {/* Billing Frequency Toggle */}
                    <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => setBillingFrequency('monthly')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          billingFrequency === 'monthly'
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingFrequency('yearly')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          billingFrequency === 'yearly'
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    {TIERS.map((tier) => {
                      if (tier.id === 'free') return null;
                      
                      const isCurrentPlan = tier.id === currentTier;
                      const displayPrice = billingFrequency === 'monthly' 
                        ? tier.price.monthly 
                        : tier.price.yearly;
                      
                      return (
                        <div key={tier.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                          isCurrentPlan 
                            ? 'border-brand-primary bg-brand-primary/5' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-brand-primary'
                        }`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-slate-800 dark:text-slate-200">{tier.name}</h5>
                              {tier.popular && (
                                <span className="px-2 py-0.5 bg-brand-primary text-white text-xs rounded-full font-semibold">
                                  Popular
                                </span>
                              )}
                              {isCurrentPlan && (
                                <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-semibold">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{tier.description}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{displayPrice}</span>
                              <span className="text-sm text-slate-500">/month</span>
                              {billingFrequency === 'yearly' && tier.yearlyTotal && (
                                <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">
                                  (₹{tier.yearlyTotal}/year total)
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUpgrade(tier.id)}
                            disabled={isCurrentPlan}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all text-sm ${
                              isCurrentPlan
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                : tier.popular
                                ? 'bg-brand-primary text-white hover:bg-teal-600 hover:scale-105'
                                : tier.highlighted
                                ? 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-105'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 hover:scale-105'
                            }`}
                          >
                            {isCurrentPlan ? 'Current Plan' : tier.cta}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
      
      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyPolicy} 
        onClose={() => setShowPrivacyPolicy(false)} 
      />
    </div>
  );
};

export default SettingsModal;