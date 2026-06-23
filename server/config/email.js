const nodemailer = require('nodemailer');

const createTransporter = () => {
  const hasCredentials =
    process.env.GOOGLE_USER &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN;

  if (!hasCredentials) {
    console.warn('WARNING: Google OAuth credentials not fully configured in environment variables. Email service is running in LOG-ONLY fallback mode.');
    return {
      sendMail: async (mailOptions) => {
        console.log('\n--- [EMAIL LOG-ONLY FALLBACK] ---');
        console.log(`To:      ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Body:\n${mailOptions.text}`);
        console.log('--------------------------------\n');
        return { messageId: 'mock-email-id-' + Math.random().toString(36).substring(7) };
      }
    };
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
  });
};

const transporter = createTransporter();

module.exports = transporter;
