/**
 * UI Components for Challenge Submission and Authentication
 * Login/Signup modal, file upload form, completion indicators
 */

/**
 * Challenge Solutions Map
 * Maps challenge IDs to their reference solutions with problem details and expected output
 */
const CHALLENGE_SOLUTIONS = {
    'challenge_1': {
        title: 'Challenge 1: Print a Triangle',
        problem: 'Write a program that prints a pyramid pattern using nested loops. Each row should have increasing number of asterisks.',
        expectedOutput: '*\n* *\n* * *\n* * * *\n* * * * *',
        solution: `for (int i = 1; i <= 5; i++) {
    // Print i asterisks
    for (int j = 0; j < i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}`
    },
    'challenge_2': {
        title: 'Challenge 2: Sum Until Zero',
        problem: 'Write a while loop that continuously sums numbers. The simulated input sequence is: 5, 10, 3, 0. Stop when 0 is entered and print the sum.',
        expectedOutput: 'Sum: 18',
        solution: `int[] numbers = {5, 10, 3, 0};
int sum = 0;
int index = 0;
while (numbers[index] != 0) {
    sum += numbers[index];
    index++;
}
System.out.println("Sum: " + sum);`
    },
    'challenge_3': {
        title: 'Challenge 3: Find First Multiple',
        problem: 'Find and print the first number divisible by both 3 and 5 in the range from 1 to 100.',
        expectedOutput: 'First multiple of 3 and 5: 15',
        solution: `for (int i = 1; i <= 100; i++) {
    if (i % 3 == 0 && i % 5 == 0) {
        System.out.println("First multiple of 3 and 5: " + i);
        break;
    }
}`
    },
    'challenge_4': {
        title: 'Challenge 4: Skip Multiples',
        problem: 'Print all numbers from 1 to 20, but skip any that are multiples of 3. Use the continue statement.',
        expectedOutput: '1 2 4 5 7 8 10 11 13 14 16 17 19 20',
        solution: `for (int i = 1; i <= 20; i++) {
    if (i % 3 == 0) continue;
    System.out.print(i + " ");
}`
    },
    'challenge_5': {
        title: 'Challenge 5: Multiplication Table',
        problem: 'Generate a 10×10 multiplication table (1-10) with proper formatting. Display table headers and align numbers in columns.',
        expectedOutput: '       1   2   3   4   5   6   7   8   9  10\n   1   1   2   3   4   5   6   7   8   9  10\n   2   2   4   6   8  10  12  14  16  18  20\n   3   3   6   9  12  15  18  21  24  27  30',
        solution: `// Print header
System.out.print("    ");
for (int i = 1; i <= 10; i++) {
    System.out.printf("%4d", i);
}
System.out.println();

// Print rows
for (int i = 1; i <= 10; i++) {
    System.out.printf("%4d", i);
    for (int j = 1; j <= 10; j++) {
        System.out.printf("%4d", i * j);
    }
    System.out.println();
}`
    },
    'challenge_6': {
        title: 'Challenge 6: Reverse Array',
        problem: 'Create an array of 5 numbers (10, 20, 30, 40, 50) and reverse it using index traversal without using built-in reverse functions.',
        expectedOutput: 'Original: 10 20 30 40 50\nReversed: 50 40 30 20 10',
        solution: `int[] arr = {10, 20, 30, 40, 50};

// Print original
System.out.print("Original: ");
for (int num : arr) System.out.print(num + " ");
System.out.println();

// Reverse in-place
for (int i = 0; i < arr.length / 2; i++) {
    int temp = arr[i];
    arr[i] = arr[arr.length - 1 - i];
    arr[arr.length - 1 - i] = temp;
}

// Print reversed
System.out.print("Reversed: ");
for (int num : arr) System.out.print(num + " ");`
    }
};

/**
 * Topic mappings
 */
const TOPIC_MAP = {
    'loops': 'Loop Structures',
    'foreach': 'For-Each Loop',
    'recursion': 'Recursion',
    'arrays2d': '2D Arrays',
    'arraylist': 'ArrayList',
    'oop': 'OOP Basics',
    'default': 'General'
};

/**
 * Challenge to topic mapping
 */
const CHALLENGE_TO_TOPIC = {
    'challenge_1': 'loops',
    'challenge_2': 'loops',
    'challenge_3': 'loops',
    'challenge_4': 'loops',
    'challenge_5': 'loops',
    'challenge_6': 'foreach'
};

/**
 * Get challenge solution by ID - dynamically from topicsData
 * Maps new format (loops_challenge_2) to actual challenge details
 */
function getChallengeSolution(challengeId) {
    // First check legacy CHALLENGE_SOLUTIONS
    if (CHALLENGE_SOLUTIONS[challengeId]) {
        return CHALLENGE_SOLUTIONS[challengeId];
    }

    // Parse new format: topicId_challenge_number
    const match = challengeId.match(/^(.+?)_challenge_(\d+)$/);
    if (!match) {
        console.warn('⚠️ Invalid challenge ID format:', challengeId);
        return null;
    }

    const [, topicId, challengeNum] = match;
    const topic = topicsData[topicId];
    
    if (!topic) {
        console.warn('⚠️ Topic not found:', topicId);
        return null;
    }

    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = topic.challenges;
        
        const challengeItems = tempDiv.querySelectorAll('.challenge-item');
        if (challengeItems.length >= challengeNum) {
            const item = challengeItems[challengeNum - 1]; // 0-indexed
            
            // Extract challenge details
            const titleElement = item.querySelector('strong');
            const title = titleElement ? titleElement.textContent : `Challenge ${challengeNum}`;
            
            const descElement = item.querySelector('.challenge-description');
            const problem = descElement ? descElement.textContent.trim() : '';
            
            let expectedOutput = '';
            const outputElement = item.querySelector('.expected-output');
            if (outputElement) {
                expectedOutput = outputElement.textContent.trim();
            }
            
            // Try to extract solution from the code block
            let solution = '';
            const solutionElement = item.querySelector('.code-block[style*="display"]');
            if (solutionElement) {
                solution = solutionElement.textContent.trim();
            } else {
                // Look for any code block
                const codeBlock = item.querySelector('.code-block');
                if (codeBlock) {
                    solution = codeBlock.textContent.trim();
                }
            }
            
            return {
                title,
                problem,
                expectedOutput,
                solution,
                topicId,
                challengeNum
            };
        }
    } catch (error) {
        console.error('Error extracting challenge from topicsData:', error, {challengeId, topicId, challengeNum});
    }

    console.warn('⚠️ Challenge not found in topicsData:', {challengeId, topicId, challengeNum});
    return null;
}

/**
 * Show toast notification
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/**
 * Create and display login/signup modal
 */
