/**
 * Groq AI Code Review Integration
 * Performs initial code review using Groq API
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Trigger AI review for submission
 */
async function triggerAIReview(submissionId) {
    try {
        const submission = await getSubmission(submissionId);
        if (!submission) throw new Error('Submission not found');

        // Update status to AI reviewing
        await updateSubmissionStatus(submissionId, 'ai_reviewing', null);

        // Get challenge info for context
        const challengeInfo = getChallengeInfo(submission.topic_id, submission.challenge_id);
        console.log('🎯 Challenge context for AI review:', {
            submissionId,
            topicId: submission.topic_id,
            challengeId: submission.challenge_id,
            challengeInfo: challengeInfo,
            sourceCodeLength: submission.source_code?.length || 0,
            sourceCodePreview: submission.source_code?.substring(0, 100) || 'N/A'
        });

        // Call Groq API
        const feedback = await reviewCodeWithGroq(
            submission.source_code,
            submission.challenge_id,
            challengeInfo
        );

        // Update with AI feedback
        await updateSubmissionStatus(submissionId, 'admin_pending', feedback);

        return { success: true, feedback };
    } catch (error) {
        console.error('AI review error:', error.message);
        await updateSubmissionStatus(submissionId, 'pending', `AI review failed: ${error.message}`);
        return { success: false, error };
    }
}

/**
 * Review code using Groq API
 */
async function reviewCodeWithGroq(sourceCode, challengeId, challengeInfo) {
    if (!SUPABASE_CONFIG.GROQ_API_KEY || SUPABASE_CONFIG.GROQ_API_KEY === 'YOUR_GROQ_API_KEY') {
        throw new Error('Groq API key not configured');
    }

    const prompt = `
You are a Java code review expert. Review the following code submission ONLY for this specific coding challenge.

${challengeInfo?.fullContext || `Challenge: ${challengeId}`}

Source Code:
\`\`\`java
${sourceCode}
\`\`\`

REVIEW SCOPE: Only evaluate if this code solves the challenge requirements above. Do NOT provide generic code improvement suggestions unrelated to the challenge.

Provide a structured code review with:
1. ✅ What's working well (2-3 points specific to the challenge requirements)
2. ❌ Issues found (code that fails to meet challenge requirements: syntax, logic errors, incorrect output)
3. 💡 Suggestions for improvement (ONLY improvements needed to solve the challenge correctly)
4. Overall assessment: NEEDS_WORK / ACCEPTABLE / GOOD / EXCELLENT

Keep response concise (under 500 chars). Focus only on challenge requirements.
`;

    console.log('📝 AI Review Prompt:', {
        challengeId,
        hasFullContext: !!challengeInfo?.fullContext,
        promptLength: prompt.length,
        sourceCodeLength: sourceCode.length,
        sourceCodePreview: sourceCode.substring(0, 150) + '...',
        fullPrompt: prompt
    });

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_CONFIG.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768', // or 'llama-2-70b-chat'
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500,
                top_p: 1
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Groq API error');
        }

        const data = await response.json();
        const feedback = data.choices[0]?.message?.content || 'No feedback generated';

        console.log('✅ AI Review Feedback Received:', {
            challengeId,
            feedbackLength: feedback.length,
            feedback: feedback,
            fullResponse: data
        });

        return formatAIFeedback(feedback);
    } catch (error) {
        console.error('Groq API call failed:', error);
        throw error;
    }
}

/**
 * Format AI feedback for display
 */
function formatAIFeedback(rawFeedback) {
    // Extract key points
    let formatted = rawFeedback;

    // Add icons if not present
    if (!formatted.includes('✅')) {
        formatted = formatted.replace(/What's working well:/gi, '✅ What\'s working well:');
    }
    if (!formatted.includes('❌')) {
        formatted = formatted.replace(/Issues found:/gi, '❌ Issues found:');
    }
    if (!formatted.includes('💡')) {
        formatted = formatted.replace(/Suggestions/gi, '💡 Suggestions');
    }

    return formatted;
}

