
import http from 'http';

const url = 'http://localhost:3000/blog/redirect-301-generator';

console.log(`Fetching ${url}...`);

http.get(url, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log('Page found!');
    } else {
        console.log('Page NOT found or error.');
    }

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.log('Body snippet:', data.substring(0, 500));
        }
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
