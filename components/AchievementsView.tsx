import React from 'react';
import { FireIcon, TargetIcon } from './icons/AppIcons';
import type { ProgressData } from '../types';

interface AchievementsViewProps {
  progressData: ProgressData;
  masteredCount?: number;
  totalCards?: number;
  swipedCards?: number;
  totalPDFs?: number;
}

// Icon components for different achievement types
const StreakIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const LightningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const GraduationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.083 12.083 0 01.665-6.479L12 14z" />
  </svg>
);

const AchievementCard: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  earned: boolean;
  glowColor?: string;
  progress?: number;
  progressText?: string;
}> = ({ title, description, icon, earned, glowColor = 'brand-primary', progress, progressText }) => (
    <div className={`bg-white dark:bg-brand-surface p-4 rounded-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 ${
      earned 
        ? `ring-2 ring-${glowColor} shadow-lg shadow-${glowColor}/20 animate-pulse` 
        : 'opacity-60 hover:opacity-80'
    }`}>
        <div className="flex flex-col items-center text-center">
            <div className={`p-3 rounded-full mb-3 ${
              earned 
                ? `bg-${glowColor}/10` 
                : 'bg-slate-100 dark:bg-slate-700'
            }`}>
                <div className={`w-8 h-8 ${
                  earned 
                    ? `text-${glowColor}` 
                    : 'text-slate-400'
                }`}>
                    {icon}
                </div>
            </div>
            <h4 className={`font-bold text-sm mb-1 ${
              earned 
                ? 'text-slate-900 dark:text-slate-100' 
                : 'text-slate-500 dark:text-slate-400'
            }`}>
                {title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mb-2">
                {description}
            </p>
            {!earned && progress !== undefined && (
              <div className="w-full">
                <div className="bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-1">
                  <div 
                    className={`bg-${glowColor} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {progressText}
                </p>
        </div>
            )}
        </div>
    </div>
);

const ALL_ACHIEVEMENTS = [
    // Streak Achievements
    { id: 'streak3', title: '3 Day Streak', description: 'Complete 3 day streak', icon: <StreakIcon className="w-full h-full" />, glowColor: 'orange-500' },
    { id: 'streak7', title: 'Week Warrior', description: 'Complete 1 week streak', icon: <LightningIcon className="w-full h-full" />, glowColor: 'yellow-500' },
    { id: 'streak30', title: 'Month Master', description: 'Complete 30 day streak', icon: <FireIcon className="w-full h-full" />, glowColor: 'red-500' },
    
    // Mastered Cards Achievements
    { id: 'mastered20', title: 'Card Master', description: 'Mastered 20 cards', icon: <PlusIcon className="w-full h-full" />, glowColor: 'blue-500' },
    { id: 'mastered50', title: 'Knowledge Seeker', description: 'Mastered 50 cards', icon: <StarIcon className="w-full h-full" />, glowColor: 'purple-500' },
    { id: 'mastered100', title: 'Achievement Hunter', description: 'Mastered 100 cards', icon: <TargetIcon className="w-full h-full" />, glowColor: 'red-500' },
    { id: 'mastered250', title: 'Study Legend', description: 'Mastered 250 cards', icon: <GraduationIcon className="w-full h-full" />, glowColor: 'indigo-500' },
    
    // Studied Cards Achievements (Total cards studied)
    { id: 'studied100', title: 'Study Champion', description: 'Studied 100 cards', icon: <BookIcon className="w-full h-full" />, glowColor: 'green-500' },
    { id: 'studied500', title: 'Learning Legend', description: 'Studied 500 cards', icon: <GraduationIcon className="w-full h-full" />, glowColor: 'indigo-500' },
    { id: 'studied1000', title: 'Knowledge Giant', description: 'Studied 1000 cards', icon: <BookIcon className="w-full h-full" />, glowColor: 'purple-500' },
    
    // PDF Upload Achievements
    { id: 'pdf3', title: 'PDF Collector', description: 'Uploaded 3 PDFs', icon: <BookIcon className="w-full h-full" />, glowColor: 'teal-500' },
    { id: 'pdf10', title: 'Document Master', description: 'Uploaded 10 PDFs', icon: <BookIcon className="w-full h-full" />, glowColor: 'blue-500' },
    
    // Weekly Progress Achievements
    { id: 'weekly100', title: 'Weekly Warrior', description: 'Studied 100 cards in a week', icon: <LightningIcon className="w-full h-full" />, glowColor: 'yellow-500' },
    { id: 'weekly500', title: 'Power Week', description: 'Studied 500 cards in a week', icon: <FireIcon className="w-full h-full" />, glowColor: 'orange-500' },
];

const AchievementsView: React.FC<AchievementsViewProps> = ({ progressData, masteredCount = 0, totalCards = 0, swipedCards = 0, totalPDFs = 0 }) => {
    
    // Safety checks
    if (!progressData) {
        return <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <h2 className="text-2xl font-semibold">Loading Achievements...</h2>
            <p className="mt-2">Please wait while we load your achievement data.</p>
        </div>;
    }
    
    // Use real progress data
    const actualProgressData = progressData;
    
    const getAchievementProgress = (achievementId: string) => {
        const earned = actualProgressData.achievements?.some(earnedAch => earnedAch.id === achievementId) || false;
        if (earned) return { progress: 100, progressText: 'Earned!' };

        switch (achievementId) {
            case 'streak3':
                return { progress: Math.min(((actualProgressData.dayStreak || 0) / 3) * 100, 100), progressText: `${actualProgressData.dayStreak || 0}/3 days` };
            case 'streak7':
                return { progress: Math.min(((actualProgressData.dayStreak || 0) / 7) * 100, 100), progressText: `${actualProgressData.dayStreak || 0}/7 days` };
            case 'streak30':
                return { progress: Math.min(((actualProgressData.dayStreak || 0) / 30) * 100, 100), progressText: `${actualProgressData.dayStreak || 0}/30 days` };
            case 'mastered20':
                return { progress: Math.min((masteredCount / 20) * 100, 100), progressText: `${masteredCount}/20 cards` };
            case 'mastered50':
                return { progress: Math.min((masteredCount / 50) * 100, 100), progressText: `${masteredCount}/50 cards` };
            case 'mastered100':
                return { progress: Math.min((masteredCount / 100) * 100, 100), progressText: `${masteredCount}/100 cards` };
            case 'mastered250':
                return { progress: Math.min((masteredCount / 250) * 100, 100), progressText: `${masteredCount}/250 cards` };
            case 'studied100':
                return { progress: Math.min((swipedCards / 100) * 100, 100), progressText: `${swipedCards}/100 cards` };
            case 'studied500':
                return { progress: Math.min((swipedCards / 500) * 100, 100), progressText: `${swipedCards}/500 cards` };
            case 'studied1000':
                return { progress: Math.min((swipedCards / 1000) * 100, 100), progressText: `${swipedCards}/1000 cards` };
            case 'pdf3':
                return { progress: Math.min((totalPDFs / 3) * 100, 100), progressText: `${totalPDFs}/3 PDFs` };
            case 'pdf10':
                return { progress: Math.min((totalPDFs / 10) * 100, 100), progressText: `${totalPDFs}/10 PDFs` };
            case 'weekly100':
                const weeklyTotal = (actualProgressData.weeklyProgress || []).reduce((sum, day) => sum + day, 0);
                return { progress: Math.min((weeklyTotal / 100) * 100, 100), progressText: `${weeklyTotal}/100 this week` };
            case 'weekly500':
                const weeklyTotal500 = (actualProgressData.weeklyProgress || []).reduce((sum, day) => sum + day, 0);
                return { progress: Math.min((weeklyTotal500 / 500) * 100, 100), progressText: `${weeklyTotal500}/500 this week` };
            default:
                return { progress: 0, progressText: 'Not started' };
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Achievements</h1>
                <p className="text-slate-500 dark:text-slate-400">Your collection of learning milestones.</p>
                
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ALL_ACHIEVEMENTS.map(ach => {
                    const earned = (actualProgressData.achievements || []).some(earnedAch => earnedAch.id === ach.id);
                    const achievementProgress = getAchievementProgress(ach.id);
                    return (
                        <AchievementCard 
                            key={ach.id} 
                            {...ach} 
                            earned={earned} 
                            progress={achievementProgress.progress}
                            progressText={achievementProgress.progressText}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementsView;
