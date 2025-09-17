import React from 'react';
import { 
    ArrowRightIcon, BookOpenIcon, TargetIcon, CogIcon, QuestionMarkCircleIcon, LogoutIcon 
} from './icons/AppIcons';
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
    return (
        <div className="p-3 md:p-4 flex flex-col items-center max-w-2xl mx-auto h-full">
            <img 
              src={user?.picture ?? undefined} 
              alt="Profile" 
              className="w-16 h-16 rounded-full mb-3 border-2 border-white dark:border-slate-600 shadow-lg"
            />
            <h1 className="text-lg font-bold">{user?.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user?.email}</p>

            <div className="w-full bg-white dark:bg-brand-surface p-3 rounded-lg flex justify-around mb-4 border border-slate-200 dark:border-slate-700">
                <StatItem value={cardsStudied} label="Cards Studied" />
                <StatItem value={progressData.dayStreak} label="Day Streak" />
                <StatItem value={progressData.achievements.length} label="Achievements" />
            </div>

            <div className="w-full flex flex-col gap-2 flex-1">
                <ProfileLink label="My Decks" description="Manage your study materials" onClick={() => setActiveView('myDecks')} Icon={BookOpenIcon} />
                <ProfileLink label="Achievements" description="View your progress badges" onClick={() => setActiveView('achievements')} Icon={TargetIcon}/>
                <ProfileLink label="Settings" description="App preferences" onClick={() => onOpenModal('settings')} Icon={CogIcon}/>
                <ProfileLink label="Help & Support" description="Get help and feedback" onClick={() => onOpenModal('help')} Icon={QuestionMarkCircleIcon}/>
            </div>
            
            <button
              onClick={onLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
                <LogoutIcon className="w-4 h-4" />
                Log Out
            </button>
        </div>
    );
};

export default ProfileView;