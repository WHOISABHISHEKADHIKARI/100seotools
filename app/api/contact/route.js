import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Prepare email content
        const emailContent = {
            to: 'abhishekadhikari1254@gmail.com',
            from: email,
            subject: `Contact Form: ${subject}`,
            text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

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
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${email}" style="color: #dc2626; text-decoration: none;">${email}</a></div>
      </div>
      <div class="field">
        <div class="label">Subject:</div>
        <div class="value">${subject}</div>
      </div>
      <div class="message-box">
        <div class="label">Message:</div>
        <div style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
      </div>
    </div>
    <div class="footer">
      This message was sent from the 100 SEO Tools contact form.<br>
      Reply directly to this email to respond to ${name}.
    </div>
  </div>
</body>
</html>
      `
        };

        // For development/testing: Log the email content
        console.log('📧 Contact form submission received:');
        console.log('From:', name, `<${email}>`);
        console.log('Subject:', subject);
        console.log('Message:', message);

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
          from: 'contact@100seotools.com',
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
            { error: 'Failed to process your request. Please try again.' },
            { status: 500 }
        );
    }
}
