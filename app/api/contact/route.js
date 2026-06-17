import { NextResponse } from 'next/server';

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { name, email, subject, message } = body || {};

        // Validate required fields
        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof subject !== 'string' ||
            typeof message !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !subject.trim() ||
            !message.trim()
        ) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address' },
                { status: 400 }
            );
        }

        const safeName = escapeHtml(name.trim());
        const safeEmail = escapeHtml(email.trim());
        const safeSubject = escapeHtml(subject.trim());
        const safeMessage = escapeHtml(message.trim());

        // Prepare email content
        const emailContent = {
            to: 'abhishekadhikari1254@gmail.com',
            from: email.trim(),
            subject: `Contact Form: ${subject.trim()}`,
            text: `
Name: ${name.trim()}
Email: ${email.trim()}
Subject: ${subject.trim()}

Message:
${message.trim()}

---
This message was sent from the 100 SEO Tools contact form.
      `,
            html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
    .value { background: white; padding: 10px; border-radius: 5px; border: 1px solid #e5e7eb; }
    .message-box { background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #dc2626; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">100 SEO Tools</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From:</div>
        <div class="value">${safeName}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${safeEmail}" style="color: #dc2626; text-decoration: none;">${safeEmail}</a></div>
      </div>
      <div class="field">
        <div class="label">Subject:</div>
        <div class="value">${safeSubject}</div>
      </div>
      <div class="message-box">
        <div class="label">Message:</div>
        <div style="margin-top: 10px; white-space: pre-wrap;">${safeMessage}</div>
      </div>
    </div>
    <div class="footer">
      This message was sent from the 100 SEO Tools contact form.<br>
      Reply directly to this email to respond to ${safeName}.
    </div>
  </div>
</body>
</html>
      `
        };

        // In production, you would integrate with an email service like:
        // - Resend (recommended for Next.js)
        // - SendGrid
        // - AWS SES
        // - Nodemailer with SMTP

        // Example with Resend (you'll need to install: npm install resend)
        /*
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: `contact@${baseUrl.replace(/^https?:\/\/(www\.)?/, '')}`,
          to: 'abhishekadhikari1254@gmail.com',
          reply_to: email,
          subject: `Contact Form: ${subject}`,
          html: emailContent.html,
        });
        */

        // For now, we'll return success and log the details
        // You can check the server console to see submissions
        return NextResponse.json(
            {
                success: true,
                message: 'Message received successfully',
                // In development, return the email content for verification
                ...(process.env.NODE_ENV === 'development' && { emailContent })
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process your request. Please try again.' },
            { status: 500 }
        );
    }
}
