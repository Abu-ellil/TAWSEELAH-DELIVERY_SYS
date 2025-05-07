const Joi = require('joi');

// Create promotion validation schema
exports.createPromotionSchema = Joi.object({
  code: Joi.string().required(),
  type: Joi.string().valid('percentage', 'fixed').required(),
  value: Joi.number().required().min(0),
  maxDiscount: Joi.number().min(0).allow(null),
  minOrderValue: Joi.number().min(0).default(0),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date().required().greater(Joi.ref('startDate')),
  isActive: Joi.boolean().default(true),
  usageLimit: Joi.number().integer().min(1).allow(null),
  userUsageLimit: Joi.number().integer().min(1).default(1),
  description: Joi.string(),
  applicableStores: Joi.array().items(Joi.string()),
  applicableProducts: Joi.array().items(Joi.string()),
  applicableCategories: Joi.array().items(Joi.string())
});

// Update promotion validation schema
exports.updatePromotionSchema = Joi.object({
  code: Joi.string(),
  type: Joi.string().valid('percentage', 'fixed'),
  value: Joi.number().min(0),
  maxDiscount: Joi.number().min(0).allow(null),
  minOrderValue: Joi.number().min(0),
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref('startDate')),
  isActive: Joi.boolean(),
  usageLimit: Joi.number().integer().min(1).allow(null),
  userUsageLimit: Joi.number().integer().min(1),
  description: Joi.string(),
  applicableStores: Joi.array().items(Joi.string()),
  applicableProducts: Joi.array().items(Joi.string()),
  applicableCategories: Joi.array().items(Joi.string())
});

// Validate promo code schema
exports.validatePromoCodeSchema = Joi.object({
  code: Joi.string().required(),
  orderValue: Joi.number().required().min(0)
});
