const http = require('http');
const https = require('https');

function checkRedirect(url, followRedirects = true, maxRedirects = 10, redirectChain = []) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const options = {
      method: 'HEAD',
      timeout: 10000,
      followRedirects: false
    };

    const req = protocol.request(url, options, (res) => {
      const statusCode = res.statusCode;
      const location = res.headers.location;
      
      console.log(`URL: ${url}`);
      console.log(`Status: ${statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
      console.log(`Redirect Chain: ${JSON.stringify([...redirectChain, {url, statusCode, location}], null, 2)}`);
      console.log('---');

      if (statusCode >= 300 && statusCode < 400 && location && followRedirects && redirectChain.length < maxRedirects) {
        // Follow redirect
        const nextUrl = new URL(location, url).toString();
        checkRedirect(nextUrl, followRedirects, maxRedirects, [...redirectChain, {url, statusCode, location}])
          .then(resolve)
          .catch(reject);
      } else {
        resolve({
          finalUrl: url,
          statusCode,
          headers: res.headers,
          redirectChain: [...redirectChain, {url, statusCode, location}]
        });
      }
    });

    req.on('error', (err) => {
      console.error(`Error checking ${url}:`, err.message);
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Test various URLs
async function testRedirects() {
  const testUrls = [
    'https://100seotools.com',
    'https://www.100seotools.com',
    'http://100seotools.com',
    'http://www.100seotools.com'
  ];

  for (const url of testUrls) {
    try {
      console.log(`\n=== Testing ${url} ===`);
      const result = await checkRedirect(url, true, 10, []);
      console.log('Final result:', JSON.stringify(result, null, 2));
    } catch (err) {
      console.error(`Failed to check ${url}:`, err.message);
    }
  }
}

testRedirects();