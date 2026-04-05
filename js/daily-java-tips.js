/**
 * Daily Java Tip dashboard widget.
 * Fetches one Groq-generated Java tip per UTC day and stores it in Supabase.
 */

const DAILY_JAVA_TIP_CACHE_KEY = 'daily-java-tip-cache-v2';
const DAILY_JAVA_TIP_TABLE = 'daily_java_tips';

function getUtcDateKey() {
    return new Date().toISOString().slice(0, 10);
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatText(text) {
    return escapeHtml(text).replace(/\n/g, '<br>');
}

function getSupabaseClient() {
    if (window.supabaseInstance) {
        return window.supabaseInstance;
    }

    if (typeof window.supabaseInitPromise === 'object' && typeof window.supabaseInitPromise.then === 'function') {
        return window.supabaseInitPromise.then(() => window.supabaseInstance);
    }

    return Promise.resolve(window.supabaseInstance || null);
}

function getGroqApiKey() {
    return window.ENV?.VITE_GROQ_API_KEY || '';
}

function extractJsonObject(text) {
    if (!text) return null;

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        return null;
    }

    try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch (error) {
        return null;
    }
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
        source: 'fallback',
        savedToDatabase: false
    };
}

function normalizeTipPayload(tip, dateKey, source, savedToDatabase) {
    return {
        dateKey,
        title: tip.title || 'Today\'s Java Tip',
        difficulty: tip.difficulty || 'Easy',
        topic: tip.topic || 'Java Basics',
        useCase: tip.useCase || 'A practical everyday Java scenario.',
        tip: tip.tip || 'Focus on one small Java improvement today.',
        whyItWorks: tip.whyItWorks || 'This approach keeps Java code simpler and clearer.',
        codeBlock: tip.codeBlock || 'public class Tip { public static void main(String[] args) { System.out.println("Java tip"); } }',
        practice: tip.practice || 'Try adapting the example to your own code.',
        source,
        savedToDatabase
    };
}

async function fetchStoredTip(dateKey) {
    const client = await getSupabaseClient();
    if (!client) {
        return null;
    }

    const { data, error } = await client
        .from(DAILY_JAVA_TIP_TABLE)
        .select('*')
        .eq('date_key', dateKey)
        .maybeSingle();

    if (error) {
        console.warn('Daily Java tip database read failed:', error);
        return null;
    }

    if (!data) {
        return null;
    }

    return {
        dateKey: data.date_key,
        title: data.title,
        difficulty: data.difficulty,
        topic: data.topic,
        useCase: data.use_case,
        tip: data.tip,
        whyItWorks: data.why_it_works,
        codeBlock: data.code_block,
        practice: data.practice,
        source: data.source || 'database',
        savedToDatabase: true,
        generatedAt: data.generated_at
    };
}

async function storeTipInDatabase(tip) {
    const client = await getSupabaseClient();
    if (!client) {
        throw new Error('Supabase client not ready');
    }

    const { data, error } = await client
        .from(DAILY_JAVA_TIP_TABLE)
        .insert({
            date_key: tip.dateKey,
            title: tip.title,
            difficulty: tip.difficulty,
            topic: tip.topic,
            use_case: tip.useCase,
            tip: tip.tip,
            why_it_works: tip.whyItWorks,
            code_block: tip.codeBlock,
            practice: tip.practice,
            source: tip.source,
            generated_at: new Date().toISOString()
        })
        .select('*');

    if (error) {
        throw error;
    }

    return data?.[0] || null;
}

async function generateDailyJavaTip(dateKey) {
    const apiKey = getGroqApiKey();

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

    try {
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

        return normalizeTipPayload(parsed, dateKey, 'groq', false);
    } catch (error) {
        console.warn('Groq daily tip generation failed:', error);
        return fallbackTip(dateKey);
    }
}

function getCachedDailyTip() {
    try {
        const raw = localStorage.getItem(DAILY_JAVA_TIP_CACHE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || parsed.dateKey !== getUtcDateKey() || !parsed.tip) {
            return null;
        }

        return parsed;
    } catch (error) {
        console.warn('Daily Java tip cache read failed:', error);
        return null;
    }
}

function setCachedDailyTip(tip) {
    try {
        localStorage.setItem(DAILY_JAVA_TIP_CACHE_KEY, JSON.stringify({
            dateKey: getUtcDateKey(),
            tip
        }));
    } catch (error) {
        console.warn('Daily Java tip cache write failed:', error);
    }
}

function renderDailyJavaTipLoading() {
    const container = document.getElementById('dailyJavaTipDashboard');
    if (!container) return;

    container.className = 'daily-java-tip-loading';
    container.textContent = 'Loading today\'s Java tip...';
}

function renderDailyJavaTipError(message) {
    const container = document.getElementById('dailyJavaTipDashboard');
    if (!container) return;

    container.className = 'daily-java-tip-empty';
    container.innerHTML = `
        <div style="font-size: 1rem; margin-bottom: 6px;">Unable to load today\'s tip</div>
        <div>${formatText(message || 'Try again in a moment.')}</div>
    `;
}

