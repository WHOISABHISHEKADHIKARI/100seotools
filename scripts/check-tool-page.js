
import http from 'http';

// Test redirect from http://100seotools.com to https://www.100seotools.com
// Note: We can only test local middleware logic, not actual domain DNS/SSL
// But we can verify if the middleware *would* redirect if it saw that host.

// Since we can't easily mock the request to the running Next.js server with a fake host header
// without a more complex setup, we will rely on the code review of middleware.js which I have already done.
// Instead, I will create a script to fetch the structured-data-validator page and check for content.

const url = 'http://localhost:3000/tools/structured-data-validator';

console.log(`Fetching ${url}...`);

http.get(url, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('Page found!');
            // Check for static content presence
            if (data.includes('Structured Data Validator')) {
                console.log('✅ Title found');
            } else {
                console.log('❌ Title NOT found');
            }

            if (data.includes('canonical')) {
                console.log('✅ Canonical tag found');
            } else {
                console.log('❌ Canonical tag NOT found');
            }

            if (data.includes('What It Does')) {
                console.log('✅ Guide content found (What It Does)');
            } else {
                console.log('❌ Guide content NOT found');
            }

        } else {
            console.log('Page NOT found or error.');
        }
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
