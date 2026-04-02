# Supabase Setup Guide for Code Reviewer

## Prerequisites

1. Supabase Project (free tier available at https://supabase.com)
2. Groq API Key (https://console.groq.com)

## Step 1: Supabase Project Setup

### Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    bio TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    file_name TEXT,
    file_url TEXT,
    source_code TEXT,
    status TEXT DEFAULT 'pending', -- pending, ai_reviewing, admin_pending, approved, rejected, resubmit
    ai_feedback TEXT,
    admin_feedback TEXT,
    ai_checked_at TIMESTAMP,
    admin_checked_at_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, topic_id, challenge_id)
);

-- Completion tracking
CREATE TABLE completion_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE completion_tracking ENABLE ROW LEVEL SECURITY;

-- Allow users to view all profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- Allow users to update own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to view all submissions
CREATE POLICY "Submissions viewable by everyone" ON submissions
    FOR SELECT USING (true);

-- Allow users to create submissions
CREATE POLICY "Users can create submissions" ON submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update own submissions
CREATE POLICY "Users can update own submissions" ON submissions
    FOR UPDATE USING (auth.uid() = user_id);

-- Completion tracking policies
CREATE POLICY "Completion viewable by everyone" ON completion_tracking
    FOR SELECT USING (true);

CREATE POLICY "Users can insert completion" ON completion_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Create Storage Bucket

In Supabase Storage:

1. Create bucket named `submissions`
2. Make it public or private (recommend private with RLS)
3. Set upload size limit to 10MB

### Storage Policies

⚠️ **Important:** Storage policies are created via **Supabase Dashboard UI**, NOT SQL

#### Setup in Supabase Dashboard

1. Go to **Storage** tab
2. Click **submissions** bucket
3. Click **Policies** tab
4. Click **New Policy** button
5. Create 3 policies below using the form

---

#### Policy 1: Allow All Users to Upload

**Settings:**

- Operation: `INSERT`
- Target roles: `anon, authenticated`
- Policy name: `Allow all users to upload`

**Policy expression (paste in the form):**

```
true
```

**What it does:**

- Any user (logged in or not) can upload
- No restrictions

---

#### Policy 2: Allow All Users to Download

**Settings:**

- Operation: `SELECT`
- Target roles: `anon, authenticated`
- Policy name: `Allow all users to download`

**Policy expression (paste in the form):**

```
true
```

**What it does:**

- Any user (logged in or not) can download files
- No restrictions

---

#### Policy 3: Allow All Users to Delete

**Settings:**

- Operation: `DELETE`
- Target roles: `anon, authenticated`
- Policy name: `Allow all users to delete`

**Policy expression (paste in the form):**

```
true
```

**What it does:**

- Any user (logged in or not) can delete files
- No restrictions

## Step 2: Environment Variables

Create or update `.env.local` (in your project root or use in HTML):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
VITE_IS_ADMIN=false  // Set to true for admin account
```

For HTML, add these as script data attributes in index.html:

```html
<script
  type="module"
  id="app-config"
  data-supabase-url="YOUR_SUPABASE_URL"
  data-supabase-key="YOUR_SUPABASE_ANON_KEY"
  data-groq-key="YOUR_GROQ_API_KEY"
></script>
```

## Step 3: Enable Auth Methods

In Supabase Project Settings → Authentication:

- Enable Email/Password
- Optional: Enable Google, GitHub OAuth
- Set JWT expiration (recommended: 7 days)

## Step 4: Install Supabase JS Client

In your HTML, add CDN link:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## Step 5: Test Connection

Use the test script provided in `supabase-client.js`

## Database Schema Visualization

```
auth.users (Supabase built-in)
    ↓
    ├─→ profiles (1:1)
    ├─→ submissions (1:many)
    └─→ completion_tracking (1:many)
```

## Important Notes

1. **Row Level Security (RLS)** is enabled to ensure data privacy
2. **Policies** restrict users to their own data while allowing admins full access
3. **Storage** buckets require specific policies for file access
4. **Real-time** subscriptions can be added for live updates
5. **Backup** your database regularly

## Management

- View data: Supabase Dashboard → Table Editor
- Monitor logs: Supabase Dashboard → Logs
- Storage management: Supabase Dashboard → Storage
- User management: Supabase Dashboard → Authentication

## Gotchas

- User IDs must match between `auth.users` and `profiles`
- Insert into `profiles` via trigger after user signup
- File URLs are public if bucket is public
- Always validate file types on server side
- Rate limit Groq API calls to avoid quota issues
