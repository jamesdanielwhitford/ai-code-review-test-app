# Step-by-Step Screenshot Replication Guide

This guide walks you through the **exact order** of steps to replicate the three remaining screenshots. It's critical to follow this sequence because the AI Code Review needs historical Sentry errors to reference.

## Overview of the Process

```
1. Set up Sentry projects
2. Deploy/run the app locally
3. Trigger the bug multiple times (creates historical errors in Sentry)
4. Wait for Sentry to process the errors
5. Verify errors appear in Sentry dashboard
6. Create GitHub PR with the buggy code
7. Trigger AI Code Review
8. Capture screenshots
```

---

## Phase 1: Sentry Setup (15 minutes)

### Step 1.1: Create Sentry Projects

1. Go to https://sentry.io and log in (or create free account)

2. Create **Frontend Project**:
   - Click "Create Project"
   - Platform: **React**
   - Alert frequency: Default
   - Project name: `analytics-dashboard-frontend`
   - Click "Create Project"
   - **IMPORTANT**: Copy the DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)
   - Save it somewhere - you'll need it soon

3. Create **Backend Project**:
   - Click "Projects" → "Create Project"
   - Platform: **Express**
   - Project name: `analytics-dashboard-backend`
   - Click "Create Project"
   - **IMPORTANT**: Copy this DSN too
   - Save it with the frontend DSN

### Step 1.2: Enable Distributed Tracing

For **both projects** (frontend and backend):

1. Go to Settings → Projects → [Your Project] → Performance
2. Find "Distributed Tracing" section
3. Toggle it **ON**
4. Click "Save"

### Step 1.3: Enable Sentry Generative AI Features

1. Go to Settings → Organization Settings
2. Find "Generative AI Features" section
3. Enable:
   - ✅ Show Generative AI Features
   - ✅ Enable AI code review
4. Click "Save"

### Step 1.4: Install GitHub Apps

1. Install **Sentry GitHub App**:
   - Go to https://github.com/marketplace/sentry
   - Click "Set up a plan" → Choose Free
   - Select your GitHub organization
   - Grant access to repositories (choose "All repositories" or select specific repo)
   - Complete installation

2. Install **Seer by Sentry GitHub App**:
   - Go to https://github.com/apps/seer-by-sentry
   - Click "Install"
   - Select your GitHub organization
   - Grant access to repositories
   - Complete installation

---

## Phase 2: Local Setup (10 minutes)

### Step 2.1: Navigate to Project

```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project
```

### Step 2.2: Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file with YOUR Sentry DSN
cat > .env.local << EOF
REACT_APP_SENTRY_DSN=your_frontend_sentry_dsn_here
REACT_APP_BACKEND_URL=http://localhost:5000
EOF

# Edit .env.local and replace 'your_frontend_sentry_dsn_here' with your actual DSN
# Use nano, vim, or VS Code to edit the file
```

### Step 2.3: Set Up Backend

```bash
cd ../backend

# Install dependencies
npm install

# Create .env file with YOUR Sentry DSN
cat > .env << EOF
SENTRY_DSN=your_backend_sentry_dsn_here
PORT=5000
EOF

# Edit .env and replace 'your_backend_sentry_dsn_here' with your actual DSN
```

### Step 2.4: Start Both Servers

Open **two terminal windows/tabs**:

**Terminal 1 - Frontend:**
```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project/frontend
npm start
```

Wait for "Compiled successfully!" message. App runs at http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project/backend
npm start
```

Should see: "Server is running on port 5000" and "Sentry is enabled"

---

## Phase 3: Generate Historical Errors (CRITICAL STEP - 20 minutes)

**WHY THIS MATTERS**: The AI Code Review screenshot shows it referencing previous Sentry errors. You need to create those errors FIRST, before making the PR.

### Step 3.1: Trigger the Bug Multiple Times

1. Open http://localhost:3000 in your browser

2. Fill out the form with **zero visitors** (this triggers the bug):
   - Visitors: `0`
   - Conversions: `5`
   - Click "Calculate Rate"

3. You should see an error message in red

4. **Repeat this 3-4 more times** with different values:
   - Visitors: `0`, Conversions: `10`
   - Visitors: `0`, Conversions: `3`
   - Visitors: `0`, Conversions: `7`

5. Also try clearing the visitors field (makes it 0) and submitting

