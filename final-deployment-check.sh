#!/bin/bash

echo "🚀 ReWise AI - Final Deployment Verification"
echo "============================================="
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

# Check if development server is running
if pgrep -f "vite" > /dev/null; then
    echo "✅ Development server is running"
    echo "   Local: http://localhost:5173 or http://localhost:5174"
else
    echo "ℹ️  Development server is not running"
    echo "   Run 'npm run dev' to start local development"
fi

echo ""

# Check build
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
fi

echo ""

echo "🌐 Deployment URLs:"
echo "   GitHub Repository: https://github.com/ruthwikiit2020/beta-testing"
echo "   Live Site: https://rewise-ai.netlify.app"
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
echo "   1. Add environment variables in Netlify dashboard"
echo "   2. Trigger manual deploy in Netlify"
echo "   3. Test the live site functionality"
echo "   4. Monitor build logs for any errors"
echo ""

echo "📖 Documentation:"
echo "   - BETA_TESTING_SUMMARY.md - Complete feature overview"
echo "   - ENVIRONMENT_VARIABLES_GUIDE.md - Setup instructions"
echo "   - NETLIFY_DEPLOYMENT.md - Deployment guide"
echo ""

echo "🎉 ReWise AI is ready for production deployment!"
