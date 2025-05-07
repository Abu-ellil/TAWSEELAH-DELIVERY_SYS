const mongoose = require('mongoose');

const userPromotionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User promotion must belong to a user']
    },
    promotion: {
      type: mongoose.Schema.ObjectId,
      ref: 'Promotion',
      required: [true, 'User promotion must reference a promotion']
    },
    usageCount: {
      type: Number,
      default: 0
    },
    lastUsedAt: Date
  },
  {
    timestamps: true
  }
);

// Create compound index for user and promotion
userPromotionSchema.index({ user: 1, promotion: 1 }, { unique: true });

const UserPromotion = mongoose.model('UserPromotion', userPromotionSchema);

module.exports = UserPromotion;
