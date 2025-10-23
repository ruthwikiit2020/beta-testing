#!/bin/bash

echo "🚀 ReWise AI - Netlify Deployment Script"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check git status
echo "📋 Git Status:"
git status --short
echo ""

# Check if we're on main branch
current_branch=$(git branch --show-current)
echo "🌿 Current branch: $current_branch"

if [ "$current_branch" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch. Netlify typically deploys from main."
fi

echo ""

# Check last commit
echo "📝 Last commit:"
git log -1 --oneline
echo ""

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. These won't be deployed."
    echo "   Run 'git add . && git commit -m \"your message\" && git push origin main' to commit changes."
else
    echo "✅ No uncommitted changes. Ready for deployment."
fi

echo ""

# Test build
echo "🔨 Testing build process..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
    if [ -d "dist" ]; then
        echo "✅ Dist directory created"
        echo "   Size: $(du -sh dist | cut -f1)"
    else
        echo "❌ Dist directory not found"
    fi
else
    echo "❌ Build failed"
    echo "   Run 'npm run build' to see errors"
    exit 1
fi

echo ""

echo "🌐 Deployment Information:"
echo "   GitHub Repository: https://github.com/ruthwikiit2020/beta-testing"
echo "   Netlify Site: https://rewise-ai.netlify.app"
echo ""

echo "🔧 Required Environment Variables in Netlify:"
echo "   VITE_FIREBASE_API_KEY"
echo "   VITE_FIREBASE_AUTH_DOMAIN"
echo "   VITE_FIREBASE_PROJECT_ID"
echo "   VITE_FIREBASE_STORAGE_BUCKET"
echo "   VITE_FIREBASE_MESSAGING_SENDER_ID"
echo "   VITE_FIREBASE_APP_ID"
echo "   VITE_GOOGLE_AI_API_KEY"
echo ""

echo "📋 Next Steps:"
echo "   1. Go to Netlify dashboard: https://app.netlify.com/"
echo "   2. Click on your 'rewise-ai' site"
echo "   3. Go to Site settings → Environment variables"
echo "   4. Add all 7 environment variables above"
echo "   5. Go to Deploys section"
echo "   6. Click 'Trigger deploy' → 'Deploy site'"
echo "   7. Wait for build to complete"
echo "   8. Test your live site!"
echo ""

echo "📖 Documentation:"
echo "   - ENVIRONMENT_VARIABLES_GUIDE.md - Detailed setup instructions"
echo "   - BETA_TESTING_SUMMARY.md - Complete feature overview"
echo "   - NETLIFY_DEPLOYMENT.md - Deployment guide"
echo ""

echo "🎉 Your app is ready for Netlify deployment!"
echo "   Once deployed, visit: https://rewise-ai.netlify.app"
