/**
 * Authentication Functions
 */

/**
 * Sign up new user
 */
async function signUp(email, password, username) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) throw error;

        // Create profile
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: data.user.id,
                username: username,
                avatar_url: getDefaultAvatar(), // Using logo
                is_admin: false
            }]);

        if (profileError) throw profileError;

        showNotification('✅ Account created! Check your email to confirm.', 'success');
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Signup error:', error.message);
        showNotification(`❌ Signup failed: ${error.message}`, 'error');
        return { success: false, error };
    }
}

/**
 * Log in user
 */
async function logIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        showNotification('✅ Login successful!', 'success');
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Login error:', error.message);
        showNotification(`❌ Login failed: ${error.message}`, 'error');
        return { success: false, error };
    }
}

/**
 * Log out user
 */
async function logOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        showNotification('✅ Logged out!', 'success');
        closeAllModals();
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error.message);
        showNotification(`❌ Logout failed: ${error.message}`, 'error');
        return { success: false, error };
    }
}

/**
 * Get default avatar (logo placeholder)
 */
function getDefaultAvatar() {
    return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%232d2d2d%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2250%22 font-weight=%22bold%22 fill=%22%23fff%22 text-anchor=%22middle%22%3ECR%3C/text%3E%3C/svg%3E';
}

/**
 * Update user profile
 */
async function updateUserProfile(updates) {
    try {
        if (!currentUser) throw new Error('User not logged in');

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', currentUser.id);

        if (error) throw error;

        // Update local state
        currentUser.profile = { ...currentUser.profile, ...updates };
        showNotification('✅ Profile updated!', 'success');
        return { success: true };
    } catch (error) {
        console.error('Profile update error:', error.message);
        showNotification(`❌ Update failed: ${error.message}`, 'error');
        return { success: false, error };
    }
}

/**
 * Get user profile by ID
 */
async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Profile fetch error:', error.message);
        return null;
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-in-out;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

/**
 * Close all modal dialogs
 */
function closeAllModals() {
    document.querySelectorAll('[data-modal]').forEach(modal => {
        modal.style.display = 'none';
    });
}
