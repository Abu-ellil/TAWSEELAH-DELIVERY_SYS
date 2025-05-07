const Joi = require('joi');

// Create store validation schema
exports.createStoreSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  description: Joi.string(),
  category: Joi.string().required().valid(
    'restaurant',
    'grocery',
    'pharmacy',
    'electronics',
    'clothing',
    'other'
  ),
  location: Joi.object({
    type: Joi.string().default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    address: Joi.string().required(),
    city: Joi.string().required()
  }).required(),
  tags: Joi.array().items(Joi.string()),
  operatingHours: Joi.array().items(
    Joi.object({
      day: Joi.string().required().valid(
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ),
      open: Joi.boolean().default(true),
      openTime: Joi.string().default('09:00'),
      closeTime: Joi.string().default('22:00')
    })
  ),
  preparationTime: Joi.number().min(5),
  minimumOrderAmount: Joi.number().min(0),
  deliveryFee: Joi.number().min(0),
  taxPercentage: Joi.number().min(0)
});

// Update store validation schema
exports.updateStoreSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  description: Joi.string(),
  category: Joi.string().valid(
    'restaurant',
    'grocery',
    'pharmacy',
    'electronics',
    'clothing',
    'other'
  ),
  location: Joi.object({
    type: Joi.string().default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2),
    address: Joi.string(),
    city: Joi.string()
  }),
  tags: Joi.array().items(Joi.string()),
  operatingHours: Joi.array().items(
    Joi.object({
      day: Joi.string().required().valid(
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ),
      open: Joi.boolean().default(true),
      openTime: Joi.string(),
      closeTime: Joi.string()
    })
  ),
  preparationTime: Joi.number().min(5),
  minimumOrderAmount: Joi.number().min(0),
  deliveryFee: Joi.number().min(0),
  taxPercentage: Joi.number().min(0)
});
