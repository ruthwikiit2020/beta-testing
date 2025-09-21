#!/bin/bash

echo "🚀 ReWise AI - Netlify Deployment Status Check"
echo "=============================================="
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

# Test build locally
echo "🔨 Testing local build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Local build successful"
    if [ -d "dist" ]; then
        echo "✅ Dist directory created"
        echo "   Size: $(du -sh dist | cut -f1)"
    else
        echo "❌ Dist directory not found"
    fi
else
    echo "❌ Local build failed"
    echo "   Run 'npm run build' to see errors"
fi

echo ""

echo "🌐 Deployment Information:"
echo "   GitHub Repository: https://github.com/ruthwikiit2020/beta-testing"
echo "   Netlify Site: https://rewise-ai.netlify.app"
echo "   Branch: main (auto-deploys on push)"
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
echo "   3. Check 'Deploys' section for build status"
echo "   4. If build failed, check build logs for errors"
echo "   5. Add environment variables in Site settings"
echo "   6. Test your live site at https://rewise-ai.netlify.app"
echo ""

echo "📖 Documentation:"
echo "   - QUICK_DEPLOYMENT_GUIDE.md - Step-by-step deployment guide"
echo "   - ENVIRONMENT_VARIABLES_GUIDE.md - API key setup instructions"
echo "   - BETA_TESTING_SUMMARY.md - Complete feature overview"
echo ""

echo "🎉 Your app should be automatically deploying to Netlify!"
echo "   Check the Netlify dashboard for build status and logs."
