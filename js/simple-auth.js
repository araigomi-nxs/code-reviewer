/**
 * Simple Username-Password Authentication
 * Uses Supabase exclusively for storage
 */

// Initialize global user state
if (!window.currentUser) {
    window.currentUser = null;
}

/**
 * Simple password hashing (not secure - for demo only)
 */
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * Get user's avatar image URL (from profile or null)
 */
function getUserAvatar(username = '') {
    const user = getCurrentUser();
    if (user && user.profile && user.profile.avatar_url) {
        return user.profile.avatar_url;
    }
    return null;
}

/**
 * Get user's avatar image URL from Supabase (async version for fetching other users)
 */
async function getUserAvatarUrl(username = '') {
    try {
        if (!window.supabaseInstance) {
            console.error('Supabase not initialized');
            return null;
        }
        
        // Get from users table where profile is stored
        const { data, error } = await window.supabaseInstance
            .from('users')
            .select('profile')
            .eq('username', username)
            .single();
        
        if (data && data.profile && data.profile.avatar_url) {
            return data.profile.avatar_url;
        }
        return null;
    } catch (error) {
        console.error('Error fetching avatar URL:', error);
        return null;
    }
}

/**
 * Get default avatar emoji for user
 */
function getDefaultAvatar(username = '') {
    const avatars = ['👨‍💻', '👩‍💻', '🧑‍💻', '💻', '🎯', '📚', '🚀', '⭐'];
    let hash = 0;
    if (username) {
        for (let i = 0; i < username.length; i++) {
            hash = ((hash << 5) - hash) + username.charCodeAt(i);
        }
    }
    const index = Math.abs(hash) % avatars.length;
    return avatars[index];
}

/**
 * Get random color for user avatar based on username
 */
function getUserAvatarColor(username = '') {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52C9A4'
    ];
    let hash = 0;
    if (username) {
        for (let i = 0; i < username.length; i++) {
            hash = ((hash << 5) - hash) + username.charCodeAt(i);
        }
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

/**
 * Get users from localStorage (deprecated - kept for backward compatibility only)
 */
function getUsers() {
    return {};
}

/**
 * Save users to localStorage (deprecated - no longer used)
 */
function saveUsers(users) {
    // Deprecated - all auth now goes to Supabase
}

/**
 * Sign up new user (saves to Supabase only)
 */
async function signUp(username, password, selectedAvatar) {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    if (!window.supabaseInstance) {
        throw new Error('Database connection not initialized. Please refresh the page.');
    }

    const hashedPassword = hashPassword(password);
    const userProfile = {
        username: username,
        is_admin: username === 'jamil', // Jamil is our admin user
        avatar_url: selectedAvatar || 'logo/usericon1.png',
        avatar_color: getUserAvatarColor(username)
    };

    try {
        const { data, error } = await window.supabaseInstance
            .from('users')
            .insert([{
                username: username,
                password: hashedPassword,
                profile: userProfile
            }])
            .select();

        if (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Username already exists');
            }
            throw error;
        }

        console.log('✅ User created in Supabase:', username);

        // Fire-and-forget Discord notification for new user signup.
        if (window.discord && window.discord.notifyUserJoined) {
            window.discord.notifyUserJoined(username).catch((discordError) => {
                console.warn('⚠️ Discord signup notification failed (non-critical):', discordError);
            });
        }

        // Auto-login after signup
        window.currentUser = {
            username: username,
            profile: userProfile
        };
        
        // Store user session in localStorage for persistence across page reloads
        localStorage.setItem('codereview_user_session', JSON.stringify(window.currentUser));
        localStorage.setItem('codereview_current_user', username); // For backward compatibility
        return window.currentUser;
    } catch (error) {
        console.error('❌ Sign up failed:', error.message);
        throw error;
    }
}

/**
 * Log in user (uses Supabase only)
 */
async function logIn(username, password) {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const hashedPassword = hashPassword(password);

    if (!window.supabaseInstance) {
        throw new Error('Database connection not initialized. Please refresh the page.');
    }

    try {
        const { data, error } = await window.supabaseInstance
            .from('users')
            .select('*')
            .eq('username', username)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (!data) {
            throw new Error('User not found');
        }

        if (data.password !== hashedPassword) {
            throw new Error('Incorrect password');
        }

        console.log('✅ User logged in from Supabase:', username);
        window.currentUser = {
            username: username,
            profile: data.profile
        };
        
        // Store user session in localStorage for persistence across page reloads
        localStorage.setItem('codereview_user_session', JSON.stringify(window.currentUser));
        localStorage.setItem('codereview_current_user', username); // For backward compatibility
        return window.currentUser;
    } catch (error) {
        console.error('❌ Login failed:', error.message);
        throw error;
    }
}

/**
 * Log out current user
 */
