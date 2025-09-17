# ReWise AI - Netlify Deployment Guide

## 🚀 Deploy to Netlify

### Method 1: Drag & Drop (Easiest)

1. **Build the app** (already done):
   ```bash
   npm run build
   ```

2. **Go to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub, Google, or email

3. **Deploy**:
   - On the Netlify dashboard, look for "Want to deploy a new site without connecting to Git?"
   - Drag and drop the `dist` folder from your project to the deploy area
   - Your app will be live in seconds!

### Method 2: Git Integration (Recommended)

1. **Push to GitHub** (already done):
   - Your code is already on GitHub at: https://github.com/ruthwikiit2020/studyswipe

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose "GitHub" and authorize
   - Select your repository: `ruthwikiit2020/studyswipe`

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

### Method 3: Netlify CLI (Advanced)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

## 🔧 Environment Variables

After deployment, add your environment variables in Netlify:

1. **Go to Site Settings** → **Environment Variables**
2. **Add**:
   - `VITE_GEMINI_API_KEY` = your_api_key_here

## 📱 Your App Will Be Live At:
- **Custom URL**: `https://your-site-name.netlify.app`
- **Custom Domain**: You can add your own domain later

## 🎯 Features Included:
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Custom Domain Support**
- ✅ **Form Handling**
- ✅ **Branch Deploys**
- ✅ **Rollback Support**

## 🔄 Continuous Deployment:
- Every push to your main branch will automatically deploy
- Preview deployments for pull requests
- Instant rollbacks if needed

## 📞 Support:
- Netlify Docs: [docs.netlify.com](https://docs.netlify.com)
- Netlify Community: [community.netlify.com](https://community.netlify.com)
