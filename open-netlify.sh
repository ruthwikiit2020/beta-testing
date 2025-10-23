#!/bin/bash

echo "🌐 Opening Netlify Dashboard for Manual Deployment"
echo "================================================="
echo ""

echo "📋 Quick Steps:"
echo "1. Click on your 'rewise-ai' site"
echo "2. Go to 'Deploys' section"
echo "3. Drag and drop 'rewise-ai-deployment.zip'"
echo "4. Wait for deployment to complete"
echo "5. Visit https://rewise-ai.netlify.app"
echo ""

echo "🔧 Don't forget to add environment variables:"
echo "   Go to Site settings → Environment variables"
echo "   Add the 7 required variables (see ENVIRONMENT_VARIABLES_GUIDE.md)"
echo ""

echo "🚀 Opening Netlify dashboard..."
open "https://app.netlify.com/"

echo ""
echo "📁 Your deployment files are ready:"
echo "   - rewise-ai-deployment.zip (for drag & drop)"
echo "   - dist/ folder (for manual upload)"
echo ""
echo "📖 For detailed instructions, see: MANUAL_DEPLOYMENT_GUIDE.md"
