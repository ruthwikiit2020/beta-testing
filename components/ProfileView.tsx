import React from 'react';
import { 
    ArrowRightIcon, BookOpenIcon, TargetIcon, CogIcon, QuestionMarkCircleIcon, LogoutIcon 
} from './icons/AppIcons';
import { subscriptionService } from '../services/subscriptionService';
import { PRICING_TIERS } from '../types/pricing';
import type { AppView } from '../App';
import type { ProgressData, GoogleUser } from '../types';

interface ProfileViewProps {
  user: GoogleUser | null;
  progressData: ProgressData;
  cardsStudied: number;
  setActiveView: (view: AppView) => void;
  onLogout: () => void;
  onOpenModal: (modal: 'settings' | 'help') => void;
}

const StatItem: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
);

const ProfileLink: React.FC<{ label: string; description: string; onClick?: () => void, Icon: React.FC<{className?: string}> }> = ({ label, description, onClick, Icon }) => (
    <button onClick={onClick} className="w-full text-left flex items-center bg-white dark:bg-brand-surface hover:bg-slate-50 dark:hover:bg-slate-800 p-3 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
        <Icon className="w-5 h-5 mr-3 text-brand-primary"/>
        <div>
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <ArrowRightIcon className="w-4 h-4 ml-auto text-slate-400 dark:text-slate-500" />
    </button>
);


const ProfileView: React.FC<ProfileViewProps> = ({ user, progressData, cardsStudied, setActiveView, onLogout, onOpenModal }) => {
    // Create a fallback avatar with user's initial
    const getInitials = (name: string | null) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const fallbackAvatar = `data:image/svg+xml,${encodeURIComponent(`
        <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" fill="#3b82f6" rx="32"/>
            <text x="32" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">
                ${getInitials(user?.name)}
            </text>
        </svg>
    `)}`;

    console.log('ProfileView - user data:', user);
    console.log('ProfileView - user picture:', user?.picture);

    // Show loading state if user is not loaded
    if (!user) {
        return (
            <div className="p-3 md:p-4 flex flex-col items-center max-w-2xl mx-auto h-full">
                <div className="w-16 h-16 rounded-full mb-3 border-2 border-white dark:border-slate-600 shadow-lg bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 flex flex-col items-center max-w-2xl mx-auto h-full justify-center">
            <div className="w-full">
            <img 
              src={user.picture || fallbackAvatar} 
              alt="Profile" 
              className="w-16 h-16 rounded-full mb-3 border-2 border-white dark:border-slate-600 shadow-lg mx-auto"
              onError={(e) => {
                console.log('Profile image failed to load, using fallback');
                e.currentTarget.src = fallbackAvatar;
              }}
            />
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-lg font-bold">{user?.name}</h1>
              {subscriptionService.getCurrentTier() !== 'free' && (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  subscriptionService.getCurrentTier() === 'pro' 
                    ? 'bg-brand-primary text-white' 
                    : subscriptionService.getCurrentTier() === 'flash'
                    ? 'bg-purple-500 text-white'
                    : subscriptionService.getCurrentTier() === 'institution'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                }`}>
                  {subscriptionService.getCurrentTier().toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 text-center">{user?.email}</p>

            <div className="w-full bg-white dark:bg-brand-surface p-3 rounded-lg flex justify-around mb-3 border border-slate-200 dark:border-slate-700">
                <StatItem value={cardsStudied} label="Cards Studied" />
                <StatItem value={progressData.dayStreak} label="Day Streak" />
                <StatItem value={progressData.achievements.length} label="Achievements" />
            </div>

            <div className="w-full flex flex-col gap-2">
                <ProfileLink label="My Decks" description="Manage your study materials" onClick={() => setActiveView('myDecks')} Icon={BookOpenIcon} />
                <ProfileLink label="Achievements" description="View your progress badges" onClick={() => setActiveView('achievements')} Icon={TargetIcon}/>
                <ProfileLink label="Settings" description="App preferences" onClick={() => onOpenModal('settings')} Icon={CogIcon}/>
                <ProfileLink label="Help & Support" description="Get help and feedback" onClick={() => onOpenModal('help')} Icon={QuestionMarkCircleIcon}/>
                
                {/* Subscription Info Card */}
                <div className="w-full bg-gradient-to-r from-brand-primary to-teal-600 p-4 rounded-lg shadow-lg mt-2">
                  <div className="text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm">Current Plan</h3>
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                        {subscriptionService.getCurrentTier().toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-teal-100 mb-3">
                      {PRICING_TIERS[subscriptionService.getCurrentTier()]?.description || 'Your active subscription plan'}
                    </p>
                    
                    {/* Subscription Details */}
                    {subscriptionService.getSubscription().endDate && subscriptionService.getCurrentTier() !== 'free' && (
                      <div className="text-xs text-teal-100 mb-3">
                        <span className="opacity-80">Expires: </span>
                        <span className="font-semibold">
                          {new Date(subscriptionService.getSubscription().endDate!).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                    
                    {/* Upgrade Button */}
                    {subscriptionService.getCurrentTier() !== 'institution' && subscriptionService.getCurrentTier() !== 'owner' && (
                      <button
                        onClick={() => onOpenModal('settings')}
                        className="w-full bg-white text-brand-primary font-semibold py-2 px-4 rounded-lg hover:bg-teal-50 transition-all transform hover:scale-105 text-sm"
                      >
                        {subscriptionService.getCurrentTier() === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                      </button>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  <LogoutIcon className="w-4 h-4" />
                  Log Out
                </button>
            </div>
            </div>
        </div>
    );
};

export default ProfileView;