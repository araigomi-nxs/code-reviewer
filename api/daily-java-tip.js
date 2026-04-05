/**
 * Vercel Serverless Function - Daily Java Tip Generator
 * Uses Groq's Qwen model to create one Java tip per day.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'qwen/qwen3-32b';

function getDateKey() {
    return new Date().toISOString().slice(0, 10);
}

function fallbackTip(dateKey) {
    return {
        dateKey,
        title: 'Use a small helper method for repeated logic',
        difficulty: 'Easy',
        topic: 'Methods',
        useCase: 'When the same Java code appears more than once, move it into a method so your program is shorter and easier to test.',
        tip: 'Extract repeated steps into a method with a clear name. That keeps your main flow readable and makes small changes safer.',
        whyItWorks: 'Methods reduce duplication, make intent clearer, and let you reuse logic without copying code.',
        codeBlock: 'public class GreetingExample {\n    static void printGreeting(String name) {\n        System.out.println("Hello, " + name + "!");\n    }\n\n    public static void main(String[] args) {\n        printGreeting("Ava");\n        printGreeting("Noah");\n    }\n}',
        practice: 'Try changing the method so it prints a custom title like "Welcome, Ava" instead of a fixed greeting.',
        source: 'fallback'
    };
}

function extractJsonObject(text) {
    if (!text) return null;

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        return null;
    }

    const candidate = text.slice(firstBrace, lastBrace + 1);
    try {
        return JSON.parse(candidate);
    } catch (error) {
        return null;
    }
}

async function generateDailyJavaTip(dateKey) {
    const apiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
        return fallbackTip(dateKey);
    }

    const prompt = `You are writing a daily Java programming tip for a learning dashboard.

Requirements:
- Target easy to medium learners.
- Focus on one practical Java concept.
- Include a realistic use case.
- Include one Java code block inside the JSON field named codeBlock, but do not wrap it in markdown fences.
- Keep it concise and useful.
- Return valid JSON only. No markdown, no explanations.

Return an object with exactly these keys:
- title
- difficulty
- topic
- useCase
- tip
- whyItWorks
- codeBlock
- practice

Today's date: ${dateKey}

Make the tip feel fresh, but keep it grounded in everyday Java practice.`;

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
                    role: 'system',
                    content: 'You generate concise Java learning content and must output valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 700,
            top_p: 1
        })
    });

    if (!response.ok) {
        return fallbackTip(dateKey);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const parsed = extractJsonObject(content);

    if (!parsed) {
        return fallbackTip(dateKey);
    }

    return {
        dateKey,
        title: parsed.title || 'Today\'s Java Tip',
        difficulty: parsed.difficulty || 'Easy',
        topic: parsed.topic || 'Java Basics',
        useCase: parsed.useCase || 'A practical everyday Java scenario.',
        tip: parsed.tip || 'Focus on one small Java improvement today.',
        whyItWorks: parsed.whyItWorks || 'This approach keeps Java code simpler and clearer.',
        codeBlock: parsed.codeBlock || 'public class Tip { public static void main(String[] args) { System.out.println("Java tip"); } }',
        practice: parsed.practice || 'Try adapting the example to your own code.',
        source: 'groq'
    };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const dateKey = getDateKey();
        const tip = await generateDailyJavaTip(dateKey);

        res.setHeader('Cache-Control', 'no-store, max-age=0');
        return res.status(200).json({
            success: true,
            ...tip
        });
    } catch (error) {
        console.error('[Daily Java Tip] Error:', error);
        return res.status(200).json({
            success: false,
            ...fallbackTip(getDateKey()),
            error: error.message
        });
    }
}
