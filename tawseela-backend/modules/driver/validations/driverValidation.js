const Joi = require('joi');

// Update driver status validation schema
exports.updateDriverStatusSchema = Joi.object({
  status: Joi.string()
    .valid('available', 'on-trip', 'offline')
    .required()
});

// Update driver location validation schema
exports.updateDriverLocationSchema = Joi.object({
  coordinates: Joi.object({
    latitude: Joi.number().required().min(-90).max(90),
    longitude: Joi.number().required().min(-180).max(180)
  }).required()
});