function createAuthModal() {
    console.log('🔐 createAuthModal() called');
    
    if (document.getElementById('authModal')) {
        console.log('✅ Auth modal already exists');
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-container">
            <div class="auth-header">
                <h2>🔐 Coding Reviewer</h2>
                <button onclick="closeAuthModal()" class="close-btn">✕</button>
            </div>

            <!-- Login Tab -->
            <div id="loginTab" class="auth-tab active">
                <h3>Login</h3>
                <form onsubmit="handleLogin(event)">
                    <input type="text" id="loginUsername" placeholder="Username" required>
                    <input type="password" id="loginPassword" placeholder="Password" required>
                    <button type="submit" class="btn-primary">Login</button>
                </form>
                <p class="auth-switch">Don't have an account? <a onclick="switchAuthTab('signup')">Sign up</a></p>
            </div>

            <!-- Signup Tab -->
            <div id="signupTab" class="auth-tab">
                <h3>Create Account</h3>
                <form onsubmit="handleSignup(event)">
                    <input type="text" id="signupUsername" placeholder="Username (3+ chars)" required>
                    <input type="password" id="signupPassword" placeholder="Password (6+ chars)" required>
                    <input type="password" id="signupConfirm" placeholder="Confirm Password" required>
                    
                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333; font-size: 14px;">Choose Your Avatar:</label>
                        <div style="display: flex; gap: 8px; justify-content: space-around; flex-wrap: wrap;" id="avatarSelector">
                            <button type="button" class="avatar-btn" data-avatar="logo/usericon1.png" onclick="selectAvatar('logo/usericon1.png', event)" style="width: 50px; height: 50px; padding: 4px; border: 2px solid #ddd; border-radius: 50%; background: white; cursor: pointer; transition: all 0.2s; overflow: hidden;"><img src="logo/usericon1.png" alt="avatar1" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></button>
                            <button type="button" class="avatar-btn" data-avatar="logo/usericon2.png" onclick="selectAvatar('logo/usericon2.png', event)" style="width: 50px; height: 50px; padding: 4px; border: 2px solid #ddd; border-radius: 50%; background: white; cursor: pointer; transition: all 0.2s; overflow: hidden;"><img src="logo/usericon2.png" alt="avatar2" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></button>
                            <button type="button" class="avatar-btn" data-avatar="logo/usericon3.png" onclick="selectAvatar('logo/usericon3.png', event)" style="width: 50px; height: 50px; padding: 4px; border: 2px solid #ddd; border-radius: 50%; background: white; cursor: pointer; transition: all 0.2s; overflow: hidden;"><img src="logo/usericon3.png" alt="avatar3" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></button>
                            <button type="button" class="avatar-btn" data-avatar="logo/usericon4.png" onclick="selectAvatar('logo/usericon4.png', event)" style="width: 50px; height: 50px; padding: 4px; border: 2px solid #ddd; border-radius: 50%; background: white; cursor: pointer; transition: all 0.2s; overflow: hidden;"><img src="logo/usericon4.png" alt="avatar4" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></button>
                            <button type="button" class="avatar-btn" data-avatar="logo/usericon5.png" onclick="selectAvatar('logo/usericon5.png', event)" style="width: 50px; height: 50px; padding: 4px; border: 2px solid #ddd; border-radius: 50%; background: white; cursor: pointer; transition: all 0.2s; overflow: hidden;"><img src="logo/usericon5.png" alt="avatar5" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></button>
                        </div>
                        <input type="hidden" id="selectedAvatar" value="">
                    </div>
                    
                    <button type="submit" class="btn-primary">Sign Up</button>
                </form>
                <p class="auth-switch">Already have an account? <a onclick="switchAuthTab('login')">Login</a></p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    console.log('✅ Auth modal added to DOM');
    addAuthModalStyles();
}

/**
 * Add CSS styles for auth modal
 */
function addAuthModalStyles() {
    if (document.getElementById('authModalStyles')) return;

    const style = document.createElement('style');
    style.id = 'authModalStyles';
    style.textContent = `
        .auth-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        }

        .auth-container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .auth-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid var(--primary-color, #4CAF50);
            padding-bottom: 15px;
        }

        .auth-header h2 {
            margin: 0;
            color: var(--primary-color, #4CAF50);
        }

        .auth-tab {
            display: none;
        }

        .auth-tab.active {
            display: block;
        }

        .auth-tab h3 {
            margin: 15px 0;
            color: #333;
        }

        .auth-tab form {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .auth-tab input {
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }

        .auth-tab input:focus {
            outline: none;
            border-color: var(--primary-color, #4CAF50);
            box-shadow: 0 0 4px rgba(76, 175, 80, 0.2);
        }

        .auth-tab .btn-primary {
            padding: 10px;
            background: var(--primary-color, #4CAF50);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }

        .auth-tab .btn-primary:hover {
            background: #45a049;
        }

        .auth-switch {
            text-align: center;
            margin-top: 15px;
            font-size: 13px;
            color: #666;
        }

        .auth-switch a {
            color: var(--primary-color, #4CAF50);
            cursor: pointer;
            font-weight: bold;
        }

        .auth-switch a:hover {
            text-decoration: underline;
        }
    `;

    document.head.appendChild(style);
    console.log('✅ Auth modal styles added');
}

/**
 * Switch between login and signup tabs
 */
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
}

/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await window.logIn(username, password);
        closeAuthModal();
        showNotification('✅ Login successful!', 'success');
        setTimeout(() => location.reload(), 800);
    } catch (error) {
        showNotification(`❌ Login failed: ${error.message}`, 'error');
    }
}

/**
 * Select avatar for signup
 */
function selectAvatar(avatar, event) {
    event.preventDefault();
    
    // Update hidden input
    document.getElementById('selectedAvatar').value = avatar;
    
    // Update button styles
    document.querySelectorAll('.avatar-btn').forEach(btn => {
        btn.style.borderColor = '#ddd';
        btn.style.boxShadow = 'none';
    });
    
    // Highlight selected button (find parent button if clicked on img)
    let button = event.target;
    if (button.tagName !== 'BUTTON') {
        button = button.closest('button');
    }
    if (button) {
        button.style.borderColor = '#4CAF50';
        button.style.boxShadow = '0 0 8px rgba(76, 175, 80, 0.5)';
    }
}

/**
 * Handle signup form submission
 */
async function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const selectedAvatar = document.getElementById('selectedAvatar').value;

    if (password !== confirm) {
        showNotification('❌ Passwords do not match', 'error');
        return;
    }
    
    if (!selectedAvatar) {
        showNotification('❌ Please select an avatar', 'error');
        return;
    }

    try {
        await window.signUp(username, password, selectedAvatar);
        closeAuthModal();
        showNotification('✅ Account created! Welcome!', 'success');
        setTimeout(() => location.reload(), 800);
    } catch (error) {
        showNotification(`❌ Signup failed: ${error.message}`, 'error');
    }
}

/**
 * Close auth modal
 */
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.remove();
}

/**
 * Handle logout
 */
async function handleLogout() {
    await window.logOut();
    showNotification('👋 Logged out successfully!', 'success');
    setTimeout(() => location.reload(), 800);
}

/**
 * Load admin dashboard (placeholder)
 */
function loadAdminDashboard() {
    showNotification('📋 Admin panel coming soon!', 'info');
}

/**
 * Extract rating from AI review
 */
