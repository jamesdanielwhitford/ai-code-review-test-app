# Screenshot Replication Project

This project helps you replicate the three remaining screenshots for the Sentry AI Code Review article:

1. **comment-sentry-context.png** - AI review comment referencing historical Sentry issues
2. **sentry-issue-visitor-count-zero.png** - Sentry dashboard showing division-by-zero error
3. **sentry-distributed-tracing.png** - Distributed tracing waterfall showing frontend → backend error

## Project Structure

```
screenshot-replication-project/
├── frontend/          # React app with conversion rate calculator
├── backend/           # Express API with division-by-zero bug
└── README.md          # This file
```

## Prerequisites

- Node.js 18+ and npm
- GitHub account with admin access to a repository
- Sentry account (free tier works)
- Sentry GitHub app and Seer by Sentry app installed

## Setup Instructions

### Step 1: Sentry Project Setup

1. Create a new Sentry project at https://sentry.io
   - Choose "React" as the platform for the frontend project
   - Note your DSN (Data Source Name)

2. Create a second Sentry project for the backend
   - Choose "Express" as the platform
   - Note your DSN

3. Enable distributed tracing in both projects:
   - Go to Settings → Projects → [Your Project] → Performance
   - Enable "Distributed Tracing"

### Step 2: Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Sentry DSN:
   ```
   REACT_APP_SENTRY_DSN=your_frontend_sentry_dsn_here
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

   The app will run at http://localhost:3000

### Step 3: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Sentry DSN:
   ```
   SENTRY_DSN=your_backend_sentry_dsn_here
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

   The API will run at http://localhost:5000

### Step 4: Create GitHub Repository and Initial Commit

1. Create a new GitHub repository (e.g., `sentry-ai-code-review-demo`)

2. Initialize git and push the initial code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Analytics app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 5: Trigger the Bug to Create Sentry Issues

**IMPORTANT:** You need to trigger the bug FIRST to create historical Sentry issues that the AI code review can reference.

1. Open the frontend app at http://localhost:3000

2. Fill out the conversion rate calculator form:
   - Visitors: 0 (or clear the field so it becomes 0)
   - Conversions: 5
   - Click "Calculate Rate"

3. You should see an error in the browser console and the form should show an error

4. Repeat this 2-3 times to create multiple error instances

5. Wait 2-3 minutes for Sentry to process the errors

6. Go to your Sentry dashboard and verify:
   - You see an error: "Cannot calculate conversion rate: visitor count is zero"
   - The issue shows distributed tracing with frontend → backend spans
   - Click into the issue to see the distributed tracing waterfall

### Step 6: Create the PR Branch with the Bug

Now we'll create a PR that adds the ConversionForm component with the validation bug:

1. Create a new branch:
   ```bash
   git checkout -b add-analytics-request
   ```

2. The ConversionForm component is already in the code with the bug (validation checks `< 0` instead of `<= 0`)

3. Create 4-5 small commits to make it look realistic:
   ```bash
   # Commit 1: Add basic form structure
   git add frontend/src/components/ConversionForm.jsx
   git commit -m "Add ConversionForm component structure"

   # Commit 2: Add form styling
   git commit --allow-empty -m "Add styling to ConversionForm"

   # Commit 3: Add validation logic (with the bug)
   git commit --allow-empty -m "Add validation logic"

   # Commit 4: Integrate with backend
   git commit --allow-empty -m "Connect form to backend API"

   # Commit 5: Add to dashboard
   git add frontend/src/pages/DashboardPage.jsx
   git commit -m "Add ConversionForm to dashboard"
   ```

4. Push the branch:
   ```bash
   git push origin add-analytics-request
   ```

### Step 7: Create Pull Request and Trigger AI Review

1. Go to GitHub and create a pull request from `add-analytics-request` to `main`
   - Title: "Add analytics request"
   - Description: "Adding conversion rate calculator to analytics dashboard"

2. Mark the PR as "Ready for review" or comment `@sentry review`

