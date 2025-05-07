const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true,
      maxlength: [100, 'A product name must have less or equal than 100 characters'],
      minlength: [3, 'A product name must have more or equal than 3 characters']
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price']
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function(val) {
          // This only works on CREATE and SAVE!!!
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    images: [String],
    category: {
      type: String,
      required: [true, 'A product must have a category']
    },
    tags: [String],
    store: {
      type: mongoose.Schema.ObjectId,
      ref: 'Store',
      required: [true, 'A product must belong to a store']
    },
    inStock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'piece',
      enum: ['piece', 'kg', 'g', 'l', 'ml']
    },
    featured: {
      type: Boolean,
      default: false
    },
    options: [
      {
        name: {
          type: String,
          required: true
        },
        choices: [
          {
            name: {
              type: String,
              required: true
            },
            price: {
              type: Number,
              default: 0
            }
          }
        ],
        required: {
          type: Boolean,
          default: false
        },
        multiple: {
          type: Boolean,
          default: false
        }
      }
    ],
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ store: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Query middleware
productSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'store',
    select: 'name logo'
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
