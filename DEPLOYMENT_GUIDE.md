# 🚀 ReWise AI - Deployment Guide

This guide will help you deploy the ReWise AI application to GitHub and Netlify.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Netlify account
- Firebase project set up

## 🔧 Environment Variables

Before deploying, you need to set up the following environment variables:

### Required Environment Variables

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google AI API
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## 🐙 GitHub Deployment

### 1. Repository Setup

The repository is already set up at: `https://github.com/ruthwikiit2020/beta-testing.git`

### 2. Push Latest Changes

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

## 🌐 Netlify Deployment

### Method 1: Connect GitHub Repository (Recommended)

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign in to your account

2. **Create New Site from Git**
   - Click "New site from Git"
   - Choose "GitHub" as your Git provider
   - Authorize Netlify to access your GitHub account

3. **Select Repository**
   - Find and select `ruthwikiit2020/beta-testing`
   - Choose the `main` branch

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

5. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add all the required environment variables listed above

6. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete

### Method 2: Manual Deploy

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify dashboard
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist`

## 🔐 Firebase Configuration

### 1. Update Firebase Rules

Make sure your `firestore.rules` file is deployed:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

### 2. Enable Authentication

In Firebase Console:
1. Go to Authentication → Sign-in method
2. Enable Google sign-in
3. Add your domain to authorized domains

## 🚀 Post-Deployment Checklist

### ✅ Verify Deployment

1. **Check Site Functionality**
   - [ ] Site loads without errors
   - [ ] Google authentication works
   - [ ] PDF upload and processing works
   - [ ] Theme toggle works
   - [ ] Notifications work (if enabled)
   - [ ] Smart filters work

2. **Test Owner Access**
   - [ ] Login with `ruthwikiit2020@gmail.com`
   - [ ] Verify unlimited access
   - [ ] Check that owner status is hidden in UI

3. **Test Regular User Access**
   - [ ] Login with different email
   - [ ] Verify free tier limitations
   - [ ] Check upgrade options

### 🔧 Troubleshooting

#### Common Issues:

1. **Build Fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Redeploy after adding variables
   - Check variable names match exactly

3. **Firebase Connection Issues**
   - Verify Firebase configuration
   - Check Firebase rules are deployed
   - Ensure domain is authorized

4. **Authentication Not Working**
   - Check Google OAuth configuration
   - Verify authorized domains
   - Check Firebase Auth settings

## 📱 Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to Site settings → Domain management
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Netlify automatically provides SSL certificates
   - Force HTTPS in site settings

## 🔄 Continuous Deployment

The site will automatically redeploy when you push changes to the `main` branch on GitHub.

### Workflow:
1. Make changes locally
2. Commit and push to GitHub
3. Netlify automatically builds and deploys
4. Check deployment status in Netlify dashboard

## 📊 Monitoring

### Netlify Analytics
- Enable Netlify Analytics in site settings
- Monitor site performance and usage

### Firebase Analytics
- Add Firebase Analytics to track user behavior
- Monitor app performance and errors

## 🛡️ Security Considerations

1. **Environment Variables**
   - Never commit API keys to Git
   - Use Netlify's environment variable system
   - Rotate keys regularly

2. **Firebase Security Rules**
   - Regularly review and update Firestore rules
   - Test rules in Firebase console
   - Monitor for unauthorized access

3. **Owner Access**
   - Owner email is hardcoded for security
   - Only `ruthwikiit2020@gmail.com` has owner access
   - Owner status is hidden from UI

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Review Netlify build logs
3. Check Firebase console for database issues
4. Verify all environment variables are set correctly

## 🎉 Success!

Your ReWise AI application should now be live and accessible to users!

**Live URL:** `https://your-site-name.netlify.app`

Remember to:
- Test all functionality thoroughly
- Monitor the site for any issues
- Keep dependencies updated
- Regularly backup your data
