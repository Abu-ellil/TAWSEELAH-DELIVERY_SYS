const Joi = require('joi');

// Create order validation schema
exports.createOrderSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        store: Joi.string().required(),
        items: Joi.array()
          .items(
            Joi.object({
              product: Joi.string().required(),
              quantity: Joi.number().integer().min(1).default(1),
              selectedOptions: Joi.array().items(
                Joi.object({
                  name: Joi.string().required(),
                  choice: Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().min(0)
                  }).required()
                })
              )
            })
          )
          .min(1)
          .required()
      })
    )
    .min(1)
    .required(),
  paymentMethod: Joi.string().valid('cash', 'card', 'wallet').default('cash'),
  deliveryAddress: Joi.object({
    address: Joi.string().required(),
    location: Joi.object({
      type: Joi.string().default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required()
  }).required(),
  promoCode: Joi.object({
    code: Joi.string().required(),
    discount: Joi.number().min(0),
    discountType: Joi.string().valid('percentage', 'fixed')
  }),
  notes: Joi.string()
});

// Add to order validation schema
exports.addToOrderSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        store: Joi.string().required(),
        items: Joi.array()
          .items(
            Joi.object({
              product: Joi.string().required(),
              quantity: Joi.number().integer().min(1).default(1),
              selectedOptions: Joi.array().items(
                Joi.object({
                  name: Joi.string().required(),
                  choice: Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().min(0)
                  }).required()
                })
              )
            })
          )
          .min(1)
          .required()
      })
    )
    .min(1)
    .required()
});

// Update order status validation schema
exports.updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'accepted', 'preparing', 'ready', 'picked', 'delivered', 'cancelled')
    .required(),
  cancelReason: Joi.string().when('status', {
    is: 'cancelled',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

// Update store order status validation schema
exports.updateStoreOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'accepted', 'preparing', 'ready', 'picked', 'delivered', 'cancelled')
    .required()
});

// Assign driver validation schema
exports.assignDriverSchema = Joi.object({
  driverId: Joi.string().required()
});
