/**
 * Code Runner - Execute Java code only
 * Uses Groq LLM to interpret and execute Java code (FREE)
 */

// No need for API configuration - uses Vercel proxy

/**
 * Validate if file is Java
 */
function isJavaFile(fileName) {
    if (!fileName) return false;
    return fileName.toLowerCase().endsWith('.java');
}

/**
 * Execute Java code using Judge0 API
 */
async function executeCode(fileName, fileContent, testInput = '') {
    return new Promise(async (resolve, reject) => {
        try {
            // Validate Java file
            if (!isJavaFile(fileName)) {
                reject(new Error('❌ This code runner supports Java files only (.java)'));
                return;
            }

            console.log('🚀 === JAVA CODE EXECUTION START ===');
            console.log('File name:', fileName);
            console.log('Code length:', fileContent.length);
            console.log('Test input:', testInput ? testInput.substring(0, 100) + '...' : '(none)');

            // Show loading state
            showCodeRunnerLoading(true);

            // Use Judge0 API for Java execution
            console.log('☁️ Using Judge0 API for Java execution');
            const result = await executeViaJudge0(fileName, fileContent, testInput);
            showCodeRunnerLoading(false);
            resolve(result);

        } catch (error) {
            console.error('❌ Execution error:', error);
            showCodeRunnerLoading(false);
            reject(error);
        }
    });
}

/**
 * Execute Java code via Groq (using Vercel serverless proxy)
 */
