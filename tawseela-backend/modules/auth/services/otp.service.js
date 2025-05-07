const OTP = require('../models/otp.model');
const winston = require('winston');

class OTPService {
  /**
   * Generate and save OTP for a user
   * @param {string} userId - User ID
   * @param {string} purpose - Purpose of OTP (registration, login, password-reset)
   * @returns {Promise<{code: string}>} - Generated OTP code
   */
  static async generateOTP(userId, purpose) {
    try {
      // Delete any existing unverified OTPs for this user and purpose
      await OTP.deleteMany({ 
        user: userId, 
        purpose, 
        isVerified: false 
      });

      // Create new OTP
      const otp = await OTP.createOTP(userId, purpose);

      // In production, you would send this via SMS/email
      // For now, we'll just log it (remove in production)
      winston.info(`OTP for user ${userId}: ${otp.code}`);

      return { code: otp.code };
    } catch (error) {
      winston.error('Error generating OTP:', error);
      throw new Error('Failed to generate OTP');
    }
  }

  /**
   * Verify OTP code
   * @param {string} userId - User ID
   * @param {string} code - OTP code to verify
   * @param {string} purpose - Purpose of OTP
   * @returns {Promise<boolean>} - Verification result
   */
  static async verifyOTP(userId, code, purpose) {
    try {
      const otp = await OTP.findOne({
        user: userId,
        purpose,
        isVerified: false
      }).sort({ createdAt: -1 });

      if (!otp) {
        throw new Error('No valid OTP found');
      }

      await otp.verifyOTP(code);
      return true;
    } catch (error) {
      winston.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Clean up expired OTPs (can be run periodically)
   */
  static async cleanupExpiredOTPs() {
    try {
      await OTP.deleteMany({
        expiresAt: { $lt: new Date() }
      });
    } catch (error) {
      winston.error('Error cleaning up OTPs:', error);
    }
  }
}

module.exports = OTPService;