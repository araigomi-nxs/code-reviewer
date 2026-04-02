/**
 * Challenge Submission Management
 * Handles file uploads and tracking for challenges (Supabase-based, no localStorage)
 * All submission data is fetched directly from Supabase
 */

/**
 * Submit a challenge file
 */
async function submitChallenge(challengeId, file, topicId = 'default') {
    const user = window.getCurrentUser();
    if (!user) {
        throw new Error('User not logged in');
    }

    // Validate file
    if (!file) {
        throw new Error('No file selected');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
    }

    const allowedExtensions = ['.java', '.cpp', '.py', '.c', '.txt', '.js', '.go', '.rs'];
    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasAllowedExtension) {
        throw new Error(`File type not allowed. Accepted: ${allowedExtensions.join(', ')}`);
    }

    // Read file content
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const username = user.username;

                // Debug: Check file content before saving
                console.log('📖 === FILE READ COMPLETE ===');
                console.log('File name:', file.name);
                console.log('File size (bytes):', file.size);
                console.log('File type:', file.type);
                console.log('Content read - type:', typeof reader.result);
                console.log('Content read - length:', reader.result?.length || 0);
                console.log('Content read - preview:', reader.result ? reader.result.substring(0, 200) : 'EMPTY');
                
                // CRITICAL CHECK
                if (!reader.result || reader.result.length === 0) {
                    console.error('❌ CRITICAL: FileReader returned empty content!');
                    console.error('   reader.result:', reader.result);
                    console.error('   reader.result === null:', reader.result === null);
                    console.error('   reader.result === undefined:', reader.result === undefined);
                    console.error('   reader.result === "":', reader.result === '');
                    throw new Error('File content could not be read. Make sure the file is not empty.');
                }
                console.log('✅ Content read successfully, proceeding to save');
                console.log('📖 === END FILE READ ===\n');
                
                console.log('📖 File read successfully:', {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    contentLength: reader.result?.length || 0,
                    contentPreview: reader.result ? reader.result.substring(0, 200) : 'EMPTY',
                    contentType: typeof reader.result
                });

                // Store submission
                const submissionData = {
                    fileName: file.name,
                    fileContent: reader.result,
                    fileType: file.type,
                    fileSize: file.size,
                    submittedAt: new Date().toISOString(),
                    topicId: topicId,
                    status: 'pending',
                    feedback: null,
                    aiReview: null,
                    aiReviewStatus: 'pending',
                    aiReviewedAt: null
                };

                console.log('💾 About to save submission:', {
                    username,
                    challengeId,
                    fileContentLength: submissionData.fileContent?.length || 0,
                    fileContentPreview: submissionData.fileContent ? submissionData.fileContent.substring(0, 100) : 'EMPTY'
                });

                // Save to Supabase only (no localStorage backup)
                if (window.supabaseSaveSubmission) {
                    try {
                        const result = await window.supabaseSaveSubmission(username, challengeId, submissionData);
                        console.log('\n✅ ===== SUBMISSION SAVE COMPLETE =====');
                        console.log('Challenge ID:', challengeId);
                        console.log('Content that was sent to Supabase (length):', submissionData.fileContent?.length || 0);
                        console.log('✅ ===== END SUBMISSION SAVE =====\n');
                        resolve(submissionData);
                    } catch (error) {
                        console.error('❌ Supabase save failed:', error.message);
                        reject(new Error(`Database save failed: ${error.message}`));
                    }
                } else {
                    reject(new Error('Supabase not initialized. Please reload the page.'));
                }
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

/**
 * Get user submissions (fetches from Supabase)
 */