### Step 3.2: Verify Errors in Sentry (IMPORTANT)

1. Go to https://sentry.io

2. Navigate to your **backend project**: `analytics-dashboard-backend`

3. Click "Issues" in the left sidebar

4. You should see an error: **"Cannot calculate conversion rate: visitor count is zero"**
   - If you don't see it, wait 2-3 minutes and refresh
   - Check that your backend .env has the correct Sentry DSN
   - Check the backend terminal for any errors

5. Click into the error to see details:
   - Should show the error message
   - Should show stack trace
   - Should show "Trace ID" (this is the distributed trace)

### Step 3.3: Check Distributed Tracing

1. In the error details, find the "Trace" section or click the Trace ID link

2. You should see a waterfall graph showing:
   - Frontend: `pageload` or `ui.interaction.click`
   - Backend: `http.server` → POST /api/calculate-conversion
   - Error at the end showing division by zero

3. If you don't see distributed tracing:
   - Check that both projects have "Distributed Tracing" enabled (Phase 1, Step 1.2)
   - Check that frontend's `tracePropagationTargets` includes "localhost" (it should by default)
   - Make sure both projects are in the same Sentry organization

### Step 3.4: Wait for Sentry to Index

**IMPORTANT**: Wait at least **5-10 minutes** after triggering errors before creating the PR. This gives Sentry time to:
- Process the errors
- Index them for semantic search
- Make them available for AI Code Review to reference

Go get coffee, check Reddit, whatever. Just wait.

---

## Phase 4: Create GitHub Repository (10 minutes)

### Step 4.1: Create GitHub Repo

1. Go to https://github.com/new

2. Create a repository:
   - Name: `sentry-ai-code-review-demo` (or whatever you want)
   - Description: "Demo app for testing Sentry AI Code Review"
   - Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

### Step 4.2: Initialize Git and Push Initial Code

```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project

# Initialize git
git init

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
.env.local
.DS_Store
npm-debug.log*
yarn-debug.log*
build/
EOF

# Add all files
git add .

# Create initial commit (without the buggy component)
git commit -m "Initial commit: Analytics dashboard base structure"

# Add remote (replace with YOUR GitHub username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/sentry-ai-code-review-demo.git

# Push to main
git branch -M main
git push -u origin main
```

---

## Phase 5: Create PR with Buggy Code (15 minutes)

### Step 5.1: Create Feature Branch

```bash
# Create and checkout new branch
git checkout -b add-analytics-request
```

### Step 5.2: Verify the Buggy Code is Present

The bug is already in the code at `frontend/src/hooks/useConversionRate.js` line 14-17:

```javascript
// BUGGY VALIDATION: This checks < 0 instead of <= 0
if (conversions < 0 || visitors < 0) {
  setError('Conversions and visitors must be positive numbers');
  return;
}
```

This validation allows `0` to pass, but should reject it.

### Step 5.3: Make Some Minor Changes (to make PR look realistic)

Add a comment to the ConversionForm:

```bash
# Edit frontend/src/components/ConversionForm.jsx
# Add a comment at the top of the file
```

Or just use this command:

```bash
cat > frontend/src/components/ConversionForm.jsx << 'EOF'
import React, { useState } from 'react';
import useConversionRate from '../hooks/useConversionRate';
import './ConversionForm.css';

// Conversion rate calculator component for analytics dashboard
function ConversionForm() {
  const [conversions, setConversions] = useState('');
  const [visitors, setVisitors] = useState('');
  const { rate, error, isLoading, calculateRate } = useConversionRate();

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRate(Number(conversions), Number(visitors));
  };

  return (
    <form className="conversion-form" onSubmit={handleSubmit} aria-label="Conversion rate calculator form">
      <div className="form-group">
        <label htmlFor="conversions">
          Conversions
        </label>
        <input
          id="conversions"
          type="number"
          value={conversions}
          onChange={(e) => setConversions(Number(e.target.value))}
          placeholder="Enter number of conversions"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="visitors">
          Visitors
        </label>
        <input
          id="visitors"
          type="number"
          value={visitors}
          onChange={(e) => setVisitors(Number(e.target.value))}
          placeholder="Enter number of visitors"
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="submit-button"
      >
        {isLoading ? 'Calculating...' : 'Calculate Rate'}
      </button>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {rate !== null && !error && (
        <div className="result-message">
          Conversion Rate: {rate}%
        </div>
      )}
    </form>
  );
}

export default ConversionForm;
EOF
```

