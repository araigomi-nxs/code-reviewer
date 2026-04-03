/**
 * Discord Webhook Integration
 * Sends notifications to Discord channel when submissions are updated
 * Supports: created, pending, under-review, ai-review, completed statuses
 */

/**
 * Get Discord webhook URL from environment
 */
function getDiscordWebhookUrl() {
    if (!window.ENV || !window.ENV.VITE_DISCORD_WEBHOOK_URL) {
        console.warn('⚠️ Discord webhook URL not configured. Set VITE_DISCORD_WEBHOOK_URL in env-config.js');
        return null;
    }
    return window.ENV.VITE_DISCORD_WEBHOOK_URL;
}

/**
 * Get status emoji and color based on submission status
 */
function getStatusEmoji(status) {
    const emojiMap = {
        'created': '✅',
        'pending': '⏳',
        'under-review': '👀',
        'under review': '👀',
        'ai-review': '🤖',
        'ai_review': '🤖',
        'processing': '⚙️',
        'approved': '✨',
        'completed': '🎉',
        'rejected': '❌'
    };
    return emojiMap[status?.toLowerCase()] || '📋';
}

/**
 * Get color code for Discord embed based on status
 */
function getStatusColor(status) {
    const colorMap = {
        'created': 5814783,      // Blue
        'pending': 16776960,     // Yellow
        'under-review': 16756480, // Orange
        'under review': 16756480,
        'ai-review': 11093254,   // Purple
        'ai_review': 11093254,
        'processing': 11093254,
        'approved': 65280,       // Green
        'completed': 65280,
        'rejected': 16711680     // Red
    };
    return colorMap[status?.toLowerCase()] || 3447003; // Default blue
}

/**
 * Get human-readable status label
 */
function getStatusLabel(status) {
    const labelMap = {
        'created': 'Created',
        'pending': 'Pending Review',
        'under-review': 'Under Review',
        'under review': 'Under Review',
        'ai-review': 'AI Review',
        'ai_review': 'AI Review',
        'processing': 'Processing',
        'approved': 'Approved',
        'completed': 'Completed ✨',
        'rejected': 'Rejected'
    };
    return labelMap[status?.toLowerCase()] || status || 'Unknown';
}

/**
 * Send submission notification to Discord
 */
async function sendDiscordNotification(submissionData) {
    const webhookUrl = getDiscordWebhookUrl();
    
    if (!webhookUrl) {
        console.log('ℹ️ Discord webhook not configured - skipping notification');
        return false;
    }

    try {
        const {
            username,
            challengeId,
            status,
            feedback,
            aiReview,
            fileName,
            submittedAt
        } = submissionData;

        // Create embed message
        const embed = {
            title: `📚 Submission ${getStatusLabel(status)}`,
            description: `User: **${username}**\nChallenge: **${challengeId}**`,
            color: getStatusColor(status),
            fields: [
                {
                    name: '📝 File',
                    value: fileName || 'N/A',
                    inline: true
                },
                {
                    name: '⏰ Time',
                    value: submittedAt ? new Date(submittedAt).toLocaleString() : 'N/A',
                    inline: true
                },
                {
                    name: `${getStatusEmoji(status)} Status`,
                    value: getStatusLabel(status),
                    inline: true
                }
            ],
            timestamp: new Date().toISOString()
        };

        // Add feedback if available
        if (feedback && feedback.trim()) {
            const feedbackText = feedback.substring(0, 1024); // Discord field limit
            embed.fields.push({
                name: '💬 Feedback',
                value: feedbackText,
                inline: false
            });
        }

        // Add AI review if available
        if (aiReview && aiReview.trim()) {
            const reviewText = aiReview.substring(0, 1024); // Discord field limit
            embed.fields.push({
                name: '🤖 AI Review',
                value: reviewText,
                inline: false
            });
        }

        // Add footer with status info
        embed.footer = {
            text: `Status: ${getStatusLabel(status)} | Coding Reviewer Platform`,
            icon_url: 'https://github.com/favicon.ico'
        };

        // Send to Discord
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                embeds: [embed],
                username: 'Coding Reviewer Bot',
                avatar_url: 'https://github.com/favicon.ico'
            })
        });

        if (response.ok) {
            console.log(`✅ Discord notification sent for ${username} - ${challengeId} (${status})`);
            return true;
        } else {
            const errorText = await response.text();
            console.error(`❌ Discord notification failed: ${response.status} - ${errorText}`);
            return false;
        }
    } catch (error) {
        console.error('❌ Error sending Discord notification:', error);
        return false;
    }
}