async function getUserSubmissions(username = null) {
    const user = username ? { username } : window.getCurrentUser();
    if (!user) return {};

    if (!window.supabaseInstance) {
        console.warn('⚠️ Supabase not initialized');
        return {};
    }

    try {
        const { data, error } = await window.supabaseInstance
            .from('submissions')
            .select('*')
            .eq('username', user.username);

        if (error) {
            console.error('❌ Failed to fetch submissions:', error);
            return {};
        }

        // Normalize snake_case to camelCase
        const normalized = {};
        if (data && data.length > 0) {
            data.forEach(sub => {
                const challengeId = sub.challenge_id;
                normalized[challengeId] = {
                    fileName: sub.file_name || '',
                    fileContent: sub.file_content || '',
                    submittedAt: sub.submitted_at,
                    topicId: sub.topic_id || 'default',
                    status: sub.status || 'pending',
                    feedback: sub.feedback || null,
                    aiReview: sub.ai_review || null,
                    aiReviewStatus: sub.ai_review ? 'completed' : 'pending'
                };
            });
        }
        return normalized;
    } catch (error) {
        console.error('❌ Exception fetching submissions:', error);
        return {};
    }
}

/**
 * Get specific submission (fetches from Supabase)
 */
async function getSubmission(challengeId, username = null) {
    const user = username ? { username } : window.getCurrentUser();
    if (!user) return null;

    if (!window.supabaseInstance) {
        console.warn('⚠️ Supabase not initialized');
        return null;
    }

    try {
        const { data, error } = await window.supabaseInstance
            .from('submissions')
            .select('*')
            .eq('username', user.username)
            .eq('challenge_id', challengeId)
            .limit(1);

        if (error) {
            console.error('❌ Failed to fetch submission:', error);
            return null;
        }

        if (!data || data.length === 0) {
            return null;
        }

        const sub = data[0];
        
        // CRITICAL: Log ALL raw data from Supabase
        console.log('📥 === RAW SUBMISSION FROM SUPABASE ===');
        console.log('Full object:', sub);
        console.log('file_name:', sub.file_name);
        console.log('file_content:', sub.file_content);
        console.log('file_content type:', typeof sub.file_content);
        console.log('file_content is null:', sub.file_content === null);
        console.log('file_content is undefined:', sub.file_content === undefined);
        console.log('file_content length:', sub.file_content?.length || 0);
        console.log('file_content preview:', sub.file_content ? sub.file_content.substring(0, 150) : 'MISSING/NULL/EMPTY');
        console.log('File metadata - type:', sub.file_type, ', size:', sub.file_size);
        console.log('📥 === END RAW DATA ===');
        
        // Debug logging
        console.log('📥 Raw submission from Supabase:', {
            file_name: sub.file_name,
            file_content_length: sub.file_content?.length || 0,
            file_content_preview: sub.file_content ? sub.file_content.substring(0, 150) : 'MISSING/EMPTY',
            file_type: sub.file_type,
            file_size: sub.file_size,
            status: sub.status
        });
        
        // Normalize snake_case to camelCase
        const submission = {
            fileName: sub.file_name || '',
            fileContent: sub.file_content || '',
            submittedAt: sub.submitted_at,
            topicId: sub.topic_id || 'default',
            status: sub.status || 'pending',
            feedback: sub.feedback || null,
            aiReview: sub.ai_review || null,
            aiReviewStatus: sub.ai_review ? 'completed' : 'pending'
        };
        
        console.log('📤 Normalized submission for use:', {
            fileContentLength: submission.fileContent?.length || 0,
            status: submission.status
        });
        
        return submission;
    } catch (error) {
        console.error('❌ Exception fetching submission:', error);
        return null;
    }
}

/**
 * Check if user has submitted a challenge
 */
async function hasUserSubmitted(challengeId, username = null) {
    const submission = await getSubmission(challengeId, username);
    return submission !== null;
}

/**
 * Get submission status
 */
async function getSubmissionStatus(challengeId, username = null) {
    const submission = await getSubmission(challengeId, username);
    if (!submission) return null;
    return {
        status: submission.status,
        submittedAt: submission.submittedAt,
        feedback: submission.feedback
    };
}

/**
 * Get all user completed challenges
 */
