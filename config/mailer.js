const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const isEmailConfigured = () =>
  process.env.SMTP_USER &&
  process.env.SMTP_USER !== 'your_email@gmail.com' &&
  process.env.SMTP_PASS &&
  process.env.SMTP_PASS !== 'your_gmail_app_password';

const sendEmail = async ({ to, subject, html, text }) => {
  // In development without SMTP configured, log and continue gracefully
  if (!isEmailConfigured()) {
    console.log('\n📧 [DEV MODE] Email not sent — SMTP not configured.');
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log('   (Set SMTP_USER and SMTP_PASS in backend/.env to enable real emails)\n');
    return { success: true, messageId: 'dev-mode' };
  }

  try {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'MediCare Store'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw new Error('Failed to send email: ' + error.message);
  }
};

const sendOTPEmail = async (email, otp, name) => {
  // Always log OTP in dev so it's testable without real SMTP
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔐 [DEV OTP] Email: ${email}  |  OTP: ${otp}  |  Name: ${name}\n`);
  }
  const templatePath = path.join(__dirname, '../templates/otpTemplate.html');
  let html;

  try {
    html = fs.readFileSync(templatePath, 'utf8');
    html = html.replace(/{{OTP}}/g, otp);
    html = html.replace(/{{NAME}}/g, name || 'User');
    html = html.replace(/{{EXPIRE_MINUTES}}/g, process.env.OTP_EXPIRE_MINUTES || '10');
  } catch (err) {
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">MediCare Store - Email Verification</h2>
        <p>Hello ${name || 'User'},</p>
        <p>Your OTP for verification is:</p>
        <h1 style="color: #0ea5e9; font-size: 48px; text-align: center; letter-spacing: 8px;">${otp}</h1>
        <p>This OTP is valid for ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
  }

  return sendEmail({
    to: email,
    subject: 'MediCare Store - Email Verification OTP',
    html
  });
};

const sendOrderConfirmationEmail = async (email, orderData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
        <p style="color: #e0f2fe; margin: 10px 0 0;">Thank you for your purchase</p>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
        <p style="color: #334155;">Hello <strong>${orderData.customerName}</strong>,</p>
        <p style="color: #334155;">Your order has been placed successfully!</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0ea5e9; margin: 0 0 15px;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
          <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
          <p><strong>Estimated Delivery:</strong> 3-5 Business Days</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">If you have any questions, contact us at support@medicarestore.com</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `MediCare Store - Order Confirmed #${orderData.orderId}`,
    html
  });
};

const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #0ea5e9;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #0ea5e9; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
      </div>
      <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'MediCare Store - Password Reset',
    html
  });
};

module.exports = { transporter, sendEmail, sendOTPEmail, sendOrderConfirmationEmail, sendPasswordResetEmail };
