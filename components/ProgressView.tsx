import React from 'react';
import { FireIcon, TargetIcon } from './icons/AppIcons';

interface ProgressData {
  dayStreak: number;
  achievements: { id: string; title: string; description: string; icon: 'fire' | 'target' }[];
  weeklyProgress: number[];
}

interface ProgressViewProps {
  progressData: ProgressData;
  masteredCount: number;
  totalCards: number;
  swipedCards: number;
}

const StatCard: React.FC<{ label: string; value: string | number; Icon: React.FC<{ className?: string }>; colorClass: string }> = ({ label, value, Icon, colorClass }) => (
    <div className={`bg-white dark:bg-brand-surface p-4 rounded-lg flex-1 text-center border-l-4 ${colorClass}`}>
        <div className="flex items-center justify-center gap-3">
            <Icon className="w-8 h-8" />
            <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
        </div>
    </div>
);

const WeeklyProgressChart: React.FC<{ data: number[] }> = ({ data }) => {
    const displayDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Assuming data array starts with Monday at index 0
    const maxVal = Math.max(...data, 1); // Avoid division by zero

    return (
        <div className="bg-white dark:bg-brand-surface p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Weekly Progress</h3>
            <div className="flex justify-between items-end h-40 gap-2">
                {data.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full h-full flex items-end">
                            <div 
                                className="w-full bg-brand-primary rounded-t-md hover:bg-teal-400 transition-colors"
                                style={{ height: `${(value / maxVal) * 100}%` }}
                                title={`${value} cards`}
                            ></div>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">{displayDays[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};



const ProgressView: React.FC<ProgressViewProps> = ({ progressData, masteredCount, totalCards, swipedCards }) => {
    const masteryPercentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Your Progress</h1>
                <p className="text-slate-500 dark:text-slate-400">Keep up the great work!</p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Day Streak" value={progressData.dayStreak} Icon={FireIcon} colorClass="border-orange-500 text-orange-400" />
                <StatCard label="Mastered" value={`${masteryPercentage}%`} Icon={TargetIcon} colorClass="border-cyan-500 text-cyan-400" />
                <StatCard label="Swiped Cards" value={swipedCards} Icon={SwipeIcon} colorClass="border-green-500 text-green-400" />
                <StatCard label="Total Cards" value={totalCards} Icon={StudyIcon} colorClass="border-slate-500 text-slate-600 dark:text-slate-300" />
            </div>

            <div className="mb-8">
                <WeeklyProgressChart data={progressData.weeklyProgress} />
            </div>

        </div>
    );
};

// Study icon for StatCard
const StudyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

// Swiped cards icon
const SwipeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);


export default ProgressView;