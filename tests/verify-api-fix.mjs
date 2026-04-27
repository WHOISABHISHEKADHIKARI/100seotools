
// Wrapper for native fetch to test the local API
async function testApi() {
    const url = 'http://localhost:3000/api/keyword-suggestion-tool';
    console.log(`Sending POST request to ${url}...`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ seed: 'seo tools' }),
        });

        const status = response.status;
        console.log(`Response Status: ${status}`);

        if (status === 200) {
            const data = await response.json();
            console.log('Response Body:', JSON.stringify(data, null, 2));
            if (data.success && data.result) {
                console.log('\nSUCCESS: API is accepting the "seed" parameter and returning results.');
            } else {
                console.error('\nFAILURE: API returned 200 but unexpected data format.');
            }
        } else {
            const text = await response.text();
            console.error(`\nFAILURE: API returned error. Body: ${text}`);
        }
    } catch (error) {
        console.error('\nERROR: Could not connect to the API. Is the server running on localhost:3000?');
        console.error(error.message);
    }
}

testApi();