/**
 * Send bulk notification for multiple submissions
 */
async function sendBulkDiscordNotifications(submissionsArray) {
    const results = [];
    
    for (const submission of submissionsArray) {
        const result = await sendDiscordNotification(submission);
        results.push({
            username: submission.username,
            challengeId: submission.challengeId,
            sent: result
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const successful = results.filter(r => r.sent).length;
    console.log(`✅ Discord bulk notification: ${successful}/${results.length} sent`);
    
    return results;
}

/**
 * Test Discord webhook connection
 */
async function testDiscordWebhookConnection() {
    const webhookUrl = getDiscordWebhookUrl();
    
    if (!webhookUrl) {
        console.error('❌ Discord webhook URL not configured');
        return false;
    }

    try {
        const testEmbed = {
            title: '🧪 Discord Webhook Test',
            description: 'This is a test message from the Coding Reviewer platform.',
            color: 3447003,
            fields: [
                {
                    name: 'Status',
                    value: '✅ Connection Successful',
                    inline: true
                },
                {
                    name: 'Timestamp',
                    value: new Date().toLocaleString(),
                    inline: true
                }
            ],
            footer: {
                text: 'Coding Reviewer Platform',
                icon_url: 'https://github.com/favicon.ico'
            },
            timestamp: new Date().toISOString()
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                embeds: [testEmbed],
                username: 'Coding Reviewer Bot',
                avatar_url: 'https://github.com/favicon.ico'
            })
        });

        if (response.ok) {
            console.log('✅ Discord webhook connection test successful!');
            return true;
        } else {
            const errorText = await response.text();
            console.error(`❌ Discord webhook test failed: ${response.status} - ${errorText}`);
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing Discord webhook:', error);
        return false;
    }
}

/**
 * Create submission update notification
 * Call this when a submission status is updated
 */
async function notifySubmissionUpdate(username, challengeId, newStatus, feedback = '', aiReview = '', fileName = '', submittedAt = '') {
    const notification = {
        username,
        challengeId,
        status: newStatus,
        feedback,
        aiReview,
        fileName,
        submittedAt: submittedAt || new Date().toISOString()
    };

    return await sendDiscordNotification(notification);
}

/**
 * Create status-specific notifications with context
 */
async function notifySubmissionCreated(username, challengeId, fileName) {
    console.log(`📢 Notifying: Submission created for ${username} - ${challengeId}`);
    return await notifySubmissionUpdate(username, challengeId, 'created', '', '', fileName);
}

async function notifySubmissionPending(username, challengeId) {
    console.log(`📢 Notifying: Submission pending for ${username} - ${challengeId}`);
    return await notifySubmissionUpdate(username, challengeId, 'pending', 'Awaiting review...');
}

async function notifyUnderReview(username, challengeId) {
    console.log(`📢 Notifying: Submission under review for ${username} - ${challengeId}`);
    return await notifySubmissionUpdate(username, challengeId, 'under-review', 'Admin is reviewing...');
}

async function notifyAIReview(username, challengeId, aiReview = '') {
    console.log(`📢 Notifying: AI review for ${username} - ${challengeId}`);
    return await notifySubmissionUpdate(username, challengeId, 'ai-review', '', aiReview);
}

async function notifySubmissionCompleted(username, challengeId, feedback = '') {
    console.log(`📢 Notifying: Submission completed for ${username} - ${challengeId}`);
    return await notifySubmissionUpdate(username, challengeId, 'completed', feedback);
}

async function notifySubmissionRejected(username, challengeId, feedback = '') {
    console.log(`📢 Notifying: Submission rejected for ${username} - ${challengeId}`);
    return await notifySubmissionUpdate(username, challengeId, 'rejected', feedback);
}

// Expose functions globally
if (!window.discord) {
    window.discord = {};
}
window.discord.sendNotification = sendDiscordNotification;
window.discord.testWebhook = testDiscordWebhookConnection;
window.discord.notifySubmissionUpdate = notifySubmissionUpdate;
window.discord.notifyCreated = notifySubmissionCreated;
window.discord.notifyPending = notifySubmissionPending;
window.discord.notifyUnderReview = notifyUnderReview;
window.discord.notifyAIReview = notifyAIReview;
window.discord.notifyCompleted = notifySubmissionCompleted;
window.discord.notifyRejected = notifySubmissionRejected;

console.log('✅ Discord webhook module loaded');
