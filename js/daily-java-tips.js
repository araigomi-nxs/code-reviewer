/**
 * Daily Java Tip dashboard widget.
 * Fetches one Groq-generated Java tip per UTC day and caches it locally.
 */

const DAILY_JAVA_TIP_CACHE_KEY = 'daily-java-tip-cache-v1';
const DAILY_JAVA_TIP_ENDPOINT = '/api/daily-java-tip';

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

    if (!forceRefresh) {
        const cachedTip = getCachedDailyTip();
        if (cachedTip) {
            renderDailyJavaTip(cachedTip.tip);
            return cachedTip.tip;
        }
    }

    renderDailyJavaTipLoading();

    try {
        const response = await fetch(DAILY_JAVA_TIP_ENDPOINT, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const tip = {
            dateKey: data.dateKey || getUtcDateKey(),
            title: data.title || 'Today\'s Java Tip',
            difficulty: data.difficulty || 'Easy',
            topic: data.topic || 'Java Basics',
            useCase: data.useCase || '',
            tip: data.tip || '',
            whyItWorks: data.whyItWorks || '',
            codeBlock: data.codeBlock || '',
            practice: data.practice || '',
            source: data.source || (data.success ? 'groq' : 'fallback')
        };

        setCachedDailyTip(tip);
        renderDailyJavaTip(tip);
        return tip;
    } catch (error) {
        console.error('Daily Java tip load failed:', error);

        const fallbackTip = {
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

        renderDailyJavaTip(fallbackTip);
        return fallbackTip;
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