### Step 5.4: Create Multiple Commits (looks more realistic)

```bash
# Commit 1
git add frontend/src/components/ConversionForm.jsx
git commit -m "Add comment to ConversionForm component"

# Commit 2
git commit --allow-empty -m "Update form validation logic"

# Commit 3
git add frontend/src/hooks/useConversionRate.js
git commit -m "Add conversion rate calculation hook"

# Commit 4
git add frontend/src/pages/DashboardPage.jsx
git commit -m "Integrate ConversionForm into dashboard"

# Commit 5
git add backend/server.js
git commit -m "Add backend endpoint for conversion calculation"
```

### Step 5.5: Push Branch

```bash
git push origin add-analytics-request
```

---

## Phase 6: Create Pull Request and Trigger AI Review (10 minutes)

### Step 6.1: Create PR on GitHub

1. Go to your repository on GitHub

2. You should see a banner: "add-analytics-request had recent pushes"
   - Click "Compare & pull request"

3. If you don't see the banner:
   - Click "Pull requests" tab
   - Click "New pull request"
   - Base: `main`, Compare: `add-analytics-request`
   - Click "Create pull request"

4. Fill in PR details:
   - Title: **"Add analytics request"**
   - Description:
     ```
     Adding conversion rate calculator to analytics dashboard.

     Features:
     - New ConversionForm component
     - Backend API endpoint for calculations
     - Form validation
     - Error handling
     ```

5. **Important**: Change PR to **"Ready for review"**
   - If it's a draft, click "Ready for review" button
   - This triggers Sentry AI Code Review automatically

### Step 6.2: Wait for AI Review

1. Sentry AI Code Review will start automatically (should see a comment from `seer-by-sentry` bot)

2. Wait **1-3 minutes** for the review to complete

3. You should see the bot analyzing your code and adding comments

### Step 6.3: Alternative: Manually Trigger Review

If AI review doesn't start automatically:

1. Comment on the PR: `@sentry review`

2. Wait 1-3 minutes

---

## Phase 7: Capture Screenshots (30 minutes)

### Screenshot 1: comment-sentry-context.png

**Location**: GitHub PR comments section

**What to capture**:

1. Go to your PR on GitHub

2. Find the `seer-by-sentry` bot comment that mentions:
   - "Potential bug: Clearing number inputs sets their value to 0"
   - The validation bug description
   - **IMPORTANT**: Links to Sentry issues (blue hyperlinks like "visitor count is zero" and "cannot calculate the rate")

3. The comment should reference your historical Sentry errors from Phase 3

4. Take screenshot showing:
   - The entire bot comment
   - The code diff above it (showing the added lines with the validation)
   - The Sentry issue links

**Troubleshooting**:
- If AI review doesn't mention Sentry issues:
  - Make sure you triggered errors in Phase 3
  - Wait longer (try 30 minutes to 1 hour)
  - Close and reopen the PR to trigger a new review
  - Make sure both Sentry projects are in the same organization

### Screenshot 2: sentry-issue-visitor-count-zero.png

**Location**: Sentry dashboard

**What to capture**:

1. In the GitHub PR comment, click one of the Sentry issue links (blue hyperlinks)

2. This opens the Sentry issue in a new tab

3. Make sure you can see:
   - **Left side**: Issue details
     - Title: "Error"
     - Message: "Cannot calculate conversion rate: visitor count is zero..."
     - Events graph
     - Browser: Chrome Mobile 141.0.0
     - Environment: production
     - Tags showing 100% Chrome Mobile, production, Nexus 5
   - **Right side**: Seer panel (if you have access)
     - "Initial Guess" section
     - Text: "The frontend form submission sends zero or null for visitors..."
     - Purple "Find Root Cause" button
     - "Issue Tracking" section below

4. Take full-width screenshot

**Note**: If you don't have Seer access (paid feature), the right panel might look different. That's okay - the important part is the issue details on the left.

### Screenshot 3: sentry-distributed-tracing.png

**Location**: Sentry trace details page

**What to capture**:

1. From the Sentry issue page, find the Trace section
   - Look for "Trace: Trace ID" in the Highlights section
   - Click the Trace ID link (blue hex string)

2. This opens the distributed tracing waterfall view

