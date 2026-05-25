const User = require('../models/User');
const OTP = require('../models/OTP');
const generateOTP = require('../utils/generateOTP');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const { sendOTPEmail, sendPasswordResetEmail } = require('../config/mailer');
const { query } = require('../config/db');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone });

    // Generate and send OTP
    const otp = generateOTP(6);
    await OTP.create(email, otp, 'verification');
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email with the OTP sent.',
      data: { userId: user.id, email }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose = 'verification' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const isValid = await OTP.verify(email, otp, purpose);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    if (purpose === 'verification') {
      await User.update(await getUserIdByEmail(email), { is_verified: 1 });

      const user = await User.findByEmail(email);
      const token = generateToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id);

      return res.json({
        success: true,
        message: 'Email verified successfully',
        data: { token, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
      });
    }

    res.json({ success: true, message: 'OTP verified successfully', data: { verified: true } });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
};

const getUserIdByEmail = async (email) => {
  const users = await query('SELECT id FROM users WHERE email = ?', [email]);
  return users[0]?.id;
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { email, purpose = 'verification' } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOTP(6);
    await OTP.create(email, otp, purpose);
    await sendOTPEmail(email, otp, user.name);

    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
};

// @desc    Login
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated. Contact support.' });
    }

    if (!user.is_verified) {
      const otp = generateOTP(6);
      await OTP.create(email, otp, 'verification');
      await sendOTPEmail(email, otp, user.name);
      return res.status(403).json({
        success: false,
        message: 'Email not verified. A new OTP has been sent.',
        data: { requiresVerification: true, email }
      });
    }

    const token = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const newToken = generateToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      data: { token: newToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return res.json({ success: true, message: 'If that email exists, you will receive an OTP.' });
    }

    const otp = generateOTP(6);
    await OTP.create(email, otp, 'password_reset');
    await sendOTPEmail(email, otp, user.name);

    res.json({ success: true, message: 'OTP sent to your email for password reset.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const isValid = await OTP.verify(email, otp, 'password_reset');
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const userId = await getUserIdByEmail(email);
    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.updatePassword(userId, newPassword);

    res.json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user data' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password required' });
    }

    const user = await User.findByEmail(req.user.email);
    const isMatch = await User.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    await User.updatePassword(req.user.id, newPassword);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

module.exports = { register, verifyOTP, resendOTP, login, refreshToken, forgotPassword, resetPassword, getMe, changePassword };
