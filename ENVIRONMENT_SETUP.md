# 🔐 Environment Variables Setup

This guide will help you set up the required environment variables for ReWise AI.

## 📋 Required Variables

### Firebase Configuration

1. **Go to Firebase Console**
   - Visit [console.firebase.google.com](https://console.firebase.google.com)
   - Select your project

2. **Get Configuration**
   - Go to Project Settings → General
   - Scroll down to "Your apps" section
   - Click on your web app or create one
   - Copy the configuration object

3. **Extract Values**
   ```javascript
   // From Firebase config object
   apiKey: "your_firebase_api_key",
   authDomain: "your_project_id.firebaseapp.com",
   projectId: "your_project_id",
   storageBucket: "your_project_id.appspot.com",
   messagingSenderId: "your_sender_id",
   appId: "your_app_id"
   ```

### Google AI API Key

1. **Go to Google AI Studio**
   - Visit [aistudio.google.com](https://aistudio.google.com)
   - Sign in with your Google account

2. **Create API Key**
   - Click "Get API key"
   - Create a new API key
   - Copy the key

## 🌐 Netlify Setup

### Method 1: Netlify Dashboard

1. **Go to Site Settings**
   - Open your Netlify site dashboard
   - Go to Site settings → Environment variables

2. **Add Variables**
   ```
   VITE_FIREBASE_API_KEY = your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN = your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = your_project_id
   VITE_FIREBASE_STORAGE_BUCKET = your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
   VITE_FIREBASE_APP_ID = your_app_id
   VITE_GOOGLE_AI_API_KEY = your_google_ai_api_key
   ```

3. **Redeploy**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"

### Method 2: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Set Environment Variables**
   ```bash
   netlify env:set VITE_FIREBASE_API_KEY "your_firebase_api_key"
   netlify env:set VITE_FIREBASE_AUTH_DOMAIN "your_project_id.firebaseapp.com"
   netlify env:set VITE_FIREBASE_PROJECT_ID "your_project_id"
   netlify env:set VITE_FIREBASE_STORAGE_BUCKET "your_project_id.appspot.com"
   netlify env:set VITE_FIREBASE_MESSAGING_SENDER_ID "your_sender_id"
   netlify env:set VITE_FIREBASE_APP_ID "your_app_id"
   netlify env:set VITE_GOOGLE_AI_API_KEY "your_google_ai_api_key"
   ```

## 🔧 Local Development

1. **Create .env file**
   ```bash
   cp env.example .env
   ```

2. **Edit .env file**
   - Replace placeholder values with actual values
   - Save the file

3. **Start development server**
   ```bash
   npm run dev
   ```

## ✅ Verification

### Check Environment Variables

1. **In Browser Console**
   ```javascript
   console.log(import.meta.env.VITE_FIREBASE_API_KEY);
   console.log(import.meta.env.VITE_GOOGLE_AI_API_KEY);
   ```

2. **In Netlify Dashboard**
   - Go to Site settings → Environment variables
   - Verify all variables are set correctly

### Test Functionality

1. **Firebase Connection**
   - Try to sign in with Google
   - Check browser console for Firebase errors

2. **Google AI Integration**
   - Upload a PDF and try to generate flashcards
   - Check browser console for API errors

## 🚨 Security Notes

- **Never commit .env files to Git**
- **Use Netlify's environment variable system for production**
- **Rotate API keys regularly**
- **Monitor usage and set up billing alerts**

## 🆘 Troubleshooting

### Common Issues:

1. **Variables not loading**
   - Ensure variables start with `VITE_`
   - Redeploy after adding variables
   - Check variable names match exactly

2. **Firebase connection fails**
   - Verify Firebase project is active
   - Check Firebase configuration
   - Ensure domain is authorized

3. **Google AI API errors**
   - Verify API key is correct
   - Check API quotas and billing
   - Ensure API is enabled

## 📞 Support

If you need help:
1. Check the browser console for errors
2. Review Netlify build logs
3. Verify all environment variables are set
4. Test with a simple API call first
