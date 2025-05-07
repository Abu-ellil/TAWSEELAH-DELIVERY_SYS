const OTPService = require('../services/otp.service');
const { catchAsync } = require('../../../middlewares/errorHandler');

class OTPController {
  /**
   * Generate OTP for a user
   */
  static generateOTP = catchAsync(async (req, res) => {
    const { userId, purpose } = req.body;

    const result = await OTPService.generateOTP(userId, purpose);

    res.status(200).json({
      status: 'success',
      message: 'OTP generated successfully',
      data: {
        userId,
        purpose,
        // In production, don't send the OTP code in response
        // It should be sent via SMS/email only
        code: result.code
      }
    });
  });

  /**
   * Verify OTP code
   */
  static verifyOTP = catchAsync(async (req, res) => {
    const { userId, code, purpose } = req.body;

    await OTPService.verifyOTP(userId, code, purpose);

    res.status(200).json({
      status: 'success',
      message: 'OTP verified successfully'
    });
  });
}

module.exports = OTPController;