import React from 'react';
import type { AppView } from '../App';
import { StudyIcon, RevisionIcon, ProgressIcon, ProfileIcon, BookOpenIcon, TargetIcon } from './icons/AppIcons';

interface BottomNavProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const NavItem: React.FC<{
  view: AppView;
  label: string;
  Icon: React.FC<{ className?: string }>;
  isActive: boolean;
  onClick: (view: AppView) => void;
}> = ({ view, label, Icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-brand-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    <Icon className="w-6 h-6 mb-1" />
    <span className="text-xs font-medium">{label}</span>
    {isActive && <div className="w-10 h-1 bg-brand-primary rounded-full mt-1"></div>}
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: 'study' as AppView, label: 'Study', Icon: StudyIcon },
    { view: 'revision' as AppView, label: 'Revision', Icon: RevisionIcon },
    { view: 'progress' as AppView, label: 'Progress', Icon: ProgressIcon },
    { view: 'achievements' as AppView, label: 'Achievements', Icon: TargetIcon },
    { view: 'myDecks' as AppView, label: 'My Decks', Icon: BookOpenIcon },
    { view: 'profile' as AppView, label: 'Profile', Icon: ProfileIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-brand-surface/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 shadow-lg z-50 md:hidden">
      <div className="max-w-md mx-auto h-full flex items-center justify-around">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            {...item}
            isActive={activeView === item.view}
            onClick={setActiveView}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
