# 🚀 ReWise AI - Netlify Deployment Guide

This guide will help you deploy ReWise AI to Netlify with the custom domain "rewise-ai".

## 🌐 Deployment Steps

### 1. Create Netlify Site

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign in** to your account
3. **Click "New site from Git"**
4. **Choose "GitHub"** as your Git provider
5. **Authorize Netlify** to access your GitHub account

### 2. Connect Repository

1. **Select Repository**: `ruthwikiit2020/beta-testing`
2. **Choose Branch**: `main`
3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### 3. Set Site Name to "rewise-ai"

1. **Before deploying**, click on "Site settings"
2. **Go to "Site details"**
3. **Change site name** to `rewise-ai`
4. **Your site URL** will be: `https://rewise-ai.netlify.app`

### 4. Configure Environment Variables

Go to **Site settings → Environment variables** and add:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### 5. Deploy

1. **Click "Deploy site"**
2. **Wait for build** to complete (usually 2-3 minutes)
3. **Your site** will be live at `https://rewise-ai.netlify.app`

## 🔧 Post-Deployment Configuration

### 1. Firebase Domain Authorization

1. **Go to Firebase Console**
2. **Authentication → Settings → Authorized domains**
3. **Add domain**: `rewise-ai.netlify.app`

### 2. Deploy Firebase Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### 3. Test Deployment

1. **Visit**: `https://rewise-ai.netlify.app`
2. **Test Google Sign-in**
3. **Upload a PDF** and test flashcard generation
4. **Test theme toggle** in settings
5. **Test notifications** (if enabled)

## 🎯 Custom Domain (Optional)

### 1. Add Custom Domain

1. **Go to Site settings → Domain management**
2. **Add custom domain**: `rewise-ai.com` (or your preferred domain)
3. **Follow DNS configuration** instructions

### 2. SSL Certificate

- Netlify automatically provides SSL certificates
- Force HTTPS in site settings

## 🔄 Continuous Deployment

The site will automatically redeploy when you push changes to the `main` branch.

### Workflow:
1. Make changes locally
2. Commit and push to GitHub
3. Netlify automatically builds and deploys
4. Check deployment status in Netlify dashboard

## 📊 Monitoring

### 1. Netlify Analytics
- Enable in site settings
- Monitor site performance and usage

### 2. Build Logs
- Check build logs for any errors
- Monitor deployment status

## 🛡️ Security Features

### 1. Headers Configuration
The `netlify.toml` includes security headers:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### 2. Environment Variables
- All sensitive data stored in Netlify environment variables
- Never committed to Git repository

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version (should be 18)
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
   - Verify authorized domains include `rewise-ai.netlify.app`
   - Check Firebase Auth settings

## 📱 Mobile Optimization

The app is fully responsive and optimized for:
- Desktop browsers
- Mobile devices
- Tablets
- Progressive Web App (PWA) features

## 🎉 Success!

Your ReWise AI application is now live at:
**https://rewise-ai.netlify.app**

### Features Available:
- ✅ RAG-powered PDF processing
- ✅ Owner access for `ruthwikiit2020@gmail.com`
- ✅ Theme switching (light/dark)
- ✅ Daily notifications
- ✅ Smart filters for all users
- ✅ Usage tracking and limits
- ✅ Responsive design
- ✅ Security headers

## 📞 Support

If you encounter any issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test Firebase connection
4. Check browser console for errors

---

**Repository**: `https://github.com/ruthwikiit2020/beta-testing`
**Live Site**: `https://rewise-ai.netlify.app`