3. You should see:
   - **Left side**: Waterfall timeline showing:
     - `pageload` (topmost span)
     - `ui.interaction.click` - form submission (88ms span)
     - `http.server` - POST /api/calculate-conversion
     - Nested middleware calls
     - Error span at bottom (red icon): "Cannot calculate conversion rate..."
   - **Right side**: Span details panel showing:
     - "ui.interaction.click" title
     - Duration: 88.00ms
     - Description: `form[aria-label="Conversion rate calculator form"] > button[type="submit"]`
     - Attributes section

4. Click on the `ui.interaction.click` span to make sure the right panel shows details

5. Take full-width screenshot showing both panels

**Troubleshooting**:
- If you don't see distributed tracing:
  - Make sure you enabled "Distributed Tracing" in both Sentry projects (Phase 1, Step 1.2)
  - Trigger the bug again from http://localhost:3000
  - Check that the `sentry-trace` header is being sent (use browser DevTools → Network tab)

---

## Phase 8: Replace Screenshots (5 minutes)

### Step 8.1: Move Screenshots

```bash
# Navigate to images directory
cd /Users/jameswhitford/CODE/ritza/sentry/images

# Backup old screenshots (optional)
mkdir -p old_screenshots
cp comment-sentry-context.png old_screenshots/
cp sentry-issue-visitor-count-zero.png old_screenshots/
cp sentry-distributed-tracing.png old_screenshots/

# Move your new screenshots here
# (Copy your screenshot files to this directory)
```

### Step 8.2: Verify Screenshot Names Match

Make sure your new screenshots have exactly these names:
- `comment-sentry-context.png`
- `sentry-issue-visitor-count-zero.png`
- `sentry-distributed-tracing.png`

### Step 8.3: Update CLAUDE.md

```bash
cd /Users/jameswhitford/CODE/ritza/sentry

# Edit CLAUDE.md and mark screenshots as completed
```

Update the "Remaining Screenshots" section to show all 3 as completed.

---

## Common Issues and Solutions

### Issue: AI Code Review doesn't reference Sentry errors

**Solutions**:
1. Make sure you triggered the bug BEFORE creating the PR (Phase 3)
2. Wait at least 10-15 minutes after triggering errors before creating PR
3. Verify errors appear in your Sentry dashboard
4. Check that both Sentry projects are in the same organization
5. Try closing and reopening the PR to trigger a new review
6. Make sure Sentry GitHub apps are installed correctly

### Issue: Distributed tracing doesn't connect frontend and backend

**Solutions**:
1. Verify "Distributed Tracing" is enabled in both Sentry projects
2. Check `frontend/src/index.js` has `tracePropagationTargets` configured
3. Check `backend/server.js` has Sentry middleware installed correctly
4. Use browser DevTools → Network tab → Check if `sentry-trace` header is being sent
5. Make sure both projects have `environment: "production"` set

### Issue: Seer panel doesn't show up

**Solutions**:
1. Seer requires a paid Sentry plan (but has 14-day free trial)
2. Start a trial at https://sentry.io/settings/billing/
3. If you don't want to pay, you can crop the screenshot to exclude the Seer panel

### Issue: Can't see Chrome Mobile in Sentry issue

**Solutions**:
1. Open http://localhost:3000 in Chrome DevTools mobile emulation
2. Press F12 → Click device toolbar icon (or Cmd+Shift+M on Mac)
3. Select "Nexus 5" or any mobile device
4. Trigger the bug again

---

## Expected Timeline

- Phase 1 (Sentry Setup): 15 minutes
- Phase 2 (Local Setup): 10 minutes
- Phase 3 (Generate Errors): 20 minutes (**includes 5-10 min wait time**)
- Phase 4 (GitHub Repo): 10 minutes
- Phase 5 (Create PR): 15 minutes
- Phase 6 (AI Review): 10 minutes (**includes 1-3 min wait time**)
- Phase 7 (Screenshots): 30 minutes
- Phase 8 (Replace): 5 minutes

**Total**: Approximately 2 hours

---

## Need Help?

If you get stuck:

1. Check the "Common Issues and Solutions" section above
2. Verify each phase was completed in order
3. Check Sentry documentation: https://docs.sentry.io
4. Check that all environment variables are set correctly
5. Look at browser console and backend terminal for error messages

Good luck! 🚀
