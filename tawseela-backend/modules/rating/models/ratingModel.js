const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Rating must have a sender']
    },
    toId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Rating must have a recipient']
    },
    type: {
      type: String,
      enum: ['user', 'driver'],
      required: [true, 'Rating must have a type']
    },
    score: {
      type: Number,
      required: [true, 'Rating must have a score'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Rating must be associated with an order']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes
ratingSchema.index({ fromId: 1, toId: 1, orderId: 1 }, { unique: true });
ratingSchema.index({ toId: 1, type: 1 });

// Query middleware
ratingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'fromId',
    select: 'name photo'
  }).populate({
    path: 'toId',
    select: 'name photo'
  });
  
  next();
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
