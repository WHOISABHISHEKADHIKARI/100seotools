# Contact Form Email Setup Guide

## Current Status
✅ Contact form UI is complete and functional
✅ API route is set up and validates form data
⚠️ Email sending is currently in **development mode** (logs to console)

## To Enable Real Email Sending

### Option 1: Resend (Recommended - Free tier available)

1. **Install Resend:**
   ```bash
   npm install resend
   ```

2. **Get API Key:**
   - Sign up at https://resend.com
   - Verify your domain or use their test domain
   - Get your API key from the dashboard

3. **Add to `.env.local`:**
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```

4. **Update `/app/api/contact/route.js`:**
   Uncomment the Resend code block (lines ~105-115) and update:
   ```javascript
   const { Resend } = require('resend');
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   await resend.emails.send({
     from: 'contact@yourdomain.com', // Must be verified domain
     to: 'abhishekadhikari1254@gmail.com',
     reply_to: email,
     subject: `Contact Form: ${subject}`,
     html: emailContent.html,
   });
   ```

### Option 2: SendGrid

1. **Install SendGrid:**
   ```bash
   npm install @sendgrid/mail
   ```

2. **Get API Key:**
   - Sign up at https://sendgrid.com
   - Create an API key

3. **Add to `.env.local`:**
   ```env
   SENDGRID_API_KEY=SG.your_api_key_here
   ```

4. **Update `/app/api/contact/route.js`:**
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
   await sgMail.send({
     to: 'abhishekadhikari1254@gmail.com',
     from: 'contact@yourdomain.com',
     replyTo: email,
     subject: `Contact Form: ${subject}`,
     html: emailContent.html,
   });
   ```

### Option 3: Nodemailer with Gmail

1. **Install Nodemailer:**
   ```bash
   npm install nodemailer
   ```

2. **Setup Gmail App Password:**
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate an App Password

3. **Add to `.env.local`:**
   ```env
   GMAIL_USER=abhishekadhikari1254@gmail.com
   GMAIL_APP_PASSWORD=your_16_char_app_password
   ```

4. **Update `/app/api/contact/route.js`:**
   ```javascript
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.GMAIL_USER,
       pass: process.env.GMAIL_APP_PASSWORD,
     },
   });
   
   await transporter.sendMail({
     from: process.env.GMAIL_USER,
     to: 'abhishekadhikari1254@gmail.com',
     replyTo: email,
     subject: `Contact Form: ${subject}`,
     html: emailContent.html,
   });
   ```

## Testing

### Development Mode (Current)
- Form submissions are logged to the server console
- Check your terminal running `npm run dev` to see submissions
- No actual emails are sent

### Production Mode
- After setting up an email service, test thoroughly
- Send a test message from the contact form
- Verify email arrives at abhishekadhikari1254@gmail.com
- Check spam folder if not in inbox

## Security Notes

- ✅ Form validation is implemented
- ✅ Email regex validation
- ✅ Rate limiting recommended for production (add middleware)
- ✅ Never commit `.env.local` to git
- ⚠️ Consider adding CAPTCHA for spam prevention

## Contact Page URL
- Local: http://localhost:3000/contact
- Production: https://www.100seotools.com/contact