function extractRatingFromReview(aiReview) {
    if (!aiReview) return '';
    
    // Convert to string in case it's an object
    let reviewText = typeof aiReview === 'string' ? aiReview : JSON.stringify(aiReview);
    
    // Look for rating patterns: "Rating: ⭐⭐⭐⭐⭐" or "Rating: Incorrect"
    const ratingMatch = reviewText.match(/Rating:?\s*(⭐+|Incorrect\s*output)/i);
    if (ratingMatch) {
        console.log('✅ Rating found via pattern 1:', ratingMatch[1]);
        return ratingMatch[1];
    }
    
    // Look for just stars: ⭐⭐⭐⭐⭐ anywhere in text
    const starMatch = reviewText.match(/⭐{1,5}/);
    if (starMatch) {
        console.log('✅ Rating found via pattern 2 (stars):', starMatch[0]);
        return starMatch[0];
    }
    
    // Look for "Incorrect output" anywhere
    if (reviewText.match(/Incorrect\s*output/i)) {
        console.log('✅ Rating found via pattern 3 (incorrect)');
        return 'Incorrect output';
    }
    
    console.log('⚠️ No rating found in:', reviewText.substring(0, 100));
    return '';
}

/**
 * Parse AI review into separate components (review text, suggestion, rating)
 */
function parseAiReview(aiReview) {
    if (!aiReview) return { review: '', suggestion: '', rating: '' };
    
    let review = '';
    let suggestion = '';
    let rating = extractRatingFromReview(aiReview);
    
    // Extract Review section
    const reviewMatch = aiReview.match(/Review:?\s*([\s\S]*?)(?=Suggestion:|Rating:|$)/i);
    if (reviewMatch) {
        review = reviewMatch[1].trim()
            .replace(/<\/?think>/gi, '')
            .replace(/<[^>]+>/g, '')
            .trim();
    }
    
    // Extract Suggestion block
    const suggestionMatch = aiReview.match(/(?:Suggestion|Improved Code):?\s*(```[\s\S]*?```|[\s\S]*?)(?=Rating:|$)/i);
    if (suggestionMatch) {
        suggestion = suggestionMatch[1].trim()
            .replace(/^```\w*\n?/, '')
            .replace(/\n?```$/, '')
            .trim();
    }
    
    return { review, suggestion, rating };
}

/**
 * Create file upload form for challenge
 */
