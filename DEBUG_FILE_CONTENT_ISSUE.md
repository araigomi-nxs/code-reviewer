# 🔍 AI Review - File Content Not Saving - Debug Guide

## ⏱️ What We Added

### Enhanced Diagnostics:

1. **Automatic verification after save** - Checks if data persisted
2. **Detailed error messages** - Shows RLS policy errors clearly
3. **Diagnostic function** - Can manually inspect database
4. **Comprehensive logging** - Every step of upload is logged

## 🧪 Step-by-Step Debugging

### Step 1: Enable Detailed Logging

Open browser console (`F12`) and paste this command to enable detailed upload logging:

```javascript
// Enable diagnostic mode
localStorage.setItem("debug_mode", "true");
```

### Step 2: Upload a File & Check Console

1. Upload a challenge file
2. Open browser console (`F12`)
3. Look for these logs in order:

```
✅ File read successfully: {contentLength: 543, ...}
💾 About to save submission: {fileContentLength: 543, ...}
📝 Saving submission data: {fileContentLength: 543, ...}
✅ Submission saved to Supabase: [username] [challengeId]
🔍 Running diagnostic to verify persistence...
🔍 === DIAGNOSTIC CHECK ===
✅ Found submission record in DB
📊 ALL FIELDS:
  file_content length: [should be > 0]
  file_content preview: [should show code]
```

### Step 3: If file_content Shows 0 or NULL

Run this command in the browser console to manually diagnose:

```javascript
// Replace with actual values
window.diagnosticCheckSubmissionInDB("your_username", "loops_challenge_1");
```

Look at the output:

- If `file_content: NULL` → Data wasn't saved to DB
- If `file_content length: 543` → Data is in DB, issue is in retrieval

### Step 4: Check RLS Policies

If you see error: "row-level security" or "policy violated"

**Go to Supabase Dashboard:**

1. Select your project
2. Navigate to: **SQL Editor** → Run this query:

```sql
-- Check RLS policies on submissions table
SELECT * FROM pg_policies WHERE tablename = 'submissions';

-- If policies exist, check what they allow
SELECT * FROM auth.users LIMIT 1; -- See current user
```

3. If policies exist restrictively, either:
   - **Disable RLS:** Go to submissions table → Settings → disable "Enable RLS"
   - **Fix policies:** Create policies that allow authenticated users to select/insert/update their own submissions

### Step 5: Check Column Type

In Supabase Dashboard:

1. Go to **Database** → **Tables** → **submissions**
2. Find the `file_content` column
3. Check its type:
   - ✅ Should be **"text"** (unlimited)
   - ❌ NOT "varchar(N)" (limited size)
   - ❌ NOT "bytea" (binary, wrong type)

If wrong type, run migration:

```sql
ALTER TABLE submissions ALTER COLUMN file_content TYPE text;
```

### Step 6: Manual Data Check

If you want to see what's ACTUALLY in the database, run query:

```sql
SELECT
  username,
  challenge_id,
  file_name,
  LENGTH(file_content) as content_length,
  SUBSTRING(file_content, 1, 100) as content_preview,
  status
FROM submissions
ORDER BY submitted_at DESC
LIMIT 10;
```

This will show you:

- ✅ How many submissions exist
- ✅ How much content each has
- ✅ First 100 characters of each

## 📋 Common Issues & Fixes

| Issue                     | Check              | Fix                                       |
| ------------------------- | ------------------ | ----------------------------------------- |
| file_content is NULL      | RLS policies       | Disable RLS or create allow policies      |
| file_content length: 0    | FileReader success | Check file upload dialog                  |
| Error: "policy violation" | RLS settings       | Security → Policies → Allow select/insert |
| Error: "too long"         | Column type        | Change column to `text` (not varchar)     |
| No error but still empty  | Verify step        | Run diagnostic in browser console         |

## 🚀 Copy-Paste Verification Command

Paste this in browser console after uploading to get full diagnostics:

```javascript
(async () => {
  const user = window.getCurrentUser();
  if (!user) {
    console.error("Not logged in");
    return;
  }
  await window.diagnosticCheckSubmissionInDB(
    user.username,
    "loops_challenge_1",
  );
})();
```

## 📞 If Still Not Working

Provide these from browser console:

1. Output of diagnostic command above
2. Screenshot of all console logs after file upload
3. Go to Supabase dashboard → SQL Editor → Run:
   ```sql
   SELECT * FROM submissions LIMIT 1;
   ```
   Show the result (file_content column especially)

The enhanced logging will pinpoint exactly where the data is being lost!
