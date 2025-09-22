#!/bin/bash

echo "🚀 Auto-Deploy Monitor for ReWise AI"
echo "===================================="
echo ""

# Function to check deployment status
check_deployment() {
    echo "📊 Checking deployment status..."
    npx netlify status
    echo ""
}

# Function to trigger deployment
trigger_deployment() {
    echo "🔄 Triggering new deployment..."
    git add .
    git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
    echo "✅ Changes pushed to GitHub - Netlify will auto-deploy"
    echo ""
}

# Function to check if there are any changes
check_changes() {
    if [ -n "$(git status --porcelain)" ]; then
        echo "📝 Changes detected - triggering deployment..."
        trigger_deployment
    else
        echo "✅ No changes detected - deployment up to date"
    fi
    echo ""
}

# Function to monitor deployment logs
monitor_logs() {
    echo "📋 Recent deployment logs:"
    npx netlify logs --live
}

# Main execution
echo "🔍 Checking current status..."
check_deployment

echo "🔍 Checking for changes..."
check_changes

echo "📋 To monitor live logs, run: npx netlify logs --live"
echo "🌐 Your app: https://rewise-ai.netlify.app"
echo ""

# Optional: Monitor logs if requested
if [ "$1" = "--monitor" ]; then
    echo "🔍 Starting live log monitoring..."
    monitor_logs
fi
