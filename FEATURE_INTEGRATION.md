# Feature Integration Guide

Complete setup instructions for integrating Supabase backend with your interactive learning platform.

---

## 📋 Overview

You now have 5 new JavaScript modules that work together:

| Module                 | Purpose                                | Key Functions                                                                   |
| ---------------------- | -------------------------------------- | ------------------------------------------------------------------------------- |
| **supabase-client.js** | Initialize Supabase, manage auth state | `getSupabaseClient()`, `getCurrentUser()`, `isUserAdmin()`                      |
| **auth.js**            | User authentication & profiles         | `signUp()`, `logIn()`, `logOut()`, `updateUserProfile()`                        |
| **submissions.js**     | Challenge submission workflow          | `submitChallenge()`, `getUserCompletedChallenges()`, `updateSubmissionStatus()` |
| **ai-checker.js**      | Groq AI automated code review          | `triggerAIReview()`, `batchReviewSubmissions()`                                 |
| **admin-panel.js**     | Admin submission review interface      | `loadAdminDashboard()`, `approveSubmission()`, `rejectSubmission()`             |
| **ui-components.js**   | User-facing UI forms & modals          | `createAuthModal()`, `createUploadForm()`, `updateUserProfileMenu()`            |

---

## 🔧 Integration Steps

### Step 1: Update HTML Head Section

Add these script tags to your `index.html` in the `<head>` section (in this order):

```html
<!-- Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Highlight.js for syntax highlighting (optional but recommended) -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

<!-- Your modules (in order) -->
<script src="js/supabase-client.js"></script>
<script src="js/auth.js"></script>
<script src="js/submissions.js"></script>
<script src="js/ai-checker.js"></script>
<script src="js/admin-panel.js"></script>
<script src="js/ui-components.js"></script>
```

### Step 2: Create `.env` File

Create a `.env` file in your project root with your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
GROQ_API_KEY=your-groq-api-key-here
```

**How to get these:**

- Supabase: Visit https://app.supabase.com → your project → Settings → API keys
- Groq: Visit https://console.groq.com → API Keys section

### Step 3: Update `js/supabase-client.js`

Add this at the top to load environment variables:

```javascript
// Load environment variables
const SUPABASE_CONFIG = {
  SUPABASE_URL:
    new URL(window.location.href).searchParams.get("supabase_url") ||
    localStorage.getItem("supabase_url"),
  SUPABASE_KEY:
    new URL(window.location.href).searchParams.get("supabase_key") ||
    localStorage.getItem("supabase_key"),
  GROQ_API_KEY:
    new URL(window.location.href).searchParams.get("groq_key") ||
    localStorage.getItem("groq_key"),
};
```

**For local development with `.env`:** Use a build tool or manually inject these values.

---

## 🎯 Integration with Challenge Cards

### Step 3a: Modify Challenge HTML Structure

Add `data-attributes` to your challenge cards for tracking:

```html
<!-- BEFORE -->
<div class="challenge">
  <h4>Challenge 1: Simple Loop</h4>
  ...
</div>

<!-- AFTER -->
<div class="challenge" data-topic-id="loop-structures" data-challenge-id="1">
  <h4>Challenge 1: Simple Loop</h4>
  ...

  <!-- Add upload form here -->
  <div id="uploadForm_loop-structures_1"></div>

  <!-- Add completion indicator here -->
  <div id="completionIndicator_loop-structures_1"></div>
</div>
```

### Step 3b: Add Upload Form to Challenge Display

When showing each challenge, inject the upload form:

```javascript
function displayChallenge(topicId, challengeId) {
  // ... your existing challenge display code ...

  // Add upload form if user is logged in
  const user = getCurrentUser();
  if (user) {
    const formContainer = document.getElementById(
      `uploadForm_${topicId}_${challengeId}`,
    );
    if (formContainer) {
      const uploadForm = createUploadForm(topicId, challengeId);
      formContainer.appendChild(uploadForm);

      // Update completion status
      updateChallengeUI(topicId, challengeId);
    }
  }
}
```

### Step 3c: Add Completion Badge to Solution Buttons

Near your "Show Solution" buttons, add:

```html
<div class="solution-header">
  <button onclick="toggleSolution(this)">Show Solution</button>
  <span id="completionBadge_1" class="completion-badge"></span>
</div>
```

Then update it in JavaScript:

```javascript
async function toggleSolution(button) {
  // ... your existing toggle code ...

  // Update completion badge
  const challengeId = button.getAttribute("data-challenge-id");
  const completed = await userCompletedChallenge(challengeId);
  const badge = document.getElementById(`completionBadge_${challengeId}`);
  if (badge && completed) {
    badge.textContent = "✅ You completed this!";
    badge.className = "completion-badge completed";
  }
}
```

---

## 🔐 Authentication Flow

### Auto-Login Detection

The `supabase-client.js` automatically detects user login state. Add this to your main page to show/hide auth UI:

```javascript
document.addEventListener("DOMContentLoaded", async () => {
  const user = getCurrentUser();

  if (!user) {
    // Show login prompt
    createAuthModal();
  } else {
    // Show user profile
    await updateUserProfileMenu();

    // Load completed challenges
    const completed = await getUserCompletedChallenges(user.id);
    console.log("Completed challenges:", completed);
  }
});
```

### Logout Handler

When user clicks logout, everything is cleaned up automatically via `auth.js`.

---

## 📤 Submission Workflow

### Complete Flow Diagram

```
User Selects Challenge
    ↓
