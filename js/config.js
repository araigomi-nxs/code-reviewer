/**
 * Configuration File
 * Set your Groq API key here if .env.local cannot be loaded
 */

// Your Groq API key (set this if .env.local loading fails)
// Get a free API key from: https://console.groq.com/keys
const GROQ_API_KEY = 'your-groq-api-key-here';

// Auto-setup on page load
function setupConfig() {
    if (GROQ_API_KEY && !localStorage.getItem('groq_api_key')) {
        localStorage.setItem('groq_api_key', GROQ_API_KEY);
        console.log('✅ Groq API key configured from config.js');
    }
}

// Setup on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupConfig);
} else {
    setupConfig();
}
