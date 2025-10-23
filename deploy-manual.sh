#!/bin/bash

echo "🚀 Manual Deployment to Netlify"
echo "================================"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Dist folder not found. Building first..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Exiting."
        exit 1
    fi
fi

echo "✅ Dist folder found"
echo "📁 Contents:"
ls -la dist/

echo ""
echo "🌐 Deploying to Netlify..."

# Try to deploy using netlify CLI with a different approach
npx netlify deploy --prod --dir=dist --message="Manual deployment from local system"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo "🌐 Your app is live at: https://rewise-ai.netlify.app"
else
    echo ""
    echo "❌ Netlify CLI deployment failed. Trying alternative method..."
    echo ""
    echo "📋 Manual deployment steps:"
    echo "1. Go to https://app.netlify.com/"
    echo "2. Click on your 'rewise-ai' site"
    echo "3. Go to 'Deploys' section"
    echo "4. Drag and drop the 'dist' folder to deploy"
    echo "5. Or use 'Deploy manually' option"
    echo ""
    echo "📁 Your dist folder is ready at: $(pwd)/dist"
fi
