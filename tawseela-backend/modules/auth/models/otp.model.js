const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['registration', 'login', 'password-reset'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
  }
}, {
  timestamps: true
});

// Add index for quick lookups and automatic deletion
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Static method to create new OTP
otpSchema.statics.createOTP = async function(userId, purpose) {
  const code = this.generateOTP();
  const otp = await this.create({
    user: userId,
    code,
    purpose
  });
  return otp;
};

// Instance method to verify OTP
otpSchema.methods.verifyOTP = async function(inputCode) {
  if (this.isVerified) {
    throw new Error('OTP already used');
  }
  if (Date.now() > this.expiresAt) {
    throw new Error('OTP expired');
  }
  if (this.code !== inputCode) {
    throw new Error('Invalid OTP');
  }
  this.isVerified = true;
  await this.save();
  return true;
};

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;