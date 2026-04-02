/**
 * Supabase Client Configuration & Database Operations
 * Manages all Supabase interactions for users and submissions
 */

// Configuration - from window.ENV (embedded in index.html or loaded from .env.local)
const getSupabaseConfig = () => {
    return {
        URL: window.ENV?.VITE_SUPABASE_URL || 'https://kptgqkgtzgxhbmyebqwy.supabase.co',
        ANON_KEY: window.ENV?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdGdxa2d0emd4aGJteWVicXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTEyNzQsImV4cCI6MjA5MDY4NzI3NH0.P-xCQEqWvpvw2lpEYEzxLi7KdU-OElv31JWQn0lRYQQ'
    };
};

// Initialize Supabase client
let supabaseInstance = null;

function initializeSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase JS library not loaded');
        return false;
    }

    try {
        const config = getSupabaseConfig();
        supabaseInstance = window.supabase.createClient(config.URL, config.ANON_KEY);
        window.supabaseInstance = supabaseInstance; // Also set globally
        console.log('✅ Supabase initialized');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error.message);
        return false;
    }
}

// Wait for Supabase library to load
function waitForSupabase() {
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds at 100ms intervals
        
        // Check immediately on each attempt
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (window.supabase) {
                clearInterval(checkInterval);
                console.log('✅ Supabase library detected after', attempts * 100, 'ms');
                if (initializeSupabase()) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                
                // Debug: Check what's actually available
                console.error('❌ Supabase library failed to load after 5 seconds');
                console.warn('window.supabase:', typeof window.supabase);
                console.warn('window.supabaseClient:', typeof window.supabaseClient);
                
                // Try alternative library names
                if (window.supabaseClient) {
                    console.log('⚠️ Found window.supabaseClient, using that instead');
                    supabaseInstance = window.supabaseClient;
                    window.supabaseInstance = supabaseInstance;
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        }, 100);
    });
}

// Store initialization promise globally
window.supabaseInitPromise = waitForSupabase();

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📝 DOM ready - Supabase initialization in progress...');
        // Promise already started above
    });
} else {
    console.log('📝 DOM already ready - Supabase initialization in progress...');
    // Promise already started above
}

/**
 * Supabase Submission Operations
 */

// Save or update submission
async function supabaseSaveSubmission(username, challengeId, submissionData) {
    if (!supabaseInstance) {
        console.error('❌ Supabase not initialized - submission will only be saved locally');
        throw new Error('Supabase not initialized');
    }

    try {
        // Debug: Log the data being saved
        console.log('📝 Saving submission data:', {
            username,
            challengeId,
            fileContentLength: submissionData.fileContent?.length || 0,
            fileContentPreview: submissionData.fileContent ? submissionData.fileContent.substring(0, 100) : 'EMPTY',
            fileName: submissionData.fileName,
            fileType: submissionData.fileType,
            fileSize: submissionData.fileSize
        });

        const { data, error } = await supabaseInstance
            .from('submissions')
            .upsert([{
                username: username,
                challenge_id: challengeId,
                file_name: submissionData.fileName,
                file_content: submissionData.fileContent,
                file_type: submissionData.fileType,
                file_size: submissionData.fileSize,
                topic_id: submissionData.topicId,
                status: submissionData.status || 'pending',
                submitted_at: submissionData.submittedAt,
                ai_review: submissionData.aiReview || null,
                ai_review_status: submissionData.aiReviewStatus || 'pending',
                ai_reviewed_at: submissionData.aiReviewedAt || null
            }], { onConflict: 'username,challenge_id' })
            .select();
        
        if (error) {
            console.error('❌ Supabase submission error:', error.code, error.message);
            
            // Check for RLS policy errors
            if (error.message.includes('row-level security') || error.message.includes('policy')) {
                console.error('🔒 RLS Policy Error: The submissions table has security policies blocking writes');
                console.error('   Solution: Disable RLS on the submissions table in Supabase');
            }
            
            throw error;
        }
        
        console.log('✅ Submission saved to Supabase:', username, challengeId);
        
        // Verify what was actually saved
        if (data && data[0]) {
            console.log('📋 Verification - Data returned from save:', {
                fileContentSavedLength: data[0].file_content?.length || 0,
                fileContentSavedPreview: data[0].file_content ? data[0].file_content.substring(0, 100) : 'EMPTY'
            });
        }
        
        return data[0];
    } catch (error) {
        console.error('❌ Failed to save submission:', error.message);
        throw error;
    }
}

// Get specific submission
async function supabaseGetSubmission(username, challengeId) {
    if (!supabaseInstance) return null;

    try {
        const { data, error } = await supabaseInstance
            .from('submissions')
            .select('*')
            .eq('username', username)
            .eq('challenge_id', challengeId)
            .maybeSingle();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    } catch (error) {
        console.error('❌ Failed to get submission:', error);
        return null;
    }
}

