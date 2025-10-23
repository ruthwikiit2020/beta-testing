# 🚀 Quick Netlify Deployment Guide

## Step 1: Access Your Netlify Dashboard
1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Sign in to your account
3. Find your "rewise-ai" site

## Step 2: Add Environment Variables
1. Click on your "rewise-ai" site
2. Go to **Site settings** → **Environment variables**
3. Click **"Add variable"** for each of these:

### Required Variables:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## Step 3: Get Your API Keys

### Firebase Keys (6 keys needed):
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Click gear icon → **Project Settings**
4. Scroll to **"Your apps"** section
5. Click on your web app (or create one)
6. Copy these values from the config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",                    // ← VITE_FIREBASE_API_KEY
  authDomain: "your-project.firebaseapp.com", // ← VITE_FIREBASE_AUTH_DOMAIN
  projectId: "your-project-id",            // ← VITE_FIREBASE_PROJECT_ID
  storageBucket: "your-project.appspot.com", // ← VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",          // ← VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123"          // ← VITE_FIREBASE_APP_ID
};
```

### Google AI Key (1 key needed):
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **"Get API key"** in the left sidebar
4. Create a new API key
5. Copy the key (starts with "AIzaSy...")

## Step 4: Deploy
1. Go to **"Deploys"** section in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for build to complete (2-3 minutes)

## Step 5: Test Your Live Site
Visit: **https://rewise-ai.netlify.app**

---

## 🔧 If You Need Help Getting API Keys

### Don't have Firebase project?
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: "rewise-ai"
4. Enable Google Analytics (optional)
5. Create project
6. Add web app to the project
7. Copy the config values

### Don't have Google AI API key?
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **"Get API key"**
4. Create a new API key
5. Copy the key

## ✅ Success Checklist
- [ ] All 7 environment variables added to Netlify
- [ ] Deployment triggered successfully
- [ ] Build completed without errors
- [ ] Site loads at https://rewise-ai.netlify.app
- [ ] Can sign in with Google
- [ ] Can upload PDF and generate flashcards
- [ ] Theme toggle works
- [ ] Smart filters work

## 🚨 Troubleshooting

### Build Fails?
- Check build logs in Netlify dashboard
- Verify all environment variables are set correctly
- Check for typos in variable names

### App Not Working?
- Check browser console for errors
- Verify Firebase configuration
- Check Google AI API key is valid

### Still Issues?
- Check the build logs in Netlify
- Verify all environment variables are correctly set
- Make sure you're using the correct Firebase project
