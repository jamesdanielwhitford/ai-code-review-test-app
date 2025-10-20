# Git Workflow for Screenshot Replication

This document explains the git workflow for replicating the Sentry AI Code Review screenshots.

## Current Status

✅ Git repository initialized
✅ Initial commit created with all code
✅ Branch renamed to `main`
✅ Sentry SDK v8 integration fixed

## Next Steps

### 1. Push to GitHub

#### Option A: Use the setup script (easiest)

```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project
./setup-github.sh
```

The script will:
- Ask for your GitHub username
- Ask for the repository name
- Add the GitHub remote
- Push the code to GitHub

#### Option B: Manual setup

```bash
# 1. Create a new repository on GitHub
#    Go to: https://github.com/new
#    Name: sentry-ai-code-review-demo (or your choice)
#    Don't initialize with README

# 2. Add the remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 3. Push to GitHub
git push -u origin main
```

### 2. Set Up Environment Files (Before Triggering Bugs)

**IMPORTANT**: Do this BEFORE creating the PR!

```bash
# Frontend
cd frontend
cat > .env.local << 'EOF'
REACT_APP_SENTRY_DSN=https://5a2016e2d7e8120988dced24dee3c4cc@o1176753.ingest.us.sentry.io/4510222570815488
REACT_APP_BACKEND_URL=http://localhost:5000
EOF

# Backend
cd ../backend
cat > .env << 'EOF'
SENTRY_DSN=https://0fa86498499dc70cc50a322fefc0ab74@o1176753.ingest.us.sentry.io/4510222579007488
PORT=5000
EOF
```

### 3. Start Servers and Generate Historical Errors

```bash
# Terminal 1 - Frontend
cd frontend
npm install
npm start

# Terminal 2 - Backend
cd backend
npm install
npm start
```

Then trigger the bug 3-4 times at http://localhost:3000:
- Submit form with visitors = 0, conversions = 5
- Wait 5-10 minutes for Sentry to index the errors

### 4. Create PR Branch

Once you have historical errors in Sentry:

```bash
# Make sure you're on main
git checkout main

# Create the feature branch
git checkout -b add-analytics-request

# The buggy code is already there, so just push it
git push origin add-analytics-request
```

### 5. Open Pull Request on GitHub

1. Go to your repository on GitHub
2. Click "Pull requests" → "New pull request"
3. Base: `main`, Compare: `add-analytics-request`
4. Title: "Add analytics request"
5. Description:
   ```
   Adding conversion rate calculator to analytics dashboard.

   Features:
   - New ConversionForm component
   - Backend API endpoint for calculations
   - Form validation
   - Error handling
   ```
6. Click "Create pull request"
7. Mark as "Ready for review"

### 6. Wait for Sentry AI Code Review

- Sentry bot will comment within 1-3 minutes
- The comment should reference your historical Sentry errors
- If it doesn't, wait 10-15 minutes and try closing/reopening the PR

### 7. Capture Screenshots

Follow the instructions in `STEP-BY-STEP-GUIDE.md` Phase 7 to capture:

1. `comment-sentry-context.png` - AI review comment on GitHub
2. `sentry-issue-visitor-count-zero.png` - Sentry dashboard with error
3. `sentry-distributed-tracing.png` - Distributed tracing waterfall

## Repository Structure

```
your-repo/                          ← Single GitHub repository
├── frontend/                       ← React app
│   ├── src/
│   │   ├── components/
│   │   │   └── ConversionForm.jsx  ← Form with number inputs
│   │   ├── hooks/
│   │   │   └── useConversionRate.js ← BUGGY VALIDATION HERE (line 14-17)
│   │   └── pages/
│   ├── package.json
│   └── .env.local                  ← Sentry DSN (not committed)
├── backend/                        ← Express API
│   ├── server.js                   ← Division-by-zero bug (line 46)
│   ├── package.json
│   └── .env                        ← Sentry DSN (not committed)
└── README.md
```

## The Bug Location

### Frontend Bug (causes zero to be submitted)

**File**: `frontend/src/hooks/useConversionRate.js`
**Lines**: 14-17

```javascript
// BUGGY: Checks < 0 instead of <= 0
if (conversions < 0 || visitors < 0) {
  setError('Conversions and visitors must be positive numbers');
  return;
}
```

### Backend Bug (throws error on zero)

**File**: `backend/server.js`
**Line**: 46

```javascript
if (visitors === 0) {
  throw new Error('Cannot calculate conversion rate: visitor count is zero...');
}
```

## Why This Order Matters

1. **Push to GitHub first** - Sets up the repository
2. **Generate errors** - Creates historical data in Sentry
3. **Wait 5-10 minutes** - Lets Sentry index the errors
4. **Create PR** - AI review can now reference historical errors
5. **Capture screenshots** - Everything is ready

If you create the PR before generating errors, the AI review won't have historical context to reference!

## Troubleshooting

### "remote origin already exists"

```bash
git remote remove origin
# Then add it again
```

### "failed to push"

Make sure you created the repository on GitHub first:
https://github.com/new

### "AI review doesn't mention Sentry errors"

- Did you trigger the bug before creating the PR?
- Did you wait 5-10 minutes after triggering?
- Check Sentry dashboard to verify errors exist
- Try closing and reopening the PR

## Quick Reference

```bash
# Current directory structure
/Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project/

# Check git status
git status

# View commit history
git log --oneline

# Check remote
git remote -v

# View current branch
git branch

# Push current branch
git push origin $(git branch --show-current)
```

## Next Actions

✅ Git is set up and ready
⏭️ Next: Run `./setup-github.sh` to push to GitHub
⏭️ Then: Follow `QUICK-START.md` for the rest of the workflow
