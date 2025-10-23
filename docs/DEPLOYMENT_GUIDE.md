# Deployment Guide

## Overview

This guide covers deploying ReWise AI to various platforms, including local development, staging, and production environments.

## Prerequisites

### Required Accounts
- **GitHub**: For code repository
- **Firebase**: For backend services
- **Google AI Studio**: For Gemini API access
- **Netlify/Vercel**: For hosting (optional)

### Required Tools
- **Node.js 18+**: JavaScript runtime
- **npm/yarn**: Package manager
- **Git**: Version control
- **Firebase CLI**: Firebase deployment tools

## Environment Setup

### 1. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: "rewiseai-beta"
4. Enable Google Analytics (optional)
5. Create project

#### Configure Authentication
1. Go to Authentication > Sign-in method
2. Enable Google provider
3. Add your domain to authorized domains
4. Copy configuration details

#### Setup Firestore Database
1. Go to Firestore Database
2. Create database in production mode
3. Set up security rules (see `firestore.rules`)
4. Enable offline persistence

#### Get Firebase Config
```javascript
// Copy from Firebase Console > Project Settings > General
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 2. Google Gemini AI Setup

#### Get API Key
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create new API key
3. Set usage limits and quotas
4. Copy API key

#### Configure API Key
```bash
# Add to .env.local
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Environment Variables

Create `.env.local` file:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key

# App Configuration
VITE_APP_VERSION=1.0.0-beta
VITE_APP_NAME=ReWise AI
VITE_APP_URL=https://your-domain.com
```

## Local Development

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/beta-testing.git
cd beta-testing
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

## Production Deployment

### Option 1: Netlify (Recommended)

#### Automatic Deployment
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

#### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to Netlify
npx netlify deploy --prod --dir=dist
```

#### Netlify Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 2: Vercel

#### Automatic Deployment
1. Import GitHub repository to Vercel
2. Set framework: Vite
3. Add environment variables
4. Deploy

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Vercel Configuration
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 3: Firebase Hosting

#### Setup Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

#### Firebase Configuration
Create `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Staging Environment

### 1. Create Staging Branch
```bash
git checkout -b staging
git push origin staging
```

### 2. Deploy to Staging
```bash
# Build for staging
npm run build

# Deploy to staging URL
# (Configure in your hosting platform)
```

### 3. Test Staging
- Test all features thoroughly
- Check performance metrics
- Verify environment variables
- Test user flows

## Production Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Firebase rules updated
- [ ] API keys secured
- [ ] Performance optimized
- [ ] Error handling implemented
- [ ] Monitoring configured

### Post-Deployment
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] CDN configured (if applicable)
- [ ] Monitoring alerts set
- [ ] Backup strategy implemented
- [ ] Documentation updated

## Monitoring & Analytics

### 1. Firebase Analytics
```javascript
// Already configured in firebase.ts
import { getAnalytics } from 'firebase/analytics';
const analytics = getAnalytics(app);
```

### 2. Error Tracking
```javascript
// Add to main.tsx
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

### 3. Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS
- **User Experience**: Page load times, interaction delays
- **API Performance**: Response times, error rates
- **Usage Analytics**: User behavior, feature adoption

## Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use secure environment variable management
- Rotate API keys regularly
- Monitor API key usage

### 2. Firebase Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. API Security
- Implement rate limiting
- Validate all inputs
- Sanitize user data
- Monitor for abuse

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variables Not Loading
```bash
# Check .env.local file exists
# Verify variable names start with VITE_
# Restart development server
```

#### Firebase Connection Issues
```bash
# Check Firebase configuration
# Verify API keys are correct
# Check Firebase project status
```

#### API Rate Limits
```bash
# Check Gemini API quotas
# Implement exponential backoff
# Add request queuing
```

### Debug Mode
```bash
# Enable debug logging
VITE_DEBUG=true npm run dev
```

## Maintenance

### Regular Tasks
- **Weekly**: Check error logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and optimize costs
- **Annually**: Plan infrastructure scaling

### Backup Strategy
- **Code**: GitHub repository with multiple branches
- **Data**: Firebase automatic backups
- **Configuration**: Documented in version control
- **Secrets**: Secure environment variable management

## Scaling Considerations

### Horizontal Scaling
- **CDN**: Global content delivery
- **Load Balancing**: Distribute traffic across servers
- **Database Sharding**: Partition data across multiple databases
- **Microservices**: Split into smaller, independent services

### Vertical Scaling
- **Server Upgrades**: More CPU, memory, storage
- **Database Optimization**: Better indexing, query optimization
- **Caching**: Redis, Memcached for faster responses
- **Compression**: Gzip, Brotli for smaller payloads

---

*This guide is updated regularly to reflect best practices and platform changes.*
