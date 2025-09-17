# ReWise AI - Smart Flashcard Learning

Transform your study materials into interactive flashcards with AI-powered learning. Master any subject faster with our intuitive swipe-based study system.

## ✨ Features

- **AI-Powered Flashcard Generation**: Upload PDFs and let AI create smart flashcards
- **Swipe-Based Learning**: Intuitive card swiping for efficient studying
- **Progress Tracking**: Monitor your learning progress and retention
- **Smart Spaced Repetition**: Cards you know well appear less frequently
- **Chapter Organization**: Organize flashcards by chapters or topics
- **Dark/Light Theme**: Beautiful UI that adapts to your preference
- **Sound Effects**: Engaging audio feedback for better learning experience

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rewise-ai.git
cd rewise-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Google Gemini API key to `.env.local`:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Enable Google Authentication
4. Update `src/services/firebase.ts` with your config

### Google Gemini API
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local` file

## 📱 Usage

1. **Sign In**: Use Google authentication to sign in
2. **Upload PDF**: Upload your study materials
3. **Generate Flashcards**: Let AI create flashcards from your content
4. **Study**: Swipe through cards to learn
5. **Track Progress**: Monitor your learning journey

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Firebase (Firestore, Authentication)
- **AI**: Google Gemini API
- **PDF Processing**: PDF.js
- **Icons**: Lucide React

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

- Email: support@rewiseai.com
- Instagram: [@rewiseai](https://instagram.com/rewiseai)
- Twitter: [@rewiseai](https://twitter.com/rewiseai)

---

Made with ❤️ by the ReWise AI team