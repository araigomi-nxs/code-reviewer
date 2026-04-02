# Quick HTML Integration Example

Concrete examples of how to modify your existing `index.html` to use the new backend features.

---

## 📍 Script Tags (Add to HTML Head)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Coding Reviewer - Interactive Learning</title>
    <link rel="stylesheet" href="styles.css" />

    <!-- ===== ADD THESE NEW SCRIPTS ===== -->

    <!-- Supabase Library -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <!-- Syntax Highlighting (optional) -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
    />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

    <!-- Your Backend Modules (ORDER MATTERS!) -->
    <script src="js/supabase-client.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/submissions.js"></script>
    <script src="js/ai-checker.js"></script>
    <script src="js/admin-panel.js"></script>
    <script src="js/ui-components.js"></script>

    <!-- ===== END NEW SCRIPTS ===== -->
  </head>
  <body>
    <!-- Your existing HTML content -->
  </body>
</html>
```

---

## 📝 Challenge Card Structure

### Before (Current)

```html
<div class="challenge">
  <h4>Challenge 1: Print Numbers 1-10</h4>
  <p>Write a program that prints numbers from 1 to 10 using a for loop.</p>

  <button onclick="document.getElementById('solution1').style.display='block'">
    Show Solution
  </button>

  <div id="solution1" class="solution-box" style="display:none;">
    <pre><code>for(int i = 1; i <= 10; i++) {
    System.out.println(i);
}</code></pre>
  </div>
</div>
```

### After (With Backend Features)

```html
<div class="challenge" data-topic-id="loop-structures" data-challenge-id="1">
  <h4>Challenge 1: Print Numbers 1-10</h4>
  <p>Write a program that prints numbers from 1 to 10 using a for loop.</p>

  <!-- Progress Badge -->
  <div id="completionIndicator_loop-structures_1" class="status-badge"></div>

  <!-- Solution Button -->
  <button onclick="document.getElementById('solution1').style.display='block'">
    Show Solution
  </button>

  <!-- Solution Box -->
  <div id="solution1" class="solution-box" style="display:none;">
    <pre><code>for(int i = 1; i <= 10; i++) {
    System.out.println(i);
}</code></pre>
  </div>

  <!-- OPTIONAL: Submissions List -->
  <div id="submissionsList_loop-structures_1" class="submissions-list"></div>

  <!-- Upload Form Container -->
  <div id="uploadForm_loop-structures_1"></div>
</div>
```

---

## 🎯 Main Dashboard Header (Add User Profile)

### Before

```html
<header>
  <h1>🎓 Coding Reviewer</h1>
  <p>Learn Java through interactive challenges</p>
</header>
```

### After

```html
<header>
  <div class="header-content">
    <div class="header-left">
      <h1>🎓 Coding Reviewer</h1>
      <p>Learn Java through interactive challenges</p>
    </div>

    <!-- User Profile Button (auto-created by ui-components.js) -->
    <div class="header-right">
      <!-- Profile menu is created by ui-components.js -->
    </div>
  </div>
</header>

<style>
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left {
    flex: 1;
  }

  .header-right {
    width: 200px;
  }
</style>
```

---

## 📊 Dashboard Stats Section (Add to Main Page)

```html
<!-- Add this after your main challenges container -->
<section id="userDashboard" class="dashboard-section" style="display:none;">
  <h2>📈 Your Progress</h2>
  <div id="userStats" class="stats-grid">
    <!-- Filled by loadUserDashboard() -->
  </div>

  <h3>✅ Completed Challenges</h3>
  <div id="completionFeed" class="completion-feed">
    <!-- Filled by loadUserDashboard() -->
  </div>
</section>

<style>
  .dashboard-section {
    background: #f5f5f5;
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .completion-feed {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .completion-item {
    background: white;
    padding: 12px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
  }

  .date {
    color: #999;
    font-size: 12px;
  }
</style>
```

---

## 🔧 Initialize UI on Page Load

### Add to your existing JavaScript

```javascript
// Call this when page is ready
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize UI (auth modal, profile menu, etc)
  initializeUI();

  // Load user dashboard if logged in
  const user = getCurrentUser();
  if (user) {
    document.getElementById("userDashboard").style.display = "block";
    await loadUserDashboard();

    // Add upload forms to all challenges
    const challengeCards = document.querySelectorAll(".challenge");
    for (const card of challengeCards) {
      const topicId = card.getAttribute("data-topic-id");
      const challengeId = card.getAttribute("data-challenge-id");

      if (topicId && challengeId) {
        const formContainer = card.querySelector('[id^="uploadForm_"]');
        if (formContainer && !formContainer.querySelector(".upload-form")) {
          const uploadForm = createUploadForm(topicId, challengeId);
          formContainer.appendChild(uploadForm);

          // Update completion status
          await updateChallengeUI(topicId, challengeId);
        }
      }
    }
  }
});
```

---

## 💾 Complete Challenge HTML with All Features

Here's a fully-featured challenge card example:

```html
<div class="challenge" data-topic-id="loop-structures" data-challenge-id="1">
  <!-- Challenge Header -->
  <div class="challenge-header">
    <h4>Challenge 1: Print Numbers 1-10</h4>
    <div
      id="completionIndicator_loop-structures_1"
      class="completion-badge"
    ></div>
  </div>

  <!-- Challenge Description -->
  <p>Write a program that prints numbers from 1 to 10 using a for loop.</p>

  <!-- Requirements -->
  <div class="requirements">
    <strong>Requirements:</strong>
    <ul>
      <li>Use a for loop structure</li>
      <li>Print each number on a new line</li>
      <li>Output: 1, 2, 3, ..., 10</li>
    </ul>
  </div>

  <!-- Solution Button -->
  <button
    onclick="document.getElementById('solution1').style.display='block'"
    class="btn-show-solution"
  >
    Show Solution
  </button>

  <!-- Solution Box (Hidden) -->
  <div id="solution1" class="solution-box" style="display:none;">
    <button
      onclick="this.closest('.solution-box').style.display='none'"
      class="btn-close-solution"
    >
      Hide
    </button>
    <pre><code>public class LoopExample {
    public static void main(String[] args) {
        for(int i = 1; i <= 10; i++) {
            System.out.println(i);
        }
    }
}</code></pre>
  </div>

  <!-- User Submissions Section -->
  <details>
    <summary>📤 View Submissions</summary>
    <div id="submissionsList_loop-structures_1" class="submissions-history">
      <!-- Will be populated by loadSubmissionHistory() -->
    </div>
  </details>

  <!-- Upload Form (Added by JavaScript) -->
  <div id="uploadForm_loop-structures_1"></div>
