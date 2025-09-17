import React from 'react';
import type { AppView } from '../App';
import { StudyIcon, RevisionIcon, ProgressIcon, ProfileIcon, BookOpenIcon } from './icons/AppIcons';

interface SideNavProps {
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
    className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'bg-brand-primary/20 text-brand-primary' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    <Icon className="w-6 h-6" />
    <span className="text-sm font-semibold ml-3">{label}</span>
  </button>
);

const SideNav: React.FC<SideNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: 'study' as AppView, label: 'Study', Icon: StudyIcon },
    { view: 'revision' as AppView, label: 'Revision', Icon: RevisionIcon },
    { view: 'progress' as AppView, label: 'Progress', Icon: ProgressIcon },
    { view: 'myDecks' as AppView, label: 'My Decks', Icon: BookOpenIcon },
    { view: 'profile' as AppView, label: 'Profile', Icon: ProfileIcon },
  ];

  return (
    <nav className="hidden md:flex flex-col w-64 p-4 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-surface flex-shrink-0">
       <div className="flex items-center gap-2 mb-8">
            <h1 className="text-2xl font-bold">
              <span style={{color: '#429E9D'}}>re</span><span className="text-slate-600 dark:text-slate-200">wise</span> <span className="text-slate-600 dark:text-slate-300">ai</span>
            </h1>
       </div>
      <div className="flex flex-col gap-2">
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

export default SideNav;
