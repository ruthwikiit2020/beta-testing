# 🚀 Manual Deployment Guide for Netlify

Your ReWise AI app is ready for manual deployment! Here are the steps to deploy it to Netlify.

## 📦 What's Ready

✅ **Built Application**: Your app has been successfully built and is ready in the `dist` folder  
✅ **Deployment Package**: Created `rewise-ai-deployment.zip` for easy upload  
✅ **GitHub Repository**: All code is committed and pushed to GitHub  
✅ **Netlify Site**: Your site `rewise-ai.netlify.app` is already configured  

## 🎯 Manual Deployment Options

### Option 1: Drag & Drop Deployment (Recommended)

1. **Open Netlify Dashboard**:
   - Go to [https://app.netlify.com/](https://app.netlify.com/)
   - Click on your "rewise-ai" site

2. **Deploy via Drag & Drop**:
   - Go to the "Deploys" section
   - Look for the "Deploy manually" area
   - Drag and drop the `rewise-ai-deployment.zip` file
   - Wait for the deployment to complete

3. **Verify Deployment**:
   - Visit [https://rewise-ai.netlify.app](https://rewise-ai.netlify.app)
   - Test your app functionality

### Option 2: Upload Dist Folder

1. **Extract the ZIP file**:
   - Extract `rewise-ai-deployment.zip` to get the `dist` folder contents

2. **Upload to Netlify**:
   - Go to your Netlify site dashboard
   - Navigate to "Deploys" section
   - Use "Deploy manually" option
   - Upload the entire `dist` folder contents

### Option 3: Fix Build Settings (For Future Auto-Deployments)

The current issue is that Netlify is trying to run `npm run build` but can't find the `vite` command. To fix this:

1. **Go to Site Settings**:
   - In your Netlify dashboard, go to "Site settings"
   - Click on "Build & deploy"

2. **Update Build Command**:
   - Change the build command from `npm run build` to `npm ci && npm run build`
   - Or remove the build command entirely since we're deploying pre-built files

3. **Set Publish Directory**:
   - Ensure publish directory is set to `dist`

## 🔧 Environment Variables Setup

**IMPORTANT**: Add these environment variables in Netlify for your app to work:

1. **Go to Site Settings → Environment variables**
2. **Add these 7 variables**:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here`  
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

📖 **For detailed API key setup instructions, see**: `ENVIRONMENT_VARIABLES_GUIDE.md`

## 🎉 After Deployment

Once deployed:

1. **Test Your App**: Visit [https://rewise-ai.netlify.app](https://rewise-ai.netlify.app)
2. **Check Functionality**: Test PDF upload, flashcard generation, and all features
3. **Monitor Logs**: Check Netlify function logs if there are any issues
4. **Set Up Auto-Deploy**: Once working, you can set up automatic deployments from GitHub

## 📁 Files Ready for Deployment

- `dist/` - Built application folder
- `rewise-ai-deployment.zip` - Compressed deployment package
- `netlify.toml` - Netlify configuration
- All source code in GitHub repository

## 🆘 Troubleshooting

If you encounter issues:

1. **Check Build Logs**: In Netlify dashboard, check the deploy logs
2. **Verify Environment Variables**: Ensure all 7 variables are set correctly
3. **Test Locally**: Run `npm run dev` to test locally first
4. **Check Dependencies**: Ensure all packages are installed with `npm install`

## 📞 Support

If you need help:
- Check the build logs in Netlify dashboard
- Refer to `BETA_TESTING_SUMMARY.md` for feature overview
- Review `ENVIRONMENT_VARIABLES_GUIDE.md` for API setup

---

**Your ReWise AI app is ready to go live! 🚀**
