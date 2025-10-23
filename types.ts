export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface ChapterDeck {
  chapterTitle: string;
  flashcards: Flashcard[];
}

export interface UserDeck {
    id: string;
    pdfName: string;
    createdAt: string;
    flashcardDecks: ChapterDeck[];
    knownCards: Flashcard[];
    reviseCards: Flashcard[];
}

export interface ProgressData {
  dayStreak: number;
  lastStudied: string | null;
  achievements: { id: string; title: string; description: string; icon: 'fire' | 'target' }[];
  weeklyProgress: number[];
}

export interface UserData {
    decks: UserDeck[];
    progress: ProgressData;
}

export interface GoogleUser {
    uid: string;
    name: string | null;
    email: string | null;
    picture: string | null;
}