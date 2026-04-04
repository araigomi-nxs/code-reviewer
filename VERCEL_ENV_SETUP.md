# Groq Code Runner - Environment Setup

Your code reviewer uses **Groq AI** for free Java code execution. You already have `VITE_GROQ_API_KEY` configured – no additional setup needed!

## Current Setup

✅ `VITE_GROQ_API_KEY` is already in your Vercel environment  
✅ The serverless function uses this key automatically  
✅ Code runner works out of the box

## How It Works

```
Your Browser
   ↓
   POST /api/groq-code-runner (with Java code)
   ↓
Vercel Serverless Function
   ↓ Uses VITE_GROQ_API_KEY from environment
   ↓
Groq AI API
   ↓ Interprets and executes Java code
   ↓
Returns Output
   ↓
Your Browser (displays result)
```

## Test It

1. Go to your code reviewer website
2. Try running Java code: `System.out.println("Hello");`
3. Check browser console (F12 → Console)
4. You should see: `🤖 Sending Java code to Groq executor...`

## Groq Features

- **Free tier**: 10,000 requests/day (more than enough)
- **Fast inference**: Groq uses specialized hardware
- **AI interpretation**: Understands Java code semantics
- **No credit card**: Truly free

## If Code Runner Doesn't Work

Check that:

1. `VITE_GROQ_API_KEY` exists in Vercel environment variables
2. Your project is deployed to Vercel (code runner requires `/api/groq-code-runner`)
3. Groq quota not exceeded at https://console.groq.com

## Need to Update the Key?

If you need a new Groq API key:

1. Go to https://console.groq.com
2. Create a new API key
3. Update `VITE_GROQ_API_KEY` in Vercel dashboard
4. Redeploy your project

## About AI Interpretation vs Compilation

**Groq (AI Interpretation):**

- ✅ Free
- ✅ Handles most student code
- ⚠️ Edge cases with very complex code

**Judge0 (Real Compiler):**

- ✅ 100% accurate
- ❌ Limited free tier or paid
- ❌ More complexity

For a student code review platform, Groq is perfect!
