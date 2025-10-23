#!/bin/bash

echo "🚀 ReWise AI - Deployment Verification"
echo "======================================"
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
echo "🌐 Your site: https://rewise-ai.netlify.app"
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
echo "📋 Next steps:"
echo "   1. Add environment variables in Netlify dashboard"
echo "   2. Trigger manual deploy"
echo "   3. Check build logs for any errors"
echo "   4. Test your live site!"
echo ""
echo "📖 For detailed instructions, see: NETLIFY_DEPLOYMENT.md"
