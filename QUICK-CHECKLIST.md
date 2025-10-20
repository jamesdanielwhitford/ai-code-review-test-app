# Quick Reference Checklist

Use this checklist to ensure you don't miss any critical steps.

## ☑️ Phase 1: Sentry Setup
- [ ] Created frontend Sentry project (React)
- [ ] Created backend Sentry project (Express)
- [ ] Saved both DSNs
- [ ] Enabled distributed tracing in BOTH projects
- [ ] Enabled "Show Generative AI Features" in org settings
- [ ] Enabled "Enable AI code review" in org settings
- [ ] Installed Sentry GitHub app
- [ ] Installed Seer by Sentry GitHub app

## ☑️ Phase 2: Local Setup
- [ ] Ran `npm install` in frontend directory
- [ ] Created `frontend/.env.local` with correct DSN
- [ ] Ran `npm install` in backend directory
- [ ] Created `backend/.env` with correct DSN
- [ ] Started frontend server (http://localhost:3000)
- [ ] Started backend server (http://localhost:5000)

## ☑️ Phase 3: Generate Historical Errors ⚠️ CRITICAL
- [ ] Triggered bug with visitors=0 at least 3-4 times
- [ ] Verified error appears in Sentry backend dashboard
- [ ] Clicked into error and saw details
- [ ] Verified distributed tracing shows frontend → backend connection
- [ ] **WAITED 5-10 minutes** for Sentry to index the errors

## ☑️ Phase 4: GitHub Repository
- [ ] Created new GitHub repository
- [ ] Initialized git in project directory
- [ ] Created .gitignore
- [ ] Committed initial code
- [ ] Pushed to main branch

## ☑️ Phase 5: Create PR with Bug
- [ ] Created new branch: `add-analytics-request`
- [ ] Verified buggy validation code is present (line 14-17 in useConversionRate.js)
- [ ] Made small changes to make PR look realistic
- [ ] Created 4-5 commits
- [ ] Pushed branch to GitHub

## ☑️ Phase 6: Trigger AI Review
- [ ] Created pull request on GitHub
- [ ] Marked PR as "Ready for review"
- [ ] Waited 1-3 minutes for AI review
- [ ] Verified seer-by-sentry bot commented on PR

## ☑️ Phase 7: Capture Screenshots

### Screenshot 1: comment-sentry-context.png
- [ ] Found seer-by-sentry comment on PR
- [ ] Comment mentions the validation bug
- [ ] Comment has blue links to Sentry issues
- [ ] Captured screenshot showing code diff + bot comment + Sentry links

### Screenshot 2: sentry-issue-visitor-count-zero.png
- [ ] Clicked Sentry issue link from PR comment
- [ ] Sentry issue page loaded
- [ ] Can see error details on left
- [ ] Can see Seer panel on right (if available)
- [ ] Captured full-width screenshot

### Screenshot 3: sentry-distributed-tracing.png
- [ ] Clicked Trace ID link from Sentry issue
- [ ] Waterfall graph loaded showing frontend → backend
- [ ] Clicked on ui.interaction.click span
- [ ] Right panel shows span details
- [ ] Captured full-width screenshot with both panels

## ☑️ Phase 8: Replace Screenshots
- [ ] Copied new screenshots to `/Users/jameswhitford/CODE/ritza/sentry/images/`
- [ ] Verified filenames match exactly
- [ ] Updated CLAUDE.md to mark screenshots as completed

---

## Critical Success Factors

### ✅ Must Do BEFORE Creating PR:
1. Trigger the bug 3-4 times to create historical errors
2. Wait at least 5-10 minutes for Sentry to index
3. Verify errors appear in Sentry dashboard

### ✅ For Distributed Tracing to Work:
1. Enable "Distributed Tracing" in BOTH Sentry projects
2. Use same `environment: "production"` in both frontend and backend
3. Frontend must have `tracePropagationTargets` configured (already done)
4. Backend must have Sentry middleware (already done)

### ✅ For AI Review to Reference Sentry Issues:
1. Historical errors must exist BEFORE creating PR
2. Both Sentry projects must be in same organization
3. Sentry GitHub apps must be installed
4. AI code review must be enabled in org settings
5. May need to wait 10-15 minutes after triggering errors

---

## Quick Troubleshooting

**AI review doesn't mention Sentry errors?**
→ Did you trigger the bug BEFORE creating the PR?
→ Did you wait 5-10 minutes after triggering errors?
→ Are both Sentry projects in the same organization?

**No distributed tracing?**
→ Is "Distributed Tracing" enabled in BOTH projects?
→ Check browser Network tab for `sentry-trace` header

**Seer panel not showing?**
→ Seer requires paid plan (14-day free trial available)
→ You can crop screenshot without Seer panel if needed

---

## Time Estimates

- Phase 1: 15 min
- Phase 2: 10 min
- Phase 3: 20 min (includes wait time)
- Phase 4: 10 min
- Phase 5: 15 min
- Phase 6: 10 min (includes wait time)
- Phase 7: 30 min
- Phase 8: 5 min

**Total: ~2 hours**