function getUserCompletedChallenges(username = null) {
    const submissions = getUserSubmissions(username);
    return Object.entries(submissions)
        .filter(([, submission]) => submission.status === 'approved')
        .map(([challengeId, submission]) => ({
            challengeId,
            ...submission
        }));
}

/**
 * Get user submission statistics
 */
async function getUserStats(username = null) {
    const submissions = await getUserSubmissions(username);
    return {
        total: Object.keys(submissions).length,
        pending: Object.values(submissions).filter(s => s.status === 'pending').length,
        approved: Object.values(submissions).filter(s => s.status === 'approved' || s.status === 'completed').length,
        rejected: Object.values(submissions).filter(s => s.status === 'rejected').length
    };
}

/**
 * Delete a submission (from Supabase only)
 */
async function deleteSubmission(challengeId, username = null) {
    const user = username ? { username } : window.getCurrentUser();
    if (!user) throw new Error('User not logged in');

    console.log('🗑️ Deleting submission:', { username: user.username, challengeId });

    // Delete from Supabase
    if (window.supabaseDeleteSubmission) {
        try {
            await window.supabaseDeleteSubmission(user.username, challengeId);
            console.log('✅ Submission deleted from Supabase:', user.username, challengeId);
            return true;
        } catch (error) {
            console.error('❌ Supabase delete failed:', error.message);
            throw new Error(`Database deletion failed: ${error.message}`);
        }
    } else {
        throw new Error('Supabase not initialized');
    }
}

/**
 * Update submission status (admin only)
 */
async function updateSubmissionStatus(challengeId, status, feedback = '', username = null) {
    const user = username ? { username } : window.getCurrentUser();
    if (!user) throw new Error('User not logged in');

    // Use Supabase to update
    if (window.updateSubmissionStatusByChallenge) {
        try {
            await window.updateSubmissionStatusByChallenge(user.username, challengeId, status, feedback);
            console.log('✅ Submission status updated:', challengeId, 'to', status);
            return true;
        } catch (error) {
            console.error('❌ Failed to update submission status:', error);
            return false;
        }
    }
    
    console.warn('⚠️ Supabase not initialized for status update');
    return false;
}

/**
 * Get all submissions (admin)
 */
async function getAllSubmissions() {
    if (window.supabaseGetAllSubmissions) {
        try {
            return await window.supabaseGetAllSubmissions();
        } catch (error) {
            console.error('❌ Failed to get all submissions:', error);
            return [];
        }
    }
    console.warn('⚠️ Supabase not initialized for fetching submissions');
    return [];
}

/**
 * Get Groq API key from window.ENV (loaded via env-config.js)
 */
function getGroqApiKey() {
    // window.ENV is set by env-config.js - update that file to change keys
    if (!window.ENV || !window.ENV.VITE_GROQ_API_KEY) {
        throw new Error('❌ Groq API key missing! Check that env-config.js is loaded in index.html');
    }
    return window.ENV.VITE_GROQ_API_KEY;
}

/**
 * Set Groq API key in window.ENV
 */
function setGroqApiKey(key) {
    if (!window.ENV) window.ENV = {};
    window.ENV.VITE_GROQ_API_KEY = key;
    console.log('✅ Groq API key updated in window.ENV');
}

/**
 * Request Groq API review for code
 */