async function createUploadForm(challengeId, topicId = 'default') {
    const formId = `uploadForm_${challengeId}`;

    const user = window.getCurrentUser();
    const submission = user ? await window.getSubmission(challengeId, user.username) : null;
    // Check if submission is actually an object with properties (not empty array)
    const hasSubmitted = submission && typeof submission === 'object' && !Array.isArray(submission) && submission.status;

    console.log(`📋 createUploadForm called: challengeId=${challengeId}, formId=${formId}, hasSubmitted=${hasSubmitted}, submission=`, submission);

    const form = document.createElement('div');
    form.id = formId;
    form.className = 'upload-form';
    
    let statusHTML = '';
    let contentHTML = '';
    let submissionsListHTML = '';
    
    // Get all submissions for this challenge
    const allSubmissions = window.getChallengeSubmissions ? await window.getChallengeSubmissions(challengeId) : [];
    
    if (allSubmissions.length > 0) {
        submissionsListHTML = '<div class="submissions-list" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">';
        submissionsListHTML += `<h5 style="margin: 0 0 10px 0;">📋 Submissions (${allSubmissions.length})</h5>`;
        
        for (const sub of allSubmissions) {
            const statusColor = sub.status === 'pending' ? '#FFA500' : 
                               (sub.status === 'approved' || sub.status === 'completed') ? '#4CAF50' : 
                               '#f44336';
            const statusEmoji = sub.status === 'pending' ? '⏳' : 
                               (sub.status === 'approved' || sub.status === 'completed') ? '✅' : 
                               '❌';
            const dateStr = new Date(sub.submittedAt).toLocaleDateString() + ' ' + 
                          new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // AI Review indicator
            let aiIndicator = '';
            let ratingDisplay = '';
            
            // Load user's avatar image
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
                aiIndicator = ' 🤖';
                const rating = extractRatingFromReview(sub.aiReview);
                if (rating) {
                    ratingDisplay = ` | ${rating}`;
                }
            } else if (sub.aiReviewStatus === 'processing') {
                aiIndicator = ' ⏳AI';
            }
            
            submissionsListHTML += `
                <div class="submission-item" onclick="showCodePreview('${sub.username}', '${challengeId}')" style="background: white; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 3px solid ${statusColor}; cursor: pointer; transition: all 0.2s; user-select: none; display: flex; align-items: center; gap: 10px;">
                    ${avatarHtml ? `<div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #f0f0f0; border-radius: 50%;">${avatarHtml}</div>` : ''}
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: bold; color: #333; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                            <span>${statusEmoji}</span>
                            <span>${sub.username}</span>
                            ${aiIndicator ? `<span>${aiIndicator}</span>` : ''}
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            <span>${sub.fileName}</span> | 
                            <span>${dateStr}${ratingDisplay}</span>
                        </div>
                    </div>
                    <div style="flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; justify-content: center;">
                        <span style="color: ${statusColor}; font-weight: bold; font-size: 11px;">${sub.status.toUpperCase()}</span>
                    </div>
                </div>
            `;
        }
        
        submissionsListHTML += '</div>';
    }
    
    if (!user) {
        // User not logged in
        contentHTML = `
            <div class="upload-container">
                <h4>📤 Submit Solution</h4>
                <p style="color: #999; margin: 10px 0;">Please log in to submit your solution</p>
                <button onclick="location.reload()" class="btn-submit" style="background: #666;">Login to Submit</button>
            </div>
        `;
    } else {
        // User is logged in
        if (hasSubmitted && submission && submission.status) {
            const statusColor = submission.status === 'pending' ? '#FFA500' : 
                               (submission.status === 'approved' || submission.status === 'completed') ? '#4CAF50' : 
                               '#f44336';
            statusHTML = `
                <div style="color: ${statusColor}; font-weight: bold; margin-bottom: 10px;">
                    ✓ Submitted: ${submission.status.toUpperCase()} | ${new Date(submission.submittedAt).toLocaleDateString()}
                </div>
            `;
        }

        // Allow resubmission only if status is not 'approved' or 'rejected' (allow re-submit for pending)
        const isFormDisabled = hasSubmitted && submission && submission.status !== 'pending';
        
        contentHTML = `
            <div class="upload-container">
                <h4>📤 Submit Solution</h4>
                ${statusHTML}
                <input type="file" id="fileInput_${challengeId}" accept=".java,.cpp,.py,.c,.txt,.js,.go,.rs" class="file-input" ${isFormDisabled ? 'disabled' : ''}>
                <button onclick="submitChallengeFile('${challengeId}', '${topicId}')" class="btn-submit" ${isFormDisabled ? 'disabled' : ''}>
                    🚀 ${isFormDisabled ? 'Already Submitted' : (hasSubmitted && submission && submission.status === 'pending' ? 'Resubmit' : 'Submit')}
                </button>
                <p class="upload-info">
                    Accepted: .java, .cpp, .py, .c, .txt, .js, .go, .rs | Max: 10MB
                </p>
                <div id="status_${challengeId}"></div>
            </div>
        `;
    }

    form.innerHTML = contentHTML + submissionsListHTML;
    return form;
}

/**
 * Show code preview modal for a submission (fetches from Supabase only)
 */
async function showCodePreview(username, challengeId) {
    try {
        // Fetch from Supabase only
        let submission = null;
        
        if (window.supabaseInstance) {
            try {
                const { data, error } = await window.supabaseInstance
                    .from('submissions')
                    .select('*')
                    .eq('username', username)
                    .eq('challenge_id', challengeId)
                    .order('submitted_at', { ascending: false })
                    .limit(1);
                
                if (!error && data && data.length > 0) {
                    submission = data[0];
                    console.log('✅ Submission loaded from Supabase:', challengeId);
                }
            } catch (error) {
                console.error('❌ Supabase lookup failed:', error);
            }
        }
        
        if (!submission || !submission.status) {
            showNotification('❌ Submission not found', 'error');
            return;
        }

        // Normalize submission object (convert snake_case from Supabase to camelCase)
        const normalizedSubmission = {
            fileContent: submission.file_content || '',
            fileName: submission.file_name || '',
            submittedAt: submission.submitted_at || new Date().toISOString(),
            aiReview: submission.ai_review || null,
            aiReviewStatus: submission.ai_review ? 'completed' : 'pending',
            status: submission.status || 'pending',
            topicId: submission.topic_id || 'default'
        };
        
        console.log('✅ Submission normalized:', {
            fileContent_length: normalizedSubmission.fileContent.length,
            aiReview_length: normalizedSubmission.aiReview ? normalizedSubmission.aiReview.length : 0,
            fileName: normalizedSubmission.fileName
        });
        
        submission = normalizedSubmission;

        // Create modal
        const modal = document.createElement('div');
    modal.id = `codePreviewModal_${username}_${challengeId}`;
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        overflow-y: auto;
        overflow-x: hidden;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 8px;
        width: 95%;
        max-width: 1400px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        margin: auto;
        overflow: hidden;
    `;

    // Header
    const header = document.createElement('div');
    const statusColor = submission.status === 'pending' ? '#FFA500' : 
                       (submission.status === 'approved' || submission.status === 'completed') ? '#4CAF50' : 
                       '#f44336';
    const statusEmoji = submission.status === 'pending' ? '⏳' : 
                       (submission.status === 'approved' || submission.status === 'completed') ? '✅' : 
                       '❌';
    
    header.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
    `;
    
    // AI review status (from normalized submission data only)
    let aiStatusHtml = '';
    let ratingHtml = '';
    
    // Check submission data for AI review (from normalized submission)
    if (submission.aiReview) {
        aiStatusHtml = ' 🤖 AI Reviewed';
        const rating = extractRatingFromReview(submission.aiReview);
        if (rating) {
            ratingHtml = ` | <span style="font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 3px; background: ${rating.includes('Incorrect') ? '#ffebee' : '#e8f5e9'}; color: ${rating.includes('Incorrect') ? '#f44336' : '#4CAF50'};">${rating}</span>`;
        }
    } else if (submission.aiReviewStatus === 'processing') {
        aiStatusHtml = ' ⏳ AI Reviewing...';
    }
    
    // Check if current user is the owner
    const currentUser = window.getCurrentUser();
    const isOwner = currentUser && currentUser.username === username;
    const isAdminUser = window.isUserAdmin ? await window.isUserAdmin() : false;
    
    const deleteButtonHtml = isOwner ? `
        <button onclick="deleteSubmissionAndRefresh('${username}', '${challengeId}', '${modal.id}')" style="
            background: #ff5722;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 15px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            margin-right: 5px;
        ">🗑️ Delete</button>
    ` : '';

    let approveButtonHtml = '';
    if (isAdminUser && submission.status !== 'completed' && submission.status !== 'approved') {
        approveButtonHtml = `
            <button onclick="if(window.approveAdminSubmission) { window.approveAdminSubmission('${challengeId}', '${username}'); setTimeout(() => document.getElementById('${modal.id}').remove(), 500); } else { alert('Admin tools not loaded.'); }" style="
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 15px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                margin-right: 5px;
            ">✅ Approve</button>
        `;
    }
    
    header.innerHTML = `
        <div>
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
                ${statusEmoji} ${username}'s Submission
            </div>
            <div style="font-size: 12px; color: #666;">
                <span style="color: ${statusColor}; font-weight: bold;">${submission.status.toUpperCase()}</span> | 
                <span>${submission.fileName}</span> | 
                <span>${new Date(submission.submittedAt).toLocaleString()}</span>
            </div>
            <div style="font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 8px;">
                <span>${aiStatusHtml}${ratingHtml}</span>
            </div>
        </div>
        <div style="display: flex; gap: 5px;">
            ${approveButtonHtml}
            ${deleteButtonHtml}
            <button onclick="document.getElementById('${modal.id}').remove()" style="
                background: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 15px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
            ">✕ Close</button>
        </div>
    `;

    // Content area - two column layout (User Code | AI Review)
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
        display: flex;
        flex: 1;
        overflow: hidden;
        gap: 0;
    `;

    // Code display (left side - user's code)
    const codeContainer = document.createElement('div');
    codeContainer.style.cssText = `
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px;
        background: #f8f8f8;
        border-right: 1px solid #eee;
        min-width: 0;
    `;

    const codeLabel = document.createElement('div');
    codeLabel.style.cssText = `
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
        font-size: 12px;
    `;
    codeLabel.textContent = '📝 YOUR CODE';
    codeContainer.appendChild(codeLabel);

    const codeBlock = document.createElement('pre');
    codeBlock.className = 'code-block';
    codeBlock.style.cssText = `
        background: #2d2d2d;
        color: #f8f8f2;
        padding: 20px;
        border-radius: 4px;
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.6;
        overflow-y: auto;
        overflow-x: hidden;
        word-break: break-word;
        white-space: pre-wrap;
    `;
    
    codeBlock.textContent = submission.fileContent;
    codeContainer.appendChild(codeBlock);

    // AI Review display (right side)
    const reviewContainer = document.createElement('div');
    reviewContainer.style.cssText = `
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px;
        background: #fafafa;
        display: flex;
        flex-direction: column;
        min-width: 0;
    `;

    const reviewLabel = document.createElement('div');
    reviewLabel.style.cssText = `
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
        font-size: 12px;
    `;
    reviewLabel.textContent = '🤖 AI REVIEW';
    reviewContainer.appendChild(reviewLabel);

    // Get AI review from normalized submission data (Supabase only)
    const aiReviewContent = submission.aiReview;
    const aiReviewStatus = submission.aiReviewStatus;
    
    console.log('🤖 AI Review Debug:', {
        content_exists: !!aiReviewContent,
        content_length: aiReviewContent ? aiReviewContent.length : 0,
        status: aiReviewStatus
    });

    if (aiReviewContent) {
        // Parse review into components
        const { review, suggestion, rating } = parseAiReview(aiReviewContent);
        
        // Display review sentences
        if (review) {
            const reviewTextDiv = document.createElement('div');
            reviewTextDiv.style.cssText = `
                background: #f5f5f5;
                padding: 15px;
                border-radius: 4px;
                border-left: 3px solid #2196F3;
                margin-bottom: 15px;
                font-size: 13px;
                line-height: 1.6;
                color: #333;
            `;
            reviewTextDiv.innerHTML = `<strong>💭 Review:</strong><br />` + review.replace(/\n/g, '<br />');
            reviewContainer.appendChild(reviewTextDiv);
        }
        
        // Display code suggestion
        if (suggestion) {
            const suggestionLabel = document.createElement('div');
            suggestionLabel.style.cssText = `
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
                font-size: 12px;
            `;
            suggestionLabel.textContent = '💡 Suggestion:';
            reviewContainer.appendChild(suggestionLabel);
            
            const codeBlock = document.createElement('pre');
            codeBlock.className = 'code-block';
            codeBlock.style.cssText = `
                background: #2d2d2d;
                color: #f8f8f2;
                padding: 15px;
                border-radius: 4px;
                border: 1px solid #e0e0e0;
                font-size: 13px;
                line-height: 1.6;
                overflow-y: auto;
                overflow-x: hidden;
                flex-shrink: 0;
                font-family: 'Courier New', monospace;
                margin: 0 0 15px 0;
                word-break: break-word;
                white-space: pre-wrap;
            `;
            codeBlock.textContent = suggestion;
            reviewContainer.appendChild(codeBlock);
        }
        
        // Add button to request new review
        const buttonDiv = document.createElement('div');
        buttonDiv.style.cssText = `
            padding: 10px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
        `;
        const isCompleted = submission.status === 'completed' || submission.status === 'approved';
        buttonDiv.innerHTML = `
            <button id="requestNewReviewBtn_${username}_${challengeId}" ${isCompleted ? 'disabled' : `onclick="requestCodeReview('${username}', '${challengeId}', this)"`} style="
                background: ${isCompleted ? '#ccc' : '#FF9800'};
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 15px;
                cursor: ${isCompleted ? 'not-allowed' : 'pointer'};
                font-weight: bold;
                font-size: 12px;
            " title="${isCompleted ? 'Cannot request review for completed submissions' : ''}">🔄 Request New Review</button>
        `;
        reviewContainer.appendChild(buttonDiv);
    } else if (aiReviewStatus === 'processing') {
        const processingDiv = document.createElement('div');
        processingDiv.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #fff3cd;
            background: #fffbf0;
            text-align: center;
            color: #666;
        `;
        processingDiv.innerHTML = '<div>⏳ AI is reviewing this code...</div><div style="font-size: 12px; margin-top: 10px; color: #999;">Please wait or refresh in a moment</div>';
        reviewContainer.appendChild(processingDiv);
    } else if (aiReviewStatus === 'failed') {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #f5c6cb;
            background: #ffe6e6;
            color: #721c24;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;
        errorDiv.innerHTML = `
            <div>
                <div>❌ AI review failed</div>
                <div style="font-size: 12px; margin-top: 10px;">${aiReviewContent || 'Unknown error'}</div>
            </div>
        `;
        
        // Add buttons
        const buttonDiv = document.createElement('div');
        buttonDiv.style.cssText = `
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        `;
        buttonDiv.innerHTML = `
            <button onclick="requestCodeReview('${username}', '${challengeId}', this); return false;" style="
                background: #FF9800;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 15px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
            ">🔄 Retry Review</button>
            <button onclick="clearFailedReview('${username}', '${challengeId}'); return false;" style="
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 15px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
            ">🗑️ Clear Error</button>
        `;
        errorDiv.appendChild(buttonDiv);
        reviewContainer.appendChild(errorDiv);
    } else {
        const noReviewDiv = document.createElement('div');
        noReviewDiv.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 15px;
        `;
        const isCompleted = submission.status === 'completed' || submission.status === 'approved';
        noReviewDiv.innerHTML = `
            <div style="color: #999;">No AI review yet</div>
            <button id="requestAiReviewBtn_${username}_${challengeId}" ${isCompleted ? 'disabled' : `onclick="requestCodeReview('${username}', '${challengeId}', this)"`} style="
                background: ${isCompleted ? '#ccc' : '#2196F3'};
                color: white;
                border: none;
                border-radius: 4px;
                padding: 10px 20px;
                cursor: ${isCompleted ? 'not-allowed' : 'pointer'};
                font-weight: bold;
            " title="${isCompleted ? 'Cannot request review for completed submissions' : ''}">🤖 Request AI Review</button>
        `;
        reviewContainer.appendChild(noReviewDiv);
    }

    contentArea.appendChild(codeContainer);
    contentArea.appendChild(reviewContainer);

    // Footer with feedback (if any)
    let footer = '';
    if (submission.feedback) {
        footer = document.createElement('div');
        footer.style.cssText = `
            padding: 20px;
            border-top: 1px solid #eee;
            background: #fffbf0;
        `;
        footer.innerHTML = `
            <div style="font-weight: bold; color: #333; margin-bottom: 10px;">💬 Admin Feedback:</div>
            <div style="color: #666; font-size: 14px;">${submission.feedback}</div>
        `;
    }

    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(contentArea);
    if (footer) modalContent.appendChild(footer);
    modal.appendChild(modalContent);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    document.body.appendChild(modal);
    
    // Apply syntax highlighting to code blocks in the modal
    if (typeof initJavaSyntaxHighlighting === 'function') {
        setTimeout(() => {
            initJavaSyntaxHighlighting();
        }, 0);
    }
    } catch (error) {
        console.error('❌ Error loading submission:', error);
        showNotification(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Delete submission and refresh the form
 */
async function deleteSubmissionAndRefresh(username, challengeId, modalId) {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
        return;
    }
    
    try {
        // Delete the submission (wait for Supabase delete to complete)
        await window.deleteSubmission(challengeId, username);
        showNotification('✅ Submission deleted successfully', 'success');
        
        // Close the modal
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
        
        // Refresh upload forms to show the submission box for this challenge
        if (window.initializeUploadForms) {
            setTimeout(() => {
                window.initializeUploadForms();
            }, 300);
        }
        
        // Refresh the latest submissions dashboard to remove deleted submission
        if (window.displayLatestSubmissionsDashboard) {
            setTimeout(() => {
                window.displayLatestSubmissionsDashboard();
            }, 500);  // Longer delay to ensure Supabase sync
        }
    } catch (error) {
        showNotification(`❌ Failed to delete submission: ${error.message}`, 'error');
    }
}

/**
 * Clear failed AI review and reopen modal
 */
function clearFailedReview(username, challengeId) {
    try {
        window.clearAiReview(challengeId, username);
        showNotification('✅ Error cleared! Reopen the submission to try again.', 'success');
        
        // Refresh the modal
        setTimeout(() => {
            const modal = document.getElementById(`codePreviewModal_${username}_${challengeId}`);
            if (modal) {
                modal.remove();
                showCodePreview(username, challengeId);
            }
        }, 500);
    } catch (error) {
        showNotification(`❌ Failed to clear error: ${error.message}`, 'error');
    }
}

/**
 * Request AI review for a submission
 */
async function requestCodeReview(username, challengeId, buttonElement) {
    let apiKey = window.getGroqApiKey();
    
    if (!apiKey) {
        showNotification('⏳ Checking for AI system configuration...', 'info');
        
        // Wait a moment in case env is still loading
        await new Promise(resolve => setTimeout(resolve, 500));
        apiKey = window.getGroqApiKey();
        
        if (!apiKey) {
            showNotification('❌ AI Review system is currently unavailable (missing configuration)', 'error');
            return;
        }
    }

    const button = buttonElement;
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = '⏳ Requesting...';

    try {
        // Clear existing review before requesting new one
        if (window.clearAiReview) {
            window.clearAiReview(challengeId, username);
        }
        
        await window.requestAiReview(challengeId, username);
        showNotification('✅ AI review completed!', 'success');
        
        // Refresh the modal
        setTimeout(() => {
            const modal = document.getElementById(`codePreviewModal_${username}_${challengeId}`);
            if (modal) {
                modal.remove();
                showCodePreview(username, challengeId);
            }
        }, 500);
    } catch (error) {
        showNotification(`❌ AI review failed: ${error.message}`, 'error');
        button.disabled = false;
        button.textContent = originalText;
    }
}

/**
 * Submit challenge file
 */
async function submitChallengeFile(challengeId, topicId = 'default') {
    const fileInput = document.getElementById(`fileInput_${challengeId}`);
    if (!fileInput || !fileInput.files.length) {
        showNotification('❌ Please select a file', 'error');
        return;
    }

    const file = fileInput.files[0];

    try {
        showNotification('⏳ Uploading and processing...', 'info');
        await window.submitChallenge(challengeId, file, topicId);
        showNotification('✅ Submission received! Status: Pending', 'success');

        // Refresh the entire upload form to show submission in the list
        const formElement = document.getElementById(`uploadForm_${challengeId}`);
        if (formElement) {
            const challengeItem = formElement.closest('.challenge-item');
            if (challengeItem) {
                // Remove old form
                formElement.remove();
                // Add new form with updated submissions list
                const newForm = await createUploadForm(challengeId, topicId);
                if (newForm) {
                    challengeItem.appendChild(newForm);
                }
            }
        }
        
        // Refresh the latest submissions dashboard to show new submission (with "No review yet")
        if (window.displayLatestSubmissionsDashboard) {
            setTimeout(() => {
                window.displayLatestSubmissionsDashboard();
            }, 300);
        }
        
        // Automatically request AI review after submission
        showNotification('🤖 AI review in progress...', 'info');
        try {
            await window.requestAiReview(challengeId);
            showNotification('✅ AI review completed!', 'success');
            
            // Refresh dashboard again after AI review completes with longer delay for Supabase sync
            if (window.displayLatestSubmissionsDashboard) {
                setTimeout(() => {
                    console.log('🔄 Refreshing dashboard after AI review (Supabase sync delay)');
                    window.displayLatestSubmissionsDashboard();
                }, 2000);  // 2 second delay for Supabase to sync
            }
        } catch (aiError) {
            console.error('AI review failed:', aiError);
            showNotification('⚠️ AI review is being processed in the background', 'info');
            
            // Refresh dashboard anyway to show processing status
            if (window.displayLatestSubmissionsDashboard) {
                setTimeout(() => {
                    console.log('🔄 Refreshing dashboard after AI review error');
                    window.displayLatestSubmissionsDashboard();
                }, 2000);
            }
        }
    } catch (error) {
        showNotification(`❌ Submission failed: ${error.message}`, 'error');
    }
}

/**
 * Delete pending submission and clear form for resubmission
 */

/**
 * Update challenge submission UI
 */
async function updateChallengeSubmissionUI(challengeId) {
    const statusEl = document.getElementById(`status_${challengeId}`);
    if (!statusEl) return;

    const user = window.getCurrentUser();
    if (!user) return;

    const submission = await window.getSubmission(challengeId, user.username);
    if (submission) {
        const statusText = submission.status.toUpperCase();
        const statusColor = submission.status === 'pending' ? '#FFA500' : 
                           (submission.status === 'approved' || submission.status === 'completed') ? '#4CAF50' : 
                           '#f44336';
        statusEl.innerHTML = `
            <div style="color: ${statusColor}; font-weight: bold; margin-top: 10px;">
                ✓ Submitted: ${statusText}
            </div>
        `;
    }
}

/**
 * Display completion indicator on challenge
 */
function displayCompletionIndicator(challengeId, isCompleted) {
    const challengeCard = document.querySelector(`[data-challenge-id="${challengeId}"]`);
    if (!challengeCard) return;

    let indicator = challengeCard.querySelector('.completion-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'completion-indicator';
        challengeCard.appendChild(indicator);
    }

    if (isCompleted) {
        indicator.innerHTML = '✅ Completed';
        indicator.classList.add('completed');
    } else {
        indicator.innerHTML = '⏳ Pending';
        indicator.classList.add('pending');
    }
}

/**
 * Add completion indicator styles
 */
function addCompletionIndicatorStyles() {
    if (document.getElementById('completionIndicatorStyles')) return;

    const style = document.createElement('style');
    style.id = 'completionIndicatorStyles';
    style.textContent = `
        .completion-indicator {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
        }

        .completion-indicator.completed {
            background: #d1e7dd;
            color: #0f5132;
            border: 1px solid #0f5132;
        }

        .completion-indicator.pending {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #856404;
        }

        .upload-form {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }

        .upload-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .upload-container h4 {
            margin: 0;
            color: #333;
        }

        .file-input {
            padding: 8px;
            border: 2px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
        }

        .file-input:hover {
            border-color: var(--primary-color, #4CAF50);
        }

        .btn-submit {
            padding: 10px 15px;
            background: var(--primary-color, #4CAF50);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
            background: #45a049;
        }

        .btn-submit:disabled {
            background: #ccc;
            cursor: not-allowed;
            opacity: 0.7;
        }

        .file-input:disabled {
            background: #f0f0f0;
            cursor: not-allowed;
            opacity: 0.6;
        }

        .upload-info {
            margin: 5px 0;
            font-size: 12px;
            color: #999;
        }

        .submission-item {
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .submission-item:hover {
            background: #f9f9f9 !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }

        .submission-item:active {
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
    `;

    document.head.appendChild(style);
}

/**
 * Show user profile dropdown
 */
function createUserProfileMenu() {
    if (document.getElementById('userProfileMenu')) return;

    const menu = document.createElement('div');
    menu.id = 'userProfileMenu';
    menu.className = 'user-profile-menu';
    menu.innerHTML = `
        <div class="profile-header">
            <button onclick="toggleTheme()" class="theme-emoji-btn" id="themeToggleBtn" title="Toggle theme">
                🌙
            </button>
        </div>

        <div class="profile-card">
            <div id="userAvatar" class="profile-avatar">
                <!-- Avatar will be loaded dynamically -->
            </div>
            <div class="profile-info">
                <p id="userName" class="profile-name"></p>
            </div>
        </div>

        <div class="profile-stats">
            <div class="stat">
                <span class="stat-value" id="userCompleted">0</span>
                <span class="stat-label">Completed</span>
            </div>
            <div class="stat">
                <span class="stat-value" id="userPending">0</span>
                <span class="stat-label">Pending</span>
            </div>
        </div>

        <div class="profile-actions">
            <button onclick="loadAdminDashboard()" class="menu-btn admin-btn" id="adminBtn" style="display:none;">
                📋 Admin Panel
            </button>
            <button onclick="handleLogout()" class="menu-btn logout-btn">
                Logout
            </button>
        </div>
    `;

    document.body.appendChild(menu);
    addUserProfileMenuStyles();
}

/**
 * Add styles for user profile menu
 */
function addUserProfileMenuStyles() {
    if (document.getElementById('userProfileMenuStyles')) return;

    const style = document.createElement('style');
    style.id = 'userProfileMenuStyles';
    style.textContent = `
        .user-profile-menu {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 5000;
            width: 250px;
        }

        .profile-header {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
            padding-bottom: 10px;
        }

        .theme-emoji-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .theme-emoji-btn:hover {
            background: #f0f0f0;
            transform: scale(1.1);
        }

        .profile-card {
            display: flex;
            gap: 12px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }

        .profile-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            flex-shrink: 0;
            overflow: hidden;
            font-size: 28px;
        }

        .avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .profile-name {
            margin: 0;
            font-weight: bold;
            color: #333;
        }

        .profile-email {
            margin: 0;
            font-size: 12px;
            color: #999;
        }

        .profile-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }

        .stat {
            text-align: center;
        }

        .stat-value {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: var(--primary-color, #4CAF50);
        }

        .stat-label {
            display: block;
            font-size: 11px;
            color: #999;
            text-transform: uppercase;
        }

        .profile-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 15px;
        }

        .menu-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .admin-btn {
            background: #ff9800;
            color: white;
        }

        .admin-btn:hover {
            background: #e68900;
        }

        .logout-btn {
            background: #f44336;
            color: white;
        }

        .logout-btn:hover {
            background: #da190b;
        }
    `;

    document.head.appendChild(style);
}

/**
 * Update user profile menu with user data
 */
async function updateUserProfileMenu() {
    try {
        const user = window.getCurrentUser();
        if (!user) return;

        createUserProfileMenu();

        const profile = user.profile;
        const isAdmin = window.isUserAdmin();

        document.getElementById('userName').textContent = profile?.username || 'User';
        const avatarContainer = document.getElementById('userAvatar');
        if (avatarContainer) {
            // Clear previous content
            avatarContainer.textContent = '';
            
            // Use avatar image if available
            if (profile?.avatar_url) {
                const img = document.createElement('img');
                img.src = profile.avatar_url;
                img.alt = 'Avatar';
                img.className = 'avatar-img';
                avatarContainer.appendChild(img);
                avatarContainer.style.background = 'transparent';
            } else if (profile?.avatar_color) {
                avatarContainer.style.background = profile.avatar_color;
            }
        }
        document.getElementById('userCompleted').textContent = '0';
        document.getElementById('userPending').textContent = '0';
        
        // Fetch and set true counts
        if (typeof updateUserStats === 'function') {
            updateUserStats();
        }

        if (isAdmin) {
            document.getElementById('adminBtn').style.display = 'block';
        }

    } catch (error) {
        console.error('Error updating profile menu:', error);
    }
}

/**
 * Update challenge UI with completion status
 */
async function updateChallengeUI(topicId, challengeId) {
    try {
        const user = window.getCurrentUser();
        if (!user) return;

        // For now, just show pending status
        displayCompletionIndicator(challengeId, false);
    } catch (error) {
        console.error('Error updating challenge UI:', error);
    }
}

/**
 * Initialize upload forms for all challenges
 * Guard prevents concurrent executions which caused duplicate forms.
 */
let _uploadFormsRunning = false;
let _uploadFormsPending = false;

async function initializeUploadForms() {
    if (_uploadFormsRunning) {
        // Another run is active — queue exactly one follow-up run
        _uploadFormsPending = true;
        return;
    }
    _uploadFormsRunning = true;
    try {
        await _doInitializeUploadForms();
    } finally {
        _uploadFormsRunning = false;
        if (_uploadFormsPending) {
            _uploadFormsPending = false;
            initializeUploadForms(); // run the queued request
        }
    }
}

async function _doInitializeUploadForms() {
    console.log('🔄 Initializing upload forms...');
    console.log('📝 Scripts loaded - submissions functions available:', typeof window.submitChallenge === 'function');
    console.log('📝 Current topic:', typeof currentTopic !== 'undefined' ? currentTopic : 'UNDEFINED');
    
    // Ensure styles are loaded
    addCompletionIndicatorStyles();
    
    // Find all challenge containers and add upload forms
    const challengeItems = document.querySelectorAll('.challenge-item');
    console.log('📊 Found', challengeItems.length, 'challenge items');
    
    if (challengeItems.length === 0) {
        console.warn('⚠️ No challenge items found');
        return;
    }
    
    let formsAdded = 0;
    for (let index = 0; index < challengeItems.length; index++) {
        const item = challengeItems[index];
        
        // Create unique challenge ID using topic context
        // Use global currentTopic variable (without 'window')
        const topicContext = (typeof currentTopic !== 'undefined' && currentTopic) ? currentTopic : 'general';
        const challengeId = `${topicContext}_challenge_${index + 1}`;
        const formId = `uploadForm_${challengeId}`;
        
        try {
            // Add a data attribute to identify the challenge
            if (!item.dataset.challengeId) {
                item.dataset.challengeId = challengeId;
            }
            
            // ALWAYS remove old forms first to prevent duplicates
            const oldForms = item.querySelectorAll('.upload-form');
            oldForms.forEach(form => form.remove());
            
            // Create and add new form with fresh submission data
            const uploadForm = await createUploadForm(challengeId, topicContext);
            if (uploadForm && uploadForm.nodeType === 1) { // nodeType 1 = element node
                item.appendChild(uploadForm);
                formsAdded++;
                console.log('✅ Added upload form for', challengeId);
            } else {
                console.warn('⚠️ Upload form creation failed for', challengeId);
            }
        } catch (error) {
            console.error('❌ Error adding upload form for', challengeId, ':', error);
        }
    }
    console.log('✅ Upload forms initialized:', formsAdded, 'new forms added');
}

/**
 * Update user stats in profile menu
 */
function updateUserStats() {
    if (!window.getUserStats) return;
    window.getUserStats().then(stats => {
        const completedEl = document.getElementById('userCompleted');
        const pendingEl = document.getElementById('userPending');
        
        if (completedEl && stats) completedEl.textContent = stats.approved || 0;
        if (pendingEl && stats) pendingEl.textContent = stats.pending || 0;
    }).catch(console.error);
}

/**
 * Display latest submissions dashboard
 */
async function displayLatestSubmissionsDashboard() {
    const dashboardContainer = document.getElementById('latestSubmissionsDashboard');
    if (!dashboardContainer) return;

    // Force fresh fetch from Supabase (skip localStorage cache)
    const latestSubmissions = window.getLatestSubmissions ? await window.getLatestSubmissions(8) : [];
    console.log('📊 Latest submissions fetched:', latestSubmissions.length, 'items');
    latestSubmissions.forEach((sub, i) => {
        console.log(`  [${i}] ${sub.username} - ${sub.challengeId}: status=${sub.aiReviewStatus}, hasReview=${!!sub.aiReview}`);
    });

    if (latestSubmissions.length === 0) {
        dashboardContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #999;">
                <div style="font-size: 48px; margin-bottom: 10px;">📋</div>
                <div>No submissions yet</div>
            </div>
        `;
        return;
    }

    let html = '<div style="display: grid; gap: 10px;">';
    
    for (const sub of latestSubmissions) {
        const statusColor = sub.status === 'pending' ? '#FFA500' : 
                           (sub.status === 'approved' || sub.status === 'completed') ? '#4CAF50' : 
                           '#f44336';
        const statusEmoji = sub.status === 'pending' ? '⏳' : 
                           (sub.status === 'approved' || sub.status === 'completed') ? '✅' : 
                           '❌';
        const timeStr = new Date(sub.submittedAt).toLocaleString();
        
        // Get challenge title
        const challengeData = CHALLENGE_SOLUTIONS[sub.challengeId] || {};
        const challengeTitle = challengeData.title || sub.challengeId;
        
        // Get topic name - prefer stored topicId, fallback to challenge mapping
        let topicId = sub.topicId;
        if (!topicId || topicId === 'default') {
            topicId = CHALLENGE_TO_TOPIC[sub.challengeId] || 'default';
        }
        const topicDisplay = TOPIC_MAP[topicId] || topicId;
        
        // Extract rating from AI review - DETAILED LOGGING
        let ratingDisplay = '';
        console.log(`🔍 Full submission data for ${sub.username}/${sub.challengeId}:`, {
            status: sub.status,
            aiReviewStatus: sub.aiReviewStatus,
            hasAiReview: !!sub.aiReview,
            aiReviewObject: typeof sub.aiReview,
            aiReviewLength: sub.aiReview ? (typeof sub.aiReview === 'string' ? sub.aiReview.length : 'not-string') : 0,
            aiReviewPreview: sub.aiReview ? (typeof sub.aiReview === 'string' ? sub.aiReview.substring(0, 150) : JSON.stringify(sub.aiReview).substring(0, 150)) : 'NONE'
        });
        
        let aiIndicator = '';
        
        // Check if review data exists (regardless of status field)
        console.log(`✅ Checking aiReview for ${sub.username}: exists=${!!sub.aiReview}, type=${typeof sub.aiReview}, value=`, sub.aiReview);
        if (sub.aiReview) {
            const rating = extractRatingFromReview(sub.aiReview);
            console.log(`⭐ Rating extracted for ${sub.username}:`, rating);
            if (rating) {
                if (rating.includes('Incorrect')) {
                    ratingDisplay = ` | <span style="background: #ffebee; color: #f44336; padding: 2px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;">❌ ${rating}</span>`;
                } else if (rating.includes('⭐')) {
                    ratingDisplay = ` | <span style="background: #e8f5e9; color: #4CAF50; padding: 2px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;">🤖 ${rating}</span>`;
                }
                console.log(`✅ Rating display set to: ${ratingDisplay}`);
            }
            aiIndicator = '';  // No separate indicator, rating badge shows it
            console.log(`✅ AI indicator set: ${aiIndicator}`);
        } else if (sub.aiReviewStatus === 'processing') {
            ratingDisplay = ' | <span style="color: #FFA500; font-weight: bold; font-size: 11px;">⏳ AI Reviewing...</span>';
            aiIndicator = '';
            console.log(`⏳ AI is processing`);
        } else {
            console.log(`❓ No review - aiReviewStatus: ${sub.aiReviewStatus}, hasReview: ${!!sub.aiReview}, aiReviewValue: ${JSON.stringify(sub.aiReview)}`);
            ratingDisplay = '';
            aiIndicator = '';
        }
        
        // Get user's avatar image
        let avatarHtml = '';
        try {
            const avatarUrl = window.getUserAvatarUrl ? await window.getUserAvatarUrl(sub.username) : null;
            if (avatarUrl) {
                avatarHtml = `<img src="${avatarUrl}" alt="avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            }
        } catch (e) {
            console.error('Error loading user avatar:', e);
        }
        
        html += `
            <div onclick="showCodePreview('${sub.username}', '${sub.challengeId}')" style="
                background: white;
                padding: 12px;
                border-radius: 6px;
                border-left: 4px solid ${statusColor};
                cursor: pointer;
                transition: all 0.2s;
                user-select: none;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 10px;
            " onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'">
                ${avatarHtml ? `<div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #f0f0f0; border-radius: 50%;">${avatarHtml}</div>` : ''}
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: bold; color: #333; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                        ${statusEmoji} ${sub.username}
                    </div>
                    <div style="font-size: 13px; color: #555; margin-top: 4px;">
                        ${challengeTitle}
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        <span style="background: #f0f0f0; padding: 2px 8px; border-radius: 3px;">${topicDisplay}</span> | 
                        <span>${timeStr}</span>
                        ${ratingDisplay}
                    </div>
                </div>
                <div style="flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; justify-content: center;">
                    <span style="color: ${statusColor}; font-weight: bold; font-size: 12px;">${sub.status.toUpperCase()}</span>
                </div>
            </div>
        `;
    }

    html += '</div>';
    dashboardContainer.innerHTML = html;
}

/**
 * Initialize UI on page load
 */
function initializeUI() {
    console.log('🔧 initializeUI called');
    
    addAuthModalStyles();
    addCompletionIndicatorStyles();
    addUserProfileMenuStyles();

    const user = window.getCurrentUser();
    console.log('👤 getCurrentUser() returned:', user);
    
    if (user) {
        console.log('✅ User logged in:', user.username);
        updateUserProfileMenu();
        updateUserStats();
        // Display latest submissions dashboard when user is logged in
        setTimeout(() => {
            if (window.displayLatestSubmissionsDashboard) {
                window.displayLatestSubmissionsDashboard();
            }
        }, 500);
    } else {
        console.log('❌ No user logged in, creating auth modal');
        createAuthModal();
    }
    
    // Note: Upload forms are initialized by selectTopic() and switchTab() after challenges are rendered
}

// Auto-initialize when DOM is ready
console.log('📝 ui-components.js loaded');
document.addEventListener('DOMContentLoaded', initializeUI);
