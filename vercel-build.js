const fs = require('fs');
const path = require('path');

let groq = process.env.VITE_GROQ_API_KEY || '';
let url = process.env.VITE_SUPABASE_URL || '';
let anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
let discordWebhook = process.env.VITE_DISCORD_WEBHOOK_URL || '';

// If running locally, read directly from .env file
try {
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('VITE_GROQ_API_KEY=')) groq = trimmed.substring(trimmed.indexOf('=') + 1);
        if (trimmed.startsWith('VITE_SUPABASE_URL=')) url = trimmed.substring(trimmed.indexOf('=') + 1);
        if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) anonKey = trimmed.substring(trimmed.indexOf('=') + 1);
        if (trimmed.startsWith('VITE_DISCORD_WEBHOOK_URL=')) discordWebhook = trimmed.substring(trimmed.indexOf('=') + 1);
    });
} catch (e) {
    // Ignore error, we might be on Vercel where .env doesn't exist
}

const envConfig = `window.ENV = {
    VITE_SUPABASE_URL: '${url}',
    VITE_SUPABASE_ANON_KEY: '${anonKey}',
    VITE_GROQ_API_KEY: '${groq}',
    VITE_DISCORD_WEBHOOK_URL: '${discordWebhook}'
};
console.log('✅ Environment variables injected by build');`;

fs.writeFileSync(path.join(__dirname, 'js', 'env-config.js'), envConfig);
console.log('Created env-config.js successfully!');
