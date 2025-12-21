// Quick Dynamicity Test - Single Tool
// Run: node scripts/quickDynamicityTest.js [tool-slug]

import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const toolSlug = process.argv[2] || 'nap-consistency-checker';

async function quickTest() {
    console.log(`\n🧪 Quick Dynamicity Test: ${toolSlug}\n`);

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const url = `${BASE_URL}/tools/${toolSlug}`;
    console.log(`📍 Testing: ${url}\n`);

    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });

        console.log('✅ Page loaded successfully\n');

        // Test 1: Check for interactive elements
        console.log('🔍 Test 1: Interactive Elements');
        const buttons = await page.$$('button');
        const inputs = await page.$$('input, textarea');
        console.log(`   - Buttons found: ${buttons.length}`);
        console.log(`   - Input fields found: ${inputs.length}`);

        // Test 2: Check for real-time features
        console.log('\n🔍 Test 2: Real-Time Features');
        const hasCounter = await page.$('.character-count, .word-count, [class*="count"]');
        const hasPreview = await page.$('.preview, .output, [class*="preview"]');
        console.log(`   - Character/word counter: ${hasCounter ? '✅ Found' : '❌ Not found'}`);
        console.log(`   - Preview area: ${hasPreview ? '✅ Found' : '❌ Not found'}`);

        // Test 3: Test input interaction
        if (inputs.length > 0) {
            console.log('\n🔍 Test 3: Input Interaction');
            const firstInput = inputs[0];
            await firstInput.fill('Test input');
            console.log('   - Input filled: ✅');

            // Wait a bit to see if anything updates
            await page.waitForTimeout(500);

            // Check if preview updated
            const previewContent = await page.textContent('.preview, .output, [class*="preview"]').catch(() => null);
            if (previewContent && previewContent.includes('Test')) {
                console.log('   - Live preview working: ✅');
            } else {
                console.log('   - Live preview working: ❌');
            }
        }

        // Test 4: Test button click
        if (buttons.length > 0) {
            console.log('\n🔍 Test 4: Button Interaction');
            const actionButton = await page.$('button[type="submit"], button:has-text("Generate"), button:has-text("Check")');

            if (actionButton) {
                const isVisible = await actionButton.isVisible();
                const isEnabled = await actionButton.isEnabled();
                console.log(`   - Action button visible: ${isVisible ? '✅' : '❌'}`);
                console.log(`   - Action button enabled: ${isEnabled ? '✅' : '❌'}`);

                if (isVisible && isEnabled) {
                    await actionButton.click();
                    console.log('   - Button clicked: ✅');

                    // Check for loading state
                    await page.waitForTimeout(200);
                    const hasLoading = await page.$('.loading, .spinner, [class*="loading"]');
                    console.log(`   - Loading indicator: ${hasLoading ? '✅ Found' : '❌ Not found'}`);
                }
            }
        }

        // Test 5: Check for copy button
        console.log('\n🔍 Test 5: Copy Functionality');
        const copyButton = await page.$('button:has-text("Copy"), [aria-label*="copy"]');
        if (copyButton) {
            console.log('   - Copy button found: ✅');
            const isVisible = await copyButton.isVisible();
            console.log(`   - Copy button visible: ${isVisible ? '✅' : '❌'}`);
        } else {
            console.log('   - Copy button found: ❌');
        }

        // Summary
        console.log('\n📊 Quick Test Summary:');
        console.log(`   - Tool: ${toolSlug}`);
        console.log(`   - URL: ${url}`);
        console.log(`   - Interactive elements: ${buttons.length + inputs.length}`);
        console.log(`   - Status: Tests completed ✅`);

        console.log('\n💡 For comprehensive testing, use: node scripts/testToolDynamicity.js');

    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
    } finally {
        await browser.close();
    }
}

quickTest().catch(console.error);
