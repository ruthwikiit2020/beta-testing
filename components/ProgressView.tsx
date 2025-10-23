import React, { useState } from 'react';
import { FireIcon, TargetIcon } from './icons/AppIcons';
import { subscriptionService } from '../services/subscriptionService';
import ActivityCalendar from 'react-activity-calendar';
import AchievementShareModal from './AchievementShareModal';

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
  userName?: string;
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

const ContributionsCalendar: React.FC<{ weeklyData: number[] }> = ({ weeklyData }) => {
    // Generate activity data from Jan 1 to today
    const generateActivityData = () => {
        const data = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        
        // Start from January 1st of current year
        const startDate = new Date(currentYear, 0, 1); // Jan 1
        
        // Calculate days from Jan 1 to today
        const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Generate data from Jan 1 to today
        for (let i = 0; i <= daysSinceStart; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateStr = date.toISOString().split('T')[0];
            
            // Calculate days from today
            const daysFromToday = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            let count = 0;
            
            // Use real weekly data for the last 7 days only
            if (daysFromToday < 7) {
                const dayOfWeek = (date.getDay() + 6) % 7; // Monday = 0
                count = weeklyData[dayOfWeek] || 0;
            }
            // For older dates, count is 0 (no historical data yet)
            // You can replace this with actual Firebase historical data
            
            data.push({
                date: dateStr,
                count: count,
                level: count === 0 ? 0 : count < 5 ? 1 : count < 10 ? 2 : count < 15 ? 3 : 4
            });
        }
        
        // Add future dates (white/empty) from tomorrow to Dec 31
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const endOfYear = new Date(currentYear, 11, 31); // Dec 31
        const daysUntilEndOfYear = Math.floor((endOfYear.getTime() - tomorrow.getTime()) / (1000 * 60 * 60 * 24));
        
        for (let i = 0; i <= daysUntilEndOfYear; i++) {
            const date = new Date(tomorrow);
            date.setDate(tomorrow.getDate() + i);
            
            const dateStr = date.toISOString().split('T')[0];
            
            data.push({
                date: dateStr,
                count: 0,
                level: 0
            });
        }
        
        return data;
    };
    
    const activityData = generateActivityData();
    const totalContributions = activityData.reduce((sum, day) => sum + day.count, 0);
    const currentYear = new Date().getFullYear();
    const today = new Date();
    const currentDayOfYear = Math.floor((today.getTime() - new Date(currentYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return (
        <div className="bg-white dark:bg-brand-surface p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Study Activity</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your study activity over the past year</p>
                </div>
            </div>

            {/* GitHub-style Activity Calendar */}
            <div className="overflow-x-auto">
                <ActivityCalendar
                    data={activityData}
                    theme={{
                        light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                        dark: ['#1e293b', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'],
                    }}
                    blockSize={12}
                    blockMargin={4}
                    fontSize={12}
                    showWeekdayLabels
                    labels={{
                        totalCount: `{{count}} cards in ${currentYear}`,
                    }}
                    renderBlock={(block, activity) =>
                        React.cloneElement(block, {
                            'data-tooltip': `${activity.date}: ${activity.count} cards mastered`,
                        })
                    }
                />
            </div>
        </div>
    );
};



const ProgressView: React.FC<ProgressViewProps> = ({ progressData, masteredCount, totalCards, swipedCards, userName }) => {
    const masteryPercentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;
    const currentTier = subscriptionService.getCurrentTier();
    const hasWeeklyProgressAccess = currentTier === 'pro' || currentTier === 'flash' || currentTier === 'institution' || currentTier === 'owner';
    
    const [selectedAchievement, setSelectedAchievement] = useState<{ id: string; title: string; description: string; icon: 'fire' | 'target'; date?: string } | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);

    const handleShareAchievement = (achievement: any) => {
        setSelectedAchievement({
            ...achievement,
            date: new Date().toISOString()
        });
        setShowShareModal(true);
    };

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

            {/* Study Activity Calendar - Pro/Flash Feature */}
            <div className="mb-8">
                {hasWeeklyProgressAccess ? (
                    <ContributionsCalendar weeklyData={progressData.weeklyProgress} />
                ) : (
                    <div className="bg-white dark:bg-brand-surface p-8 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Study Activity Calendar</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Unlock detailed activity tracking and analytics with Pro or Flash plan
                            </p>
                            <div className="flex justify-center gap-3">
                                <button 
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-teal-600 transition-all hover:scale-105 font-semibold"
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Unlocked Achievements Section - Only shows earned achievements */}
            {progressData.achievements && progressData.achievements.length > 0 && (
                <div className="mb-8">
                    <div className="bg-white dark:bg-brand-surface p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Unlocked Achievements</h3>
                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold">
                                {progressData.achievements.length} Unlocked
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Share your achievements with friends! Click the share button to post on WhatsApp or Instagram.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {progressData.achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="relative group bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border-2 border-yellow-400 dark:border-yellow-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                            {achievement.icon === 'fire' ? '🔥' : '🎯'}
                                        </div>
                                        <button
                                            onClick={() => handleShareAchievement(achievement)}
                                            className="p-2 bg-white/80 dark:bg-slate-800/80 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-md group-hover:scale-110 transition-transform"
                                            title="Share achievement"
                                        >
                                            <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{achievement.title}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{achievement.description}</p>
                                    <div className="mt-2 flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-400">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span>Unlocked</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            <AchievementShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                achievement={selectedAchievement}
                userName={userName || 'Student'}
            />
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