</div>

<style>
  .challenge {
    background: white;
    padding: 20px;
    margin: 15px 0;
    border-radius: 8px;
    border-left: 4px solid #4caf50;
  }

  .challenge-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .challenge h4 {
    margin: 0;
    color: #333;
  }

  .completion-badge {
    padding: 4px 8px;
    background: #d1e7dd;
    color: #0f5132;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
  }

  .requirements {
    background: #f0f7ff;
    padding: 12px;
    border-radius: 4px;
    margin: 15px 0;
  }

  .requirements ul {
    margin: 5px 0;
    padding-left: 20px;
  }

  .btn-show-solution {
    padding: 8px 16px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px 0;
  }

  .btn-show-solution:hover {
    background: #45a049;
  }

  .solution-box {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 15px;
    border-radius: 4px;
    margin: 15px 0;
    position: relative;
  }

  .btn-close-solution {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #f44336;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 3px;
    cursor: pointer;
  }

  .submissions-history {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    margin-top: 10px;
  }

  details summary {
    cursor: pointer;
    font-weight: bold;
    color: #4caf50;
  }
</style>
```

---

## 🎨 Optional: Add Admin Button to Header

```html
<header>
  <div class="header-content">
    <h1>🎓 Coding Reviewer</h1>

    <!-- Admin Button (only visible if user is admin) -->
    <button
      id="adminPanelBtn"
      onclick="loadAdminDashboard()"
      class="btn-admin"
      style="display:none;"
    >
      📋 Admin Panel
    </button>
  </div>
</header>

<script>
  // Show admin button if user is admin
  document.addEventListener("DOMContentLoaded", async () => {
    if (getCurrentUser() && (await isUserAdmin())) {
      document.getElementById("adminPanelBtn").style.display = "block";
    }
  });
</script>

<style>
  .btn-admin {
    padding: 8px 16px;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  .btn-admin:hover {
    background: #e68900;
  }
</style>
```

---

## 📋 Submission History Function

Add this to display user's submissions for a challenge:

```javascript
async function loadSubmissionHistory(topicId, challengeId) {
  const user = getCurrentUser();
  if (!user) return;

  try {
    const submissions = await getUserSubmissions(user.id);
    const filtered = submissions.filter(
      (s) => s.topic_id === topicId && s.challenge_id === challengeId,
    );

    const container = document.getElementById(
      `submissionsList_${topicId}_${challengeId}`,
    );
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = "<p>No submissions yet</p>";
      return;
    }

    const html = filtered
      .map(
        (s) => `
            <div class="submission-item">
                <span>${s.status}</span>
                <span>${new Date(s.created_at).toLocaleDateString()}</span>
                <button onclick="viewSubmissionModal('${s.id}')">View</button>
            </div>
        `,
      )
      .join("");

    container.innerHTML = html;
  } catch (error) {
    console.error("Error loading submission history:", error);
  }
}
```

---

## ✅ Checklist for HTML Integration

- [ ] Added Supabase script tag to head
- [ ] Added all 6 JS module script tags in correct order
- [ ] Added `data-topic-id` and `data-challenge-id` to challenge cards
- [ ] Added submission containers (`uploadForm_`, `submissionsList_`, `completionIndicator_`)
- [ ] Added `DOMContentLoaded` event listener with `initializeUI()`
- [ ] Added user dashboard section with stats/feed
- [ ] Added admin button to header
- [ ] Tested login/signup modal appears
- [ ] Tested file upload displays properly
- [ ] Tested completion badges show after approval

---

## 🧪 Quick Test

After integration, run this in browser console to verify everything loads:

```javascript
// Check all modules loaded
console.log("Supabase Client:", typeof getSupabaseClient);
console.log("Auth loaded:", typeof signUp);
console.log("Submissions loaded:", typeof submitChallenge);
console.log("AI Checker loaded:", typeof triggerAIReview);
console.log("Admin Panel loaded:", typeof loadAdminDashboard);
console.log("UI Components loaded:", typeof createAuthModal);

// Test auth state
console.log("Current user:", getCurrentUser());

// Load profile if logged in
if (getCurrentUser()) {
  console.log(
    "User completed:",
    await getUserCompletedChallenges(getCurrentUser().id),
  );
}

// Test Groq connection
console.log("Groq test:", await testGroqConnection());
```

---

**Everything integrated? You're ready to test the full feature set!** 🚀
