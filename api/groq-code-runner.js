/**
 * Vercel Serverless Function - Groq Code Runner Proxy
 * Uses Groq LLM to execute Java code
 * Endpoint: POST /api/groq-code-runner
 */

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

        // Get Groq API key from environment
        const groqApiKey = process.env.GROQ_API_KEY;

        if (!groqApiKey) {
            return res.status(500).json({
                error: 'Groq API key not configured',
                message: 'Set GROQ_API_KEY in Vercel environment variables'
            });
        }

        console.log('[Groq Runner] Executing Java code with Groq...');

        // Prepare the prompt for Groq to execute the code
        const prompt = `You are a Java code executor. Execute the following Java code and return ONLY the output.

Java Code:
\`\`\`java
${sourceCode}
\`\`\`

${stdin ? `Test Input (stdin):\n${stdin}\n` : ''}

Execute this code and return ONLY the output. No explanations, no errors formatting, just the raw output the code would produce. If there's a compilation error, respond with: COMPILATION_ERROR: [error message]. If there's a runtime error, respond with: RUNTIME_ERROR: [error message].`;

        // Call Groq API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768', // Fast model suitable for code
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.1, // Low temperature for deterministic output
                max_tokens: 2000
            })
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.text();
            console.error('[Groq Runner] Groq API error:', groqResponse.status, errorData);
            return res.status(groqResponse.status).json({
                error: 'Groq API error',
                details: errorData
            });
        }

        const groqData = await groqResponse.json();
        const output = groqData.choices[0].message.content.trim();

        console.log('[Groq Runner] Code execution complete');

        // Parse response for errors
        let success = true;
        let error = null;
        let finalOutput = output;

        if (output.startsWith('COMPILATION_ERROR:')) {
            success = false;
            error = output.substring('COMPILATION_ERROR:'.length).trim();
            finalOutput = '';
        } else if (output.startsWith('RUNTIME_ERROR:')) {
            success = false;
            error = output.substring('RUNTIME_ERROR:'.length).trim();
            finalOutput = '';
        }

        return res.status(200).json({
            success: success,
            output: finalOutput || '(no output)',
            error: error,
            status: success ? 'Accepted' : (error ? 'Error' : 'Execution Complete'),
            statusId: success ? 3 : 6,
            executionTime: 'N/A',
            memory: 'N/A'
        });

    } catch (error) {
        console.error('[Groq Runner] Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
