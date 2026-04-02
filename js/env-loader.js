/**
 * Load environment variables from .env.local file
 */

// Initialize environment variables
window.ENV = window.ENV || {};

/**
 * Load and parse .env.local file
 */
async function loadEnvVariables() {
    // Try multiple possible paths
    const pathsToTry = [
        './.env',
        '../.env',
        './../../.env'
    ];
    
    for (const path of pathsToTry) {
        try {
            const response = await fetch(path);
            if (!response.ok) continue;
            
            const envContent = await response.text();
            const lines = envContent.split('\n');
            
            lines.forEach(line => {
                line = line.trim();
                // Skip empty lines and comments
                if (!line || line.startsWith('#')) return;
                
                const [key, value] = line.split('=');
                if (key && value) {
                    window.ENV[key.trim()] = value.trim();
                }
            });
            
            // Set Groq API key if available and not already stored
            if (window.ENV.VITE_GROQ_API_KEY && !localStorage.getItem('groq_api_key')) {
                localStorage.setItem('groq_api_key', window.ENV.VITE_GROQ_API_KEY);
                console.log('✅ Groq API key loaded from .env');
            }
            
            console.log('✅ Environment variables loaded from:', path);
            return; // Success, exit after first successful load
        } catch (error) {
            // Try next path
            continue;
        }
    }
    
    console.warn('⚠️ Could not load .env file from any path');
}

// Load env variables on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEnvVariables);
} else {
    loadEnvVariables();
}