async function logOut() {
    window.currentUser = null;
    localStorage.removeItem('codereview_user_session');
    localStorage.removeItem('codereview_current_user');
    console.log('❌ User logged out');
}

/**
 * Get current user (from memory or localStorage session)
 */
function getCurrentUser() {
    // Check if user is stored in memory (current session)
    if (window.currentUser) {
        return window.currentUser;
    }

    // Check localStorage for session persistence (after page reload)
    const storedUser = localStorage.getItem('codereview_user_session');
    if (storedUser) {
        try {
            window.currentUser = JSON.parse(storedUser);
            return window.currentUser;
        } catch (error) {
            console.warn('⚠️ Failed to restore user session from localStorage');
        }
    }

    return null;
}

/**
 * Check if user is admin
 */
function isUserAdmin() {
    // Check if user is marked as admin in profile or if username is jamil
    return (window.currentUser?.profile?.is_admin === true) || (window.currentUser?.username === 'jamil');
}

/**
 * Update user profile (Supabase only)
 */
async function updateUserProfile(username, updates) {
    if (!window.supabaseInstance) {
        throw new Error('Database connection not initialized');
    }

    try {
        const { data: userData, error: fetchError } = await window.supabaseInstance
            .from('users')
            .select('profile')
            .eq('username', username)
            .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        if (!userData) {
            throw new Error('User not found');
        }

        const updatedProfile = { ...userData.profile, ...updates };

        const { error } = await window.supabaseInstance
            .from('users')
            .update({ profile: updatedProfile })
            .eq('username', username);

        if (error) {
            throw error;
        }

        // Update in-memory user
        if (window.currentUser?.username === username) {
            window.currentUser.profile = updatedProfile;
        }

        console.log('✅ Profile updated in Supabase:', username);
    } catch (error) {
        console.error('❌ Profile update failed:', error.message);
        throw error;
    }
}

/**
 * Create default admin account if it doesn't exist (Supabase only)
 */
async function initializeDefaultAdmin() {
    const adminUsername = 'admin';
    const adminPassword = '123456';
    const hashedPassword = hashPassword(adminPassword);

    if (!window.supabaseInstance) {
        console.warn('⚠️ Supabase not initialized, skipping admin account creation');
        return;
    }

    try {
        // Check if admin already exists
        const { data } = await window.supabaseInstance
            .from('users')
            .select('username')
            .eq('username', adminUsername)
            .maybeSingle();

        if (data) {
            console.log('👑 Default admin account already exists');
            return;
        }

        // Create admin account
        const { error } = await window.supabaseInstance
            .from('users')
            .insert([{
                username: adminUsername,
                password: hashedPassword,
                profile: {
                    username: adminUsername,
                    is_admin: true,
                    avatar_url: 'logo/usericon1.png',
                    avatar_color: getUserAvatarColor(adminUsername)
                }
            }]);

        if (error && error.code !== '23505') {
            throw error;
        }

        console.log('👑 Default admin account created in Supabase');
        console.log('   Username: admin');
        console.log('   Password: 123456');
    } catch (error) {
        console.error('❌ Failed to create default admin account:', error.message);
    }
}

/**
 * Initialize auth on page load (Supabase only)
 */
async function initializeAuth() {
    console.log('📝 simple-auth.js loaded - waiting for Supabase...');
    
    // Try to restore user session from localStorage first
    const storedSession = localStorage.getItem('codereview_user_session');
    if (storedSession) {
        try {
            window.currentUser = JSON.parse(storedSession);
            console.log('✅ User session restored:', window.currentUser.username);
            
            // Don't wait for Supabase if we have a cached session
            console.log('💡 Using cached user session');
            return;
        } catch (error) {
            console.warn('⚠️ Failed to restore session from localStorage');
        }
    }
    
    // Wait for Supabase initialization promise if it exists
    if (window.supabaseInitPromise) {
        console.log('⏱️ Waiting for Supabase initialization...');
        await window.supabaseInitPromise;
    }
    
    // Double-check Supabase is ready
    if (!window.supabaseInstance) {
        console.error('❌ Supabase failed to initialize');
        console.error('window.supabase:', typeof window.supabase);
        return;
    }
    
    console.log('✅ Supabase is ready');
    
    // Create default admin account if needed
    await initializeDefaultAdmin();
    
    // Note: Users must log in after page refresh
    // Session persistence is via localStorage
    console.log('💡 Users can use cached sessions or log in via Supabase');
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}

// Make functions globally available
window.signUp = signUp;
window.logIn = logIn;
window.logOut = logOut;
window.getCurrentUser = getCurrentUser;
window.isUserAdmin = isUserAdmin;
window.updateUserProfile = updateUserProfile;
window.initializeDefaultAdmin = initializeDefaultAdmin;
