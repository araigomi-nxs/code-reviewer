# Environment Setup Guide

This guide shows you how to configure the required API keys for the Coding Study Reviewer.

## Overview

The application requires two services:

1. **Supabase** - Database and authentication
2. **Groq** - AI code review API

## Step 1: Get Supabase Keys

### Create/Access Supabase Project

1. Go to https://app.supabase.com
2. Sign in or create an account
3. Create a new project or select existing one
4. Wait for project initialization (2-3 minutes)

### Get Your API Keys

1. Click **Settings** (gear icon) in left sidebar
2. Click **API**
3. You'll see two keys:
   - **Project URL** - Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public** - Copy this JWT token

### Update env-config.js

Edit `js/env-config.js` and replace:

```javascript
VITE_SUPABASE_URL: 'https://your-project-id.supabase.co',
```

with your actual Project URL.

And replace:

```javascript
VITE_SUPABASE_ANON_KEY: 'your-supabase-anon-key-here',
```

with your actual anon public key.

## Step 2: Get Groq API Key

### Create Groq Account

1. Go to https://console.groq.com
2. Sign in or create an account
3. Navigate to **API Keys** section

### Generate API Key

1. Click **Create API Key**
2. Name it something like "code-reviewer"
3. Copy the generated key

### Update env-config.js

Edit `js/env-config.js` and replace:

```javascript
VITE_GROQ_API_KEY: "your-groq-api-key-here";
```

with your actual Groq API key.

## Step 3: Test Locally

1. Open the application in your browser
2. Do a hard refresh: **Ctrl + Shift + R** (Windows/Linux) or **Cmd + Shift + R** (Mac)
3. Open browser DevTools (F12)
4. Try logging in - you should see:
   - ✅ Supabase initialized
   - ✅ Login successful
   - No 401 errors

## Step 4: Deploy to Vercel (Optional)

The keys in `js/env-config.js` are automatically deployed with your code.

1. Commit your changes:

   ```bash
   git add js/env-config.js
   git commit -m "Add environment configuration"
   git push
   ```

2. Vercel automatically deploys on push
3. Your app will work on the live URL with the configured keys

## Troubleshooting

### "Supabase config missing" Error

- Check that `env-config.js` is loaded in `index.html`
- Verify the URL and ANON_KEY are correct (not placeholder text)
- Do a hard refresh: `Ctrl + Shift + R`

### "Invalid API key" from Supabase (401 Errors)

- Double-check your ANON_KEY is correct
- Make sure it's the "anon public" key, not the service role key
- Verify no extra spaces were copied

### "Invalid API key" from Groq (401 Errors)

- Verify your Groq API key is correct
- Check that your Groq account is active
- Ensure the key hasn't expired (reissue if needed)

### Changes not showing locally

- Hard refresh the page: `Ctrl + Shift + R`
- Clear browser cache (DevTools → Storage → Clear cache)
- Check browser console for errors

## File Locations

- **Configuration**: `js/env-config.js` - Edit this file with your keys
- **Supabase client**: `js/supabase-client.js` - Loads keys from `window.ENV`
- **Groq client**: `js/submissions.js` - Loads keys from `window.ENV`
- **HTML**: `index.html` - Ensures `env-config.js` loads first

## Security Notes

- ⚠️ **Never commit real API keys** to a public repository
- `env-config.js` is committed with placeholder values only
- Real keys should be:
  - Set locally in `js/env-config.js` (not tracked by git)
  - Set as environment variables on Vercel (separate from code)
- For production deployments with shared keys, use Vercel environment variables (see Vercel Settings)

## Support

If you encounter issues:

1. Check browser console (F12) for error messages
2. Verify all three values are set in `env-config.js` (no placeholder text)
3. Try a hard refresh and clear cache
4. Verify URL/keys are exactly correct (no extra spaces)
