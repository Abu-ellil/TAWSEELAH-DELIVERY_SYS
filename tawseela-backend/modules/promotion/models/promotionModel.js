const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'A promotion must have a code'],
      unique: true,
      uppercase: true,
      trim: true
    },
    type: {
      type: String,
      required: [true, 'A promotion must have a type'],
      enum: ['percentage', 'fixed']
    },
    value: {
      type: Number,
      required: [true, 'A promotion must have a value']
    },
    maxDiscount: {
      type: Number,
      default: null
    },
    minOrderValue: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      required: [true, 'A promotion must have a start date'],
      default: Date.now
    },
    endDate: {
      type: Date,
      required: [true, 'A promotion must have an end date']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    usageLimit: {
      type: Number,
      default: null
    },
    usageCount: {
      type: Number,
      default: 0
    },
    userUsageLimit: {
      type: Number,
      default: 1
    },
    description: {
      type: String,
      trim: true
    },
    applicableStores: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Store'
      }
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ],
    applicableCategories: [String],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A promotion must have a creator']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes
promotionSchema.index({ code: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });
promotionSchema.index({ isActive: 1 });

// Virtual field to check if promotion is expired
promotionSchema.virtual('isExpired').get(function() {
  return Date.now() > this.endDate;
});

// Virtual field to check if promotion is valid
promotionSchema.virtual('isValid').get(function() {
  return (
    this.isActive &&
    !this.isExpired &&
    (this.usageLimit === null || this.usageCount < this.usageLimit)
  );
});

// Query middleware
promotionSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'applicableStores',
    select: 'name'
  }).populate({
    path: 'applicableProducts',
    select: 'name price'
  });
  
  next();
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
