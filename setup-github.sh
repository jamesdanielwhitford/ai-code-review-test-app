#!/bin/bash

# Setup GitHub Remote Script
# This script helps you push the project to GitHub

echo "🚀 GitHub Setup Script"
echo "====================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Prompt for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Prompt for repository name
read -p "Enter repository name (e.g., sentry-ai-code-review-demo): " REPO_NAME

# Construct the GitHub URL
GITHUB_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo ""
echo "📝 Repository URL: $GITHUB_URL"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote 'origin' already exists"
    read -p "Do you want to replace it? (y/n): " REPLACE
    if [ "$REPLACE" = "y" ]; then
        git remote remove origin
        echo "✅ Removed existing remote"
    else
        echo "❌ Aborted"
        exit 1
    fi
fi

# Add remote
git remote add origin "$GITHUB_URL"
echo "✅ Added remote 'origin'"

# Show current branch
CURRENT_BRANCH=$(git branch --show-current)
echo ""
echo "Current branch: $CURRENT_BRANCH"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
if git push -u origin $CURRENT_BRANCH; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🔗 Your repository: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo "2. Verify the code is there"
    echo "3. Follow QUICK-START.md to set up .env files"
    echo "4. Trigger the bug to create historical Sentry errors"
    echo "5. Create the PR branch with: git checkout -b add-analytics-request"
else
    echo ""
    echo "❌ Failed to push to GitHub"
    echo ""
    echo "Make sure you:"
    echo "1. Created the repository on GitHub: https://github.com/new"
    echo "2. Have git credentials configured"
    echo "3. Have permission to push to this repository"
    exit 1
fi
