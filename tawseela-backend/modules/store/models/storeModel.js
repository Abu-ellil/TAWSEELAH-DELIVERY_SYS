const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A store must have a name'],
      trim: true,
      maxlength: [50, 'A store name must have less or equal than 50 characters'],
      minlength: [3, 'A store name must have more or equal than 3 characters']
    },
    slug: String,
    description: {
      type: String,
      trim: true
    },
    logo: {
      type: String,
      default: 'default-store.jpg'
    },
    coverImage: {
      type: String,
      default: 'default-cover.jpg'
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      city: String
    },
    category: {
      type: String,
      required: [true, 'A store must have a category'],
      enum: [
        'restaurant',
        'grocery',
        'pharmacy',
        'electronics',
        'clothing',
        'other'
      ]
    },
    tags: [String],
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // Round to 1 decimal place
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    operatingHours: [
      {
        day: {
          type: String,
          enum: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday'
          ],
          required: true
        },
        open: {
          type: Boolean,
          default: true
        },
        openTime: {
          type: String,
          default: '09:00'
        },
        closeTime: {
          type: String,
          default: '22:00'
        }
      }
    ],
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A store must have an owner']
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    featured: {
      type: Boolean,
      default: false
    },
    preparationTime: {
      type: Number,
      default: 15, // in minutes
      min: [5, 'Preparation time must be at least 5 minutes']
    },
    minimumOrderAmount: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    taxPercentage: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes
storeSchema.index({ location: '2dsphere' });
storeSchema.index({ name: 1 });
storeSchema.index({ category: 1 });
storeSchema.index({ slug: 1 });

// Virtual populate for products
storeSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'store',
  localField: '_id'
});

// Virtual populate for reviews
storeSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'store',
  localField: '_id'
});

// Document middleware: runs before .save() and .create()
storeSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query middleware
storeSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

storeSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'owner',
    select: 'name email phone'
  });
  next();
});

// Helper function to slugify store name
function slugify(text, options) {
  const defaults = {
    lower: true
  };
  
  options = { ...defaults, ...options };
  
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
