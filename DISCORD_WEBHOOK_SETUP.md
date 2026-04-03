# Discord Webhook Integration Setup Guide

## Overview

The Coding Reviewer platform now includes Discord webhook integration that sends notifications whenever submissions are updated with status changes:

- **📝 Created** - New submission uploaded
- **⏳ Pending** - Awaiting review
- **👀 Under Review** - Admin is reviewing the submission
- **🤖 AI Review** - AI review has been completed
- **🎉 Completed** - Submission approved and completed
- **❌ Rejected** - Submission was rejected

## Prerequisites

- A Discord server where you have permission to create webhooks
- Admin access to create integrations in Discord

## Step 1: Create a Discord Webhook

### 1.1 Open Discord Server Settings

- Right-click on your Discord server name
- Select **Server Settings**

### 1.2 Navigate to Integrations

- Click **Integrations** in the left sidebar
- Click **Webhooks**

### 1.3 Create a New Webhook

- Click **New Webhook**
- Give it a name like "Coding Reviewer Bot"
- (Optional) Upload a custom avatar
- Select the channel where notifications should be sent
- Click **Create**

### 1.4 Copy the Webhook URL

- Click **Copy Webhook URL**
- Save this URL somewhere safe - you'll need it in the next step

The URL will look like:

```
https://discordapp.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

## Step 2: Configure the Environment

### 2.1 Update `env-config.js`

Open `js/env-config.js` and update the Discord webhook URL:

```javascript
window.ENV = {
  // ... other config ...

  // Replace with your Discord Webhook URL
  VITE_DISCORD_WEBHOOK_URL:
    "https://discordapp.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",
};
```

Replace `YOUR_WEBHOOK_ID` and `YOUR_WEBHOOK_TOKEN` with the values from your webhook URL.

### 2.2 Reload the Page

After updating `env-config.js`, reload your application in the browser to pick up the changes.

## Step 3: Test the Integration

### 3.1 Test from Browser Console

Open the browser console (F12 or right-click → Inspect → Console) and run:

```javascript
await window.discord.testWebhook();
```

You should see:

- ✅ Console output: "Discord webhook connection test successful!"
- 🎉 A test message in your Discord channel with green status

### 3.2 Check Discord Channel

Look in your Discord channel - you should see a test embed message that says:

- Title: "🧪 Discord Webhook Test"
- Status: "✅ Connection Successful"

## How It Works

### Automatic Notifications

The Discord webhook is automatically triggered when:

1. **User Submits Code**
   - Event: File uploaded
   - Status: "Created" ✅
   - Contains: filename, timestamp, username, challenge ID

2. **Submission Status Changes**
   - Triggered by admin actions or system updates
   - Shows: status change, feedback/comments, user info
   - Color-coded by status (red=rejected, yellow=pending, green=approved)

3. **AI Review Completes**
   - Triggered when Groq AI finishes analyzing code
   - Contains: AI review summary and rating
   - Status: "AI Review" 🤖

### Manual Notifications

You can also send custom notifications from the browser console:

```javascript
// Notify submission created
await window.discord.notifyCreated("username", "challenge-id", "filename.java");

// Notify pending review
await window.discord.notifyPending("username", "challenge-id");

// Notify under review
await window.discord.notifyUnderReview("username", "challenge-id");

// Notify AI review
await window.discord.notifyAIReview(
  "username",
  "challenge-id",
  "Review text...",
);

// Notify completed
await window.discord.notifyCompleted("username", "challenge-id", "Feedback...");

// Notify rejected
await window.discord.notifyRejected("username", "challenge-id", "Reason...");

