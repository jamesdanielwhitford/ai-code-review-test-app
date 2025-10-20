# 🚀 START HERE - Screenshot Replication Project

Welcome! This project helps you replicate the 3 remaining screenshots for the Sentry AI Code Review article.

## ✅ Git Setup Complete!

The git repository is ready with:
- ✅ Git initialized
- ✅ All code committed to `main` branch
- ✅ `.gitignore` configured (protects your Sentry DSNs)
- ✅ 3 commits ready to push
- ⏭️ Ready to push to GitHub

## 📋 Quick Start Checklist

### Step 1: Push to GitHub (5 minutes)

Choose one option:

**Option A - Easy way (recommended):**
```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project
./setup-github.sh
```

**Option B - Manual way:**
1. Create repo on GitHub: https://github.com/new
2. Name it: `sentry-ai-code-review-demo`
3. Run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/sentry-ai-code-review-demo.git
git push -u origin main
```

### Step 2: Set Up Environment Files (5 minutes)

**Frontend:**
```bash
cd frontend
cat > .env.local << 'EOF'
REACT_APP_SENTRY_DSN=https://5a2016e2d7e8120988dced24dee3c4cc@o1176753.ingest.us.sentry.io/4510222570815488
REACT_APP_BACKEND_URL=http://localhost:5000
EOF
```

**Backend:**
```bash
cd ../backend
cat > .env << 'EOF'
SENTRY_DSN=https://0fa86498499dc70cc50a322fefc0ab74@o1176753.ingest.us.sentry.io/4510222579007488
PORT=5000
EOF
```

### Step 3: Enable Sentry Features (5 minutes)

1. Go to https://sentry.io/orgredirect/settings/:orgslug/
2. Enable:
   - ✅ Show Generative AI Features
   - ✅ Enable AI code review
3. Enable distributed tracing in BOTH projects:
   - Settings → Projects → [Project] → Performance → Distributed Tracing: ON
4. Install GitHub apps:
   - https://github.com/marketplace/sentry
   - https://github.com/apps/seer-by-sentry

### Step 4: Generate Historical Errors ⚠️ CRITICAL (20 minutes)

**This must be done BEFORE creating the PR!**

```bash
# Terminal 1 - Start frontend
cd frontend
npm install
npm start
# Opens http://localhost:3000

# Terminal 2 - Start backend
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

Then **trigger the bug 3-4 times**:
1. Open http://localhost:3000
2. Enter: Visitors = `0`, Conversions = `5`
3. Click "Calculate Rate"
4. Repeat with different conversion values
5. **Wait 5-10 minutes** for Sentry to index the errors
6. Verify errors appear in Sentry dashboard

### Step 5: Create PR (10 minutes)

```bash
# Create and push PR branch
git checkout -b add-analytics-request
git push origin add-analytics-request

# Go to GitHub and create Pull Request:
# - Base: main
# - Compare: add-analytics-request
# - Title: "Add analytics request"
# - Mark as "Ready for review"
```

### Step 6: Wait for AI Review (3 minutes)

Sentry AI Code Review will:
- Analyze your PR automatically
- Reference the historical errors you created
- Leave a comment about the validation bug

### Step 7: Capture Screenshots (30 minutes)

See detailed instructions in `STEP-BY-STEP-GUIDE.md` Phase 7

**Screenshot 1**: GitHub PR comment from seer-by-sentry bot
**Screenshot 2**: Sentry dashboard showing "visitor count is zero" error
**Screenshot 3**: Distributed tracing waterfall

## 📚 Documentation Files

- **START-HERE.md** (this file) - Quick overview
- **QUICK-START.md** - Fast setup with your existing Sentry DSNs
- **QUICK-CHECKLIST.md** - Complete checklist
- **STEP-BY-STEP-GUIDE.md** - Detailed walkthrough (2 hours)
- **GIT-WORKFLOW.md** - Git commands and workflow
- **README.md** - Project overview

## 🐛 The Bugs

**Frontend** (`frontend/src/hooks/useConversionRate.js:14-17`):
```javascript
// BUG: Checks < 0 instead of <= 0, allows zero to pass
if (conversions < 0 || visitors < 0) {
  setError('Conversions and visitors must be positive numbers');
  return;
}
```

**Backend** (`backend/server.js:46`):
```javascript
// Throws error when visitors = 0
if (visitors === 0) {
  throw new Error('Cannot calculate conversion rate: visitor count is zero...');
}
```

## 🎯 Critical Success Factors

1. ⚠️ **Trigger errors BEFORE creating PR** (or AI won't reference them)
2. ⚠️ **Wait 5-10 minutes** after triggering errors
3. ⚠️ **Enable distributed tracing** in both Sentry projects
4. ✅ Both Sentry projects in same organization
5. ✅ GitHub apps installed correctly

## ⏱️ Expected Timeline

- Push to GitHub: 5 min
- Environment setup: 5 min
- Sentry configuration: 5 min
- Generate errors: 20 min (includes wait time)
- Create PR: 10 min
- AI review: 3 min (wait time)
- Capture screenshots: 30 min
- **Total: ~1.5 hours**

## 🆘 Need Help?

- **Git issues**: See `GIT-WORKFLOW.md`
- **Setup issues**: See `QUICK-START.md`
- **Detailed steps**: See `STEP-BY-STEP-GUIDE.md`
- **Quick checklist**: See `QUICK-CHECKLIST.md`

## 🚀 Ready to Start?

```bash
# Push to GitHub
./setup-github.sh

# Then follow the checklist above!
```

Good luck! 🎉