async function requestAiReview(challengeId, username = null) {
    const user = username ? { username } : window.getCurrentUser();
    if (!user) throw new Error('User not logged in');

    const submission = await getSubmission(challengeId, username);
    if (!submission) {
        throw new Error('Submission not found - please upload a file first');
    }

    if (!submission.fileContent || submission.fileContent.trim().length === 0) {
        console.error('❌ ===== CRITICAL: CANNOT REQUEST AI REVIEW =====');
        console.error('File content is empty! Here is the submission state:');
        console.error('Submission object:', submission);
        console.error('fileContent:', submission.fileContent);
        console.error('fileContent type:', typeof submission.fileContent);
        console.error('fileContent length:', submission.fileContent?.length || 0);
        console.error('fileContent is empty string:', submission.fileContent === '');
        console.error('fileContent is null:', submission.fileContent === null);
        console.error('fileContent is undefined:', submission.fileContent === undefined);
        console.error('fileName:', submission.fileName);
        console.error('status:', submission.status);
        console.error('');
        console.error('WHAT TO CHECK:');
        console.error('1. ^ Look above at the console output from getSubmission()');
        console.error('2. ^ The "file_content" field should NOT be NULL or empty');
        console.error('3. ^ If it IS null/empty, the data was not saved to Supabase');
        console.error('4. Run this in console: await window.diagnosticCheckSubmissionInDB(window.getCurrentUser().username, "' + challengeId + '")');
        console.error('===== END CRITICAL ERROR =====');
        
        throw new Error('No code content to review - the submission appears to be empty. Please check that your file was uploaded correctly.');
    }

    const apiKey = getGroqApiKey();
    if (!apiKey) throw new Error('Groq API key not configured');
    
    // DEBUG: Log the API key being used
    console.log('🔑 === API KEY DEBUG ===');
    console.log('API Key source: ✅ window.ENV (from env-config.js)');
    console.log('API Key length:', apiKey?.length || 0);
    console.log('API Key starts with:', apiKey ? apiKey.substring(0, 10) : 'N/A');
    console.log('API Key ends with:', apiKey ? apiKey.substring(apiKey.length - 10) : 'N/A');
    console.log('🔑 === END DEBUG ===\n');

    try {
        // Update status to processing in Supabase
        if (window.updateSubmissionStatusByChallenge) {
            await window.updateSubmissionStatusByChallenge(user.username, challengeId, 'processing');
        }

        console.log('🤖 Requesting AI review from Groq...');
        
        // Get challenge solution for comparison
        const solution = window.getChallengeSolution ? window.getChallengeSolution(challengeId) : null;
        
        const problemContext = solution ? `
=== CHALLENGE DETAILS ===
Problem: ${solution.problem}

Expected Output:
${solution.expectedOutput}

Reference Solution:
\`\`\`java
${solution.solution}
\`\`\`
=== END CHALLENGE DETAILS ===
` : '';

        console.log('🎯 Challenge Extraction Result:', {
            challengeId,
            solutionFound: !!solution,
            solution: solution,
            problemContextLength: problemContext.length,
            hasPromlem: !!solution?.problem,
            hasExpectedOutput: !!solution?.expectedOutput,
            hasSolutionCode: !!solution?.solution
        });

        console.log('🎯 Challenge Context for AI Review:', {
            challengeId,
            username: user.username,
            hasSolution: !!solution,
            problemContext: problemContext,
            sourceCodeLength: submission.fileContent?.length || 0,
            sourceCodePreview: submission.fileContent?.substring(0, 200) || 'N/A',
            solution: solution
        });

        console.log('🌐 === GROQ API REQUEST ===');
        console.log('Endpoint: https://api.groq.com/openai/v1/chat/completions');
        console.log('Authorization header:', `Bearer ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 10)}`);
        console.log('Model:', 'qwen/qwen3-32b');
        console.log('🌐 === END REQUEST DEBUG ===\n');

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'qwen/qwen3-32b',
                messages: [
                    {
                        role: 'system',
                        content: `RESPOND WITH ONLY THIS FORMAT - NO THINKING TAGS:

\`\`\`
Review:
[2-3 sentences: is core logic correct? discuss code quality, efficiency, readability]

Suggestion:
[code block showing improvement/optimization/alternative approach]

Rating: ⭐⭐⭐⭐⭐ (or "Incorrect output")
\`\`\`

RULES:
- ONLY rate based on CORE LOGIC correctness
- Check: does the code produce the REQUIRED output correctly?
- If REQUIRED output is correct → give ⭐⭐⭐⭐⭐ ALWAYS (extra output = BONUS)
- Extra features (inverted pyramid, bonus patterns, helper code) = BONUS, praised in review
- Extra output (pyramid + inverted pyramid when only pyramid required) = bonus feature, NOT penalty
- Do NOT penalize for extra output if core requirement is met
- Do NOT suggest removing any working code
- WRONG core logic / missing required output → give "Incorrect output" and suggest fix
- Review FOCUS: analyze the CODE itself - discuss efficiency, style, potential improvements, readability
- Discuss: what works well, what could be improved, what could be added
- Suggestion: provide optimization, cleaner approach, efficiency improvement, or new feature idea
- Encourage: think about edge cases, alternative implementations, code reusability
- NO thinking tags, NO xml, NO markdown fence headers`
                    },
                    {
                        role: 'user',
                        content: `${problemContext}

USER'S CODE:
\`\`\`java
${submission.fileContent}
\`\`\`

RESPOND WITH ONLY CODE BLOCK FORMAT - nothing else.`
                    }
                ],
                temperature: 0.5,
                max_tokens: 500
            })
        });

        console.log('📝 Full AI Review Prompt Sent:', {
            challengeId,
            hasProblemContext: !!problemContext,
            systemPromptLength: 1000,
            userPromptLength: problemContext.length + submission.fileContent.length + 100,
            fullProblemContext: problemContext,
            sourceCodeSent: submission.fileContent
        });

        if (!response.ok) {
            console.error('❌ === GROQ API ERROR ===');
            console.error('HTTP Status:', response.status, response.statusText);
            console.error('Status Details:');
            console.error('  200-299:', 'Success');
            console.error('  400-499:', 'Client error (usually auth/key issue)');
            console.error('  500-599:', 'Server error');
            console.error('Your status:', response.status, response.status >= 400 && response.status < 500 ? '← CLIENT ERROR (likely invalid API key)' : '');
            
            try {
                const error = await response.json();
                console.error('API Response:', error);
                console.error('Error message from Groq:', error.error?.message || error.message || 'Unknown error');
                throw new Error(error.error?.message || error.message || 'Groq API call failed');
            } catch (parseError) {
                console.error('Could not parse error response:', parseError);
                throw new Error(`Groq API returned ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        const aiReview = data.choices[0]?.message?.content || '';

        console.log('✅ AI Review Response Received:', {
            challengeId,
            reviewLength: aiReview.length,
            fullResponse: aiReview,
            rawApiResponse: data
        });

        // Save AI review to Supabase only (no localStorage backup)
        if (window.supabaseUpdateSubmissionReview) {
            try {
                console.log('📡 Saving AI review to Supabase - review length:', aiReview.length);
                const result = await window.supabaseUpdateSubmissionReview(
                    user.username,
                    challengeId,
                    aiReview,
                    'completed'
                );
                console.log('✅ AI review saved to Supabase, result:', result);
            } catch (error) {
                console.error('❌ Supabase update FAILED:', error.message, error);
                throw new Error(`Database save failed: ${error.message}`);
            }
        } else {
            throw new Error('Supabase not initialized');
        }

        console.log('✅ AI review completed');
        return aiReview;
    } catch (error) {
        // Save error status to Supabase only
        if (window.supabaseUpdateSubmissionReview) {
            try {
                await window.supabaseUpdateSubmissionReview(
                    user.username,
                    challengeId,
                    `Error: ${error.message}`,
                    'failed'
                );
            } catch (supabaseError) {
                console.warn('⚠️ Supabase error update failed:', supabaseError.message);
            }
        }
        
        console.error('❌ AI review failed:', error);
        throw error;
    }
}

/**
 * Get AI review for a submission (fetches from Supabase)
 */
async function getAiReview(challengeId, username = null) {
    try {
        const submission = await getSubmission(challengeId, username);
        if (!submission) return null;
        return {
            review: submission.aiReview,
            status: submission.aiReviewStatus,
            reviewedAt: submission.aiReviewedAt
        };
    } catch (error) {
        console.error('❌ Failed to get AI review:', error);
        return null;
    }
}

/**
 * Clear AI review for a submission (deletes from Supabase)
 */
async function clearAiReview(challengeId, username = null) {
    const user = username ? { username } : window.getCurrentUser();
    if (!user) throw new Error('User not logged in');

    // Update Supabase to clear review
    if (window.supabaseUpdateSubmissionReview) {
        try {
            await window.supabaseUpdateSubmissionReview(user.username, challengeId, null, 'pending');
            console.log('✅ AI review cleared for:', challengeId);
            return true;
        } catch (error) {
            console.error('❌ Failed to clear AI review:', error);
            throw error;
        }
    } else {
        throw new Error('Supabase not initialized');
    }
}

/**
 * Get all submissions for a specific challenge from all users (from Supabase only)
 */
async function getChallengeSubmissions(challengeId) {
    if (window.supabaseGetChallengeSubmissions) {
        try {
            const submissions = await window.supabaseGetChallengeSubmissions(challengeId);
            return submissions.map(sub => ({
                username: sub.username,
                challengeId: sub.challenge_id,
                fileName: sub.file_name,
                fileContent: sub.file_content,
                fileSize: sub.file_size,
                status: sub.status,
                submittedAt: sub.submitted_at,
                aiReview: sub.ai_review,
                aiReviewStatus: sub.ai_review_status,
                aiReviewedAt: sub.ai_reviewed_at,
                topicId: sub.topic_id
            }));
        } catch (error) {
            console.error('❌ Failed to get submissions:', error);
            return [];
        }
    }
    throw new Error('Supabase not initialized');
}

/**
 * Get latest submissions across all challenges from Supabase (sorted by date)
 */
async function getLatestSubmissions(limit = 10) {
    if (window.supabaseGetLatestSubmissions) {
        try {
            return await window.supabaseGetLatestSubmissions(limit);
        } catch (error) {
            console.error('❌ Failed to get latest submissions:', error);
            return [];
        }
    }
    throw new Error('Supabase not initialized');
}

/**
 * Clear all submissions for current user (for cleanup/debugging)
 */
async function clearUserSubmissions(username = null) {
    const user = username ? { username } : window.getCurrentUser();
    if (!user) throw new Error('User not logged in');
    
    // Clear from Supabase
    if (window.supabaseClearUserSubmissions) {
        try {
            await window.supabaseClearUserSubmissions(user.username);
            console.log('🗑️ Cleared all submissions for user:', user.username);
        } catch (error) {
            console.error('❌ Failed to clear submissions:', error);
            throw error;
        }
    } else {
        console.warn('⚠️ Supabase not initialized for clearing submissions');
    }
}

/**
 * Make functions globally available
 */
window.submitChallenge = submitChallenge;
window.getUserSubmissions = getUserSubmissions;
window.getSubmission = getSubmission;
window.hasUserSubmitted = hasUserSubmitted;
window.getSubmissionStatus = getSubmissionStatus;
window.getUserCompletedChallenges = getUserCompletedChallenges;
window.getUserStats = getUserStats;
window.deleteSubmission = deleteSubmission;
window.updateSubmissionStatus = updateSubmissionStatus;
window.getAllSubmissions = getAllSubmissions;
window.getChallengeSubmissions = getChallengeSubmissions;
window.getLatestSubmissions = getLatestSubmissions;
window.requestAiReview = requestAiReview;
window.getAiReview = getAiReview;
window.clearAiReview = clearAiReview;
window.getGroqApiKey = getGroqApiKey;
window.setGroqApiKey = setGroqApiKey;
window.clearUserSubmissions = clearUserSubmissions;

console.log('📝 submissions.js loaded - Run window.clearUserSubmissions() to reset local submissions');

