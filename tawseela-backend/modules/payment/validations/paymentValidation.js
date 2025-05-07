const Joi = require('joi');

// Create payment intent validation schema
exports.createPaymentIntentSchema = Joi.object({
  orderId: Joi.string().required()
});

// Create payment link validation schema
exports.createPaymentLinkSchema = Joi.object({
  orderId: Joi.string().required()
});
