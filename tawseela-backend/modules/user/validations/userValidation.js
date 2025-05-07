const Joi = require('joi');

// Update user profile validation schema
exports.updateUserProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  phone: Joi.string().min(10).max(15),
  photo: Joi.string()
});

// Add user address validation schema
exports.addUserAddressSchema = Joi.object({
  title: Joi.string().required(),
  address: Joi.string().required(),
  location: Joi.object({
    type: Joi.string().default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  }).required(),
  isDefault: Joi.boolean().default(false)
});

// Update user address validation schema
exports.updateUserAddressSchema = Joi.object({
  title: Joi.string(),
  address: Joi.string(),
  location: Joi.object({
    type: Joi.string().default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2)
  }),
  isDefault: Joi.boolean()
});
