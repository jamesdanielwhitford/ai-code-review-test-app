# Testing Guide - How to Trigger the Bug

This guide shows you how to test the application locally and trigger the division-by-zero bug.

## Prerequisites

Make sure you have:
- ✅ Node.js 18+ installed
- ✅ Created `.env.local` in frontend folder with your Sentry DSN
- ✅ Created `.env` in backend folder with your Sentry DSN

## Step 1: Start the Backend Server

Open a terminal window:

```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project/backend

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

You should see:
```
Server is running on port 5000
Sentry is enabled
```

**Keep this terminal open!** The backend needs to stay running.

## Step 2: Start the Frontend App

Open a **NEW** terminal window (keep backend running):

```bash
cd /Users/jameswhitford/CODE/ritza/sentry/code/screenshot-replication-project/frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

You should see:
```
Compiled successfully!

You can now view analytics-dashboard-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Your browser should automatically open to http://localhost:3000

## Step 3: Test the App (Without Bug)

First, verify everything works correctly:

1. You should see: **Analytics Dashboard** with a form
2. Enter:
   - Conversions: `50`
   - Visitors: `100`
3. Click **Calculate Rate**
4. You should see: **Conversion Rate: 50.00%** (green success message)

✅ If this works, your setup is correct!

## Step 4: Trigger the Bug

Now let's trigger the division-by-zero bug:

### Method 1: Enter Zero

1. Refresh the page (to clear the form)
2. Enter:
   - Conversions: `5`
   - Visitors: `0`
3. Click **Calculate Rate**

**What should happen:**
- ❌ Red error message appears: "Cannot calculate conversion rate: visitor count is zero..."
- 🔍 Check backend terminal - you'll see the error logged
- 📊 Error is sent to Sentry

### Method 2: Clear the Field

1. Refresh the page
2. Click in the "Visitors" field
3. Type a number, then delete it (field becomes empty/0)
4. Enter Conversions: `10`
5. Click **Calculate Rate**

**Same result** - the bug is triggered!

### Method 3: Use Browser DevTools

1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to "Network" tab
3. Enter Visitors: `0`, Conversions: `5`
4. Click **Calculate Rate**
5. In Network tab, find the `calculate-conversion` request
6. Click it to see:
   - Request payload: `{"conversions": 5, "visitors": 0}`
   - Response status: **400 Bad Request**
   - Response body: `{"error": "Cannot calculate conversion rate..."}`

## Step 5: Verify Errors in Sentry

### Frontend Sentry Project

The frontend doesn't actually throw an error (it just displays the error message from backend), so you might not see frontend errors. That's normal!

### Backend Sentry Project ⭐ IMPORTANT

1. Go to https://sentry.io
2. Navigate to your **backend project** (`analytics-dashboard-backend`)
3. Click **Issues** in the left sidebar
4. You should see:
   - **Title**: Error
   - **Message**: "Cannot calculate conversion rate: visitor count is zero..."
   - **Count**: Number of times you triggered it

5. Click into the issue to see:
   - Stack trace showing `server.js:46`
   - Tags: `endpoint: calculate-conversion`, `error_type: division_by_zero`
   - Extra context: conversions and visitors values
   - **Trace ID** (this is for distributed tracing!)

### Check Distributed Tracing

1. In the issue details, look for "Trace" section
2. Click the **Trace ID** (blue link)
3. You should see a waterfall graph showing:
   - Frontend: `ui.interaction.click` or similar
   - Backend: `http.server` → POST /api/calculate-conversion
   - Error at the bottom

**If you DON'T see distributed tracing:**
- Make sure "Distributed Tracing" is enabled in both Sentry projects
- Check that frontend is sending the `sentry-trace` header (Network tab → Headers)
- Both projects must be in the same Sentry organization

## Step 6: Trigger Multiple Times (For Historical Data)

To create good historical data for AI Code Review:

**Trigger the bug 3-4 times with different values:**

1. Visitors: `0`, Conversions: `5` → Calculate
2. Visitors: `0`, Conversions: `10` → Calculate
3. Visitors: `0`, Conversions: `3` → Calculate
4. Visitors: `0`, Conversions: `15` → Calculate

**Why?** This creates multiple error instances that Sentry can aggregate. The AI Code Review will see this pattern and reference it in the PR review.

## Step 7: Wait for Sentry to Index

⏰ **IMPORTANT**: Wait **5-10 minutes** after triggering errors before creating the PR.

This gives Sentry time to:
- Process the errors
- Build the error aggregation
- Index for semantic search
- Make them available for AI Code Review

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts and opens in browser
- [ ] Form works with valid input (shows conversion rate)
- [ ] Bug triggers with visitors = 0 (shows error message)
- [ ] Backend terminal shows error log
- [ ] Error appears in Sentry backend project
- [ ] Distributed tracing shows frontend → backend connection
- [ ] Triggered bug 3-4 times with different values
- [ ] Waited 5-10 minutes for Sentry to index

## Troubleshooting

### Backend won't start

**Error**: "Cannot find module '@sentry/node'"
```bash
cd backend
npm install
```

### Frontend won't start

**Error**: "Cannot find module 'react'"
```bash
cd frontend
npm install
```

### "Sentry is disabled" message

Backend shows: "Sentry is disabled"
- Check that `backend/.env` exists
- Check that `SENTRY_DSN` is set correctly
- DSN should start with: `https://`

### No errors in Sentry

- Check that your Sentry DSN is correct
- Check that Sentry projects are active
- Look in the correct project (backend, not frontend)
- Try triggering the error again
- Wait 1-2 minutes for Sentry to process

### Can't see distributed tracing

- Enable "Distributed Tracing" in both projects:
  - Settings → Projects → [Project] → Performance → Distributed Tracing
- Check browser Network tab for `sentry-trace` header
- Both projects must be in same Sentry organization
- Make sure `environment: "production"` is set in both

### Port already in use

**Error**: "Port 3000 already in use" or "Port 5000 already in use"

```bash
# Find process using the port
lsof -ti:3000  # or :5000

# Kill it
kill -9 $(lsof -ti:3000)
```

Or change the port:
```bash
# Backend: Edit backend/.env
PORT=5001

# Frontend: Set environment variable
PORT=3001 npm start
```

## What's Next?

Once you've:
✅ Triggered the bug multiple times
✅ Verified errors in Sentry
✅ Confirmed distributed tracing works
✅ Waited 5-10 minutes

You're ready to:
1. Push code to GitHub
2. Create the PR branch
3. Open Pull Request
4. Get Sentry AI Code Review
5. Capture screenshots

See `START-HERE.md` for the complete workflow!

## Quick Commands Reference

```bash
# Start backend
cd backend && npm start

# Start frontend (new terminal)
cd frontend && npm start

# Stop backend: Ctrl+C in backend terminal
# Stop frontend: Ctrl+C in frontend terminal

# Test backend health endpoint
curl http://localhost:5000/health

# Test backend API manually
curl -X POST http://localhost:5000/api/calculate-conversion \
  -H "Content-Type: application/json" \
  -d '{"conversions": 5, "visitors": 0}'
```
