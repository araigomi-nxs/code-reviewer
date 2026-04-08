/**
 * Admin Dashboard - Submission Review Panel
 * Interface for admin users to review, approve, or reject submissions
 */

/**
 * Refresh all submission displays after approval/rejection
 */
async function refreshAllSubmissionLists(challengeId) {
    try {
        // Refresh challenge-specific submissions list
        await refreshChallengeSubmissionsList(challengeId);
        
        // Refresh latest submissions dashboard
        await refreshLatestSubmissionsDashboard();
        
        // Update header stats
        await updateHeaderStats();
    } catch (error) {
        console.error('Error refreshing submission lists:', error);
    }
}

/**
 * Refresh submissions list for a specific challenge
 */
async function refreshChallengeSubmissionsList(challengeId) {
    try {
        console.log('🔄 Refreshing submissions for challenge:', challengeId);
        
        // Get updated submissions for this challenge
        const allSubmissions = window.getChallengeSubmissions ? 
            await window.getChallengeSubmissions(challengeId) : [];
        
        // Find the submissions list container
        const uploadForm = document.getElementById(`uploadForm_${challengeId}`);
        if (!uploadForm) return;
        
        // Remove old submissions list
        const oldList = uploadForm.querySelector('.submissions-list');
        if (oldList) oldList.remove();
        
        // Create new submissions list
        let submissionsListHTML = '';
        if (allSubmissions.length > 0) {
            submissionsListHTML = '<div class="submissions-list">';
            submissionsListHTML += `<h5 class="submissions-list-header">📋 Submissions (${allSubmissions.length})</h5>`;
            
            for (const sub of allSubmissions) {
                const statusColor = sub.status === 'pending' ? '#FFA500' : 
                                   (sub.status === 'completed') ? '#4CAF50' : 
                                   '#f44336';
                const dateStr = new Date(sub.submittedAt).toLocaleDateString() + ' ' + 
                              new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // AI Review indicator
                let ratingDisplay = '';
                let avatarHtml = '';
                
                try {
                    const avatarUrl = window.getUserAvatarUrl ? await window.getUserAvatarUrl(sub.username) : null;
                    if (avatarUrl) {
                        avatarHtml = `<img src="${avatarUrl}" alt="avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                    }
                } catch (e) {
                    console.error('Error loading avatar:', e);
                }
                
                if (sub.aiReviewStatus === 'completed') {
                    const ratingMatch = sub.aiReview?.match(/Rating:\s*(.+?)(?:\n|$)/i);
                    if (ratingMatch && ratingMatch[1]) {
                        ratingDisplay = ` - 🤖 ${ratingMatch[1].trim()}`;
                    }
                }
                
                submissionsListHTML += `
                    <div class="submission-item" data-username="${sub.username}" data-challengeid="${challengeId}" onclick="handleShowCodePreview(this)" style="background: var(--bg-secondary); padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 3px solid ${statusColor}; cursor: pointer; transition: all 0.2s; user-select: none; display: flex; flex-direction: column; gap: 8px; position: relative;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            ${avatarHtml ? `<div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--bg-tertiary); border-radius: 50%;">${avatarHtml}</div>` : ''}
                            <div style="flex: 1; min-width: 0; font-size: 13px; color: var(--text-primary);">
                                <span style="font-weight: bold;">${sub.username}</span> - <span style="color: var(--text-secondary);">${sub.fileName}</span> - <span style="color: var(--text-secondary);">${dateStr}${ratingDisplay}</span>
                            </div>
                            <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: ${statusColor}; border-radius: 50%; color: white; font-size: 16px; font-weight: bold;" title="${sub.status === 'pending' ? 'Pending Review' : (sub.status === 'completed') ? 'Completed' : 'Rejected'}">${sub.status === 'pending' ? '⏳' : (sub.status === 'completed') ? '✓' : '✕'}</div>
                        </div>
                        ${sub.feedback ? `<div style="font-size: 12px; color: var(--text-primary); background: ${sub.status === 'completed' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)'}; padding: 8px 10px; border-radius: 3px; border-left: 3px solid ${sub.status === 'completed' ? '#4CAF50' : '#f44336'}; margin-top: 4px;">
                            <strong>${sub.status === 'completed' ? '✅ Approved' : '❌ Rejected'}:</strong> ${sub.feedback.substring(0, 100)}${sub.feedback.length > 100 ? '...' : ''}
                        </div>` : ''}
                    </div>
                `;
            }
            
            submissionsListHTML += '</div>';
        }
        
        // Append new submissions list
        if (submissionsListHTML) {
            const newListDiv = document.createElement('div');
            newListDiv.innerHTML = submissionsListHTML;
            uploadForm.appendChild(newListDiv.firstChild);
        }
        
        console.log('✅ Submissions list refreshed for challenge:', challengeId);
    } catch (error) {
        console.error('Error refreshing challenge submissions:', error);
    }
}

/**
 * Refresh latest submissions in dashboard
 */
async function refreshLatestSubmissionsDashboard() {
    try {
        console.log('🔄 Refreshing latest submissions dashboard');
        
        const dashboard = document.getElementById('latestSubmissionsDashboard');
        if (!dashboard) return;
        
        // Get latest submissions
        if (!window.supabaseGetLatestSubmissions) {
            console.warn('supabaseGetLatestSubmissions not available');
            return;
        }
        
        const submissions = await window.supabaseGetLatestSubmissions(10);
        
        if (!submissions || submissions.length === 0) {
            dashboard.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-tertiary);">No submissions yet</div>';
            return;
        }
        
        // Build HTML for submissions
        let html = '';
        for (const sub of submissions) {
            const statusColor = sub.status === 'pending' ? '#FFA500' : 
                               (sub.status === 'completed') ? '#4CAF50' : 
                               '#f44336';
            const statusEmoji = sub.status === 'pending' ? '⏳' : 
                               (sub.status === 'completed') ? '✅' : 
                               '❌';
            const dateStr = new Date(sub.submitted_at).toLocaleDateString();
            
            html += `
                <div style="background: var(--bg-secondary); padding: 12px; margin: 8px 0; border-radius: 4px; border-left: 4px solid ${statusColor};">
                    <div style="display: flex; justify-content: space-between; align-items: start; gap: 10px;">
                        <div style="flex: 1;">
                            <div style="font-weight: 500; font-size: 0.95em; color: var(--text-primary);">
                                ${sub.username} - <span style="color: var(--text-secondary);">Challenge ${sub.challenge_id}</span>
                            </div>
                            <div style="font-size: 0.85em; color: var(--text-secondary); margin-top: 4px;">
                                📅 ${dateStr}
                            </div>
                        </div>
                        <div style="font-size: 1.2em;">${statusEmoji}</div>
                    </div>
                </div>
            `;
        }
        
        dashboard.innerHTML = html;
        console.log('✅ Latest submissions dashboard refreshed');
    } catch (error) {
        console.error('Error refreshing dashboard submissions:', error);
    }
}

/**
 * Update header stats
 */
async function updateHeaderStats() {
    try {
        const user = window.getCurrentUser?.();
        if (!user) return;
        
        const submissions = await window.getUserSubmissions?.(user.username);
        if (!submissions) return;
        
        let completed = 0;
        let pending = 0;
        let rejected = 0;
        
        Object.values(submissions).forEach(sub => {
            if (sub.status === 'completed') completed++;
            else if (sub.status === 'pending') pending++;
            else if (sub.status === 'rejected') rejected++;
        });
        
        const completedEl = document.getElementById('headerCompleted');
        const pendingEl = document.getElementById('headerPending');
        const rejectedEl = document.getElementById('headerRejected');
        
        if (completedEl) completedEl.textContent = completed;
        if (pendingEl) pendingEl.textContent = pending;
        if (rejectedEl) rejectedEl.textContent = rejected;
    } catch (error) {
        console.error('Error updating header stats:', error);
    }
}

// Add CSS animations for toast
if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Load and display admin dashboard
 */
async function loadAdminDashboard() {
    try {
        // Check if user is admin
        const isAdmin = await isUserAdmin();
        if (!isAdmin) {
            showNotification('❌ Admin access required', 'error');
            return;
        }

        // Create admin panel if not exists
        createAdminPanel();

        // Load submissions pending admin review
        const submissions = await getAdminPendingSubmissions();
        console.log('📊 Dashboard submissions:', submissions);
        displayAdminSubmissions(submissions);

        // Load statistics
        const stats = await getAdminStatistics();
        displayAdminStats(stats);

    } catch (error) {
        console.error('Admin dashboard load error:', error);
        showNotification(`❌ Failed to load admin dashboard: ${error.message}`, 'error');
    }
}

/**
 * Create admin panel HTML structure
 */
function createAdminPanel() {
    if (document.getElementById('adminPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'adminPanel';
    panel.className = 'admin-panel';
    panel.innerHTML = `
        <div class="admin-header">
            <h2>📋 Admin Review Dashboard</h2>
            <button onclick="closeAdminPanel()" class="close-btn">✕</button>
        </div>

        <div class="admin-stats">
            <div class="stat-card">
                <span class="stat-label">Pending Review</span>
                <span class="stat-number" id="statPending">0</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Approved Today</span>
                <span class="stat-number" id="statApproved">0</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Rejected Today</span>
                <span class="stat-number" id="statRejected">0</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Total Reviewed</span>
                <span class="stat-number" id="statTotal">0</span>
            </div>
        </div>

        <div class="admin-filters">
            <input type="text" id="filterTopic" placeholder="Filter by topic..." class="filter-input">
            <select id="filterStatus" class="filter-select">
                <option value="">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="admin_pending">Admin Pending</option>
                <option value="completed">Completed/Approved</option>
                <option value="rejected">Rejected</option>
            </select>
            <button onclick="applyAdminFilters()" class="btn-primary">🔍 Apply Filters</button>
        </div>

        <div class="submissions-list" id="adminSubmissionsList">
            <div class="loading">Loading submissions...</div>
        </div>
    `;

    document.body.appendChild(panel);
    addAdminPanelStyles();
}

/**
 * Add CSS styles for admin panel
 */
function addAdminPanelStyles() {
    if (document.getElementById('adminPanelStyles')) return;

    const style = document.createElement('style');
    style.id = 'adminPanelStyles';
    style.textContent = `
        .admin-panel {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            overflow-y: auto;
            padding: 20px;
        }

        .admin-header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-bottom: 3px solid var(--primary-color, #4CAF50);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .admin-header h2 {
            margin: 0;
            color: #333;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }

        .close-btn:hover {
            color: #333;
        }

        .admin-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-label {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
            font-weight: bold;
        }

        .stat-number {
            font-size: 28px;
            font-weight: bold;
            color: var(--primary-color, #4CAF50);
            margin-top: 5px;
        }

        .admin-filters {
            background: white;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .filter-input, .filter-select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .filter-input:focus, .filter-select:focus {
            outline: none;
            border-color: var(--primary-color, #4CAF50);
            box-shadow: 0 0 4px rgba(76, 175, 80, 0.2);
        }

        .submissions-list {
            background: white;
            border-radius: 8px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .submission-item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 15px;
            align-items: center;
        }

        .submission-item:hover {
            background: #f5f5f5;
        }

        .submission-info h4 {
            margin: 0 0 5px 0;
            color: #333;
        }

        .submission-meta {
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: #999;
            margin: 5px 0;
        }

        .submission-meta span {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .ai-feedback {
            background: #f0f7ff;
            padding: 10px;
            border-left: 3px solid #2196F3;
            margin-top: 10px;
            font-size: 13px;
            color: #555;
            border-radius: 2px;
        }

        .submission-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .btn-view, .btn-approve, .btn-reject, .btn-resubmit {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        }

        .btn-view {
            background: #2196F3;
            color: white;
        }

        .btn-view:hover {
            background: #1976D2;
        }

        .btn-approve {
            background: #4CAF50;
            color: white;
        }

        .btn-approve:hover {
            background: #45a049;
        }

        .btn-reject {
            background: #f44336;
            color: white;
        }

        .btn-reject:hover {
            background: #da190b;
        }

        .btn-resubmit {
            background: #ff9800;
            color: white;
        }

        .btn-resubmit:hover {
            background: #e68900;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #999;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
        }

        .status-pending {
            background: #fff3cd;
            color: #856404;
        }

        .status-admin_pending {
            background: #cfe2ff;
            color: #084298;
        }

        .status-approved {
            background: #d1e7dd;
            color: #0f5132;
        }

        .status-completed {
            background: #d1e7dd;
            color: #0f5132;
        }

        .status-rejected {
            background: #f8d7da;
            color: #842029;
        }

        /* Comment Dialog Styles */
        .comment-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.2s ease-in;
        }

        .comment-dialog {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .comment-dialog-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9f9f9;
        }

        .comment-dialog-header h3 {
            margin: 0;
            color: #333;
            font-size: 16px;
        }

        .comment-dialog-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .comment-dialog-close:hover {
            color: #333;
        }

        .comment-dialog-body {
            padding: 20px;
        }

        .comment-dialog-body p {
            margin: 0 0 12px 0;
            color: #555;
            font-size: 14px;
        }

        .comment-textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            resize: vertical;
            transition: border-color 0.2s;
        }

        .comment-textarea:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 6px rgba(76, 175, 80, 0.2);
        }

        .comment-char-count {
            font-size: 12px;
            color: #999;
            margin-top: 8px;
            text-align: right;
        }

        .comment-dialog-footer {
            padding: 15px 20px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            background: #f9f9f9;
        }

        .btn-cancel {
            padding: 10px 16px;
            background: #e0e0e0;
            color: #333;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            transition: background 0.2s;
        }

        .btn-cancel:hover {
            background: #d0d0d0;
        }

        .btn-clear {
            padding: 10px 16px;
            background: #fff9e6;
            color: #f57f17;
            border: 1px solid #ffe082;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s;
        }

        .btn-clear:hover {
            background: #ffe082;
            color: #e65100;
        }

        .btn-confirm {
            padding: 10px 16px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            transition: opacity 0.2s;
        }

        .btn-confirm:hover {
            opacity: 0.8;
        }

        .btn-confirm:active {
            opacity: 0.9;
        }
    `;

    document.head.appendChild(style);
}

/**
 * Get submissions pending admin review
 */
async function getAdminPendingSubmissions() {
    try {
        const supabase = window.supabaseInstance;
        if (!supabase) throw new Error('Supabase not initialized');
        
        const { data, error } = await supabase
            .from('submissions')
            .select(`
                username,
                topic_id,
                challenge_id,
                status,
                ai_review,
                submitted_at,
                file_name
            `)
            .in('status', ['pending', 'admin_pending', 'completed', 'rejected'])
            .order('submitted_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        console.log('✅ Admin submissions loaded:', data?.length || 0, 'submissions');
        console.log('📋 Statuses found:', [...new Set(data?.map(d => d.status) || [])]);
        return data || [];
    } catch (error) {
        console.error('❌ Error fetching submissions:', error);
        return [];
    }
}

/**
 * Get admin statistics
 */
async function getAdminStatistics() {
    try {
        const supabase = window.supabaseInstance;
        if (!supabase) throw new Error('Supabase not initialized');
        const today = new Date().toISOString().split('T')[0];

        // Get pending count (both 'pending' and 'admin_pending')
        const { count: pendingCount, error: pendingError } = await supabase
            .from('submissions')
            .select('id', { count: 'exact', head: true })
            .in('status', ['pending', 'admin_pending']);

        const [completed, rejected] = await Promise.all([
            supabase
                .from('submissions')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'completed')
                .gte('submitted_at', `${today}T00:00:00`),
            supabase
                .from('submissions')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'rejected')
                .gte('submitted_at', `${today}T00:00:00`)
        ]);

        const total = (completed.count || 0) + (rejected.count || 0);

        return {
            pending: pendingCount || 0,
            approvedToday: completed.count || 0,
            rejectedToday: rejected.count || 0,
            totalReviewedToday: total
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { pending: 0, approvedToday: 0, rejectedToday: 0, totalReviewedToday: 0 };
    }
}

/**
 * Display submissions in admin list
 */
function displayAdminSubmissions(submissions) {
    const container = document.getElementById('adminSubmissionsList');

    // Return early if container doesn't exist (modal closed)
    if (!container) {
        console.log('ℹ️ Submissions container not found - admin panel may be closed');
        return;
    }

    if (!submissions || submissions.length === 0) {
        container.innerHTML = '<div class="loading">✅ No submissions pending review</div>';
        return;
    }

    container.innerHTML = submissions
        .map(s => createSubmissionItemHTML(s))
        .join('');
}

/**
 * Create submission item HTML
 */
/**
 * Get friendly status label for display
 */
function getStatusLabel(status) {
    const labels = {
        'pending': '⏳ Pending Review',
        'admin_pending': '⏳ Admin Pending',
        'completed': '✅ Approved',
        'rejected': '❌ Rejected'
    };
    return labels[status] || status;
}

/**
 * Get status badge style class
 */
function getStatusClass(status) {
    const classes = {
        'pending': 'status-pending',
        'admin_pending': 'status-admin-pending',
        'completed': 'status-completed',
        'rejected': 'status-rejected'
    };
    return classes[status] || 'status-pending';
}

function createSubmissionItemHTML(submission) {
    const username = submission.username || 'Unknown User';
    const date = new Date(submission.submitted_at).toLocaleDateString();
    const aiSummary = submission.ai_review ? submission.ai_review.substring(0, 100) + '...' : 'Pending AI review';
    const statusLabel = getStatusLabel(submission.status);
    const statusClass = getStatusClass(submission.status);

    return `
        <div class="submission-item">
            <div class="submission-info">
                <h4>${username} - Challenge ${submission.challenge_id}</h4>
                <div class="submission-meta">
                    <span>📚 Topic ${submission.topic_id}</span>
                    <span>📅 ${date}</span>
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                </div>
                <div class="ai-feedback">
                    🤖 AI Review: ${aiSummary}
                </div>
            </div>
            <div class="submission-actions">
                <button onclick="viewAdminSubmission('${submission.challenge_id}', '${username}')" class="btn-view">👁️ View</button>
                <button class="btn-approve" data-challenge="${submission.challenge_id}" data-username="${username}" onclick="handleApproval(this)">✅ Approve</button>
                <button class="btn-reject" data-challenge="${submission.challenge_id}" data-username="${username}" onclick="handleRejection(this)">❌ Reject</button>
            </div>
        </div>
    `;
}

/**
 * Display statistics
 */
function displayAdminStats(stats) {
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('statApproved').textContent = stats.approvedToday;
    document.getElementById('statRejected').textContent = stats.rejectedToday;
    document.getElementById('statTotal').textContent = stats.totalReviewedToday;
}

/**
 * Show approval comments dialog
 */
function showApproveCommentDialog(challengeId, username) {
    showReviewCommentDialog('approve', challengeId, username);
}

/**
 * Show rejection comments dialog
 */
function showRejectCommentDialog(challengeId, username) {
    showReviewCommentDialog('reject', challengeId, username);
}

/**
 * Show review comment dialog (approve or reject)
 */
function showReviewCommentDialog(action, challengeId, username) {
    const isApprove = action === 'approve';
    const title = isApprove ? '✅ Approve Submission' : '❌ Reject Submission';
    const buttonText = isApprove ? 'Approve' : 'Reject';
    const buttonColor = isApprove ? '#4CAF50' : '#f44336';
    const message = isApprove 
        ? 'Please add feedback or remarks for this submission:'
        : 'Please provide a reason for rejection:';

    const dialog = document.createElement('div');
    dialog.className = 'comment-dialog-overlay';
    dialog.id = 'commentDialog';
    dialog.innerHTML = `
        <div class="comment-dialog">
            <div class="comment-dialog-header">
                <h3>${title}</h3>
                <button class="comment-dialog-close" onclick="closeCommentDialog()">✕</button>
            </div>
            <div class="comment-dialog-body">
                <p>${message}</p>
                <textarea id="commentTextarea" class="comment-textarea" placeholder="Type your remarks here..." rows="6"></textarea>
                <div class="comment-char-count">
                    <span id="charCount">0</span> / 1000 characters
                </div>
            </div>
            <div class="comment-dialog-footer">
                <button class="btn-cancel" onclick="closeCommentDialog()">Cancel</button>
                <button class="btn-clear" onclick="clearCommentText()">Clear</button>
                <button class="btn-confirm" style="background-color: ${buttonColor};" onclick="${isApprove ? 'confirmApproveWithComment' : 'confirmRejectWithComment'}('${challengeId}', '${username}')">${buttonText}</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    addAdminPanelStyles();  // This will add styles including comment dialog styles
    
    // Focus textarea and setup character counter
    const textarea = document.getElementById('commentTextarea');
    textarea.focus();
    
    textarea.addEventListener('input', () => {
        const count = textarea.value.length;
        document.getElementById('charCount').textContent = Math.min(count, 1000);
        textarea.value = textarea.value.substring(0, 1000);
    });
}

/**
 * Close comment dialog
 */
function closeCommentDialog() {
    const dialog = document.getElementById('commentDialog');
    if (dialog) dialog.remove();
}

/**
 * Clear comment text
 */
function clearCommentText() {
    const textarea = document.getElementById('commentTextarea');
    if (textarea) {
        textarea.value = '';
        document.getElementById('charCount').textContent = '0';
        textarea.focus();
    }
}

/**
 * Confirm approve with comment
 */
async function confirmApproveWithComment(challengeId, username) {
    const comment = document.getElementById('commentTextarea').value;
    console.log('💬 Approval Comment Submitted:', {
        challengeId,
        username,
        commentLength: comment.length,
        commentPreview: comment.substring(0, 100)
    });
    closeCommentDialog();
    await approveAdminSubmission(challengeId, username, comment);
}

/**
 * Confirm reject with comment
 */
async function confirmRejectWithComment(challengeId, username) {
    const comment = document.getElementById('commentTextarea').value;
    if (!comment.trim()) {
        showNotification('⚠️ Please provide a reason for rejection', 'error');
        return;
    }
    console.log('❌ Rejection Comment Submitted:', {
        challengeId,
        username,
        commentLength: comment.length,
        commentPreview: comment.substring(0, 100)
    });
    closeCommentDialog();
    await rejectAdminSubmission(challengeId, username, comment);
}

/**
 * Approve submission (closes modal and refreshes submission lists)
 */
async function approveAdminSubmission(challengeId, username, comment = '') {

    try {
        console.log('✅ === APPROVING SUBMISSION ===');
        console.log('Challenge ID:', challengeId);
        console.log('Username:', username);
        console.log('Comment provided:', !!comment);
        
        // Update submission status to completed
        await updateSubmissionStatusByChallenge(
            username,
            challengeId,
            'completed',
            comment || 'Approved by admin reviewer.'
        );

        // Mark challenge as completed for user
        await markChallengeCompleted(challengeId, username);

        console.log('✅ === APPROVAL COMPLETE ===\n');
        
        // Close the preview modal FIRST
        closeAdminSubmissionViewModal();
        
        // Show success notification
        showNotification('✅ Submission approved', 'success');
        
        // Refresh all submission displays
        await refreshAllSubmissionLists(challengeId);
    } catch (error) {
        console.error('❌ Error approving submission:', error);
        showNotification(`❌ Error approving submission: ${error.message}`, 'error');
    }
}

/**
 * Reject submission (closes modal and refreshes submission lists)
 */
async function rejectAdminSubmission(challengeId, username, feedback = '') {
    try {
        console.log('❌ === REJECTING SUBMISSION ===');
        console.log('Challenge ID:', challengeId);
        console.log('Username:', username);
        console.log('Feedback provided:', !!feedback);
        
        await updateSubmissionStatusByChallenge(
            username,
            challengeId,
            'rejected',
            feedback || 'Rejected by admin reviewer. Please resubmit.'
        );

        console.log('❌ === REJECTION COMPLETE ===\n');
        
        // Close the preview modal FIRST
        closeAdminSubmissionViewModal();
        
        // Show success notification
        showNotification('❌ Submission rejected', 'success');
        
        // Refresh all submission displays
        await refreshAllSubmissionLists(challengeId);
    } catch (error) {
        console.error('❌ Error rejecting submission:', error);
        showNotification(`❌ Error rejecting submission: ${error.message}`, 'error');
    }
}

/**
 * View submission details (with guard against duplicate modals)
 */
async function viewAdminSubmission(challengeId, username) {
    try {
        // Close any existing modal first
        closeAdminSubmissionViewModal();
        
        console.log('📂 viewAdminSubmission called with:', { challengeId, username });
        const submission = await getSubmissionForAdmin(challengeId, username);
        console.log('📊 Returned submission from getSubmissionForAdmin:', submission);
        if (!submission) {
            console.error('❌ CRITICAL: getSubmission returned null/undefined');
            showNotification('❌ Submission not found', 'error');
            return;
        }
        console.log('✅ About to display modal with submission:', submission.challenge_id);
        displayAdminSubmissionViewModal(submission);
    } catch (error) {
        console.error('❌ Error in viewAdminSubmission:', error);
        showNotification(`❌ Error loading submission: ${error.message}`, 'error');
    }
}

/**
 * Apply admin filters
 */
async function applyAdminFilters() {
    const topic = document.getElementById('filterTopic').value;
    const status = document.getElementById('filterStatus').value;

    try {
        const supabase = window.supabaseInstance;
        if (!supabase) throw new Error('Supabase not initialized');
        let query = supabase
            .from('submissions')
            .select(`
                username,
                topic_id,
                challenge_id,
                status,
                ai_review,
                submitted_at,
                file_name
            `);

        if (topic) query = query.eq('topic_id', topic);
        if (status) query = query.eq('status', status);

        const { data, error } = await query.limit(100);
        if (error) throw error;

        console.log('✅ Filtered submissions:', data?.length || 0);
        displayAdminSubmissions(data);
    } catch (error) {
        showNotification(`❌ Filter error: ${error.message}`, 'error');
    }
}

/**
 * Close admin panel
 */
function closeAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) panel.remove();
}

/**
 * Get submission details from Supabase using challenge_id (gets most recent)
 */
async function getSubmissionForAdmin(challengeId, username = null) {
    try {
        const supabase = window.supabaseInstance;
        if (!supabase) throw new Error('Supabase not initialized');
        
        console.log('🔍 Fetching submission (admin):', { challengeId, username });
        
        let query = supabase
            .from('submissions')
            .select(`
                username,
                topic_id,
                challenge_id,
                status,
                file_content,
                file_name,
                ai_review,
                feedback,
                submitted_at
            `)
            .eq('challenge_id', challengeId);
        
        // If username provided, fetch specific user's submission
        if (username) {
            query = query.eq('username', username);
            console.log('🔑 Added username filter:', username);
        }
        
        // Order by most recent and get first (latest)
        const result = await query
            .order('submitted_at', { ascending: false })
            .limit(1);

        console.log('📦 Query raw result:', { data: result.data, error: result.error });
        
        if (result.error) {
            console.error('❌ Supabase query error:', result.error);
            return null;
        }

        // result.data is array; take first item or return null if empty
        const data = Array.isArray(result.data) && result.data.length > 0 ? result.data[0] : null;
        
        if (!data) {
            console.warn('⚠️ No data returned from query');
            return null;
        }
        
        console.log('✅ Submission found, all fields:', data);
        console.log('📋 Field breakdown:', {
            username: data.username,
            topic_id: data.topic_id,
            challenge_id: data.challenge_id,
            status: data.status,
            file_name: data.file_name,
            file_content_length: data.file_content ? data.file_content.length : 0,
            file_content_preview: data.file_content ? data.file_content.substring(0, 100) : 'MISSING',
            ai_review_exists: !!data.ai_review,
            ai_review_length: data.ai_review ? data.ai_review.length : 0,
            ai_review_preview: data.ai_review ? data.ai_review.substring(0, 100) : 'MISSING',
            feedback_exists: !!data.feedback,
            feedback_length: data.feedback ? data.feedback.length : 0,
            feedback_preview: data.feedback ? data.feedback.substring(0, 100) : 'NO ADMIN REMARKS YET',
            submitted_at: data.submitted_at
        });
        return data;
    } catch (error) {
        console.error('❌ Exception in getSubmissionForAdmin:', error);
        return null;
    }
}

/**
 * Update submission status in Supabase by username and challenge_id
 */
async function updateSubmissionStatusByChallenge(username, challengeId, status, feedback = '') {
    try {
        const supabase = window.supabaseInstance;
        if (!supabase) throw new Error('Supabase not initialized');
        
        console.log('💾 === SAVING SUBMISSION UPDATE TO DATABASE ===');
        console.log('Username:', username);
        console.log('Challenge ID:', challengeId);
        console.log('Status:', status);
        console.log('Feedback/Remarks length:', feedback.length);
        console.log('Feedback preview:', feedback.substring(0, 100) + (feedback.length > 100 ? '...' : ''));
        
        const { data, error } = await supabase
            .from('submissions')
            .update({
                status: status,
                feedback: feedback,
                submitted_at: new Date().toISOString()
            })
            .eq('username', username)
            .eq('challenge_id', challengeId)
            .select();

        if (error) throw error;
        
        console.log('✅ SUCCESSFULLY SAVED TO DATABASE');
        console.log('Submission status updated:', challengeId, 'to', status);
        console.log('Feedback saved to database:', !!feedback);
        console.log('💾 === END DATABASE SAVE ===\n');
        
        // Send Discord webhook notification
        if (window.discord) {
            try {
                if (status === 'completed') {
                    if (window.discord.notifyCompleted) {
                        await window.discord.notifyCompleted(username, challengeId, feedback);
                    }
                } else if (status === 'rejected') {
                    if (window.discord.notifyRejected) {
                        await window.discord.notifyRejected(username, challengeId, feedback);
                    }
                }
            } catch (discordError) {
                console.warn('⚠️ Discord notification failed (non-critical):', discordError);
                // Don't throw - Discord notification shouldn't block the status update
            }
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error updating submission status:', error);
        throw error;
    }
}

/**
 * Mark challenge as completed for user
 */
async function markChallengeCompleted(challengeId, username) {
    try {
        // This updates the user's completed challenges list
        // Get the current user or use provided username
        const user = getCurrentUser();
        if (!user && !username) {
            throw new Error('User context not available');
        }

        const targetUsername = username || user.username;

        // Update user profile with completed challenge
        const supabase = window.supabaseInstance;
        if (!supabase) throw new Error('Supabase not initialized');
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('profile')
            .eq('username', targetUsername)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (!userData) {
            console.warn('User not found:', targetUsername);
            return;
        }

        // Ensure profile exists and has completed_challenges array
        const profile = userData.profile || {};
        let completedChallenges = profile.completed_challenges || [];

        // Add challenge if not already there
        if (!completedChallenges.includes(challengeId)) {
            completedChallenges.push(challengeId);
        }

        // Update profile
        const updatedProfile = {
            ...profile,
            completed_challenges: completedChallenges
        };

        const { error: updateError } = await supabase
            .from('users')
            .update({ profile: updatedProfile })
            .eq('username', targetUsername);

        if (updateError) throw updateError;
        console.log('✅ Challenge marked as completed:', challengeId, 'for', targetUsername);
    } catch (error) {
        console.error('Error marking challenge completed:', error);
        throw error;
    }
}

/**
 * Display admin submission view modal
 */
function displayAdminSubmissionViewModal(submission) {
    try {
        console.log('🎬 displayAdminSubmissionViewModal called, submission:', submission);
        if (!submission) {
            console.error('❌ Submission is null/undefined in displayAdminSubmissionViewModal');
            showNotification('❌ Submission not found', 'error');
            return;
        }

        console.log('📌 Submission status:', submission.status);
        const statusLabel = getStatusLabel(submission.status);
        const statusClass = getStatusClass(submission.status);
        console.log('🏷️ Status label:', statusLabel);
        console.log('🎨 Status class:', statusClass);

        const isApproved = submission.status === 'completed';
        const isRejected = submission.status === 'rejected';
        const isDecided = isApproved || isRejected;

        console.log('✔️ Modal setup: isApproved:', isApproved, 'isRejected:', isRejected);

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'adminSubmissionViewModal';
        console.log('📋 Creating modal HTML...');
        
        // Build the status badge HTML safely
        const statusBadgeHtml = `<span class="status-badge ${statusClass}">${statusLabel}</span>`;
        
        // DEBUG: Log what we're about to insert
        console.log('🔧 TEMPLATE DATA CHECK:', {
            file_content_exists: !!submission.file_content,
            file_content_length: submission.file_content ? submission.file_content.length : 0,
            ai_review_exists: !!submission.ai_review,
            ai_review_length: submission.ai_review ? submission.ai_review.length : 0
        });
        
        // Build sections separately to avoid template literal issues
        const codeSection = submission.file_content
            ? `<div class="code-preview"><pre><code>${escapeHtml(submission.file_content)}</code></pre></div>`
            : '<div style="color: #999; padding: 10px;">⚠️ No code provided</div>';

        const challenge = window.getChallengeSolution ? window.getChallengeSolution(submission.challenge_id) : null;
        const challengeSection = challenge
            ? `<div class="detail-section challenge-section"><h4>📌 Challenge Details</h4><p><strong>Title:</strong> ${escapeHtml(challenge.title || submission.challenge_id)}</p><p><strong>Problem:</strong></p><div class="challenge-text-box">${escapeHtml(challenge.problem || 'No problem statement available')}</div>${challenge.expectedOutput ? `<p><strong>Expected Output:</strong></p><div class="challenge-text-box challenge-output">${escapeHtml(challenge.expectedOutput)}</div>` : ''}</div>`
            : `<div class="detail-section challenge-section" style="background: #fff8e1; border-left: 3px solid #ffb300;"><h4>📌 Challenge Details</h4><p>Challenge context could not be loaded for <strong>${escapeHtml(submission.challenge_id)}</strong>.</p></div>`;

        const comparisonSection = `<div class="detail-section comparison-section"><h4>🔍 Compare Submission</h4><div class="comparison-grid"><div class="comparison-panel"><h5>Submitted Code</h5>${codeSection}</div><div class="comparison-panel"><h5>Reference Solution</h5>${challenge && challenge.solution ? `<div class="code-preview reference-code"><pre><code>${escapeHtml(challenge.solution)}</code></pre></div>` : '<div class="challenge-text-box">No reference solution available.</div>'}</div></div></div>`;
        
        const reviewSection = submission.ai_review
            ? `<div class="detail-section"><h4>🤖 AI Feedback</h4><div class="ai-feedback-box">${submission.ai_review}</div></div>`
            : `<div class="detail-section" style="background: #fff3cd; border-left: 3px solid #ffc107; padding: 15px;"><h4>⏳ AI Feedback Status</h4><p>This submission has not been reviewed by AI yet.</p></div>`;
        
        const adminFeedbackSection = submission.feedback
            ? `<div class="detail-section" style="background: #f3e5f5; border-left: 3px solid #9c27b0;"><h4>💬 Admin Remarks</h4><div class="admin-feedback-box">${escapeHtml(submission.feedback)}</div></div>`
            : '';
        
        const approvalSection = isDecided
            ? `<div class="detail-section" style="background: ${isApproved ? '#e8f5e9' : '#ffebee'}; border-left: 3px solid ${isApproved ? '#4CAF50' : '#f44336'};"><h4>${isApproved ? '✅ Approved' : '❌ Rejected'}</h4><p>${isApproved ? 'This submission has been approved.' : 'This submission has been rejected.'}</p></div>`
            : '';
        
        const buttons = !isDecided
            ? `<button class="btn-approve" data-challenge="${submission.challenge_id}" data-username="${submission.username}" onclick="handleApproval(this)">✅ Approve</button><button class="btn-reject" data-challenge="${submission.challenge_id}" data-username="${submission.username}" onclick="handleRejection(this)">❌ Reject</button>`
            : '';
        
        console.log('✅ All sections built successfully');
        
        modal.innerHTML = `
        <div class="modal-content submission-view-modal">
            <div class="modal-header">
                <h3>Submission Detail - ${submission.username}</h3>
                <button class="modal-close" onclick="closeAdminSubmissionViewModal()">✕</button>
            </div>
            
            <div class="modal-body">
                <div class="submission-details">
                    <div class="detail-section">
                        <h4>📋 Challenge Info</h4>
                        <p><strong>Challenge ID:</strong> ${submission.challenge_id}</p>
                        <p><strong>Topic:</strong> ${submission.topic_id}</p>
                        <p><strong>User:</strong> ${submission.username}</p>
                        <p><strong>Status:</strong> ${statusBadgeHtml}</p>
                        <p><strong>Submitted:</strong> ${new Date(submission.submitted_at).toLocaleString()}</p>
                    </div>

                    ${challengeSection}

                    ${comparisonSection}

                    ${reviewSection}
                    ${adminFeedbackSection}
                    ${approvalSection}
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeAdminSubmissionViewModal()">Close</button>
                ${buttons}
            </div>
        </div>
    `;

        console.log('🔌 Appending modal to DOM...');
        console.log('📐 Modal dimensions before append:', {
            offsetHeight: modal.offsetHeight,
            offsetWidth: modal.offsetWidth,
            innerHTML_length: modal.innerHTML.length,
            innerHTML_firstChars: modal.innerHTML.substring(0, 100)
        });
        document.body.appendChild(modal);
        console.log('✅ Modal successfully appended to DOM');
        console.log('📐 Modal dimensions after append:', {
            offsetHeight: modal.offsetHeight,
            offsetWidth: modal.offsetWidth,
            isVisible: modal.offsetHeight > 0 ? 'YES' : 'NO (height=0)',
            computedStyle: window.getComputedStyle(modal).display
        });
    } catch (error) {
        console.error('❌ CRITICAL error in displayAdminSubmissionViewModal:', error);
        console.error('❌ Error stack:', error.stack);
        showNotification(`❌ Error displaying modal: ${error.message}`, 'error');
    }
}

/**
 * Close admin submission view modal
 */
function closeAdminSubmissionViewModal() {
    const modal = document.getElementById('adminSubmissionViewModal');
    if (modal) modal.remove();
}

/**
 * Add styles for submission view modal
 */
function addSubmissionViewModalStyles() {
    if (document.getElementById('submissionViewModalStyles')) return;

    const style = document.createElement('style');
    style.id = 'submissionViewModalStyles';
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .modal-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
            max-height: 90vh;
            overflow-y: auto;
            max-width: 900px;
        }

        .submission-view-modal {
            width: 95%;
        }

        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9f9f9;
        }

        .modal-header h3 {
            margin: 0;
            color: #333;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }

        .modal-close:hover {
            color: #333;
        }

        .modal-body {
            padding: 20px;
        }

        .submission-details {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .detail-section {
            padding: 15px;
            background: #f5f5f5;
            border-radius: 6px;
            border-left: 3px solid #2196F3;
        }

        .detail-section h4 {
            margin: 0 0 10px 0;
            color: #333;
        }

        .detail-section p {
            margin: 5px 0;
            color: #555;
            font-size: 14px;
        }

        .challenge-section .challenge-text-box {
            margin-top: 8px;
            padding: 12px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            color: #444;
            white-space: pre-wrap;
            line-height: 1.6;
        }

        .challenge-section .challenge-output {
            background: #f8fafc;
        }

        .comparison-section {
            background: #f8f9fa;
        }

        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 16px;
        }

        .comparison-panel h5 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #333;
        }

        .comparison-panel .code-preview {
            height: 100%;
        }

        .comparison-panel .code-preview pre {
            max-height: 420px;
            overflow: auto;
        }

        .comparison-panel .challenge-text-box {
            margin-top: 0;
            height: 100%;
            max-height: 420px;
            overflow: auto;
        }

        .code-preview {
            background: #1e1e1e;
            color: #d4d4d4;
            border-radius: 4px;
            overflow-x: auto;
        }

        .code-preview pre {
            margin: 0;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
        }

        .code-preview code {
            color: #d4d4d4;
        }

        .ai-feedback-box {
            background: #f0f7ff;
            padding: 12px;
            border-radius: 4px;
            border-left: 3px solid #2196F3;
            color: #555;
            font-size: 13px;
            line-height: 1.6;
        }

        .admin-feedback-box {
            background: #f3e5f5;
            padding: 12px;
            border-radius: 4px;
            border-left: 3px solid #9c27b0;
            color: #5e35b1;
            font-size: 13px;
            line-height: 1.6;
        }

        .modal-footer {
            padding: 15px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            background: #f9f9f9;
        }

        .btn-secondary {
            padding: 8px 16px;
            background: #e0e0e0;
            color: #333;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }

        .btn-secondary:hover {
            background: #d0d0d0;
        }

        @media (max-width: 720px) {
            .comparison-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}

/**
 * Handle approval button click
 */
function handleApproval(button) {
    const challengeId = button.getAttribute('data-challenge');
    const username = button.getAttribute('data-username');
    console.log('🎯 Approve button clicked - Challenge:', challengeId, 'Username:', username);
    showApproveCommentDialog(challengeId, username);
}

/**
 * Handle rejection button click
 */
function handleRejection(button) {
    const challengeId = button.getAttribute('data-challenge');
    const username = button.getAttribute('data-username');
    console.log('🎯 Reject button clicked - Challenge:', challengeId, 'Username:', username);
    showRejectCommentDialog(challengeId, username);
}

/**
 * Export functions to global scope
 */
window.loadAdminDashboard = loadAdminDashboard;
window.handleApproval = handleApproval;
window.handleRejection = handleRejection;
window.closeAdminPanel = closeAdminPanel;
window.showApproveCommentDialog = showApproveCommentDialog;
window.showRejectCommentDialog = showRejectCommentDialog;
window.showReviewCommentDialog = showReviewCommentDialog;
window.closeCommentDialog = closeCommentDialog;
window.clearCommentText = clearCommentText;
window.confirmApproveWithComment = confirmApproveWithComment;
window.confirmRejectWithComment = confirmRejectWithComment;
window.approveAdminSubmission = approveAdminSubmission;
window.rejectAdminSubmission = rejectAdminSubmission;
window.viewAdminSubmission = viewAdminSubmission;
window.applyAdminFilters = applyAdminFilters;
window.getSubmissionForAdmin = getSubmissionForAdmin;
window.updateSubmissionStatus = updateSubmissionStatus;
window.markChallengeCompleted = markChallengeCompleted;
window.displayAdminSubmissionViewModal = displayAdminSubmissionViewModal;
window.closeAdminSubmissionViewModal = closeAdminSubmissionViewModal;
window.refreshAllSubmissionLists = refreshAllSubmissionLists;
window.refreshChallengeSubmissionsList = refreshChallengeSubmissionsList;
window.refreshLatestSubmissionsDashboard = refreshLatestSubmissionsDashboard;
window.updateHeaderStats = updateHeaderStats;
