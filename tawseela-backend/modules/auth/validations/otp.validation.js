const Joi = require('joi');
const { validator } = require('../../../middlewares/validator');

const generateOTPSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
    'any.required': 'User ID is required'
  }),
  purpose: Joi.string().valid('registration', 'login', 'password-reset').required().messages({
    'string.empty': 'Purpose is required',
    'any.required': 'Purpose is required',
    'any.only': 'Purpose must be one of: registration, login, password-reset'
  })
});

const verifyOTPSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
    'any.required': 'User ID is required'
  }),
  code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    'string.empty': 'OTP code is required',
    'string.length': 'OTP code must be 6 digits',
    'string.pattern.base': 'OTP code must contain only numbers',
    'any.required': 'OTP code is required'
  }),
  purpose: Joi.string().valid('registration', 'login', 'password-reset').required().messages({
    'string.empty': 'Purpose is required',
    'any.required': 'Purpose is required',
    'any.only': 'Purpose must be one of: registration, login, password-reset'
  })
});

module.exports = {
  validateGenerateOTP: validator(generateOTPSchema),
  validateVerifyOTP: validator(verifyOTPSchema)
};