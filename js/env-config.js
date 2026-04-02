/**
 * Environment Configuration
 * 
 * IMPORTANT: Replace the placeholder keys with your own values:
 * 1. Get Supabase keys from: https://app.supabase.com → Your Project → Settings → API
 * 2. Get Groq API key from: https://console.groq.com/keys
 * 3. Update the values below
 * 4. Reload the page (browser will pick up changes)
 * 
 * To deploy to Vercel:
 * 1. Update this file with your keys
 * 2. Commit and push to main
 * 3. Vercel auto-deploys
 * 
 * See ENVIRONMENT_SETUP.md for detailed instructions
 */

window.ENV = {
    // Replace with your Supabase URL from https://app.supabase.com
    VITE_SUPABASE_URL: 'https://your-project-id.supabase.co',
    
    // Replace with your Supabase ANON_KEY from https://app.supabase.com → Settings → API
    VITE_SUPABASE_ANON_KEY: 'your-supabase-anon-key-here',
    
    // Replace with your Groq API key from https://console.groq.com/keys
    VITE_GROQ_API_KEY: 'your-groq-api-key-here'
};
console.log('✅ Environment variables injected by build');