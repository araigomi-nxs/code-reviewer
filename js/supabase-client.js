/**
 * Supabase Client Configuration & Database Operations
 * Manages all Supabase interactions for users and submissions
 */

// Configuration - from window.ENV (loaded via env-config.js)
// env-config.js is loaded first in index.html
const getSupabaseConfig = () => {
    // window.ENV is set by env-config.js - update that file to change keys
    if (!window.ENV || !window.ENV.VITE_SUPABASE_URL || !window.ENV.VITE_SUPABASE_ANON_KEY) {
        throw new Error('❌ Supabase config missing! Check that env-config.js is loaded in index.html');
    }
    return {
        URL: window.ENV.VITE_SUPABASE_URL,
        ANON_KEY: window.ENV.VITE_SUPABASE_ANON_KEY
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
        
        // Setup real-time listener for instant updates
        setupRealtimeSubmissionsListener();
        
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
        console.log('📝 === SUPABASE SAVE OPERATION STARTING ===');
        console.log('Username:', username);
        console.log('Challenge ID:', challengeId);
        console.log('File name:', submissionData.fileName);
        console.log('File content type:', typeof submissionData.fileContent);
        console.log('File content length:', submissionData.fileContent?.length || 0);
        console.log('File content preview:', submissionData.fileContent ? submissionData.fileContent.substring(0, 100) : 'EMPTY/NULL');
        
        // CRITICAL CHECK
        if (!submissionData.fileContent || submissionData.fileContent.length === 0) {
            console.error('❌ CRITICAL: Attempting to save with EMPTY file_content!');
            console.error('   submissionData.fileContent:', submissionData.fileContent);
            console.error('   This WILL result in NULL/empty data in Supabase');
        }
        console.log('📝 === SENDING UPSERT TO SUPABASE ===');
        
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
            .select('*');
        
        if (error) {
            console.error('❌ Supabase submission error:', error.code, error.message);
            console.error('   Full error object:', error);
            
            // Check for RLS policy errors
            if (error.message.includes('row-level security') || error.message.includes('policy')) {
                console.error('🔒 RLS POLICY ERROR DETECTED');
                console.error('   This means Row-Level Security is blocking the write');
                console.error('   ');
                console.error('   SOLUTION:');
                console.error('   1. Go to Supabase Dashboard');
                console.error('   2. Select your project');
                console.error('   3. Go to Authentication → Policies (in the "submissions" table)');
                console.error('   4. If there are policies, you must either:');
                console.error('      - Temporarily disable RLS: Remove all policies');
                console.error('      - Create proper policies that allow inserts');
                console.error('   5. Or disable RLS entirely for testing');
            }
            
            // Check for column size limits
            if (error.message.includes('too long') || error.message.includes('violates')) {
                console.error('⚠️ DATA SIZE CONSTRAINT VIOLATED');
                console.error('   The file_content column might have a text size limit');
                console.error('   Check if the column is type "text" (unlimited) or "varchar(N)"');
            }
            
            throw error;
        }
        
        console.log('✅ Submission saved to Supabase:', username, challengeId);
        
        // Run diagnostic to verify data persisted correctly
        console.log('🔍 === IMMEDIATE VERIFICATION ===');
        console.log('Fetching data back from Supabase to verify...');
        await diagnosticCheckSubmissionInDB(username, challengeId);
        console.log('🔍 === END VERIFICATION ===\n');
        
        // Verify what was actually saved
        if (data && data[0]) {
            console.log('📋 Verification - Data returned from save:', {
                fileContentSavedLength: data[0].file_content?.length || 0,
                fileContentSavedPreview: data[0].file_content ? data[0].file_content.substring(0, 100) : 'EMPTY'
            });
        }
        
        // CRITICAL: Verify the data actually persisted by fetching it back immediately
        console.log('🔍 Double-checking saved data by fetching directly from DB...');
        const { data: verifyData, error: verifyError } = await supabaseInstance
            .from('submissions')
            .select('file_content, file_name, username, challenge_id')
            .eq('username', username)
            .eq('challenge_id', challengeId)
            .single();
        
        if (verifyError) {
            console.error('❌ Failed to verify saved data:', verifyError);
        } else {
            console.log('✅ Verification successful - file_content persisted:', {
                fileContentLength: verifyData?.file_content?.length || 0,
                fileContentPreview: verifyData?.file_content ? verifyData.file_content.substring(0, 100) : 'EMPTY',
                fileName: verifyData?.file_name
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

/**
 * DIAGNOSTIC: Inspect actual database content for a submission
 * Use this to debug what's actually stored in Supabase
 */
async function diagnosticCheckSubmissionInDB(username, challengeId) {
    if (!supabaseInstance) {
        console.error('❌ Supabase not initialized');
        return;
    }
    
    try {
        console.log('\n🔍 === DIAGNOSTIC CHECK ===');
        console.log('Looking for submission:', { username, challengeId });
        
        // Get the raw submission record
        const { data, error } = await supabaseInstance
            .from('submissions')
            .select('*')
            .eq('username', username)
            .eq('challenge_id', challengeId)
            .single();
        
        if (error) {
            console.error('❌ Query error:', error);
            return;
        }
        
        if (!data) {
            console.warn('⚠️ No submission found in database');
            return;
        }
        
        console.log('✅ Found submission record in DB');
        console.log('📊 ALL FIELDS:');
        console.log('  username:', data.username);
        console.log('  challenge_id:', data.challenge_id);
        console.log('  file_name:', data.file_name);
        console.log('  file_type:', data.file_type);
        console.log('  file_size:', data.file_size);
        console.log('  topic_id:', data.topic_id);
        console.log('  status:', data.status);
        console.log('  submitted_at:', data.submitted_at);
        console.log('  ai_review_status:', data.ai_review_status);
        console.log('  file_content type:', typeof data.file_content);
        console.log('  file_content length:', data.file_content?.length || 0);
        console.log('  file_content preview:', data.file_content ? data.file_content.substring(0, 200) : '❌ MISSING/NULL');
        console.log('  file_content is null:', data.file_content === null);
        console.log('  file_content is undefined:', data.file_content === undefined);
        console.log('  file_content == "":', data.file_content === '');
        console.log('🔍 === END DIAGNOSTIC ===\n');
        
    } catch (error) {
        console.error('❌ Diagnostic error:', error);
    }
}

/**
 * Real-time subscription for instant dashboard updates
 * Listens for INSERT, UPDATE, DELETE on submissions table
 */
let submissionsSubscription = null;

async function setupRealtimeSubmissionsListener() {
    if (!supabaseInstance) {
        console.warn('⚠️ Supabase not initialized, cannot setup real-time listener');
        return;
    }
    
    try {
        // Clean up any existing subscription
        if (submissionsSubscription) {
            console.log('🔄 Unsubscribing from previous listener...');
            submissionsSubscription.unsubscribe();
        }
        
        console.log('📡 Setting up real-time listener for submissions table...');
        
        submissionsSubscription = supabaseInstance
            .channel('submissions-channel')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'submissions'
                },
                (payload) => {
                    const eventType = payload.eventType; // INSERT, UPDATE, DELETE
                    const record = payload.new || payload.old;
                    
                    console.log('🔔 Real-time change detected:', {
                        type: eventType,
                        challenge: record.challenge_id,
                        username: record.username,
                        status: record.status
                    });
                    
                    // Show notification based on event type
                    let message = '🔄 ';
                    if (eventType === 'INSERT') {
                        message += 'New submission submitted';
                    } else if (eventType === 'UPDATE') {
                        if (record.status === 'completed') {
                            message += 'Submission approved!';
                        } else if (record.status === 'rejected') {
                            message += 'Submission rejected';
                        } else if (record.ai_review) {
                            message += 'AI review completed!';
                        } else {
                            message += 'Submission updated';
                        }
                    } else if (eventType === 'DELETE') {
                        message += 'Submission deleted';
                    }
                    
                    if (window.showNotification) {
                        window.showNotification(message, 'info');
                    }
                    
                    // Trigger instant dashboard refresh
                    if (window.displayLatestSubmissionsDashboard) {
                        console.log('🔄 Refreshing dashboard instantly...');
                        window.displayLatestSubmissionsDashboard();
                    }
                    
                    // Also refresh admin dashboard if open
                    if (window.loadAdminDashboard) {
                        console.log('🔄 Refreshing admin dashboard instantly...');
                        window.loadAdminDashboard();
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Real-time listener SUBSCRIBED - instant updates enabled');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Real-time channel error');
                } else if (status === 'TIMED_OUT') {
                    console.warn('⚠️ Real-time subscription timed out, retrying...');
                    setTimeout(() => setupRealtimeSubmissionsListener(), 5000);
                }
            });
    } catch (error) {
        console.error('❌ Failed to setup real-time listener:', error);
    }
}

/**
 * Study Notes & Resources Management
 * Handles persistent storage of notes and learning resources in Supabase
 */

// Save or update study notes
async function supabaseSaveStudyNotes(username, topicId, notesContent) {
    if (!supabaseInstance) {
        console.error('❌ Supabase not initialized');
        throw new Error('Supabase not initialized');
    }

    try {
        console.log('📝 Saving study notes:', { username, topicId, contentLength: notesContent?.length || 0 });

        const { data, error } = await supabaseInstance
            .from('study_notes')
            .upsert([{
                username: username,
                topic_id: topicId,
                notes_content: notesContent || '',
                updated_at: new Date().toISOString()
            }], { onConflict: 'username,topic_id' })
            .select('*');

        if (error) {
            console.error('❌ Failed to save notes:', error);
            throw error;
        }

        console.log('✅ Study notes saved:', { username, topicId, dataLength: data?.length || 0 });
        return data?.[0] || null;
    } catch (error) {
        console.error('❌ Error saving study notes:', error.message);
        throw error;
    }
}

// Get study notes for a topic (GLOBAL - all users can see all notes)
async function supabaseGetStudyNotes(username, topicId) {
    if (!supabaseInstance) return [];

    try {
        // Note: username parameter kept for backward compatibility
        // All users can see all notes for this topic (GLOBAL MODE)
        // Returns array of all notes for the topic (one per user)
        const { data, error } = await supabaseInstance
            .from('study_notes')
            .select('*')
            .eq('topic_id', topicId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ Failed to get study notes:', error);
        return [];
    }
}

// Save a study resource (image, video link, or file)
async function supabaseSaveStudyResource(username, topicId, resourceData) {
    if (!supabaseInstance) {
        console.error('❌ Supabase not initialized');
        throw new Error('Supabase not initialized');
    }

    try {
        console.log('📦 Saving resource:', { username, topicId, resourceType: resourceData.type });

        const { data, error } = await supabaseInstance
            .from('study_resources')
            .insert([{
                username: username,
                topic_id: topicId,
                resource_type: resourceData.type,
                resource_name: resourceData.name,
                resource_url: resourceData.url || null,
                resource_data: resourceData.data || null,
                resource_size: resourceData.size || null,
                created_at: new Date().toISOString()
            }])
            .select('*');

        if (error) {
            console.error('❌ Failed to save resource:', error);
            throw error;
        }

        console.log('✅ Resource saved:', { resourceId: data?.[0]?.id, resourceName: resourceData.name });
        return data?.[0] || null;
    } catch (error) {
        console.error('❌ Error saving resource:', error.message);
        throw error;
    }
}

// Get all study resources for a topic (GLOBAL - all users can see all resources)
async function supabaseGetStudyResources(username, topicId) {
    if (!supabaseInstance) return [];

    try {
        // Note: username parameter kept for backward compatibility
        // All users can see all resources for this topic (GLOBAL MODE)
        const { data, error } = await supabaseInstance
            .from('study_resources')
            .select('*')
            .eq('topic_id', topicId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ Failed to get study resources:', error);
        return [];
    }
}

// Delete a study resource
async function supabaseDeleteStudyResource(resourceId) {
    if (!supabaseInstance) return;

    try {
        console.log('🗑️ Deleting resource:', resourceId);

        const { error } = await supabaseInstance
            .from('study_resources')
            .delete()
            .eq('id', resourceId);

        if (error) throw error;
        console.log('✅ Resource deleted:', resourceId);
    } catch (error) {
        console.error('❌ Failed to delete resource:', error);
        throw error;
    }
}

// Delete all resources for a topic
async function supabaseDeleteStudyResourcesByTopic(username, topicId) {
    if (!supabaseInstance) return;

    try {
        console.log('🗑️ Deleting all resources for topic:', topicId);

        const { error } = await supabaseInstance
            .from('study_resources')
            .delete()
            .eq('username', username)
            .eq('topic_id', topicId);

        if (error) throw error;
        console.log('✅ All resources deleted for topic:', topicId);
    } catch (error) {
        console.error('❌ Failed to delete resources:', error);
        throw error;
    }
}

// Export real-time functions
window.setupRealtimeSubmissionsListener = setupRealtimeSubmissionsListener;

// Export all functions to window (supabaseInstance will be updated once initialized)
window.supabaseSaveSubmission = supabaseSaveSubmission;
window.supabaseGetSubmission = supabaseGetSubmission;
window.supabaseGetUserSubmissions = supabaseGetUserSubmissions;
window.supabaseGetChallengeSubmissions = supabaseGetChallengeSubmissions;
window.supabaseGetLatestSubmissions = supabaseGetLatestSubmissions;
window.supabaseUpdateSubmissionReview = supabaseUpdateSubmissionReview;
window.supabaseDeleteSubmission = supabaseDeleteSubmission;
window.diagnosticCheckSubmissionInDB = diagnosticCheckSubmissionInDB;
window.initializeSupabase = initializeSupabase;
window.waitForSupabase = waitForSupabase;

// Export notes functions to window
window.supabaseSaveStudyNotes = supabaseSaveStudyNotes;
window.supabaseGetStudyNotes = supabaseGetStudyNotes;
window.supabaseSaveStudyResource = supabaseSaveStudyResource;
window.supabaseGetStudyResources = supabaseGetStudyResources;
window.supabaseDeleteStudyResource = supabaseDeleteStudyResource;
window.supabaseDeleteStudyResourcesByTopic = supabaseDeleteStudyResourcesByTopic;

/**
 * Verify study notes system is operational
 * (Notes are GLOBAL - all users can view all notes and resources)
 */
async function checkStudyNotesRLSSecurity() {
    if (!supabaseInstance) {
        console.warn('⚠️ Supabase not initialized yet');
        return;
    }

    try {
        console.log('📝 === STUDY NOTES: GLOBAL MODE ===');
        console.log('   ✅ All users can view all notes and resources for each topic');
        console.log('   ✅ Notes are organized by topic, shared globally');
        console.log('   ✅ Each user can add notes and resources for topics');
        console.log('📝 === STATUS: OPERATIONAL ===');
    } catch (error) {
        console.error('❌ Error during check:', error.message);
    }
}

// Export security check function
window.checkStudyNotesRLSSecurity = checkStudyNotesRLSSecurity;

// Run security check when Supabase is initialized
window.supabaseInitPromise.then(() => {
    // Delay slightly to let Supabase initialize
    setTimeout(() => {
        checkStudyNotesRLSSecurity();
    }, 1000);
});

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