User Uploads File (.java, .cpp, .py)
    ↓
submitChallenge() in submissions.js
    ↓
File uploaded to Supabase Storage
    ↓
Database record created with status="pending"
    ↓
triggerAIReview() called
    ↓
Groq API reviews code
    ↓
Status updated to "admin_pending" with AI feedback
    ↓
Admin notified (in admin-panel.js)
    ↓
Admin approves or rejects
    ↓
If approved: markChallengeCompleted() called
    ↓
User sees ✅ completion badge
```

---

## 👨‍💼 Admin Features

### Enable Admin Panel

For your user account to be admin:

1. Log in to Supabase dashboard
2. Go to `profiles` table
3. Update your row: set `is_admin = true`

### Display Admin Panel

Add a button/link that calls:

```javascript
// Somewhere in your UI (e.g., top bar)
<button onclick="loadAdminDashboard()" class="admin-btn">
  📋 Admin Panel
</button>

// In admin panel, you can:
// - View all pending submissions
// - See AI feedback for each
// - Approve/Reject submissions
// - Add admin feedback/comments
```

---

## 📊 User Dashboard

### Display User Stats

Add this to your main dashboard section:

```javascript
async function loadUserDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  const stats = await getUserStats(user.id);
  const completed = await getUserCompletedChallenges(user.id);

  // Display stats
  document.getElementById("userStats").innerHTML = `
        <div class="dashboard-stats">
            <h3>Your Progress</h3>
            <p>✅ Completed: ${stats.completed} challenges</p>
            <p>⏳ Pending Review: ${stats.pending} submissions</p>
            <p>✔️ Approved: ${stats.approved} submissions</p>
            <p>❌ Rejected: ${stats.rejected} submissions</p>
        </div>
    `;

  // Display completed challenges feed
  const feed = completed
    .map(
      (c) => `
        <div class="completion-item">
            <span>✅ Challenge ${c.challenge_id}</span>
            <span class="date">${new Date(c.completed_at).toLocaleDateString()}</span>
        </div>
    `,
    )
    .join("");

  document.getElementById("completionFeed").innerHTML = feed;
}
```

---

## 🧪 Testing Checklist

### Local Testing

- [ ] Create Supabase project and add credentials
- [ ] Run `testGroqConnection()` in browser console
- [ ] Test signup/login with new account
- [ ] Upload a sample challenge file
- [ ] Check Supabase Storage for uploaded file
- [ ] Verify submission appears in Supabase `submissions` table
- [ ] Verify AI review completes and feedback is saved
- [ ] Check admin panel displays submission
- [ ] Test approve/reject functions
- [ ] Verify completion badge appears on approved challenge

### Test Commands in Browser Console

```javascript
// Test Supabase
console.log(getSupabaseClient());

// Test auth
await testGroqConnection();

// Get current user
console.log(getCurrentUser());

// Get user stats
console.log(await getUserStats(getCurrentUser().id));

// Get completed challenges
console.log(await getUserCompletedChallenges(getCurrentUser().id));

// Load admin dashboard
loadAdminDashboard();
```

---

## 🚀 Deployment

### Before Going Live

1. **Environment Variables**: Set `SUPABASE_URL`, `SUPABASE_KEY`, `GROQ_API_KEY` in production
2. **RLS Policies**: Verify all RLS policies in Supabase are enabled
3. **Storage Permissions**: Check storage bucket has correct permissions
4. **Email Verification**: Enable email verification in Supabase Auth settings
5. **API Rate Limits**: Configure Groq API rate limits appropriately

### Hosting

Store your production secrets securely:

- **Vercel**: Set in Environment Variables section
- **Netlify**: Set in Build & Deploy → Environment
- **GitHub Pages**: Use GitHub Secrets (requires build step)

---

## 📚 File Reference

| File                   | Created | Purpose                   |
| ---------------------- | ------- | ------------------------- |
| SUPABASE_SETUP.md      | ✅      | Database schema and setup |
| js/supabase-client.js  | ✅      | Supabase initialization   |
| js/auth.js             | ✅      | Authentication functions  |
| js/submissions.js      | ✅      | Submission management     |
| js/ai-checker.js       | ✅      | Groq AI integration       |
| js/admin-panel.js      | ✅      | Admin review interface    |
| js/ui-components.js    | ✅      | User UI forms/modals      |
| FEATURE_INTEGRATION.md | ✅      | This file                 |

---

## 🛠️ Troubleshooting

### "Supabase client is undefined"

- Check that supabase-client.js is loaded FIRST
- Verify Supabase credentials are correct
- Check browser console for CORS errors

### "AI review not working"

- Verify Groq API key is set
- Run `testGroqConnection()` in console
- Check rate limits on Groq account

### "File upload fails"

- Verify Storage bucket exists in Supabase
- Check file size (max 10MB)
- Verify file type is in whitelist (.java, .cpp, .py, .c, .txt)

### "Admin panel not showing"

- Verify user's `is_admin` flag is true in profiles table
- Check browser console for errors
- Refresh page after setting admin flag

---

## 📞 Support

For issues:

1. Check browser console (F12 → Console tab)
2. Check Supabase logs in dashboard
3. Verify all script tags are in correct order
4. Test individual functions in console

---

## ✅ Next Steps

After integration:

1. Test all features locally
2. Deploy to production
3. Create admin account
4. Invite first users to test
5. Monitor Supabase logs for errors
6. Iterate based on user feedback

---

**Version**: 1.0
**Last Updated**: $(date)
**Status**: Ready for integration
