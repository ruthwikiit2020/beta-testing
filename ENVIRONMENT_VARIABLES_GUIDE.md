# 🔧 Environment Variables Setup for Netlify

## Quick Setup Guide

### Step 1: Access Netlify Dashboard
1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Click on your **"rewise-ai"** site
3. Go to **Site settings** → **Environment variables**

### Step 2: Add These 7 Variables

Click **"Add variable"** for each one:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyC...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123456789:web:abc123` |
| `VITE_GOOGLE_AI_API_KEY` | Google AI API Key | `AIzaSyC...` |

### Step 3: Get Your Firebase Config

1. **Go to Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. **Select your project**
3. **Go to Project Settings** (gear icon)
4. **Scroll to "Your apps"** section
5. **Click on your web app** or create one
6. **Copy the config values**

### Step 4: Get Google AI API Key

1. **Go to Google AI Studio**: [https://aistudio.google.com/](https://aistudio.google.com/)
2. **Sign in** with your Google account
3. **Go to API Keys** section
4. **Create a new API key**

### Step 5: Deploy

1. **Go to "Deploys"** section
2. **Click "Trigger deploy"** → **"Deploy site"**
3. **Wait for build** to complete

## ✅ Verification

After deployment, your app should be live at:
**https://rewise-ai.netlify.app**

### Test These Features:
- ✅ Google Sign-in
- ✅ PDF Upload
- ✅ Flashcard Generation
- ✅ Theme Toggle
- ✅ Smart Filters
- ✅ Notifications (if enabled)

## 🚨 Troubleshooting

### Build Fails?
- Check build logs in Netlify dashboard
- Verify all environment variables are set
- Check for typos in variable names

### App Not Working?
- Check browser console for errors
- Verify Firebase configuration
- Check Google AI API key is valid

### Still Issues?
- Check the build logs in Netlify
- Verify all environment variables are correctly set
- Make sure you're using the correct Firebase project