// Custom notification
await window.discord.notifySubmissionUpdate(
  "username",
  "challenge-id",
  "status",
  "feedback-text",
  "ai-review-text",
  "filename.java",
);
```

## Discord Embed Format

Each notification appears as an elegant Discord embed with:

- **Title**: Status and emoji (e.g., "📚 Submission Completed")
- **Description**: Username and Challenge ID
- **Color**: Status-specific (blue=pending, green=approved, red=rejected, etc.)
- **Fields**:
  - 📝 File: Submitted filename
  - ⏰ Time: Submission/update timestamp
  - Status indicator with emoji
  - 💬 Feedback (if provided)
  - 🤖 AI Review (if available)
- **Footer**: Coding Reviewer Platform branding
- **Timestamp**: ISO 8601 format for tracking

## Status Colors

| Status       | Color             | Emoji |
| ------------ | ----------------- | ----- |
| Created      | Blue (5814783)    | ✅    |
| Pending      | Yellow (16776960) | ⏳    |
| Under Review | Orange (16756480) | 👀    |
| AI Review    | Purple (11093254) | 🤖    |
| Processing   | Purple (11093254) | ⚙️    |
| Approved     | Green (65280)     | ✨    |
| Completed    | Green (65280)     | 🎉    |
| Rejected     | Red (16711680)    | ❌    |

## Troubleshooting

### Test Fails with 404 Error

**Problem**: Webhook URL is incorrect or webhook was deleted
**Solution**:

1. Go back to Discord Server Settings → Webhooks
2. Create a new webhook
3. Copy the URL again and update `env-config.js`

### Test Fails with 401 Error

**Problem**: Webhook token is invalid
**Solution**:

1. Delete the webhook and create a new one
2. Copy the complete URL carefully
3. Make sure there are no extra spaces or characters

### No Messages Appearing in Discord

**Problem**: Webhook exists but messages aren't sending
**Solution**:

1. Check browser console for JavaScript errors (F12)
2. Run `await window.discord.testWebhook()` to see detailed errors
3. Verify the Discord channel permissions allow the webhook to post
4. Check that the webhook channel still exists

### Messages Stopped Appearing

**Problem**: Webhook was deleted or Discord permissions changed
**Solution**:

1. Create a new webhook (Discord automatically deletes unused ones after ~90 days)
2. Update the URL in `env-config.js`
3. Test with console command

## Security Notes

⚠️ **Important**: Keep your webhook URL safe!

- ✅ Safe to commit to GitHub (Discord will rotate it if leaked)
- ✅ Safe to use in client-side JavaScript
- ⚠️ If compromised, anyone can post to your webhook
- 🔄 You can regenerate webhook URLs in Discord if needed

## Advanced: Bulk Notifications

For testing or bulk updates, you can send multiple notifications:

```javascript
const submissions = [
  {
    username: "user1",
    challengeId: "challenge1",
    status: "completed",
    feedback: "Great work!",
  },
  {
    username: "user2",
    challengeId: "challenge2",
    status: "pending",
    feedback: "",
  },
  {
    username: "user3",
    challengeId: "challenge3",
    status: "rejected",
    feedback: "Needs improvement",
  },
];

await window.discord.sendBulkDiscordNotifications(submissions);
```

## Integration Points

The Discord webhook is integrated at these points in the codebase:

### [js/submissions.js](js/submissions.js)

1. **Line ~95** - When new submission is created via `submitChallenge()`
   - Calls: `window.discord.notifyCreated()`

2. **Line ~605** - When AI review completes via `requestAiReview()`
   - Calls: `window.discord.notifyAIReview()`

3. **Line ~328** - When status is updated via `updateSubmissionStatus()`
   - Calls: `window.discord.notifySubmissionUpdate()`

### [js/discord-webhook.js](js/discord-webhook.js)

Core webhook functionality with functions:

- `sendDiscordNotification()` - Main function to send embed to Discord
- `getDiscordWebhookUrl()` - Retrieves URL from environment
- `getStatusEmoji()` - Returns emoji based on status
- `getStatusColor()` - Returns color code for embed
- `getStatusLabel()` - Returns human-readable status text
- `testDiscordWebhookConnection()` - Connection test function

## Environment Configuration

The webhook URL is loaded from `window.ENV.VITE_DISCORD_WEBHOOK_URL` which is set in:

**[js/env-config.js](js/env-config.js)**

```javascript
window.ENV = {
  VITE_SUPABASE_URL: "...",
  VITE_SUPABASE_ANON_KEY: "...",
  VITE_GROQ_API_KEY: "...",
  VITE_DISCORD_WEBHOOK_URL: "https://your-webhook-url-here",
};
```

For Vercel deployments:

1. Add `VITE_DISCORD_WEBHOOK_URL` as an environment variable in Vercel settings
2. The build process will inject it into the page during deployment

## Deployment to Vercel

### Steps:

1. **Add Environment Variable**
   - Go to Vercel Project Settings → Environment Variables
   - Add: `VITE_DISCORD_WEBHOOK_URL` = your webhook URL
   - Save

2. **Deploy**
   - Commit and push to your main branch
   - Vercel automatically redeploys
   - Discord notifications will work immediately

3. **Verify**
   - After deployment, check your Discord channel
   - When a submission is made or updated, you should see the notification

## FAQ

**Q: Will Discord notifications work on my local development?**
A: Yes! As long as you have the webhook URL in `env-config.js` and reload the page.

**Q: Can I use multiple Discord channels?**
A: Yes, create multiple webhooks (one per channel) and you can modify the code to send to different webhooks based on submission type.

**Q: What if the Discord notification fails?**
A: The application continues working normally - Discord notifications are non-critical and won't block submissions or reviews.

**Q: Can admins see who submitted via Discord?**
A: Yes, the username is included in every notification along with the challenge ID.

**Q: Are old notifications retained in Discord?**
A: Yes, Discord keeps messages indefinitely (unless deleted). Discord auto-archives old channels after 6 months of inactivity.

## Next Steps

1. ✅ Create Discord webhook
2. ✅ Add URL to `env-config.js`
3. ✅ Test with console command
4. ✅ Deploy to production
5. ✅ Monitor submissions in Discord channel

## Support

For issues or questions:

1. Check Troubleshooting section above
2. Review browser console for errors (F12)
3. Test webhook directly at step 3.1
4. Verify Discord permissions on the webhook
5. Regenerate webhook if older than 90 days
