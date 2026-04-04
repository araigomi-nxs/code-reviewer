/**
 * Vercel Serverless Function - Groq Code Runner
 * Uses Groq's Qwen 32B model to execute Java code
 * Keeps the API key private (not exposed to client-side code)
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'qwen/qwen3-32b'; // Same model as AI review

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
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'GROQ_API_KEY not configured',
                message: 'Set GROQ_API_KEY in Vercel environment variables'
            });
        }

        console.log('[Groq Runner] Executing Java code via Qwen 32B');

        // Prepare prompt for Groq to execute code
        const prompt = `You are a Java code executor. Execute the following Java code and return ONLY the output.

Java Code:
\`\`\`java
${sourceCode}
\`\`\`

${stdin ? `Input/stdin:\n${stdin}\n` : ''}

Execute this code and provide the output. If there's an error, show the error message.
Return ONLY the program output, no explanations.`;

        // Call Groq API with same model as review
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0,
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[Groq Runner] API Error:', response.status, errorData);

            if (response.status === 401) {
                return res.status(401).json({
                    error: 'Invalid GROQ_API_KEY',
                    message: 'Get a free API key at https://console.groq.com'
                });
            }

            return res.status(response.status).json({
                error: 'Groq API Error',
                details: errorData.error?.message || 'Unknown error'
            });
        }

        const result = await response.json();
        const output = result.choices[0]?.message?.content || '';

        console.log('[Groq Runner] Execution complete');

        return res.status(200).json({
            success: true,
            output: output || '(no output)',
            error: null,
            status: 'Execution Complete',
            executionTime: 'N/A',
            memory: 'N/A'
        });

    } catch (error) {
        console.error('[Judge0 Proxy] Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}


