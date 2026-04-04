# Vercel Environment Variables Setup

This guide explains how to configure your Vercel deployment with the Judge0 API key for Java code execution.

## Overview

Your code reviewer now uses a **Vercel serverless function** (`/api/judge0-proxy.js`) to securely handle Java code execution. The API key stays on the server side only - never exposed to the client.

## Setup Steps

### 1. Get a Judge0 API Key

1. Go to https://rapidapi.com/judge0-official/api/judge0
2. Click **"Subscribe to Test"** (free tier available)
3. You'll get your API key in the dashboard
4. Copy your API key

### 2. Add to Vercel Environment Variables

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your **code-reviewer** project
3. Click **Settings** tab
4. Go to **Environment Variables** section
5. Click **Add New**
6. Fill in:
   - **Name:** `JUDGE0_API_KEY`
   - **Value:** (paste your API key from step 1)
   - **Environments:** Select all (Production, Preview, Development)
7. Click **Save**
8. **Redeploy** your project for changes to take effect
   - Go to **Deployments** tab
   - Click the three dots on latest deployment
   - Select **Redeploy**

#### Option B: Via Vercel CLI

```bash
vercel env add JUDGE0_API_KEY
```

Then paste your API key when prompted.

### 3. Verify Setup

After deployment:

1. Go to your code reviewer website
2. Try running some Java code
3. Check browser console for logs (F12 → Console)
4. You should see: `📤 Sending Java code to Vercel proxy...`

## How It Works

```
Browser (Client)
    ↓ POST /api/judge0-proxy
    ↓ (no API key exposed)
Vercel Serverless Function
    ↓ Uses JUDGE0_API_KEY from environment
    ↓
Judge0 API
    ↓
    ↓ Returns execution result
Vercel Serverless Function
    ↓ Formats result
Browser (Client)
    ↓ Displays output
```

## Troubleshooting

### "Setup Required: Add JUDGE0_API_KEY to your Vercel environment variables"

- You haven't set the environment variable yet
- OR you set it but didn't redeploy (see "Redeploy" step above)

### "Execution timeout"

- Judge0 API is slow or overloaded
- Try again in a few seconds
- If persistent, you may have exceeded free tier rate limits (upgrade on RapidAPI)

### "Compilation Error" or "Runtime Error"

- This is a Java code error, not a setup issue
- Check your Java code syntax

## Local Development

For local testing without Vercel, add to your `.env` file:

```
JUDGE0_API_KEY=your_api_key_here
```

Then run your project locally.

## Environment File Documentation

Your `vercel.json` now includes:

```json
{
  "env": {
    "JUDGE0_API_KEY": {
      "description": "Judge0 RapidAPI key for Java code execution"
    }
  },
  "functions": {
    "api/judge0-proxy.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

This documents:

- **Required environment variables** for deployment
- **Function settings**: 1024MB memory, 60-second timeout

## Rate Limits

Judge0 free tier has rate limits:

- Generous limits for free tier usage
- If you exceed them, upgrade on RapidAPI or implement request caching

## Security

Your setup is now **more secure** because:

- ✅ API key stored only on Vercel servers
- ✅ Never exposed to client-side code
- ✅ API calls go through your serverless function
- ✅ No credentials in version control
