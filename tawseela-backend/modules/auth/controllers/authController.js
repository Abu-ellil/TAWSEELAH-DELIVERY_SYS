const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
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
exports.signup = async (req, res, next) => {
  try {
    const newUser = await authService.signup(req.body);
    createSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const resetToken = await authService.forgotPassword(req.body.email);
    
    // In a real application, you would send an email with the reset token
    // For development, we'll just return it in the response
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
      resetToken // In production, remove this line
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const user = await authService.resetPassword(
      req.params.token,
      req.body.password,
      req.body.passwordConfirm
    );
    
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await authService.updatePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.password,
      req.body.passwordConfirm
    );
    
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
