const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Message must belong to an order']
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a sender']
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a receiver']
    },
    content: {
      type: String,
      required: [true, 'Message must have content'],
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date
  },
  {
    timestamps: true
  }
);

// Create indexes
messageSchema.index({ order: 1 });
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });

// Query middleware
messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender',
    select: 'name role'
  }).populate({
    path: 'receiver',
    select: 'name role'
  });
  
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
