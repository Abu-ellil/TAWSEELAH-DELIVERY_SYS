const Joi = require('joi');

// Create product validation schema
exports.createProductSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string(),
  price: Joi.number().required().min(0),
  discountPrice: Joi.number().min(0),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  store: Joi.string().required(),
  inStock: Joi.boolean().default(true),
  quantity: Joi.number().min(0),
  unit: Joi.string().valid('piece', 'kg', 'g', 'l', 'ml').default('piece'),
  featured: Joi.boolean().default(false),
  options: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      choices: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          price: Joi.number().default(0)
        })
      ).required(),
      required: Joi.boolean().default(false),
      multiple: Joi.boolean().default(false)
    })
  )
});

// Update product validation schema
exports.updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string(),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0),
  category: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  inStock: Joi.boolean(),
  quantity: Joi.number().min(0),
  unit: Joi.string().valid('piece', 'kg', 'g', 'l', 'ml'),
  featured: Joi.boolean(),
  options: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      choices: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          price: Joi.number().default(0)
        })
      ).required(),
      required: Joi.boolean().default(false),
      multiple: Joi.boolean().default(false)
    })
  )
});
