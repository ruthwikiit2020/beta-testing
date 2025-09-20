# ReWise AI - Beta Testing Repository

> **Transform Your Study Notes into Interactive Flashcards with AI-Powered Learning**

[![Version](https://img.shields.io/badge/version-1.0.0--beta-blue.svg)](https://github.com/yourusername/beta-testing)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-beta-orange.svg)](https://github.com/yourusername/beta-testing)

## 🚀 Overview

ReWise AI is an intelligent flashcard generation platform that transforms PDF study materials into interactive, swipeable flashcards using advanced AI technology. Built with React, TypeScript, and powered by Google Gemini AI, it provides an optimized learning experience with smart filtering, RAG (Retrieval-Augmented Generation) pipeline, and comprehensive progress tracking.

## ✨ Key Features

### 🧠 AI-Powered Flashcard Generation
- **Smart PDF Processing**: Upload any PDF and let AI create organized flashcards by chapter
- **RAG Pipeline**: Optimized retrieval-augmented generation for contextually accurate flashcards
- **Intelligent Filtering**: Customize card generation with smart filters (formulas, key concepts, summaries)
- **Chapter Organization**: Automatic chapter detection and content organization

### 📱 Interactive Study Experience
- **Swipe Interface**: Intuitive left/right swipe mechanics for studying
- **Progress Tracking**: Visual progress indicators, streaks, and mastery levels
- **Revision Hub**: AI-powered chat for deeper understanding and clarification
- **Spaced Repetition**: Smart algorithm for optimal learning retention

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching with system preference detection
- **Smooth Animations**: Polished interactions and transitions
- **Accessibility**: WCAG compliant with keyboard navigation support

### 🔐 Subscription & Usage Management
- **Tiered Pricing**: Free, Pro, Flash, and Institution plans
- **Usage Tracking**: Real-time monitoring of PDF uploads, flashcards, and revision hub usage
- **Feature Gating**: Premium features locked behind subscription tiers
- **Upgrade Prompts**: Seamless upgrade flow with coming soon modals

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Firebase** for authentication and data persistence
- **React Router** for client-side routing

### Backend & AI Services
- **Google Gemini AI** for flashcard generation and chat functionality
- **Firebase Firestore** for real-time data storage
- **Custom RAG Pipeline** for optimized content processing
- **Embedding Service** for semantic content understanding

### Performance Optimizations
- **Code Splitting**: Lazy loading of components for faster initial load
- **Memoization**: React.memo and useMemo for preventing unnecessary re-renders
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Intelligent caching of AI responses and user data

## 🔧 RAG Pipeline Architecture

### Overview
Our RAG (Retrieval-Augmented Generation) pipeline is designed to minimize latency, reduce API calls, and ensure contextually accurate flashcards without requiring the entire document.

### Core Components

#### 1. **Embedding & Chunking Service** (`services/embeddingService.ts`)
```typescript
// Semantic chunking with 200-400 token chunks
const chunkSize = 400;
const overlap = 50; // 12.5% overlap for context preservation
```

**Features:**
- **Semantic Chunking**: Splits PDF into meaningful chunks based on content structure
- **Deduplication**: Merges overlapping chunks to avoid redundancy
- **Embedding Generation**: Creates vector embeddings for semantic search
- **Caching**: Stores embeddings for faster retrieval

#### 2. **RAG Pipeline** (`services/ragPipeline.ts`)
```typescript
// Dynamic configuration based on document size
const config = isLargeDocument(pdfText) ? largeDocumentConfig : defaultConfig;
```

**Optimizations:**
- **Dynamic Configuration**: Different settings for small vs large documents
- **Top-K Retrieval**: Retrieves only the most relevant chunks (K=3-5)
- **Context Compression**: Summarizes retrieved chunks to fit LLM context window
- **Batch Processing**: Processes multiple requests efficiently

#### 3. **Performance Monitoring** (`services/performanceMonitor.ts`)
```typescript
// Real-time performance tracking
const metrics = {
  processingTime: Date.now() - startTime,
  tokensUsed: response.tokensUsed,
  chunksProcessed: chunks.length,
  cacheHitRate: cacheHits / totalRequests
};
```

### RAG Configuration

#### Small Documents (< 50 pages)
```typescript
const defaultConfig = {
  topK: 3,
  maxTokens: 2000,
  batchSize: 5,
  maxChunksPerChapter: 10,
  enablePagination: false,
  maxMemoryChunks: 50,
  enableProgressiveLoading: false
};
```

#### Large Documents (≥ 50 pages)
```typescript
const largeDocumentConfig = {
  topK: 5,
  maxTokens: 4000,
  batchSize: 10,
  maxChunksPerChapter: 20,
  enablePagination: true,
  maxMemoryChunks: 100,
  enableProgressiveLoading: true
};
```

## 💰 Cost Analysis & Token Usage

### Current Implementation
- **Model**: Google Gemini 1.5 Flash
- **Context Window**: 1M tokens
- **Pricing**: $0.075 per 1M input tokens, $0.30 per 1M output tokens

### Token Usage Estimates

#### Small PDF (10 pages, ~5,000 words)
- **Input Tokens**: ~6,500 tokens
- **Output Tokens**: ~2,000 tokens (20 flashcards)
- **Cost**: ~$0.0005 per PDF

#### Medium PDF (50 pages, ~25,000 words)
- **Input Tokens**: ~32,500 tokens
- **Output Tokens**: ~5,000 tokens (50 flashcards)
- **Cost**: ~$0.0025 per PDF

#### Large PDF (200 pages, ~100,000 words)
- **Input Tokens**: ~130,000 tokens
- **Output Tokens**: ~10,000 tokens (100 flashcards)
- **Cost**: ~$0.01 per PDF

### Scaling Projections

#### Free Tier (1,000 users, 4 PDFs/day each)
- **Daily Cost**: ~$20
- **Monthly Cost**: ~$600
- **Annual Cost**: ~$7,200

#### Pro Tier (500 users, 10 PDFs/day each)
- **Daily Cost**: ~$25
- **Monthly Cost**: ~$750
- **Annual Cost**: ~$9,000

#### Flash Tier (100 users, unlimited PDFs)
- **Daily Cost**: ~$15
- **Monthly Cost**: ~$450
- **Annual Cost**: ~$5,400

#### Total Projected Costs
- **1,600 users**: ~$21,600 annually
- **Revenue Potential**: ~$150,000 annually (based on pricing tiers)
- **Profit Margin**: ~85%

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/beta-testing.git
cd beta-testing
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Create .env.local file
cp .env.example .env.local

# Add your API keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
rewiseai/
├── components/                 # React components
│   ├── blocks/                # Reusable UI blocks
│   │   ├── pricing-data.ts    # Pricing configuration
│   │   ├── pricing-demo.tsx   # Pricing section demo
│   │   └── pricing-section.tsx # Pricing section component
│   ├── icons/                 # SVG icon components
│   ├── ui/                    # UI utility components
│   ├── AchievementsView.tsx   # Achievements display
│   ├── BottomNav.tsx          # Bottom navigation
│   ├── ComingSoonModal.tsx    # Coming soon modal
│   ├── Dashboard.tsx          # Main dashboard
│   ├── FileUpload.tsx         # PDF upload component
│   ├── FilterPanel.tsx        # Smart filters panel
│   ├── Flashcard.tsx          # Individual flashcard
│   ├── FlashcardStack.tsx     # Flashcard stack
│   ├── LandingPage.tsx        # Landing page
│   ├── LoadingScreen.tsx      # Loading screen
│   ├── MyDecksView.tsx        # User decks view
│   ├── ProfileView.tsx        # User profile
│   ├── ProgressView.tsx       # Progress tracking
│   ├── RevisionChatModal.tsx  # AI chat modal
│   ├── SettingsModal.tsx      # Settings modal
│   └── StudyView.tsx          # Study interface
├── services/                  # Backend services
│   ├── embeddingService.ts    # Embedding generation
│   ├── firebase.ts           # Firebase configuration
│   ├── geminiService.ts      # Gemini AI integration
│   ├── performanceMonitor.ts # Performance tracking
│   ├── ragPipeline.ts        # RAG pipeline
│   ├── subscriptionService.ts # Subscription management
│   └── utils.ts              # Utility functions
├── types/                     # TypeScript type definitions
│   ├── filters.ts            # Filter types
│   └── pricing.ts            # Pricing types
├── utils/                     # Utility functions
│   └── sounds.ts             # Audio utilities
├── App.tsx                   # Main app component
├── index.html                # HTML template
├── index.tsx                 # React entry point
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Google provider)
3. Create Firestore database
4. Update security rules in `firestore.rules`

### Gemini AI Setup
1. Get API key from Google AI Studio
2. Add to environment variables
3. Configure rate limits and quotas

### Environment Variables
```bash
# Required
VITE_GEMINI_API_KEY=your_api_key
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional
VITE_APP_VERSION=1.0.0-beta
VITE_APP_NAME=ReWise AI
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] PDF upload and processing
- [ ] Flashcard generation with different filters
- [ ] Study interface (swipe, progress tracking)
- [ ] Revision Hub chat functionality
- [ ] User authentication and profile management
- [ ] Subscription and usage tracking
- [ ] Responsive design on different devices
- [ ] Dark/light mode switching

### Performance Testing
- [ ] Large PDF processing (100+ pages)
- [ ] Multiple concurrent users
- [ ] Memory usage optimization
- [ ] API rate limiting
- [ ] Cache effectiveness

## 🚀 Deployment

### Netlify (Recommended)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

### Vercel
1. Import GitHub repository
2. Set framework: Vite
3. Add environment variables
4. Deploy

### Manual Deployment
```bash
# Build for production
npm run build

# Upload dist/ folder to your hosting provider
```

## 📊 Performance Metrics

### Current Performance
- **Initial Load**: < 2 seconds
- **PDF Processing**: 5-15 seconds (depending on size)
- **Flashcard Generation**: 10-30 seconds
- **Memory Usage**: < 100MB average
- **Bundle Size**: ~2MB gzipped

### Optimization Targets
- **Initial Load**: < 1.5 seconds
- **PDF Processing**: < 10 seconds
- **Flashcard Generation**: < 20 seconds
- **Memory Usage**: < 80MB average
- **Bundle Size**: < 1.5MB gzipped

## 🔒 Security

### Data Protection
- **Client-side encryption** for sensitive data
- **Firebase security rules** for data access control
- **API key protection** with environment variables
- **User data isolation** with proper authentication

### Privacy
- **No data collection** beyond necessary functionality
- **Local storage** for user preferences
- **Secure API communication** with HTTPS
- **GDPR compliance** ready

## 🐛 Known Issues

### Current Limitations
1. **Large PDF Processing**: Very large PDFs (>500 pages) may timeout
2. **Image Processing**: Currently only processes text content
3. **Offline Support**: Limited offline functionality
4. **Mobile Performance**: Some performance issues on older mobile devices

### Planned Fixes
1. **Progressive Loading**: Implement chunked processing for large PDFs
2. **Image OCR**: Add support for image-based content
3. **PWA Support**: Full offline functionality
4. **Performance Optimization**: Mobile-specific optimizations

## 🤝 Contributing

### Beta Testing Guidelines
1. **Test thoroughly** on different devices and browsers
2. **Report bugs** with detailed reproduction steps
3. **Suggest improvements** for user experience
4. **Document issues** with screenshots and logs

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

### Contact Information
- **Email**: support@rewiseai.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/beta-testing/issues)
- **Discord**: [Join our community](https://discord.gg/rewiseai)

### Documentation
- **API Documentation**: [Coming Soon]
- **User Guide**: [Coming Soon]
- **Developer Guide**: [Coming Soon]

## 📄 License

This project is licensed under Ruthwik Siddhartha Keerthi - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language processing
- **Firebase** for backend infrastructure
- **React Team** for the amazing framework
- **Tailwind CSS** for beautiful styling
- **Vite** for fast development experience

---

**ReWise AI** - *Transforming Education with AI-Powered Learning*

*Built with ❤️ for students, by students*
