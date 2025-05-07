const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user']
    },
    orderItems: [
      {
        store: {
          type: mongoose.Schema.ObjectId,
          ref: 'Store',
          required: [true, 'Order item must belong to a store']
        },
        items: [
          {
            product: {
              type: mongoose.Schema.ObjectId,
              ref: 'Product',
              required: [true, 'Order item must have a product']
            },
            name: String,
            price: Number,
            quantity: {
              type: Number,
              default: 1
            },
            selectedOptions: [
              {
                name: String,
                choice: {
                  name: String,
                  price: Number
                }
              }
            ],
            itemTotal: Number
          }
        ],
        storeSubtotal: Number,
        storeTax: Number,
        storeDeliveryFee: Number,
        storeTotal: Number,
        storeStatus: {
          type: String,
          enum: [
            'pending',
            'accepted',
            'preparing',
            'ready',
            'picked',
            'delivered',
            'cancelled'
          ],
          default: 'pending'
        },
        storePreparationTime: Number, // in minutes
        storeAcceptedAt: Date,
        storeReadyAt: Date
      }
    ],
    status: {
      type: String,
      enum: [
        'pending',
        'accepted',
        'preparing',
        'ready',
        'picked',
        'delivered',
        'cancelled'
      ],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'wallet'],
      default: 'cash'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paymentDetails: {
      transactionId: String,
      paymentProvider: String,
      amount: Number,
      currency: {
        type: String,
        default: 'SAR'
      },
      paidAt: Date
    },
    subtotal: {
      type: Number,
      required: [true, 'Order must have a subtotal']
    },
    tax: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'Order must have a total']
    },
    deliveryAddress: {
      address: {
        type: String,
        required: [true, 'Order must have a delivery address']
      },
      location: {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          required: [true, 'Order must have delivery coordinates']
        }
      }
    },
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    driverAssignedAt: Date,
    pickedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    estimatedDeliveryTime: Number, // in minutes
    notes: String,
    promoCode: {
      code: String,
      discount: Number,
      discountType: {
        type: String,
        enum: ['percentage', 'fixed']
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes
orderSchema.index({ user: 1 });
orderSchema.index({ driver: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'orderItems.store': 1 });
orderSchema.index({ 'deliveryAddress.location': '2dsphere' });

// Query middleware
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email phone'
  })
    .populate({
      path: 'driver',
      select: 'name phone currentLocation'
    })
    .populate({
      path: 'orderItems.store',
      select: 'name logo location'
    })
    .populate({
      path: 'orderItems.items.product',
      select: 'name images'
    });
  
  next();
});

// Calculate order totals before saving
orderSchema.pre('save', function(next) {
  // Calculate store subtotals and totals
  this.orderItems.forEach(storeOrder => {
    // Calculate item totals
    storeOrder.items.forEach(item => {
      let optionsTotal = 0;
      
      // Calculate options total
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        optionsTotal = item.selectedOptions.reduce((total, option) => {
          return total + (option.choice ? option.choice.price : 0);
        }, 0);
      }
      
      // Calculate item total
      item.itemTotal = (item.price + optionsTotal) * item.quantity;
    });
    
    // Calculate store subtotal
    storeOrder.storeSubtotal = storeOrder.items.reduce((total, item) => {
      return total + item.itemTotal;
    }, 0);
    
    // Get store for tax and delivery fee calculation
    const Store = mongoose.model('Store');
    Store.findById(storeOrder.store)
      .then(store => {
        if (store) {
          // Calculate store tax
          storeOrder.storeTax = storeOrder.storeSubtotal * (store.taxPercentage / 100);
          
          // Set store delivery fee
          storeOrder.storeDeliveryFee = store.deliveryFee;
          
          // Calculate store total
          storeOrder.storeTotal = storeOrder.storeSubtotal + storeOrder.storeTax + storeOrder.storeDeliveryFee;
          
          // Set store preparation time
          storeOrder.storePreparationTime = store.preparationTime;
        }
      })
      .catch(err => {
        console.error('Error calculating store totals:', err);
      });
  });
  
  // Calculate order subtotal
  this.subtotal = this.orderItems.reduce((total, storeOrder) => {
    return total + storeOrder.storeSubtotal;
  }, 0);
  
  // Calculate order tax
  this.tax = this.orderItems.reduce((total, storeOrder) => {
    return total + (storeOrder.storeTax || 0);
  }, 0);
  
  // Calculate order delivery fee
  this.deliveryFee = this.orderItems.reduce((total, storeOrder) => {
    return total + (storeOrder.storeDeliveryFee || 0);
  }, 0);
  
  // Apply promo code discount if available
  if (this.promoCode && this.promoCode.discount) {
    if (this.promoCode.discountType === 'percentage') {
      this.discount = (this.subtotal * this.promoCode.discount) / 100;
    } else {
      this.discount = this.promoCode.discount;
    }
  }
  
  // Calculate order total
  this.total = this.subtotal + this.tax + this.deliveryFee - this.discount;
  
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
