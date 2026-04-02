# 🧪 STEP-BY-STEP DEBUGGING CHECKLIST

## ⏱️ What Changed

Added **CRITICAL diagnostic logging** that shows exactly where file content disappears.

## 🔍 What To Look For In Console

### Step 1: Upload a File & Open Console (F12)

Look for this sequence in the browser console (in order):

```
📖 === FILE READ COMPLETE ===
File name: solution.java
File size (bytes): 543
Content read - length: 543
✅ Content read successfully, proceeding to save

📝 === SUPABASE SAVE OPERATION STARTING ===
File content length: 543
📝 === SENDING UPSERT TO SUPABASE ===

✅ === SUBMISSION SAVE COMPLETE ===
Content that was sent to Supabase (length): 543

🔍 === IMMEDIATE VERIFICATION ===
Fetching data back from Supabase to verify...
🔍 === DIAGNOSTIC CHECK ===
✅ Found submission record in DB
📊 ALL FIELDS:
  file_name: solution.java
  file_content type: string
  file_content length: 543  ← KEY LINE
  file_content preview: public class Solution { ...
```

## ❌ If You See These Warnings

### Warning 1: "FileReader returned empty content"

```
❌ CRITICAL: FileReader returned empty content!
   reader.result:
   reader.result === null: true
```

**Cause:** File picker dialog didn't actually select file  
**Fix:** Make sure file is selected in dialog, file is not empty

---

### Warning 2: "Attempting to save with EMPTY file_content"

```
❌ CRITICAL: Attempting to save with EMPTY file_content!
   submissionData.fileContent:
```

**Cause:** File content is empty before save  
**Fix:** Check if FileReader step succeeded

---

### Warning 3: "file_content length: 0" in diagnostic

```
file_content type: string
file_content length: 0  ← ❌ PROBLEM
file_content preview: ❌ MISSING/NULL/EMPTY
```

**Cause:** Data didn't persist to Supabase  
**Fix:** Check RLS policies or column type (see below)

---

## 🚨 If file_content is Empty in Database

### Step A: Check RLS Policies

In browser console, look for red errors like:

```
"row-level security policy" or "policy violation"
```

If you see this:

1. Go to Supabase Dashboard
2. Database → submissions table
3. Settings tab → Find "Enable RLS"
4. If it's ON, toggle it OFF
5. Re-test upload

### Step B: Check Column Type

In Supabase Dashboard:

1. Database → submissions table
2. Find `file_content` column in the schema
3. Check the **Type** field
4. Should be: `text` (unlimited)
5. If shows: `varchar(100)` or similar → PROBLEM!

If wrong type, copy-paste in SQL Editor:

```sql
ALTER TABLE submissions ALTER COLUMN file_content TYPE text;
```

### Step C: Run Raw Verification

In Supabase SQL Editor:

```sql
-- Check what's ACTUALLY in the database
SELECT
  username,
  challenge_id,
  file_name,
  LENGTH(file_content) as content_length,
  SUBSTRING(file_content, 1, 50) as content_preview
FROM submissions
ORDER BY submitted_at DESC
LIMIT 5;
```

## 📋 Full Debug Flow

```
1. Clear cache: Ctrl+Shift+Delete
2. Reload page
3. Open console: F12
4. Select & upload file
5. Look for: "FILE READ COMPLETE" section
   ✅ Should show: "length: [number > 0]"
   ❌ If shows: "length: 0", file read failed

6. Look for: "SUPABASE SAVE OPERATION" section
   ✅ Should show: "File content length: [number > 0]"
   ❌ If shows: "length: 0", file didn't reach save

7. Look for: "DIAGNOSTIC CHECK" section
   ✅ Should show: "file_content length: 543"
   ❌ If shows: "file_content length: 0", RLS/column issue

8. Try AI Review
   ✅ Should work if all above show content
   ❌ If fails, check diagnostic output above
```

## 🎯 Most Common Causes (In Order)

| Issue                 | Symptom                              | Fix                                |
| --------------------- | ------------------------------------ | ---------------------------------- |
| **RLS Policy**        | "file_content length: 0" in database | Disable RLS in Supabase Settings   |
| **Wrong Column Type** | "file_content length: 0" in database | Change column to `text` type       |
| **File Not Read**     | "FileReader returned empty content"  | Check file upload dialog           |
| **Supabase Down**     | Errors in Supabase save section      | Check Supabase status.supabase.com |

## 🚀 Quick Test Command

Copy-paste in browser console after uploading:

```javascript
// This will show you EXACTLY what's in the database
(async () => {
  const user = window.getCurrentUser();
  await window.diagnosticCheckSubmissionInDB(
    user.username,
    "loops_challenge_1",
  );
})();
```

## 📸 What To Share If It's Still Broken

1. Screenshot of browser console (F12) showing:
   - "FILE READ COMPLETE" section
   - "DIAGNOSTIC CHECK" section
   - Any red error messages

2. Output from running:

   ```javascript
   (async () => {
     const user = window.getCurrentUser();
     await window.diagnosticCheckSubmissionInDB(
       user.username,
       "loops_challenge_1",
     );
   })();
   ```

3. Go to Supabase → SQL Editor → Run:
   ```sql
   SELECT * FROM submissions LIMIT 1;
   ```
   Screenshot the result

The new logging makes it IMPOSSIBLE to hide where the data is being lost! 🎯
