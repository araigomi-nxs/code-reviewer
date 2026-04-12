# Submission Display Locations - Student Dashboard Guide

## Overview

This document maps where student submissions, AI feedback, and results are displayed throughout the platform.

---

## 1. SUBMISSION ITEMS LIST (Challenge View)

### Location: `js/ui-components.js` - **`createUploadForm()` function**

- **Lines**: 930-1020
- **Component Class**: `.submission-item`
- **Purpose**: Renders list of all submissions for a challenge below the upload form

### HTML Structure of Submission Item

```html
<div
  class="submission-item"
  data-username="{sub.username}"
  data-challengeid="{challengeId}"
  onclick="handleShowCodePreview(this)"
  style="background: var(--bg-secondary); padding: 10px; margin: 5px 0; 
            border-radius: 4px; border-left: 3px solid {statusColor}; 
            cursor: pointer; transition: all 0.2s;"
></div>
```

### What's Displayed in Each Submission Item:

1. **Avatar** - User's profile picture (40x40px circle)
2. **Username** - Submission author name (bold)
3. **File Name** - Submitted file name
4. **Timestamp** - Date & time of submission
5. **AI Rating** - Emoji rating from AI review (e.g., "🤖 Correct" or "🤖 Incorrect")
6. **Status Badge** - Colored circle badge (left side border color):
   - 🟠 Orange (#FFA500) = Pending
   - 🟢 Green (#4CAF50) = Completed/Approved
   - 🔴 Red (#f44336) = Rejected

### Admin Feedback Display (Under Status):

- **Location**: [js/ui-components.js line 1004-1005](js/ui-components.js#L1004-L1005)
- Shows first 100 characters of feedback with truncation indicator
- Green background for approved submissions
- Red background for rejected submissions
- Format: `✅ Approved: {feedback}` or `❌ Rejected: {feedback}`

---

## 2. LATEST SUBMISSIONS DASHBOARD

### Location: `index.html`

- **Lines**: 1589-1601
- **HTML ID**: `latestSubmissionsDashboard`
- **Container Style**: `min-height: 200px; max-height: 600px; overflow-y: auto;`
- **CSS Styling**: Lines 718-738

### Dashboard Features:

- Scrollable grid showing top 10 most recent submissions site-wide
- Each submission card shows:
  - Username + Challenge ID
  - Submission date
  - Status indicator
  - Feedback preview (if available)

---

## 3. CODE PREVIEW MODAL (Full Submission View)

### Trigger Function: `showCodePreview(username, challengeId)`

- **Location**: [js/ui-components.js lines 1094-1700+](js/ui-components.js#L1094)
- **Trigger**: Click on any submission item in the list
- **Modal ID**: `codePreviewModal_{username}_{challengeId}`

### Modal Layout: Two-Column Split View

#### LEFT SIDE - User's Code

- **Label**: "📝 YOUR CODE"
- **Code Display**: Pre-formatted code block with syntax highlighting
  - Background: `#2d2d2d` (dark terminal style)
  - Font: Courier New, monospace, 13px
  - Max height: scrollable
- **Run Button**: Blue "▶️" button (2196F3) to execute code
- **Code Runner Section**:
  - Hidden by default
  - Shows when user clicks run button
  - Contains input/output areas for testing

#### RIGHT SIDE - AI Review Panel

- **Label**: "🤖 AI REVIEW"
- **Background**: `#fafafa` (light gray)
- **Sections** (if AI review exists):
  1. **💭 Review Section**
     - Background: `var(--bg-secondary)` with left blue border
     - Text parsed from AI feedback
     - Each line separated by `<br />`

  2. **💡 Suggestion Section**
     - Labeled as "💡 Suggestion:"
     - Shows improved code in formatted code block
     - Same dark styling as user code

  3. **Request New Review Button**
     - Orange button (#FF9800)
     - Disabled if submission is completed
     - Text: "🔄 Request New Review"

  4. **AI Review States**:
     - **Processing**: "⏳ AI is reviewing this code..."
     - **Failed**: Error message with retry options
     - **None**: "No AI review yet"

---

## 4. MODAL HEADER & STATUS INFO

### Location: [js/ui-components.js lines 1150-1190](js/ui-components.js#L1150-L1190)

**Displays**:

- Submission owner username
- Status emoji (⏳ Pending / ✓ Completed / ✕ Rejected)
- File name
- Submission timestamp
- AI status indicator:
  - "🤖 AI Reviewed" (if completed)
  - "⏳ AI Reviewing..." (if processing)
  - Rating badge with color:
    - Green background for "Correct"
    - Red background for "Incorrect"

**Admin Buttons** (if user is admin):

- ✅ Approve button (green, #4CAF50)
- ❌ Reject button (red, #f44336)
- 🗑️ Delete button (orange, #ff5722)
- ✕ Close button (red)

---

## 5. CHALLENGE DETAILS SECTION

### Location: [js/ui-components.js lines 1280-1340](js/ui-components.js#L1280-L1340)

**Shown Above Code & AI Review**:

1. **Challenge Title**: "📌 {Challenge Title}"
2. **Problem Statement**: Full problem description in formatted box
3. **Expected Output**: What correct output should be
4. **Reference Solution** (if AI review completed):
   - Toggle button: "👁️ Show Solution" / "🙈 Hide Solution"
   - Code displayed in dark terminal style
   - Max height: 220px before scrolling

---

## 6. CSS CLASSES FOR SUBMISSIONS

### Primary Classes:

| Class                      | Purpose                       | Location                                         |
| -------------------------- | ----------------------------- | ------------------------------------------------ |
| `.submission-item`         | Inline styled submission card | [ui-components.js:996](js/ui-components.js#L996) |
| `.submissions-list`        | Container for all submissions | [ui-components.js:954](js/ui-components.js#L954) |
| `.submissions-list-header` | "📋 Submissions (X)" title    | [ui-components.js:964](js/ui-components.js#L964) |
| `.upload-form`             | Form wrapper                  | [ui-components.js:943](js/ui-components.js#L943) |
| `.code-block`              | Code display styling          | [index.html:282-298](index.html#L282-L298)       |

### Color Scheme for Status:

```javascript
const statusColor =
  submission.status === "pending"
    ? "#FFA500" // Orange
    : submission.status === "completed"
      ? "#4CAF50" // Green
      : "#f44336"; // Red
```

---

## 7. AI FEEDBACK PARSING & DISPLAY

### Parse Function: `parseAiReview(aiReview)`

- **Location**: [js/ui-components.js lines 905-930](js/ui-components.js#L905-L930)
- **Extracts**:
  - Review text (from "Review:" section)
  - Suggestion/improved code (from "Suggestion:" or "Improved Code:" section)
  - Rating (from "Rating:" section)

### Extract Rating: `extractRatingFromReview(aiReview)`

- **Location**: [js/ui-components.js lines 872-903](js/ui-components.js#L872-L903)
- **Returns**: Extracted rating text (e.g., "Correct", "Incorrect")
- **Used For**: Display next to AI status indicator

### Summary Display in List:

- **Location**: [ui-components.js lines 986-990](js/ui-components.js#L986-L990)
- Shows only the rating: "🤖 {rating}"
- Appears at the end of submission item info line

---

## 8. SUBMISSION STATUS INDICATORS

### Status Colors (Used Consistently):

**Color Constants**:

- **Pending**: `#FFA500` (Orange)
- **Completed/Approved**: `#4CAF50` (Green)
- **Rejected**: `#f44336` (Red)

### Status Emoji:

```javascript
const statusEmoji =
  submission.status === "pending"
    ? "⏳"
    : submission.status === "completed"
      ? "✓"
      : "✕";
```

### Feedback Box Styling:

```javascript
background: ${submission.status === 'completed' ?
  'rgba(76, 175, 80, 0.15)' :           // Green tint
  'rgba(244, 67, 54, 0.15)'};            // Red tint
border-left: 3px solid ${submission.status === 'completed' ?
  '#4CAF50' : '#f44336'};
```

---

## 9. ADMIN PANEL SUBMISSION DISPLAY

### Location: `js/admin-panel.js`

- **Lines**: 50-95

### Refresh Functions:

1. **`refreshChallengeSubmissionsList(challengeId)`** - [Lines 20-95](js/admin-panel.js#L20)
   - Updates submissions list for specific challenge
   - Shows same layout as student view + admin buttons

2. **`refreshLatestSubmissionsDashboard()`** - [Lines 103-160](js/admin-panel.js#L103)
   - Updates main dashboard with latest 10 submissions

### Admin-Specific Features:

- Feedback display with truncation
- AI review status display
- User avatar loading

---

## 10. SUBMISSION RENDERING DATA FLOW

```
Student View Flow:
├── Student clicks challenge
├── createUploadForm() generates:
│   ├── File upload input
│   ├── Submit button
│   └── Submissions list (.submissions-list)
│       └── Multiple .submission-item divs
│           ├── Click triggers showCodePreview()
│           └── Modal displays with:
│               ├── Challenge details (top)
│               ├── User code (left)
│               └── AI review (right)
│
└── AI Review States:
    ├── No Review → "No AI review yet"
    ├── Processing → "⏳ AI is reviewing..."
    ├── Completed → parseAiReview() displays:
    │   ├── Review text
    │   ├── Suggestion code
    │   └── Request new review button
    └── Failed → Error with retry options
```

---

## 11. KEY FUNCTIONS FOR SUBMISSION DISPLAY

| Function                              | Location                                           | Purpose                            |
| ------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| `createUploadForm()`                  | [ui-components.js:930](js/ui-components.js#L930)   | Generate submission form + list    |
| `showCodePreview()`                   | [ui-components.js:1094](js/ui-components.js#L1094) | Modal with full submission view    |
| `handleShowCodePreview()`             | [ui-components.js:1052](js/ui-components.js#L1052) | Click handler for submission items |
| `extractRatingFromReview()`           | [ui-components.js:872](js/ui-components.js#L872)   | Parse AI rating                    |
| `parseAiReview()`                     | [ui-components.js:905](js/ui-components.js#L905)   | Parse full AI review               |
| `refreshChallengeSubmissionsList()`   | [admin-panel.js:20](js/admin-panel.js#L20)         | Refresh submission list display    |
| `refreshLatestSubmissionsDashboard()` | [admin-panel.js:103](js/admin-panel.js#L103)       | Update latest submissions          |

---

## 12. CSS STYLING REFERENCE

### Dark Mode Colors:

```css
--bg-primary: #1a1a1a; /* Main background */
--bg-secondary: #242424; /* Card background */
--bg-tertiary: #2d2d2d; /* Code block background */
--text-primary: #ffffff; /* Main text */
--text-secondary: #b0b0b0; /* Secondary text */
--accent: #d5e339; /* Highlight color */
```

### Light Mode Colors:

```css
--bg-primary: #ffffff;
--bg-secondary: #f8f9fa;
--bg-tertiary: #eeeff1;
--text-primary: #1a1a1a;
--text-secondary: #666666;
--accent: #12151c;
```

### Submission Item Styling:

```css
width: 100%;
padding: 10px;
margin: 5px 0;
border-radius: 4px;
border-left: 3px solid {statusColor};
transition: all 0.2s;
display: flex;
flex-direction: column;
gap: 8px;
```

---

## Summary

**Where Students See Submissions & Feedback:**

1. **Inline List** → Challenge view's submissions-list below form
2. **Dashboard** → Latest Submissions dashboard (latest 10 site-wide)
3. **Modal Detail View** → Clicking any submission shows full preview with AI review
4. **Status Indicators** → Color-coded badges show submission status
5. **Feedback Boxes** → Truncated feedback visible in list, full feedback in modal
6. **AI Review Display** → Right panel of modal with review + suggested code