/**
 * Get challenge info for context
 */
function getChallengeInfo(topicId, challengeId) {
    // This would look up the challenge from topicsData
    const topic = topicsData[topicId];
    if (!topic) {
        return {
            description: `Challenge: ${challengeId}`,
            topic: 'Unknown Topic'
        };
    }

    // Extract challenge number from challengeId (e.g., "loops_challenge_2" -> 2)
    const challengeMatch = challengeId.match(/_challenge_(\d+)$/);
    const challengeNum = challengeMatch ? parseInt(challengeMatch[1]) : 1;

    // Parse the challenges HTML to extract specific challenge details
    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = topic.challenges;
        
        const challengeItems = tempDiv.querySelectorAll('.challenge-item');
        if (challengeItems.length >= challengeNum) {
            const item = challengeItems[challengeNum - 1]; // 0-indexed
            
            // Extract challenge title
            const titleElement = item.querySelector('strong');
            const title = titleElement ? titleElement.textContent : `Challenge ${challengeNum}`;
            
            // Extract difficulty
            const difficultyElement = item.querySelector('.difficulty');
            const difficulty = difficultyElement ? difficultyElement.textContent.trim() : 'Unknown';
            
            // Extract challenge description
            const descElement = item.querySelector('.challenge-description');
            const description = descElement ? descElement.textContent.trim() : '';
            
            // Extract expected output
            let expectedOutput = '';
            const outputElement = item.querySelector('.expected-output');
            if (outputElement) {
                expectedOutput = outputElement.textContent.trim();
            }
            
            return {
                title,
                description,
                expectedOutput,
                difficulty,
                topic: topic.name,
                fullContext: `
CHALLENGE: ${title}
DIFFICULTY: ${difficulty}
TOPIC: ${topic.name}

PROBLEM DESCRIPTION:
${description}

EXPECTED OUTPUT:
${expectedOutput || '(See challenge description)'}
                `.trim()
            };
        }
    } catch (error) {
        console.error('Error parsing challenge HTML:', error);
    }

    // Fallback if parsing fails
    return {
        description: `Challenge: ${challengeId}`,
        topic: topic.name
    };
}

/**
 * Batch review multiple submissions (for admin)
 */
async function batchReviewSubmissions(submissionIds) {
    const results = [];

    for (const id of submissionIds) {
        const result = await triggerAIReview(id);
        results.push({ id, ...result });
        
        // Rate limit to avoid API quota issues
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    showNotification(`✅ AI review completed for ${results.filter(r => r.success).length}/${submissionIds.length} submissions`, 'success');
    return results;
}

/**
 * Parse AI feedback severity
 */
function getAIFeedbackSeverity(feedback) {
    const lower = feedback.toLowerCase();
    
    if (lower.includes('excellent')) return 'excellent';
    if (lower.includes('good')) return 'good';
    if (lower.includes('acceptable')) return 'acceptable';
    if (lower.includes('needs_work') || lower.includes('needs work')) return 'needs_work';
    
    // Count issues
    const issueCount = (feedback.match(/❌/g) || []).length;
    if (issueCount > 3) return 'needs_work';
    if (issueCount > 1) return 'acceptable';
    
    return 'good';
}

/**
 * Test Groq connection
 */
async function testGroqConnection() {
    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_CONFIG.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [
                    {
                        role: 'user',
                        content: 'Say "Groq connection working!" in exactly 5 words.'
                    }
                ],
                max_tokens: 50
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Groq API Connected:', data.choices[0]?.message?.content);
            return { success: true, message: data.choices[0]?.message?.content };
        } else {
            const error = await response.json();
            console.error('❌ Groq connection failed:', error);
            return { success: false, error };
        }
    } catch (error) {
        console.error('❌ Groq connection error:', error);
        return { success: false, error };
    }
}