function renderDailyJavaTip(tip) {
    const container = document.getElementById('dailyJavaTipDashboard');
    if (!container) return;

    if (!tip) {
        renderDailyJavaTipError('No tip was returned.');
        return;
    }

    container.className = 'daily-java-tip-content';
    container.innerHTML = `
        <div class="daily-java-tip-grid">
            <div class="daily-java-tip-panel">
                <p class="daily-java-tip-label">Use Case</p>
                <div style="margin-bottom: 8px; font-size: 1.05em; font-weight: 700; color: var(--text-primary);">${escapeHtml(tip.title || "Today's Java Tip")}</div>
                <div class="daily-java-tip-copy">${formatText(tip.useCase || '')}</div>

                <div class="daily-java-tip-meta">
                    <span class="daily-java-tip-chip">${escapeHtml(tip.difficulty || 'Easy')}</span>
                    <span class="daily-java-tip-chip">${escapeHtml(tip.topic || 'Java')}</span>
                    ${tip.savedToDatabase ? '<span class="daily-java-tip-chip">Saved in DB</span>' : ''}
                    ${tip.source ? `<span class="daily-java-tip-chip">${escapeHtml(tip.source === 'groq' ? 'Groq Qwen' : 'Fallback')}</span>` : ''}
                </div>
            </div>

            <div class="daily-java-tip-panel">
                <p class="daily-java-tip-label">Today's Tip</p>
                <div class="daily-java-tip-copy">
                    <p>${formatText(tip.tip || '')}</p>
                    <p><strong>Why it works:</strong> ${formatText(tip.whyItWorks || '')}</p>
                    <p><strong>Practice:</strong> ${formatText(tip.practice || '')}</p>
                </div>
            </div>
        </div>

        <div class="daily-java-tip-panel" style="margin-top: 16px; position: relative; z-index: 1;">
            <p class="daily-java-tip-label">Code Block</p>
            <div class="code-block daily-java-tip-code">${escapeHtml(tip.codeBlock || '')}</div>
        </div>
    `;

    if (typeof initJavaSyntaxHighlighting === 'function') {
        try {
            initJavaSyntaxHighlighting();
        } catch (error) {
            console.warn('Daily Java tip highlighting failed:', error);
        }
    }
}

async function loadDailyJavaTip(forceRefresh = false) {
    const container = document.getElementById('dailyJavaTipDashboard');
    if (!container) return null;

    const dateKey = getUtcDateKey();

    if (!forceRefresh) {
        const cachedTip = getCachedDailyTip();
        if (cachedTip) {
            renderDailyJavaTip(cachedTip.tip);
            return cachedTip.tip;
        }
    }

    renderDailyJavaTipLoading();

    try {
        const storedTip = await fetchStoredTip(dateKey);
        if (storedTip) {
            setCachedDailyTip(storedTip);
            renderDailyJavaTip(storedTip);
            return storedTip;
        }

        const generatedTip = await generateDailyJavaTip(dateKey);

        try {
            const savedTip = await storeTipInDatabase(generatedTip);
            const responseTip = savedTip
                ? {
                    dateKey: savedTip.date_key,
                    title: savedTip.title,
                    difficulty: savedTip.difficulty,
                    topic: savedTip.topic,
                    useCase: savedTip.use_case,
                    tip: savedTip.tip,
                    whyItWorks: savedTip.why_it_works,
                    codeBlock: savedTip.code_block,
                    practice: savedTip.practice,
                    source: savedTip.source || 'database',
                    savedToDatabase: true,
                    generatedAt: savedTip.generated_at
                }
                : generatedTip;

            setCachedDailyTip(responseTip);
            renderDailyJavaTip(responseTip);
            return responseTip;
        } catch (writeError) {
            if (writeError?.code === '23505') {
                const existingTip = await fetchStoredTip(dateKey);
                if (existingTip) {
                    setCachedDailyTip(existingTip);
                    renderDailyJavaTip(existingTip);
                    return existingTip;
                }
            }

            console.warn('Daily Java tip save failed:', writeError);
            const responseTip = {
                ...generatedTip,
                savedToDatabase: false
            };
            setCachedDailyTip(responseTip);
            renderDailyJavaTip(responseTip);
            return responseTip;
        }
    } catch (error) {
        console.error('Daily Java tip load failed:', error);

        const fallback = fallbackTip(dateKey);
        renderDailyJavaTip(fallback);
        return fallback;
    }
}

function initializeDailyJavaTipWidget() {
    const container = document.getElementById('dailyJavaTipDashboard');
    if (!container) return;

    loadDailyJavaTip(false);
}

window.loadDailyJavaTip = loadDailyJavaTip;
window.renderDailyJavaTip = renderDailyJavaTip;
window.initializeDailyJavaTipWidget = initializeDailyJavaTipWidget;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDailyJavaTipWidget);
} else {
    initializeDailyJavaTipWidget();
}
