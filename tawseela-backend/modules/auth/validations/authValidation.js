const Joi = require('joi');

// Signup validation schema
exports.signupSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  phone: Joi.string().required().min(10).max(15),
  password: Joi.string().required().min(8),
  passwordConfirm: Joi.string().required().valid(Joi.ref('password')),
  role: Joi.string().valid('customer', 'driver', 'store-admin').default('customer')
});

// Login validation schema
exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Forgot password validation schema
exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

// Reset password validation schema
exports.resetPasswordSchema = Joi.object({
  password: Joi.string().required().min(8),
  passwordConfirm: Joi.string().required().valid(Joi.ref('password'))
});

// Update password validation schema
exports.updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  password: Joi.string().required().min(8),
  passwordConfirm: Joi.string().required().valid(Joi.ref('password'))
});