3. Wait 1-2 minutes for Sentry AI Code Review to analyze the PR

4. The AI should leave a comment identifying:
   - The validation bug (checking `< 0` instead of `<= 0`)
   - References to the historical Sentry issues you created earlier
   - Links to the Sentry dashboard showing "visitor count is zero" errors

### Step 8: Capture Screenshots

Now you can capture the three remaining screenshots:

#### Screenshot 1: comment-sentry-context.png (line 95)

1. In the GitHub PR, find the Sentry AI Code Review comment
2. The comment should mention:
   - "Potential bug: Clearing number inputs sets their value to 0"
   - Description of the validation bug
   - Links to Sentry issues: "visitor count is zero" and "cannot calculate the rate"
3. Take a screenshot of this entire comment
4. Save as `comment-sentry-context.png`

#### Screenshot 2: sentry-issue-visitor-count-zero.png (line 101)

1. Click one of the Sentry issue links in the AI review comment
2. This opens the Sentry issue dashboard
3. Make sure the Seer panel on the right is visible showing "Initial Guess"
4. The issue should show:
   - Title: "Error"
   - Message: "Cannot calculate conversion rate: visitor count is zero"
   - Browser: Chrome Mobile
   - Environment: production
   - Seer panel with "Find Root Cause" button
5. Take a full-width screenshot showing both the issue details and Seer panel
6. Save as `sentry-issue-visitor-count-zero.png`

#### Screenshot 3: sentry-distributed-tracing.png (line 107)

1. In the same Sentry issue, scroll down to find the "Trace" section or click the trace ID link
2. This opens the distributed tracing waterfall view
3. The waterfall should show:
   - Top level: pageload (FCP badge showing timing)
   - Second level: ui.interaction.click - form submission (88ms)
   - Third level: http.server - POST /api/calculate-conversion (with error icon)
   - Nested levels showing middleware and request handler calls
   - Error at bottom: "Cannot calculate conversion rate: visitor count is zero" (red error icon)
4. Click on the `ui.interaction.click` span on the right side to open the detail panel
5. Take a screenshot showing the full waterfall on the left and span details on the right
6. Save as `sentry-distributed-tracing.png`

## Troubleshooting

### AI Code Review doesn't reference Sentry issues

- Make sure you triggered the bug BEFORE creating the PR
- Verify the Sentry issues are visible in your dashboard
- Check that distributed tracing is enabled in both Sentry projects
- Wait a few hours for Sentry to index the issues, then close and reopen the PR

### Distributed tracing doesn't show frontend → backend connection

- Verify both frontend and backend have Sentry configured with the same `environment` tag
- Check that the `tracePropagationTargets` in frontend includes your backend URL
- Make sure the backend is receiving the `sentry-trace` header (check network tab)

### Seer panel doesn't appear

- Seer requires a paid Sentry plan (but has a 14-day free trial)
- If you don't have Seer, you can still capture the issue screenshot without the panel

## Next Steps

Once you have the three screenshots:

1. Replace the old screenshots in `/images/` directory
2. Verify the draft.md text matches the new screenshots
3. Update CLAUDE.md to mark screenshots as completed

## Technical Details

### The Bug

The validation bug is in `frontend/src/hooks/useConversionRate.js`:

```javascript
// BUGGY CODE - checks less than zero, but should check less than OR EQUAL TO zero
if (conversions < 0 || visitors < 0) {
  // validation passes for zero values
}
```

When a user clears a number input, it becomes `0`, which passes the `< 0` validation but causes a division-by-zero error in the backend.

### How Distributed Tracing Works

1. Frontend captures user interaction (form submit) as a span
2. Frontend sends HTTP request with `sentry-trace` header
3. Backend receives header and continues the trace
4. Backend error is linked to frontend interaction via trace ID
5. Sentry displays the full trace as a waterfall graph

This is why Sentry AI Code Review can connect the frontend validation bug to the backend division-by-zero error.
