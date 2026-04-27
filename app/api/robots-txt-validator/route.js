import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { robots } = await request.json();

        if (!robots || typeof robots !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Robots.txt content is required' },
                { status: 400 }
            );
        }

        const lines = robots.split(/\r?\n/);
        const report = [];
        let errors = 0;
        let warnings = 0;

        lines.forEach((line, index) => {
            const ln = index + 1;
            const content = line.trim();

            // Skip empty lines and comments
            if (!content || content.startsWith('#')) {
                return;
            }

            // Check for valid directives
            const validDirectives = ['User-agent', 'Disallow', 'Allow', 'Sitemap', 'Crawl-delay', 'Clean-param', 'Host'];
            const parts = content.split(':');

            if (parts.length < 2) {
                report.push(`Line ${ln} [ERROR]: Invalid format. Expected 'Directive: value'`);
                errors++;
                return;
            }

            const directive = parts[0].trim();
            // Case-insensitive check for standard directives
            const matchedDirective = validDirectives.find(d => d.toLowerCase() === directive.toLowerCase());
            const value = parts.slice(1).join(':').trim();

            if (!matchedDirective) {
                report.push(`Line ${ln} [ERROR]: Unknown directive '${directive}'`);
                errors++;
                return;
            }

            // Specific checks
            if (matchedDirective.toLowerCase() === 'user-agent') {
                if (!value) {
                    report.push(`Line ${ln} [ERROR]: User-agent cannot be empty`);
                    errors++;
                }
            } else if (matchedDirective.toLowerCase() === 'disallow' || matchedDirective.toLowerCase() === 'allow') {
                if (value && !value.startsWith('/') && value !== '*') {
                    // Allow empty Disallow: (means allow all)
                    report.push(`Line ${ln} [WARNING]: Path '${value}' should usually start with '/'`);
                    warnings++;
                }
            } else if (matchedDirective.toLowerCase() === 'sitemap') {
                if (!value.startsWith('http')) {
                    report.push(`Line ${ln} [WARNING]: Sitemap URL should be absolute (start with http/https)`);
                    warnings++;
                }
            }
        });

        let summary = '';
        if (errors === 0 && warnings === 0) {
            summary = '✅ Valid robots.txt file. No errors found.';
        } else {
            summary = `Found ${errors} errors and ${warnings} warnings.`;
        }

        const fullOutput = [
            summary,
            '',
            ...report
        ].join('\n');

        return NextResponse.json({
            success: true,
            result: fullOutput
        });

    } catch (error) {
        console.error('Robots Validator API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
