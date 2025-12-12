async function checkLive() {
    const url = 'https://www.100seotools.com/contact';
    try {
        const res = await fetch(url);
        const html = await res.text();
        console.log(`Checking ${url}...`);

        // Check for specific schema types
        const hasContact = html.includes('ContactPage');
        const hasBreadcrumb = html.includes('BreadcrumbList');
        const hasFAQ = html.includes('FAQPage');

        console.log('Has ContactPage:', hasContact);
        console.log('Has BreadcrumbList:', hasBreadcrumb);
        console.log('Has FAQPage:', hasFAQ);

        if (hasContact) {
            console.log('SUCCESS: Schema found!');
        } else {
            console.log('FAILURE: Schema NOT found.');
            console.log('Build ID/Timestamp marker (if any):', html.match(/<script id="__NEXT_DATA__".*?"buildId":"(.*?)"/)?.[1]);
        }

    } catch (e) {
        console.error(e);
    }
}

checkLive();
