const fs = require('fs');
const path = require('path');

const envConfig = `window.ENV = {
    VITE_SUPABASE_URL: '${process.env.VITE_SUPABASE_URL || ''}',
    VITE_SUPABASE_ANON_KEY: '${process.env.VITE_SUPABASE_ANON_KEY || ''}',
    VITE_GROQ_API_KEY: '${process.env.VITE_GROQ_API_KEY || ''}'
};
console.log('✅ Environment variables injected by Vercel build');`;

fs.writeFileSync(path.join(__dirname, 'js', 'env-config.js'), envConfig);
console.log('Created env-config.js successfully!');
