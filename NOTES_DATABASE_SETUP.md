# Study Notes Database Setup Guide

**📝 GLOBAL NOTES: All users can view and share study notes**

## Overview

The notes feature uses Supabase for persistent storage. Notes are **GLOBAL** - all users can view all notes and resources for each topic. This enables collaborative learning where students can share study materials, examples, and resources with each other.

## SQL Migrations

Run the following SQL in your Supabase SQL Editor to create the required tables:

### 1. Create `study_notes` Table

```sql
-- Create study_notes table
CREATE TABLE study_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    notes_content TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(username, topic_id)
);

-- Create index for faster queries
CREATE INDEX idx_study_notes_username_topic ON study_notes(username, topic_id);
CREATE INDEX idx_study_notes_updated_at ON study_notes(updated_at DESC);

-- Add comment
COMMENT ON TABLE study_notes IS 'Stores study notes for each topic - globally visible to all users';
```

### 2. Create `study_resources` Table

```sql
-- Create study_resources table
CREATE TABLE study_resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    resource_type TEXT NOT NULL, -- 'image', 'video', or 'file'
    resource_name TEXT NOT NULL,
    resource_url TEXT, -- For video links
    resource_data BYTEA, -- For images and files (stored as base64 in JSON)
    resource_size BIGINT, -- File size in bytes
    created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX idx_study_resources_username_topic ON study_resources(username, topic_id);
CREATE INDEX idx_study_resources_created_at ON study_resources(created_at DESC);
CREATE INDEX idx_study_resources_type ON study_resources(resource_type);

-- Add comment
COMMENT ON TABLE study_resources IS 'Stores study resources (images, videos, files) for each topic - globally visible to all users';
```

## Row-Level Security (RLS) - OPTIONAL

Since notes are globally shared, RLS is **optional**. However, you may want to enable RLS to:

- Control who can **edit** global notes
- Manage administrative access
- Restrict access by role

### If You Want to Enable RLS (Optional)

```sql
-- Enable RLS on study_notes table
ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on study_resources table
ALTER TABLE study_resources ENABLE ROW LEVEL SECURITY;

-- Optional: Allow everyone to read, but only note creator can edit
CREATE POLICY "Anyone can view notes"
    ON study_notes FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Users can update their own notes"
    ON study_notes FOR UPDATE
    USING (username = current_user_id());

-- Similar policies for study_resources
CREATE POLICY "Anyone can view resources"
    ON study_resources FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Users can delete their own resources"
    ON study_resources FOR DELETE
    USING (username = current_user_id());
```

## How Global Notes Work

1. **Creating Notes**: Each user can create/edit notes for a topic
   - Notes are stored with the creator's username
   - Only one note entry per user per topic (UNIQUE constraint)

2. **Viewing Notes**: All users can see all notes for a topic
   - When viewing a topic, you see the combined notes from ALL users
   - Each note shows who created it
   - Everyone benefits from shared study materials

3. **Resources**: Global sharing of study materials
   - All users can see images, videos, and files added by others
   - Resources are tagged with creator and topic
   - Collaborative resource pool for each topic

## Database Functions Used

### Supabase Client Functions

The following functions have been added to `js/supabase-client.js`:

