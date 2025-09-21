#!/bin/bash

# ReWise AI - Netlify Deployment Script
echo "🚀 Deploying ReWise AI to Netlify (rewise-ai.netlify.app)..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not found. Please initialize git first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build successful!"

# Add all changes to git
echo "📝 Adding changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to rewise-ai.netlify.app: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "🎉 Deployment initiated!"
echo "🌐 Your app will be available at: https://rewise-ai.netlify.app"
echo ""
echo "📋 Next steps:"
echo "   1. Go to Netlify dashboard"
echo "   2. Create new site from GitHub repository"
echo "   3. Set site name to 'rewise-ai'"
echo "   4. Configure build settings:"
echo "      - Build command: npm run build"
echo "      - Publish directory: dist"
echo "      - Node version: 18"
echo "   5. Add environment variables"
echo "   6. Deploy!"
echo ""
echo "📖 For detailed instructions, see: NETLIFY_DEPLOYMENT.md"
