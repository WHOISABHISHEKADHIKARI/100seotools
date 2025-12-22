import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllToolsMeta } from '../tools/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOOLS_DIR = path.join(__dirname, '..', 'tools');

// Logic duplicated from generateHighCTRMetadata.js
function generateTitle(tool) {
    const name = tool.name;
    const category = tool.category;

    const templates = [
        `Free ${name} | Boost Your SEO Rankings | 100 SEO Tools`,
        `${name} - Free Online Tool | Instant Results | 100 SEO Tools`,
        `Best ${name} | Analyze & Optimize SEO | Free Tool`,
        `${name} | Professional SEO Analysis | 100 SEO Tools`,
        `Free ${name} - Instant SEO Insights | 100 SEO Tools`,
    ];

    const categoryOptimizations = {
        'Keyword Research': `Free ${name} | Find High-Value Keywords | 100 SEO Tools`,
        'On-Page Optimization': `${name} | Optimize Content for Google | Free Tool`,
        'Technical SEO': `Free ${name} | Fix SEO Issues Fast | 100 SEO Tools`,
        'Backlink & Link-Building': `${name} | Build Quality Backlinks | Free SEO Tool`,
        'Content SEO': `Free ${name} | Create SEO-Optimized Content | 100 Tools`,
        'SEO Performance': `${name} | Track & Improve Rankings | Free Tool`,
        'Local SEO': `Free ${name} | Dominate Local Search | 100 SEO Tools`,
        'Competitor Analysis': `${name} | Spy on Competitors | Free SEO Tool`,
        'AI-Powered SEO': `AI ${name} | Smart SEO Automation | 100 SEO Tools`,
        'SEO Utility': `Free ${name} | Essential SEO Utility | 100 SEO Tools`,
    };

    return categoryOptimizations[category] || templates[0];
}

function generateDescription(tool) {
    const name = tool.name;
    const category = tool.category;

    const templates = {
        'Keyword Research': `Discover high-value keywords instantly with our free ${name}. Get search volume, competition data, and long-tail suggestions. Trusted by 10,000+ SEO professionals. Try it now!`,
        'On-Page Optimization': `Optimize your content for Google with our free ${name}. Analyze titles, meta tags, headings, and keyword density. Get instant recommendations to rank higher. Start optimizing now!`,
        'Technical SEO': `Fix technical SEO issues fast with our free ${name}. Identify crawl errors, broken links, and speed problems. Get actionable insights to improve site health. Analyze your site today!`,
        'Backlink & Link-Building': `Build quality backlinks with our free ${name}. Find link opportunities, analyze anchor text, and track your backlink profile. Boost your domain authority. Get started free!`,
        'Content SEO': `Create SEO-optimized content with our free ${name}. Analyze readability, keyword usage, and content structure. Write content that ranks and converts. Try it free today!`,
        'SEO Performance': `Track and improve your SEO performance with our free ${name}. Monitor rankings, traffic, and conversions. Get data-driven insights to grow organic traffic. Start tracking now!`,
        'Local SEO': `Dominate local search with our free ${name}. Optimize your Google Business Profile, citations, and local keywords. Attract more local customers. Get started today!`,
        'Competitor Analysis': `Spy on your competitors with our free ${name}. Discover their keywords, backlinks, and content strategy. Find gaps and opportunities to outrank them. Analyze competitors now!`,
        'AI-Powered SEO': `Automate your SEO with our AI-powered ${name}. Get smart recommendations, content ideas, and optimization tips. Save hours of manual work. Try AI SEO free!`,
        'SEO Utility': `Streamline your SEO workflow with our free ${name}. Quick, accurate, and easy to use. Essential tool for every SEO professional. Use it free today!`,
    };

    return templates[category] || `Use our free ${name} to improve your SEO. Get instant results, actionable insights, and professional-grade analysis. Join thousands of SEO professionals. Try it free now!`;
}

async function applyMetadata() {
    console.log('🚀 Starting Metadata Application...');
    const tools = getAllToolsMeta();
    let updatedCount = 0;

    for (const tool of tools) {
        const optimizedTitle = generateTitle(tool);
        const optimizedDesc = generateDescription(tool);

        // Find the file
        // Assumption: file name matches slug.js
        const filePath = path.join(TOOLS_DIR, `${tool.slug}.js`);

        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Regex to replace name and description
            // Handle both single and double quotes
            // Note: This is a simple regex replacement. It assumes standard formatting.

            const titleRegex = /("name"|'name'|name)\s*:\s*(["'])(?:(?=(\\?))\3.)*?\2/g;
            const descRegex = /("description"|'description'|description)\s*:\s*(["'])(?:(?=(\\?))\3.)*?\2/g;

            // Check if changes are needed
            // We use a simplified replace approach
            let newContent = content;

            // Replace Name
            // We need to be careful not to break JSON/JS syntax if the new string contains quotes
            const safeTitle = optimizedTitle.replace(/"/g, '\\"');
            const safeDesc = optimizedDesc.replace(/"/g, '\\"');

            // We assume the file uses "key": "value" or key: "value"
            // We'll construct a replacement using double quotes for consistency

            // Replace name
            newContent = newContent.replace(
                /(["']?name["']?\s*:\s*)(["'])(?:(?=(\\?))\3.)*?\2/,
                `$1"${safeTitle}"`
            );

            // Replace description
            newContent = newContent.replace(
                /(["']?description["']?\s*:\s*)(["'])(?:(?=(\\?))\3.)*?\2/,
                `$1"${safeDesc}"`
            );

            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`✅ Updated: ${tool.slug}`);
                updatedCount++;
            } else {
                console.log(`Skipped (No Change): ${tool.slug}`);
            }

        } else {
            console.error(`❌ File not found for: ${tool.slug}`);
        }
    }

    console.log(`\n✨ Metadata application complete! Updated ${updatedCount} tools.`);
}

applyMetadata();
