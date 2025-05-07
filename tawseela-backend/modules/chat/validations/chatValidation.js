const Joi = require('joi');

// Send message validation schema
exports.sendMessageSchema = Joi.object({
  order: Joi.string().required(),
  content: Joi.string().required().min(1).max(500)
});