async function executeViaJudge0(fileName, fileContent, testInput = '') {
    try {
        console.log('🤖 Sending Java code to Groq executor...');

        const payload = {
            sourceCode: fileContent,
            stdin: testInput || ''
        };

        // Call the Vercel serverless function proxy
        const response = await fetch('/api/groq-code-runner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Groq executor error:', errorData);

            if (response.status === 500 && errorData.message?.includes('GROQ_API_KEY')) {
                throw new Error('⚙️ Setup Required: Add GROQ_API_KEY to your Vercel environment variables at https://vercel.com/dashboard');
            }
            throw new Error(`Execution error: ${errorData.error || response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Code execution complete');

        return result;

    } catch (error) {
        console.error('❌ Execution error:', error);
        throw error;
    }
}

/**
 * Format execution result (from Vercel proxy)
 */
function formatJudge0Result(result) {
    // Result is already formatted by the serverless proxy
    return {
        success: result.success,
        output: result.output || '(no output)',
        error: result.error || null,
        executionTime: result.executionTime,
        memory: result.memory || 'N/A',
        status: result.status,
        statusCode: result.statusId
    };
}

/**
 * Show/hide code runner loading state
 */
function showCodeRunnerLoading(show) {
    let loader = document.getElementById('codeRunnerLoader');
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'codeRunnerLoader';
            loader.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 10001; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 15px;">⏳</div>
                    <div style="font-weight: bold; color: #333; margin-bottom: 8px;">Executing code...</div>
                    <div style="font-size: 12px; color: #999;">This may take a few seconds</div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'block';
    } else {
        if (loader) loader.style.display = 'none';
    }
}

/**
 * Create code runner UI and display results
 */
function createCodeRunnerUI(submission) {
    // Check if we already have a runner panel
    let runnerPanel = document.getElementById('codeRunnerPanel');
    if (!runnerPanel) {
        runnerPanel = document.createElement('div');
        runnerPanel.id = 'codeRunnerPanel';
        runnerPanel.innerHTML = `
            <div id="codeRunnerContent"></div>
        `;
        document.body.appendChild(runnerPanel);
        addCodeRunnerStyles();
    }

    const content = document.getElementById('codeRunnerContent');
    const fileName = submission.fileName || 'code.java';

    content.innerHTML = `
        <div style="padding: 20px; background: white; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <h3 style="margin: 0; color: #333;">🚀 Java Code Runner</h3>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">${fileName}</p>
                </div>
                <button onclick="closeCodeRunner()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999;">✕</button>
            </div>

            <div style="background: #f3e5f5; border-left: 3px solid #9c27b0; padding: 10px 12px; margin-bottom: 15px; border-radius: 2px; font-size: 12px; color: #6a1b9a;">
                <strong>🤖 Groq Powered:</strong> This runner uses Groq's free AI API to execute Java code. Set GROQ_API_KEY in Vercel environment variables for deployment.
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; font-size: 12px; font-weight: bold; color: #666; margin-bottom: 8px;">📥 Test Input (optional)</label>
                    <textarea id="codeRunnerInput" placeholder="Enter test input for Scanner/BufferedReader" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; resize: vertical;"></textarea>
                </div>
                <div>
                    <label style="display: block; font-size: 12px; font-weight: bold; color: #666; margin-bottom: 8px;">📤 Output / Results</label>
                    <div id="codeRunnerOutput" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; font-family: monospace; font-size: 12px; overflow-y: auto; white-space: pre-wrap; word-break: break-word; color: #333;"></div>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="runCodeExecution('${submission.fileName}', '${submission.fileContent.replace(/'/g, "\\'")}')" class="code-runner-btn-run">▶️ Run Code</button>
                <button onclick="closeCodeRunner()" class="code-runner-btn-close">Close</button>
            </div>

            <div id="codeRunnerStats" style="margin-top: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px; font-size: 12px; color: #666; display: none;">
                <strong>Execution Details:</strong>
                <div id="statsContent"></div>
            </div>
        </div>
    `;

    // Show in modal
    const modal = document.createElement('div');
    modal.id = 'codeRunnerModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.7); display: flex; align-items: center;
        justify-content: center; z-index: 10000; padding: 20px;
    `;
    modal.onclick = (e) => {
        if (e.target === modal) closeCodeRunner();
    };
    modal.innerHTML = content.parentElement.innerHTML;
    
    // Clear old modal
    const oldModal = document.getElementById('codeRunnerModal');
    if (oldModal) oldModal.remove();
    
    document.body.appendChild(modal);
    addCodeRunnerStyles();
}

/**
 * Execute code and display results
 */
async function runCodeExecution(fileName, fileContent) {
    try {
        const testInput = document.getElementById('codeRunnerInput')?.value || '';
        const outputDiv = document.getElementById('codeRunnerOutput');
        const statsDiv = document.getElementById('codeRunnerStats');
        const statsContent = document.getElementById('statsContent');

        outputDiv.textContent = '⏳ Executing...';
        statsDiv.style.display = 'none';

        const result = await executeCode(fileName, fileContent, testInput);

        // Display output
        if (result.success) {
            outputDiv.style.color = '#0a7d0a';
            outputDiv.textContent = result.output || '(no output)';
        } else {
            outputDiv.style.color = '#c41e3a';
            outputDiv.textContent = (result.error || result.output || 'Execution failed');
        }

        // Display stats
        statsContent.innerHTML = `
            <div>Status: <strong>${result.status || (result.success ? '✅ Success' : '❌ Failed')}</strong></div>
            <div>Execution Time: <strong>${result.executionTime ? result.executionTime + 's' : 'N/A'}</strong></div>
            ${result.error ? `<div>Error: <strong>${result.error}</strong></div>` : ''}
        `;
        statsDiv.style.display = 'block';

        console.log('✅ === CODE EXECUTION COMPLETE ===');
        console.log('Result:', result);

    } catch (error) {
        console.error('❌ Error running code:', error);
        const outputDiv = document.getElementById('codeRunnerOutput');
        outputDiv.style.color = '#c41e3a';
        
        let errorMsg = '❌ Error: ' + error.message;
        
        // Check if it's a Groq API error
        if (error.message.includes('GROQ_API_KEY')) {
            errorMsg += '\n\n⚙️ Setup Required:\n';
            errorMsg += 'Add GROQ_API_KEY to your Vercel environment variables\n';
            errorMsg += 'Visit: https://vercel.com/dashboard';
        }
        
        outputDiv.textContent = errorMsg;
    }
}

/**
 * Close code runner modal
 */
function closeCodeRunner() {
    const modal = document.getElementById('codeRunnerModal');
    if (modal) modal.remove();
}

/**
 * Add code runner styles
 */
function addCodeRunnerStyles() {
    if (document.getElementById('codeRunnerStyles')) return;

    const style = document.createElement('style');
    style.id = 'codeRunnerStyles';
    style.textContent = `
        .code-runner-btn-run {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
        }

        .code-runner-btn-run:hover {
            background: #45a049;
        }

        .code-runner-btn-run:active {
            transform: scale(0.98);
        }

        .code-runner-btn-close {
            background: #f0f0f0;
            color: #333;
            border: 1px solid #ddd;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
        }

        .code-runner-btn-close:hover {
            background: #e0e0e0;
        }
    `;

    document.head.appendChild(style);
}

/**
 * Export functions to global scope
 */
window.executeCode = executeCode;
window.createCodeRunnerUI = createCodeRunnerUI;
window.runCodeExecution = runCodeExecution;
window.closeCodeRunner = closeCodeRunner;
window.isJavaFile = isJavaFile;
