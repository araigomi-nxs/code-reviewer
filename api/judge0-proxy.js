/**
 * Vercel Serverless Function - Judge0 API Proxy
 * Securely proxies Java code execution requests to Judge0 using environment variables
 * Keeps the API key private (not exposed to client-side code)
 */

const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com';
const JAVA_LANGUAGE_ID = 62; // Java (OpenJDK 8)

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sourceCode, stdin = '' } = req.body;

        if (!sourceCode) {
            return res.status(400).json({ error: 'sourceCode is required' });
        }

        // Get API key from environment (only accessible on server-side)
        const apiKey = process.env.JUDGE0_API_KEY;

        const payload = {
            language_id: JAVA_LANGUAGE_ID,
            source_code: sourceCode,
            stdin: stdin
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        // Add API credentials if available
        if (apiKey) {
            headers['x-rapidapi-key'] = apiKey;
            headers['x-rapidapi-host'] = 'judge0-ce.p.rapidapi.com';
        }

        console.log('[Judge0 Proxy] Submitting Java code to Judge0 API');

        // Submit code for execution
        const submitResponse = await fetch(`${JUDGE0_URL}/submissions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!submitResponse.ok) {
            const errorData = await submitResponse.text();
            console.error('[Judge0 Proxy] Submission error:', submitResponse.status, errorData);
            return res.status(submitResponse.status).json({
                error: `Judge0 API error: ${submitResponse.status}`,
                details: errorData
            });
        }

        const submission = await submitResponse.json();
        const submissionId = submission.token;

        console.log('[Judge0 Proxy] Submission created:', submissionId);

        // Poll for results
        let attempts = 0;
        const maxAttempts = 60; // 30 seconds with 500ms polling
        let result = null;

        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms

            const checkResponse = await fetch(`${JUDGE0_URL}/submissions/${submissionId}`, {
                headers: headers
            });

            if (!checkResponse.ok) {
                return res.status(checkResponse.status).json({
                    error: `Failed to check submission status: ${checkResponse.status}`
                });
            }

            result = await checkResponse.json();
            console.log(`[Judge0 Proxy] Status check ${attempts + 1}/${maxAttempts}:`, result.status.id);

            // Status 1 = In Queue, 2 = Processing
            if (result.status.id > 2) {
                console.log('[Judge0 Proxy] Execution complete');
                break;
            }

            attempts++;
        }

        if (attempts >= maxAttempts) {
            return res.status(408).json({
                error: 'Execution timeout - took too long'
            });
        }

        // Format and return result
        const formattedResult = formatJudge0Result(result);
        console.log('[Judge0 Proxy] Returning result:', formattedResult.status);

        return res.status(200).json(formattedResult);

    } catch (error) {
        console.error('[Judge0 Proxy] Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

/**
 * Format Judge0 result for client consumption
 */
function formatJudge0Result(result) {
    const statusMap = {
        1: 'In Queue',
        2: 'Processing',
        3: 'Accepted',
        4: 'Wrong Answer',
        5: 'Time Limit Exceeded',
        6: 'Compilation Error',
        7: 'Runtime Error (SIGSEGV)',
        8: 'Runtime Error (SIGXFSZ)',
        9: 'Runtime Error (SIGABRT)',
        10: 'Runtime Error (NZEC)',
        11: 'Runtime Error (Other)',
        12: 'Internal Error',
        13: 'Exec Format Error'
    };

    const statusId = result.status.id;
    const statusText = statusMap[statusId] || 'Unknown';

    return {
        success: statusId === 3, // Status 3 = Accepted
        output: result.stdout || '',
        error: result.stderr || result.compile_output || '',
        status: statusText,
        statusId: statusId,
        executionTime: result.time ? `${(parseFloat(result.time) * 1000).toFixed(2)}ms` : 'N/A',
        memory: result.memory ? `${result.memory}KB` : 'N/A',
        token: result.token
    };
}
