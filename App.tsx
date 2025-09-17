import React, { useState, useCallback, useEffect } from 'react';
import { generateFlashcardsFromText } from './services/geminiService';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import type { Flashcard, ChapterDeck, UserData, UserDeck, ProgressData, GoogleUser } from './types';
import BottomNav from './components/BottomNav';
import SideNav from './components/SideNav';
import StudyView from './components/StudyView';
import RevisionView from './components/RevisionView';
import ProgressView from './components/ProgressView';
import ProfileView from './components/ProfileView';
import RevisionChatModal from './components/RevisionChatModal';
import { SunIcon, MoonIcon } from './components/icons/AppIcons';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import MyDecksView from './components/MyDecksView';
import AchievementsView from './components/AchievementsView';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import { BackgroundNoiseWrapper } from './components/ui/background-noise-effect';

export type AppView = 'myDecks' | 'study' | 'revision' | 'progress' | 'profile' | 'achievements';
export type Theme = 'light' | 'dark';
type AppStatus = 'initializing' | 'landing' | 'loading' | 'fetching_data' | 'authenticated';


const INITIAL_USER_DATA: UserData = {
  decks: [],
  progress: {
    dayStreak: 0,
    lastStudied: null,
    achievements: [],
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
  }
};

function App() {
  const [appStatus, setAppStatus] = useState<AppStatus>('initializing');
  const [activeView, setActiveView] = useState<AppView>('myDecks');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
  
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  
  const [lastAction, setLastAction] = useState<{ card: Flashcard; type: 'known' | 'revise' } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCardForChat, setSelectedCardForChat] = useState<Flashcard | null>(null);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User signed in' : 'User signed out');
      if (user) {
        setAppStatus('fetching_data');
        console.log('Setting status to fetching_data');
        const userProfile: GoogleUser = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
        };
        setCurrentUser(userProfile);

        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          console.log('Timeout reached, setting to authenticated with initial data');
          setUserData(INITIAL_USER_DATA);
          setAppStatus('authenticated');
          setActiveView('myDecks');
        }, 10000); // 10 second timeout

                  try {
                    const userDocRef = doc(db, "users", user.uid);
                    console.log('Fetching user data from Firestore for user:', user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    clearTimeout(timeoutId); // Clear timeout if we succeed

                    if (userDocSnap.exists()) {
                      const userData = userDocSnap.data() as UserData;
                      console.log('User data found in Firestore:', {
                        exists: userDocSnap.exists(),
                        data: userData,
                        decksCount: userData.decks?.length || 0,
                        hasProgress: !!userData.progress,
                        firstDeckName: userData.decks?.[0]?.pdfName || 'No decks'
                      });
                      
                      // Validate data structure
                      if (!userData.decks) {
                        console.warn('User data missing decks array, initializing...');
                        userData.decks = [];
                      }
                      if (!userData.progress) {
                        console.warn('User data missing progress, initializing...');
                        userData.progress = INITIAL_USER_DATA.progress;
                      }
                      
                      setUserData(userData);
                    } else {
                      console.log('No user data found in Firestore, creating new user document');
                      await setDoc(userDocRef, INITIAL_USER_DATA);
                      console.log('New user document created with initial data');
                      setUserData(INITIAL_USER_DATA);
                    }
                    console.log('Setting status to authenticated');
                    setAppStatus('authenticated');
                    setActiveView('myDecks');
                  } catch (error) {
                    console.error('Error fetching user data from Firestore:', error);
                    clearTimeout(timeoutId);
                    setError('Failed to load user data from database');
                    setUserData(INITIAL_USER_DATA);
                    setAppStatus('authenticated');
                  }
      } else {
        setCurrentUser(null);
        setUserData(null);
        setActiveDeckId(null);
        setAppStatus('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // This effect handles persisting user data to Firestore.
    if (appStatus === 'authenticated' && userData && currentUser) {
      console.log('Saving user data to Firestore:', {
        userId: currentUser.uid,
        decksCount: userData.decks?.length || 0,
        hasProgress: !!userData.progress,
        userData: userData
      });
      const userDocRef = doc(db, "users", currentUser.uid);
      setDoc(userDocRef, userData, { merge: true })
        .then(() => {
          console.log('✅ User data saved successfully to Firestore');
          console.log('Saved data structure:', {
            decks: userData.decks?.map(deck => ({
              id: deck.id,
              pdfName: deck.pdfName,
              createdAt: deck.createdAt,
              chaptersCount: deck.flashcardDecks.length,
              totalCards: deck.flashcardDecks.reduce((sum, chapter) => sum + chapter.flashcards.length, 0)
            })) || []
          });
        })
        .catch(error => {
          console.error("❌ Error saving user data to Firestore:", error);
          console.error("Error details:", {
            code: error.code,
            message: error.message,
            userData: userData
          });
        });
    }
  }, [userData, currentUser, appStatus]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');


  const handleGenerate = useCallback(async (text: string, fileName: string) => {
    setAppStatus('loading');
    setError(null);
    setLastAction(null);
    try {
      console.log('Starting flashcard generation with text length:', text.length);
      const decks = await generateFlashcardsFromText(text, (progress, status) => {
        setLoadingProgress(progress);
        setLoadingStatus(status);
      });
      console.log('Generated decks:', decks);
      if (decks && decks.length > 0) {
        const newDeck: UserDeck = {
          id: `deck-${Date.now()}`,
          pdfName: fileName,
          createdAt: new Date().toISOString(),
          flashcardDecks: decks,
          knownCards: [],
          reviseCards: [],
        };
        console.log('Creating new deck:', {
          deckId: newDeck.id,
          pdfName: newDeck.pdfName,
          chaptersCount: newDeck.flashcardDecks.length,
          totalCards: newDeck.flashcardDecks.reduce((sum, chapter) => sum + chapter.flashcards.length, 0)
        });
        setUserData(prev => prev ? { ...prev, decks: [...prev.decks, newDeck] } : { ...INITIAL_USER_DATA, decks: [newDeck] });
        setActiveDeckId(newDeck.id);
        setActiveView('study');
        setAppStatus('authenticated');
      } else {
        setError("The AI couldn't generate any flashcards from the provided material. Please try with a different PDF or check if the content is suitable for flashcard generation.");
        setAppStatus('authenticated'); 
      }
    } catch (err: any) {
      console.error('Error in handleGenerate:', err);
      setError(err.message || "An unknown error occurred while generating flashcards.");
      setAppStatus('authenticated');
    }
  }, []);

  const activeDeck = userData?.decks.find(d => d.id === activeDeckId);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  useEffect(() => {
    setCurrentChapterIndex(0);
    setLastAction(null);
  }, [activeDeckId]);

  const updateStudyProgress = (prevUserData: UserData, masteredIncrement: number): ProgressData => {
    const progress = prevUserData.progress;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = progress.dayStreak;
    if (progress.lastStudied !== todayStr && (masteredIncrement > 0 || prevUserData.decks.some(d => d.reviseCards.length > 0))) {
        newStreak = progress.lastStudied === yesterdayStr ? progress.dayStreak + 1 : 1;
    }
    
    const dayOfWeek = (today.getDay() + 6) % 7; // Monday is 0
    const newWeeklyProgress = [...progress.weeklyProgress];
    if (masteredIncrement > 0) {
      newWeeklyProgress[dayOfWeek] = (newWeeklyProgress[dayOfWeek] || 0) + masteredIncrement;
    }
    
    const newAchievements = [...progress.achievements];
    if (newStreak > 0 && !progress.achievements.some(a => a.id === 'streak1')) {
      newAchievements.push({ id: 'streak1', title: 'Fire Starter', description: 'Started your first streak', icon: 'fire' });
    }
    const totalMastered = prevUserData.decks.reduce((sum, deck) => sum + deck.knownCards.length, 0) + masteredIncrement;
    if (totalMastered >= 10 && !progress.achievements.some(a => a.id === 'mastered10')) {
      newAchievements.push({ id: 'mastered10', title: 'Quick Learner', description: 'Mastered 10 cards', icon: 'target'});
    }

    return { ...progress, dayStreak: newStreak, lastStudied: todayStr, weeklyProgress: newWeeklyProgress, achievements: newAchievements };
  };

  const handleSwipeLeft = (card: Flashcard) => { // Revise
    setUserData(prevUserData => {
        if (!prevUserData) return null;
        const newDecks = prevUserData.decks.map(d => {
            if (d.id === activeDeckId) {
                const newChapterDecks = d.flashcardDecks.map((chapter, i) => i === currentChapterIndex ? {...chapter, flashcards: chapter.flashcards.filter(f => f.id !== card.id)} : chapter);
                return { ...d, reviseCards: [...d.reviseCards, card], flashcardDecks: newChapterDecks };
            }
            return d;
        });
        const newProgress = updateStudyProgress({ ...prevUserData, decks: newDecks }, 0);
        return { decks: newDecks, progress: newProgress };
    });
    setLastAction({ card, type: 'revise' });
  };

  const handleSwipeRight = (card: Flashcard) => { // Know it
    setUserData(prevUserData => {
        if (!prevUserData) return null;
        const newDecks = prevUserData.decks.map(d => {
            if (d.id === activeDeckId) {
                const newChapterDecks = d.flashcardDecks.map((chapter, i) => i === currentChapterIndex ? {...chapter, flashcards: chapter.flashcards.filter(f => f.id !== card.id)} : chapter);
                return { ...d, knownCards: [...d.knownCards, card], flashcardDecks: newChapterDecks };
            }
            return d;
        });
        const newProgress = updateStudyProgress({ ...prevUserData, decks: newDecks }, 1);
        return { decks: newDecks, progress: newProgress };
    });
    setLastAction({ card, type: 'known' });
  };
  
  const handleUndo = () => {
    if (!lastAction) return;
    const { card, type } = lastAction;
    setUserData(prevUserData => {
        if (!prevUserData) return null;
        const newDecks = prevUserData.decks.map(d => {
            if (d.id === activeDeckId) {
                const newChapterDecks = d.flashcardDecks.map((chapter, i) => i === currentChapterIndex ? {...chapter, flashcards: [...chapter.flashcards, card]} : chapter);
                let newKnownCards = d.knownCards;
                let newReviseCards = d.reviseCards;
                if (type === 'known') newKnownCards = newKnownCards.filter(c => c.id !== card.id);
                if (type === 'revise') newReviseCards = newReviseCards.filter(c => c.id !== card.id);
                return { ...d, knownCards: newKnownCards, reviseCards: newReviseCards, flashcardDecks: newChapterDecks };
            }
            return d;
        });
        // Note: Undoing does not revert progress stats to keep it simple.
        return { ...prevUserData, decks: newDecks };
    });
    setLastAction(null);
  };
  
  const handleMarkRevisedAsKnown = (cardId: string) => {
    setUserData(prevUserData => {
        if (!prevUserData) return null;
        let cardToMove: Flashcard | undefined;
        const newDecks = prevUserData.decks.map(d => {
            if (d.id === activeDeckId) {
                cardToMove = d.reviseCards.find(c => c.id === cardId);
                if (!cardToMove) return d;
                return { 
                    ...d, 
                    reviseCards: d.reviseCards.filter(c => c.id !== cardId),
                    knownCards: [...d.knownCards, cardToMove]
                };
            }
            return d;
        });
        if (!cardToMove) return prevUserData;
        const newProgress = updateStudyProgress({ ...prevUserData, decks: newDecks }, 1);
        return { decks: newDecks, progress: newProgress };
    });
  };

  const handleResetDeck = (deckId: string) => {
    // Add confirmation dialog
    if (!window.confirm('Are you sure you want to reset this deck? This will clear all your progress and put all cards back to study.')) {
      return;
    }
    
    console.log('Resetting deck:', deckId);
    setUserData(prevUserData => {
      if (!prevUserData) return null;
      const newDecks = prevUserData.decks.map(d => {
        if (d.id === deckId) {
          console.log('Resetting deck data:', {
            before: { 
              knownCards: d.knownCards.length, 
              reviseCards: d.reviseCards.length,
              totalCardsInChapters: d.flashcardDecks.reduce((sum, chapter) => sum + chapter.flashcards.length, 0)
            }
          });
          
          // Collect all cards that need to be restored
          const allCardsToRestore = [...d.knownCards, ...d.reviseCards];
          console.log('Cards to restore:', allCardsToRestore.length);
          
          // Reset the deck by clearing known and revise cards
          let resetDeck = {
            ...d,
            knownCards: [],
            reviseCards: []
          };
          
          // If there are cards to restore, redistribute them to chapters
          if (allCardsToRestore.length > 0) {
            // Create a copy of flashcardDecks to modify
            const restoredChapters = [...resetDeck.flashcardDecks];
            
            // Distribute cards evenly across chapters
            allCardsToRestore.forEach((card, index) => {
              const targetChapterIndex = index % restoredChapters.length;
              restoredChapters[targetChapterIndex] = {
                ...restoredChapters[targetChapterIndex],
                flashcards: [...restoredChapters[targetChapterIndex].flashcards, card]
              };
            });
            
            resetDeck = {
              ...resetDeck,
              flashcardDecks: restoredChapters
            };
          }
          
          console.log('After reset:', {
            knownCards: resetDeck.knownCards.length,
            reviseCards: resetDeck.reviseCards.length,
            totalCardsInChapters: resetDeck.flashcardDecks.reduce((sum, chapter) => sum + chapter.flashcards.length, 0),
            cardsRestored: allCardsToRestore.length
          });
          
          return resetDeck;
        }
        return d;
      });
      console.log('Deck reset complete');
      return { ...prevUserData, decks: newDecks };
    });
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Failed to sign in. Please ensure your domain is authorized in Firebase and your config is correct.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  const handleSelectDeck = (deckId: string) => {
    setActiveDeckId(deckId);
    setActiveView('study');
  };

  const openModal = (modal: 'settings' | 'help') => {
    if (modal === 'settings') setSettingsModalOpen(true);
    if (modal === 'help') setHelpModalOpen(true);
  };

  const renderView = () => {
    console.log('renderView called with appStatus:', appStatus, 'userData:', !!userData, 'currentUser:', !!currentUser);
    if (appStatus === 'fetching_data' || !userData) {
      console.log('Showing loading spinner - appStatus:', appStatus, 'userData exists:', !!userData);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-500 dark:text-slate-400">Loading your data...</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Status: {appStatus}</p>
          </div>
        </div>
      );
    }
    switch(activeView) {
      case 'myDecks':
        return <MyDecksView decks={userData.decks || []} onSelectDeck={handleSelectDeck} onGenerate={handleGenerate} onResetDeck={handleResetDeck} isLoading={appStatus === 'loading'} error={error} />;
      case 'achievements':
        return <AchievementsView progressData={userData.progress} />;
      case 'study':
        if (!activeDeck) return <div className="p-8 text-center text-slate-500 dark:text-slate-400"><h2 className="text-2xl font-semibold">No Deck Selected</h2><p className="mt-2">Please go to "My Decks" to choose a deck to study.</p></div>;
        return <StudyView pdfName={activeDeck.pdfName} decks={activeDeck.flashcardDecks} currentDeck={activeDeck.flashcardDecks[currentChapterIndex]} currentDeckIndex={currentChapterIndex} onSelectChapter={(i) => { setCurrentChapterIndex(i); setLastAction(null); }} onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} lastAction={lastAction} onUndo={handleUndo} />;
      case 'revision':
        return <RevisionView reviseCards={activeDeck?.reviseCards || []} onStartChat={setSelectedCardForChat} onMarkAsKnown={handleMarkRevisedAsKnown} />;
      case 'progress':
        const totalCards = activeDeck ? activeDeck.flashcardDecks.reduce((sum, d) => d.flashcards.length, 0) + activeDeck.knownCards.length + activeDeck.reviseCards.length : 0;
        return <ProgressView progressData={userData.progress} masteredCount={activeDeck?.knownCards.length || 0} totalCards={totalCards} />;
      case 'profile':
        const cardsStudied = userData ? userData.decks.reduce((sum, deck) => sum + deck.knownCards.length + deck.reviseCards.length, 0) : 0;
        return <ProfileView user={currentUser} progressData={userData.progress} cardsStudied={cardsStudied} setActiveView={setActiveView} onLogout={handleLogout} onOpenModal={openModal} />;
      default:
        return <MyDecksView decks={userData.decks || []} onSelectDeck={handleSelectDeck} onGenerate={handleGenerate} onResetDeck={handleResetDeck} isLoading={appStatus === 'loading'} error={error} />;
    }
  };

  console.log('App render - appStatus:', appStatus, 'userData:', !!userData, 'currentUser:', !!currentUser);
  
  if (appStatus === 'initializing') return <div className="fixed inset-0 bg-slate-100 dark:bg-brand-dark"></div>; // Blank screen during init
  if (appStatus === 'landing') return <LandingPage onGoogleSignIn={handleGoogleSignIn} theme={theme} toggleTheme={toggleTheme} />;
  if (appStatus === 'loading') return <LoadingScreen progress={loadingProgress} statusText={loadingStatus} theme={theme} />;
  
  // Fallback: if we have a user but no userData after 5 seconds, show the app anyway
  if (currentUser && !userData && appStatus === 'fetching_data') {
    console.log('Fallback: showing app with initial data');
    return (
      <BackgroundNoiseWrapper variant={theme === 'dark' ? 'dark' : 'light'} className="h-screen">
        <div className="h-screen flex bg-slate-50/80 dark:bg-brand-dark/80 backdrop-blur-sm">
          <SideNav activeView={activeView} setActiveView={setActiveView} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex-shrink-0 flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {userData?.decks?.length || 0} decks
                </span>
              </div>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-800" />}
              </button>
            </header>
            <main className="flex-grow overflow-y-auto pb-24 md:pb-4">
              <MyDecksView decks={[]} onSelectDeck={handleSelectDeck} onGenerate={handleGenerate} isLoading={false} error={error} />
            </main>
          </div>
          <BottomNav activeView={activeView} setActiveView={setActiveView} />
        </div>
      </BackgroundNoiseWrapper>
    );
  }

  return (
    <BackgroundNoiseWrapper variant={theme === 'dark' ? 'dark' : 'light'} className="h-screen">
      <div className="h-screen flex bg-slate-50/80 dark:bg-brand-dark/80 backdrop-blur-sm">
        <SideNav activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex-shrink-0 flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {userData?.decks?.length || 0} decks
              </span>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-800" />}
            </button>
          </header>
          <main className="flex-grow overflow-y-auto pb-24 md:pb-4">
            {renderView()}
          </main>
        </div>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
        {selectedCardForChat && <RevisionChatModal card={selectedCardForChat} isOpen={!!selectedCardForChat} onClose={() => setSelectedCardForChat(null)} />}
        {isSettingsModalOpen && <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} />}
        {isHelpModalOpen && <HelpModal isOpen={isHelpModalOpen} onClose={() => setHelpModalOpen(false)} />}
      </div>
    </BackgroundNoiseWrapper>
  );
}

export default App;