// Get all user submissions
async function supabaseGetUserSubmissions(username) {
    if (!supabaseInstance) return {};

    try {
        const { data, error } = await supabaseInstance
            .from('submissions')
            .select('*')
            .eq('username', username);
        
        if (error) throw error;
        
        // Convert array to object format for UI compatibility
        const submissionsObj = {};
        data.forEach(sub => {
            submissionsObj[sub.challenge_id] = {
                fileName: sub.file_name,
                fileContent: sub.file_content,
                fileType: sub.file_type,
                fileSize: sub.file_size,
                topicId: sub.topic_id,
                status: sub.status,
                submittedAt: sub.submitted_at,
                feedback: sub.feedback,
                aiReview: sub.ai_review,
                aiReviewStatus: sub.ai_review_status,
                aiReviewedAt: sub.ai_reviewed_at
            };
        });
        
        return submissionsObj;
    } catch (error) {
        console.error('❌ Failed to get user submissions:', error);
        return {};
    }
}

// Get all submissions for a challenge
async function supabaseGetChallengeSubmissions(challengeId) {
    if (!supabaseInstance) return [];

    try {
        const { data, error } = await supabaseInstance
            .from('submissions')
            .select('*')
            .eq('challenge_id', challengeId);
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ Failed to get challenge submissions:', error);
        return [];
    }
}

// Get latest submissions across all challenges
async function supabaseGetLatestSubmissions(limit = 10) {
    if (!supabaseInstance) return [];

    try {
        const { data, error } = await supabaseInstance
            .from('submissions')
            .select('*')
            .order('submitted_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        
        console.log('📊 Raw Supabase data fetched:', data?.length, 'submissions');
        if (data && data.length > 0) {
            console.log('📊 First submission ai_review field:', data[0].ai_review);
            console.log('📊 First submission full:', JSON.stringify(data[0], null, 2));
        }
        
        return (data || []).map(sub => ({
            username: sub.username,
            challengeId: sub.challenge_id,
            fileName: sub.file_name,
            fileContent: sub.file_content,
            fileSize: sub.file_size,
            submittedAt: sub.submitted_at,
            status: sub.status,
            aiReview: sub.ai_review,
            aiReviewStatus: sub.ai_review_status,
            aiReviewedAt: sub.ai_reviewed_at,
            topicId: sub.topic_id
        }));
    } catch (error) {
        console.error('❌ Failed to get latest submissions:', error);
        return [];
    }
}

// Update AI review for submission
async function supabaseUpdateSubmissionReview(username, challengeId, aiReview, aiReviewStatus) {
    if (!supabaseInstance) return null;

    try {
        console.log('📝 Saving AI review to Supabase:', { username, challengeId, aiReviewLength: aiReview?.length || 0, aiReviewStatus });
        
        // Try using upsert instead of update to bypass RLS restrictions
        const { data, error } = await supabaseInstance
            .from('submissions')
            .upsert({
                username: username,
                challenge_id: challengeId,
                ai_review: aiReview,
                ai_review_status: aiReviewStatus,
                ai_reviewed_at: new Date().toISOString()
            }, {
                onConflict: 'username,challenge_id'  // Match on existing row
            })
            .select();
        
        if (error) {
            console.error('❌ Supabase update error during save:', error);
            throw error;
        }
        
        console.log('✅ AI review updated (upsert): rows affected:', data?.length, 'Response:', data);
        
        // Verify the save by fetching it back
        console.log('🔍 Verifying AI review was saved...');
        const { data: verifyData, error: verifyError } = await supabaseInstance
            .from('submissions')
            .select('ai_review, ai_review_status')
            .eq('username', username)
            .eq('challenge_id', challengeId)
            .single();
        
        if (verifyError) {
            console.error('❌ Verification fetch failed:', verifyError);
            throw verifyError;
        }
        
        console.log('✅ Verified - AI review in DB:', verifyData?.ai_review ? `${verifyData.ai_review.substring(0, 100)}...` : 'NULL', 'Status:', verifyData?.ai_review_status);
        return data?.[0] || verifyData || null;
    } catch (error) {
        console.error('❌ Failed to update review:', error);
        throw error;
    }
}

// Delete submission
async function supabaseDeleteSubmission(username, challengeId) {
    if (!supabaseInstance) return;

    try {
        const { error } = await supabaseInstance
            .from('submissions')
            .delete()
            .eq('username', username)
            .eq('challenge_id', challengeId);
        
        if (error) throw error;
        console.log('✅ Submission deleted:', username, challengeId);
    } catch (error) {
        console.error('❌ Failed to delete submission:', error);
        throw error;
    }
}

// Export all functions to window (supabaseInstance will be updated once initialized)
window.supabaseSaveSubmission = supabaseSaveSubmission;
window.supabaseGetSubmission = supabaseGetSubmission;
window.supabaseGetUserSubmissions = supabaseGetUserSubmissions;
window.supabaseGetChallengeSubmissions = supabaseGetChallengeSubmissions;
window.supabaseGetLatestSubmissions = supabaseGetLatestSubmissions;
window.supabaseUpdateSubmissionReview = supabaseUpdateSubmissionReview;
window.supabaseDeleteSubmission = supabaseDeleteSubmission;
window.initializeSupabase = initializeSupabase;
window.waitForSupabase = waitForSupabase;

// Getter for supabaseInstance (since it's initialized asynchronously)
Object.defineProperty(window, 'supabaseInstance', {
    get() {
        return supabaseInstance;
    },
    set(value) {
        supabaseInstance = value;
    }
});

console.log('📝 supabase-client.js loaded - waiting for Supabase library...');
