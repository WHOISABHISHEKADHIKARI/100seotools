import { NextResponse } from 'next/server';
import { getBaseUrl } from '../../../lib/site';

export async function POST(request) {
    try {
        const baseUrl = getBaseUrl();
        const { customer_name, rating, comment } = await request.json();

        const n = customer_name || 'Customer';
        const r = parseInt(rating) || 5;

        let output = `Generated Response for ${r}-Star Review by ${n}:\n\n`;

        if (r >= 4) {
            output += `Hi ${n},\n\n`;
            output += `Thank you so much for the amazing ${r}-star review! We are thrilled to hear that you enjoyed our service. `;
            if (comment) output += `It's great to know that you liked it. `;
            output += `We look forward to serving you again soon!\n\n`;
            output += `Best regards,\nThe Team`;
        } else if (r === 3) {
            output += `Hi ${n},\n\n`;
            output += `Thank you for your feedback. We appreciate you taking the time to rate us. `;
            output += `We always strive to improve, and your comments help us do that. If there's anything specific we can do better next time, please let us know.\n\n`;
            output += `Sincerely,\nCustomer Support`;
        } else {
            output += `Hi ${n},\n\n`;
            output += `We are very sorry to hear about your experience. This is not the standard we aim for. `;
            output += `Please contact us directly at support@${baseUrl.replace(/^https?:\/\/(www\.)?/, '')} so we can make this right. We value your business and want to ensure you are satisfied.\n\n`;
            output += `Sincerely,\nManagement Team`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
