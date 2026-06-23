const transporter = require('../config/email');

const sendOTPEmail = async (email, otp, purpose) => {
  const subject = purpose === 'verification'
    ? 'Practice CAD - Verify Your Email'
    : 'Practice CAD - Password Reset Request';

  const bodyText = purpose === 'verification'
    ? `Welcome to Practice CAD!\n\nYour One-Time Password (OTP) for account verification is: ${otp}\n\nThis OTP is valid for 5 minutes. If you did not request this, please ignore this email.`
    : `You requested a password reset for your Practice CAD account.\n\nYour One-Time Password (OTP) to reset your password is: ${otp}\n\nThis OTP is valid for 5 minutes. If you did not request this, please ignore this email.`;

  const htmlBody = purpose === 'verification'
    ? `
      <div style="background-color: #f1f5f9; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; text-align: left;">
          <!-- Accent Line -->
          <div style="height: 6px; background: linear-gradient(90deg, #0f7af2 0%, #0263d9 100%);"></div>
          
          <!-- Logo & Header -->
          <div style="padding: 32px 32px 20px 32px; text-align: center;">
            <div style="font-size: 24px; font-weight: 800; letter-spacing: 0.5px; color: #0f172a; margin-bottom: 4px; font-family: 'Outfit', -apple-system, sans-serif;">
              <span style="color: #0f7af2;">Practice</span> <span style="color: #0263d9;">CAD</span>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">Observe • Solve • Compete</div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0 32px;" />
          
          <!-- Body Content -->
          <div style="padding: 32px; color: #334155; font-size: 15px; line-height: 1.6;">
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-align: center;">Verify Your Email Address</h3>
            <p style="margin-top: 0; margin-bottom: 24px; color: #475569; text-align: center;">Thank you for signing up for Practice CAD! Please use the One-Time Password (OTP) below to complete your registration:</p>
            
            <!-- OTP Box -->
            <div style="background-color: #f0f7ff; border: 1px solid #bcdffd; border-radius: 12px; padding: 24px 16px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #0263d9; margin-bottom: 8px;">Verification Code</div>
              <div style="font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f7af2; margin: 0; line-height: 1;">
                ${otp}
              </div>
            </div>
            
            <p style="font-size: 13px; color: #64748b; text-align: center; margin: 0 0 8px 0; line-height: 1.5;">
              This OTP is valid for <strong>5 minutes</strong>.
            </p>
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5;">
              If you did not request an account, you can safely ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0 0 6px 0;">&copy; ${new Date().getFullYear()} Practice CAD. All rights reserved.</p>
            <p style="margin: 0; color: #cbd5e1;">Competitive Visual Speed Solving Platform</p>
          </div>
        </div>
      </div>
    `
    : `
      <div style="background-color: #f1f5f9; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; text-align: left;">
          <!-- Accent Line -->
          <div style="height: 6px; background: linear-gradient(90deg, #f43f5e 0%, #be123c 100%);"></div>
          
          <!-- Logo & Header -->
          <div style="padding: 32px 32px 20px 32px; text-align: center;">
            <div style="font-size: 24px; font-weight: 800; letter-spacing: 0.5px; color: #0f172a; margin-bottom: 4px; font-family: 'Outfit', -apple-system, sans-serif;">
              <span style="color: #f43f5e;">Practice</span> <span style="color: #be123c;">CAD</span>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px;">Security & Account Recovery</div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0 32px;" />
          
          <!-- Body Content -->
          <div style="padding: 32px; color: #334155; font-size: 15px; line-height: 1.6;">
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-align: center;">Password Reset Request</h3>
            <p style="margin-top: 0; margin-bottom: 24px; color: #475569; text-align: center;">We received a request to reset the password for your account. Please use the verification code below to set a new password:</p>
            
            <!-- OTP Box -->
            <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 24px 16px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #be123c; margin-bottom: 8px;">Reset Password Code</div>
              <div style="font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #e11d48; margin: 0; line-height: 1;">
                ${otp}
              </div>
            </div>
            
            <p style="font-size: 13px; color: #64748b; text-align: center; margin: 0 0 8px 0; line-height: 1.5;">
              This OTP is valid for <strong>5 minutes</strong>.
            </p>
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5;">
              If you did not request a password reset, you can safely ignore this email and your password will remain unchanged.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0 0 6px 0;">&copy; ${new Date().getFullYear()} Practice CAD. All rights reserved.</p>
            <p style="margin: 0; color: #cbd5e1;">Competitive Visual Speed Solving Platform</p>
          </div>
        </div>
      </div>
    `;

  await transporter.sendMail({
    from: `"Practice CAD" <${process.env.GOOGLE_USER || 'no-reply@practicecad.com'}>`,
    to: email,
    subject: subject,
    text: bodyText,
    html: htmlBody
  });
};

module.exports = {
  sendOTPEmail
};