| Function                                                     | Description                                            |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| `supabaseSaveStudyNotes(username, topicId, notesContent)`    | Save/update notes for a topic (by current user)        |
| `supabaseGetStudyNotes(username, topicId)`                   | Get all notes for a topic (global - all users' notes)  |
| `supabaseSaveStudyResource(username, topicId, resourceData)` | Add a resource (image, video, or file) to a topic      |
| `supabaseGetStudyResources(username, topicId)`               | Get all resources for a topic (global - all users')    |
| `supabaseDeleteStudyResource(resourceId)`                    | Delete a specific resource (authenticated users)       |
| `supabaseDeleteStudyResourcesByTopic(username, topicId)`     | Delete all resources for a topic (authenticated users) |

## Data Structure

### study_notes Object

```javascript
{
    id: "uuid",
    username: "user@example.com",  // Who created the note
    topic_id: "loops",
    notes_content: "My study notes...",
    created_at: "2026-04-05T10:00:00Z",
    updated_at: "2026-04-05T11:00:00Z"
}
```

### study_resources Object

```javascript
{
    id: "uuid",
    username: "user@example.com",  // Who uploaded the resource
    topic_id: "loops",
    resource_type: "image",        // or "video" or "file"
    resource_name: "diagram.png",
    resource_url: "https://youtube.com/...",  // For videos
    resource_data: "data:image/png;base64,...", // For images/files
    resource_size: 102400,         // In bytes
    created_at: "2026-04-05T10:00:00Z"
}
```

## Migration Steps

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click "SQL Editor" in the left sidebar

2. **Create Tables**
   - Copy and run the "Create `study_notes` Table" SQL
   - Copy and run the "Create `study_resources` Table" SQL

3. **Optional: Enable RLS**
   - If needed, copy and run the optional RLS SQL above

4. **Verify Tables**
   - Go to "Table Editor" in the sidebar
   - You should see `study_notes` and `study_resources` tables

## Testing

After setup, test by:

1. **User 1**: Open the app, select a topic, click "📝 Notes" tab
2. **Add Notes**: Write some study notes and save
3. **User 2**: Log in with a different account, go to the same topic
4. **View Shared Notes**: You should see User 1's notes immediately
5. **Add Resources**: User 2 adds an image or video link
6. **Verify Sharing**: User 1 refreshes and sees User 2's resources

## Troubleshooting

### "Supabase not initialized" Error

- Wait for page to fully load
- Check browser console for Supabase connection errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### Notes Not Saving

- Check browser console for error messages
- Verify user is logged in: `window.getCurrentUser()`
- Ensure tables are created in Supabase dashboard

### Not Seeing Other Users' Notes

- Verify the tables exist and have data in Supabase Table Editor
- Check that you're viewing the same topic as the note creator
- Confirm multiple users are creating/adding resources

## Performance Optimization

For large datasets with many notes and resources:

```sql
-- Query to see frequency of notes per topic
SELECT topic_id, COUNT(*) as note_count, COUNT(DISTINCT username) as user_count
FROM study_notes
GROUP BY topic_id
ORDER BY note_count DESC;

-- Limit resource queries to recent items (e.g., last 100)
SELECT * FROM study_resources
WHERE topic_id = 'loops'
ORDER BY created_at DESC
LIMIT 100;
```

## Backup & Export

To backup study materials:

```sql
-- Export all study notes by topic
SELECT * FROM study_notes ORDER BY topic_id, created_at DESC;

-- Export all study resources by topic
SELECT * FROM study_resources ORDER BY topic_id, created_at DESC;
```

## Cleanup

To delete all notes and resources for a topic:

```sql
-- Delete all resources for a topic
DELETE FROM study_resources WHERE topic_id = 'loops';

-- Delete all notes for a topic
DELETE FROM study_notes WHERE topic_id = 'loops';
```

To delete a specific user's notes:

```sql
-- Delete all of user's notes and resources
DELETE FROM study_resources WHERE username = 'user@example.com';
DELETE FROM study_notes WHERE username = 'user@example.com';
```

## Migration Steps

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click "SQL Editor" in the left sidebar

2. **Create Tables**
   - Copy and run the "Create `study_notes` Table" SQL
   - Copy and run the "Create `study_resources` Table" SQL

3. **Optional: Enable Security**
   - Copy and run the "Enable RLS" SQL
   - Copy and run the "Create RLS Policies" SQL

4. **Verify Tables**
   - Go to "Table Editor" in the sidebar
   - You should see `study_notes` and `study_resources` tables

## Testing

After setup, test by:

1. Opening the app in your browser
2. Selecting a topic and clicking the "📝 Notes" tab
3. Adding notes and resources
4. Refreshing the page - your notes should persist from the database

## Troubleshooting

### "Supabase not initialized" Error

- Wait for page to fully load
- Check browser console for Supabase connection errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### Notes Not Saving

- Check browser console for error messages
- Verify user is logged in: `window.getCurrentUser()`
- Ensure tables are created in Supabase dashboard

### RLS Policy Errors

- If you see "row-level security policy" errors, either:
  - Disable RLS: `ALTER TABLE study_notes DISABLE ROW LEVEL SECURITY;`
  - Or fix the policy to match your auth method

### Resources Not Loading

- Check if `study_resources` table has data in Supabase
- Verify `resource_data` is not NULL for images/files
- For videos, ensure `resource_url` is set

## Performance Optimization

For large datasets, you may want to add:

```sql
-- Limit resource queries to recent items (e.g., last 100)
SELECT * FROM study_resources
WHERE username = 'user' AND topic_id = 'loops'
ORDER BY created_at DESC
LIMIT 100;
```

## Backup & Export

To backup user notes:

```sql
-- Export all study notes
SELECT * FROM study_notes ORDER BY username, topic_id;

-- Export all study resources
SELECT * FROM study_resources ORDER BY username, topic_id, created_at;
```

## Cleanup

To delete a user's data:

```sql
-- Delete all notes and resources for a user
DELETE FROM study_resources WHERE username = 'user@example.com';
DELETE FROM study_notes WHERE username = 'user@example.com';
```
