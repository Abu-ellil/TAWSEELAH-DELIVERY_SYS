const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const { AppError } = require('../../../middlewares/errorHandler');

// Sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Create and send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Register a new user
exports.signup = async (userData) => {
  // Create a new user
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    passwordConfirm: userData.passwordConfirm,
    role: userData.role || 'customer'
  });

  return newUser;
};

// Login user
exports.login = async (email, password) => {
  // 1) Check if email and password exist
  if (!email || !password) {
    throw new AppError('Please provide email and password!', 400);
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  return user;
};

// Forgot password
exports.forgotPassword = async (email) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('There is no user with that email address.', 404);
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  return resetToken;
};

// Reset password
exports.resetPassword = async (token, password, passwordConfirm) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};

// Update password
exports.updatePassword = async (userId, currentPassword, newPassword, newPasswordConfirm) => {
  // 1) Get user from collection
  const user = await User.findById(userId).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    throw new AppError('Your current password is wrong.', 401);
  }

  // 3) If so, update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  return user;
};
