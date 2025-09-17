import React from 'react';
import { FireIcon, TargetIcon } from './icons/AppIcons';
import type { ProgressData } from '../types';

interface AchievementsViewProps {
  progressData: ProgressData;
}

const AchievementCard: React.FC<{ title: string; description: string; icon: 'fire' | 'target'; earned: boolean }> = ({ title, description, icon, earned }) => (
    <div className={`bg-white dark:bg-brand-surface p-6 rounded-lg flex items-center gap-6 border border-slate-200 dark:border-slate-700 transition-opacity ${!earned && 'opacity-40'}`}>
        <div className={`p-4 rounded-full ${earned ? 'bg-brand-primary/10' : 'bg-slate-100 dark:bg-slate-700'}`}>
            {icon === 'fire' && <FireIcon className={`w-10 h-10 ${earned ? 'text-orange-400' : 'text-slate-400'}`} />}
            {icon === 'target' && <TargetIcon className={`w-10 h-10 ${earned ? 'text-cyan-400' : 'text-slate-400'}`} />}
        </div>
        <div>
            <h4 className={`font-bold text-xl ${earned ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>{title}</h4>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

const ALL_ACHIEVEMENTS = [
    { id: 'streak1', title: 'Fire Starter', description: 'Started your first streak', icon: 'fire' as const },
    { id: 'mastered10', title: 'Quick Learner', description: 'Mastered 10 cards', icon: 'target' as const },
    // Add more potential achievements here
];

const AchievementsView: React.FC<AchievementsViewProps> = ({ progressData }) => {
    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Achievements</h1>
                <p className="text-slate-500 dark:text-slate-400">Your collection of learning milestones.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ALL_ACHIEVEMENTS.map(ach => {
                    const earned = progressData.achievements.some(earnedAch => earnedAch.id === ach.id);
                    return <AchievementCard key={ach.id} {...ach} earned={earned} />;
                })}
            </div>
        </div>
    );
};

export default AchievementsView;
