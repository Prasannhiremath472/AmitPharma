const { query } = require('../config/db');

class OTP {
  static async create(email, otp, purpose = 'verification') {
    // Delete existing OTPs for this email/purpose
    await query('DELETE FROM otps WHERE email = ? AND purpose = ?', [email, purpose]);

    const expiresAt = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRE_MINUTES) || 10) * 60 * 1000);
    await query(
      'INSERT INTO otps (email, otp, purpose, expires_at) VALUES (?, ?, ?, ?)',
      [email, otp, purpose, expiresAt]
    );
  }

  static async verify(email, otp, purpose = 'verification') {
    const otps = await query(
      'SELECT * FROM otps WHERE email = ? AND otp = ? AND purpose = ? AND expires_at > NOW() AND is_used = 0',
      [email, otp, purpose]
    );

    if (!otps.length) return false;

    // Mark as used
    await query('UPDATE otps SET is_used = 1 WHERE id = ?', [otps[0].id]);
    return true;
  }

  static async cleanup() {
    await query('DELETE FROM otps WHERE expires_at < NOW() OR is_used = 1');
  }

  static async exists(email, purpose = 'verification') {
    const otps = await query(
      'SELECT id FROM otps WHERE email = ? AND purpose = ? AND expires_at > NOW() AND is_used = 0',
      [email, purpose]
    );
    return otps.length > 0;
  }
}

module.exports = OTP;
