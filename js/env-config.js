/**
 * Environment Configuration
 * 
 * IMPORTANT: Replace the placeholder keys with your own values:
 * 1. Get Supabase keys from: https://app.supabase.com → Your Project → Settings → API
 * 2. Get Groq API key from: https://console.groq.com/keys
 * 3. Get Discord webhook URL from Discord Server Settings → Integrations → Webhooks
 * 4. Update the values below
 * 5. Reload the page (browser will pick up changes)
 * 
 * To deploy to Vercel:
 * 1. Update this file with your keys
 * 2. Commit and push to main
 * 3. Vercel auto-deploys
 * 
 * See ENVIRONMENT_SETUP.md and DISCORD_WEBHOOK_SETUP.md for detailed instructions
 */

window.ENV = {
    // Replace with your Supabase URL from https://app.supabase.com
    VITE_SUPABASE_URL: 'https://your-project-id.supabase.co',
    
    // Replace with your Supabase ANON_KEY from https://app.supabase.com → Settings → API
    VITE_SUPABASE_ANON_KEY: 'your-supabase-anon-key-here',
    
    // Replace with your Groq API key from https://console.groq.com/keys
    VITE_GROQ_API_KEY: 'your-groq-api-key-here',
    
    // Replace with your Discord Webhook URL from Discord Server Settings
    // Steps to create:
    // 1. Open your Discord server
    // 2. Go to Server Settings → Integrations → Webhooks
    // 3. Click "New Webhook"
    // 4. Give it a name (e.g., "Coding Reviewer Bot")
    // 5. Select the channel where notifications should go
    // 6. Click "Copy Webhook URL"
    // 7. Paste it below (replace the entire placeholder URL)
    VITE_DISCORD_WEBHOOK_URL: 'https://discordapp.com/api/webhooks/your-webhook-id/your-webhook-token'
};

console.log('✅ Environment variables loaded from env-config.js');

// Diagnostic helper for troubleshooting configuration
window.checkEnvSetup = function() {
    console.log('🔍 === ENVIRONMENT SETUP CHECK ===');
    console.log('Supabase URL configured:', window.ENV.VITE_SUPABASE_URL !== 'https://your-project-id.supabase.co');
    console.log('Supabase Key configured:', window.ENV.VITE_SUPABASE_ANON_KEY !== 'your-supabase-anon-key-here');
    console.log('Groq API Key configured:', window.ENV.VITE_GROQ_API_KEY !== 'your-groq-api-key-here');
    console.log('Discord Webhook configured:', window.ENV.VITE_DISCORD_WEBHOOK_URL !== 'https://discordapp.com/api/webhooks/your-webhook-id/your-webhook-token');
    console.log('');
    console.log('Discord Webhook URL:', window.ENV.VITE_DISCORD_WEBHOOK_URL);
    console.log('🔍 === END CHECK ===');
};