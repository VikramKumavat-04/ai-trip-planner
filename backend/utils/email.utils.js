const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    tls: { rejectUnauthorized: false },
  });

const sendPasswordResetEmail = async (email, name, resetToken) => {
  const transporter = createTransporter();
  await transporter.verify();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: `"AI Trip Planner" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password - AI Trip Planner',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="background: linear-gradient(135deg, #4F46E5, #8B5CF6); width: 56px; height: 56px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="color: white; font-size: 24px;">✈️</span>
          </div>
          <h1 style="color: #0f172a; font-size: 24px; margin: 0;">AI Trip Planner</h1>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #475569;">Hi <strong>${name}</strong>,</p>
          <p style="color: #475569;">We received a request to reset your password. Click the button below — this link expires in <strong>1 hour</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}"
              style="background: linear-gradient(135deg, #4F46E5, #8B5CF6); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px;">
              Reset My Password
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            If the button doesn't work, copy this link:<br />
            <a href="${resetUrl}" style="color: #4F46E5; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
          © 2026 AI Trip Planner — Made with ❤️ by Vikram Kumavat
        </p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail };