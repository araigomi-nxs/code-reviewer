/**
 * Load environment variables from .env.local file or window.ENV (from build)
 */

// Initialize environment variables
window.ENV = window.ENV || {};

/**
 * Load and parse .env.local file (fallback for local development)
 * This is skipped if env-config.js already set window.ENV
 */
async function loadEnvVariables() {
    // If window.ENV already has Groq API key (from env-config.js at build time), we're done
    if (window.ENV.VITE_GROQ_API_KEY) {
        console.log('✅ Environment variables already injected via build process');
        
        // Store in localStorage for easier access
        if (!localStorage.getItem('groq_api_key')) {
            localStorage.setItem('groq_api_key', window.ENV.VITE_GROQ_API_KEY);
            console.log('✅ Groq API key stored in localStorage');
        }
        return;
    }
    
    // Fallback: Try to fetch .env file (for local development only)
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
    
    console.warn('⚠️ Could not load .env file - using localStorage fallback');
}

// Load env variables on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEnvVariables);
} else {
    loadEnvVariables();
}
