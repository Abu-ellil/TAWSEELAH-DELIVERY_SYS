const Joi = require('joi');

// Create rating validation schema
exports.createRatingSchema = Joi.object({
  toId: Joi.string().required(),
  type: Joi.string().valid('user', 'driver').required(),
  score: Joi.number().required().min(1).max(5),
  comment: Joi.string(),
  orderId: Joi.string().required()
});

// Update rating validation schema
exports.updateRatingSchema = Joi.object({
  score: Joi.number().min(1).max(5),
  comment: Joi.string()
}).min(1);
