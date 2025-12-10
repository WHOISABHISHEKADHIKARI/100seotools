

const BASE_URL = 'http://localhost:3000/api';

const tests = [
    // Backlink Tracking Template
    { id: 'BTT-01', url: '/backlink-tracking-template-generator', payload: { project_name: "My Campaign" }, expected: 200 },
    { id: 'BTT-02', url: '/backlink-tracking-template-generator', payload: { project_name: "" }, expected: 400 },
    { id: 'BTT-03', url: '/backlink-tracking-template-generator', payload: {}, expected: 400 },

    // Competitor Backlink Idea Generator
    { id: 'CBIG-01', url: '/competitor-backlink-idea-generator', payload: { competitor_url: "https://competitor.com" }, expected: 200 },
    { id: 'CBIG-02', url: '/competitor-backlink-idea-generator', payload: { competitor_url: "not-a-valid-url" }, expected: 400 },
    { id: 'CBIG-03', url: '/competitor-backlink-idea-generator', payload: { competitor_url: "" }, expected: 400 },
];

async function runTargetedTests() {
    console.log('Running Targeted Tests for BTT and CBIG...\n');

    for (const t of tests) {
        try {
            const start = Date.now();
            const res = await fetch(`${BASE_URL}${t.url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(t.payload)
            });
            const data = await res.json();
            const duration = Date.now() - start;

            const pass = res.status === t.expected;
            const statusIcon = pass ? '✅' : '❌';

            console.log(`${statusIcon} [${t.id}] Status: ${res.status} (Exp: ${t.expected}) - Time: ${duration}ms`);
            if (!pass) {
                console.log(`   Response: ${JSON.stringify(data)}`);
            }
        } catch (e) {
            console.log(`❌ [${t.id}] Network Error: ${e.message}`);
        }
    }
}

runTargetedTests();
