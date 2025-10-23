#!/bin/bash

echo "🔍 Checking ReWise AI Deployment Status..."
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
echo "🌐 Your site should be available at: https://rewise-ai.netlify.app"
echo ""
echo "📋 Next steps:"
echo "   1. Go to Netlify dashboard"
echo "   2. Connect your site to GitHub repository"
echo "   3. Set build command: npm run build"
echo "   4. Set publish directory: dist"
echo "   5. Add environment variables"
echo "   6. Trigger manual deploy"
echo ""
echo "📖 For detailed instructions, see: NETLIFY_DEPLOYMENT.md"
