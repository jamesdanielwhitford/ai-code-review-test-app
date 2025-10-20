# Quick Start Guide

Based on your existing Sentry projects, here's the fastest way to get started.

## Your Sentry Projects

I can see you already have two Sentry projects set up:

- **Frontend DSN**: `https://5a2016e2d7e8120988dced24dee3c4cc@o1176753.ingest.us.sentry.io/4510222570815488`
- **Backend DSN**: `https://0fa86498499dc70cc50a322fefc0ab74@o1176753.ingest.us.sentry.io/4510222579007488`

## Fast Setup (10 minutes)

### Step 1: Configure Environment Variables

```bash
# Navigate to project
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project

# Set up frontend
cd frontend
cat > .env.local << 'EOF'
REACT_APP_SENTRY_DSN=https://5a2016e2d7e8120988dced24dee3c4cc@o1176753.ingest.us.sentry.io/4510222570815488
REACT_APP_BACKEND_URL=http://localhost:5000
EOF

# Set up backend
cd ../backend
cat > .env << 'EOF'
SENTRY_DSN=https://0fa86498499dc70cc50a322fefc0ab74@o1176753.ingest.us.sentry.io/4510222579007488
PORT=5000
EOF
```

### Step 2: Install Dependencies & Start Servers

Open **two terminal windows**:

**Terminal 1 - Frontend:**
```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project/frontend
npm install
npm start
```

**Terminal 2 - Backend:**
```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project/backend
npm install
npm start
```

### Step 3: Verify Sentry Configuration

Check that you have these settings enabled in your Sentry organization:

1. Go to https://sentry.io/orgredirect/settings/:orgslug/
2. Enable:
   - ✅ Show Generative AI Features
   - ✅ Enable AI code review

### Step 4: Enable Distributed Tracing

For **both projects** (frontend and backend):

1. Go to Settings → Projects → [Your Project] → Performance
2. Enable "Distributed Tracing"
3. Click "Save"

### Step 5: Install GitHub Apps (if not already installed)

1. **Sentry GitHub app**: https://github.com/marketplace/sentry
2. **Seer by Sentry app**: https://github.com/apps/seer-by-sentry

## Now Follow the Main Workflow

Once setup is complete, follow the critical workflow:

1. **Generate Historical Errors** (MUST DO FIRST)
   - Open http://localhost:3000
   - Submit form with visitors = 0, conversions = 5
   - Repeat 3-4 times
   - Wait 5-10 minutes

2. **Verify Errors in Sentry**
   - Go to your backend project in Sentry
   - Check that errors appear
   - Click into an error and verify distributed tracing works

3. **Create GitHub Repository**
   - Create new repo on GitHub
   - Push this code to it

4. **Create PR with Bug**
   - Create branch: `add-analytics-request`
   - Push branch
   - Open PR on GitHub

5. **Capture Screenshots**
   - Wait for Sentry AI review comment
   - Follow screenshot instructions in STEP-BY-STEP-GUIDE.md

## The Bug Location

The validation bug is in `frontend/src/hooks/useConversionRate.js` at lines 14-17:

```javascript
// BUGGY VALIDATION: checks < 0 instead of <= 0
if (conversions < 0 || visitors < 0) {
  setError('Conversions and visitors must be positive numbers');
  return;
}
```

This allows zero values to pass validation, causing division-by-zero errors in the backend.

## Need More Details?

- See `QUICK-CHECKLIST.md` for a complete checklist
- See `STEP-BY-STEP-GUIDE.md` for detailed instructions
- See `README.md` for project overview

## Expected Output

When everything works correctly:

1. **Sentry Dashboard** will show "Cannot calculate conversion rate: visitor count is zero" errors
2. **Distributed Tracing** will show frontend → backend connection
3. **AI Code Review** will reference these historical errors in the PR comment
4. You'll have all three screenshots ready to replace the old ones

Good luck! 🚀
