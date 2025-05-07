const Message = require('../models/messageModel');
const Order = require('../../order/models/orderModel');
const User = require('../../auth/models/userModel');
const { AppError } = require('../../../middlewares/errorHandler');
const socketService = require('./socketService');

// Send message
exports.sendMessage = async (messageData, senderId) => {
  // Check if order exists
  const order = await Order.findById(messageData.order);
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  
  // Check if sender is involved in the order
  const isUserInvolved =
    order.user.toString() === senderId ||
    order.driver?.toString() === senderId;
  
  if (!isUserInvolved) {
    throw new AppError('You are not involved in this order', 403);
  }
  
  // Determine receiver
  let receiverId;
  
  if (order.user.toString() === senderId) {
    // Sender is customer, receiver is driver
    if (!order.driver) {
      throw new AppError('No driver assigned to this order yet', 400);
    }
    receiverId = order.driver;
  } else {
    // Sender is driver, receiver is customer
    receiverId = order.user;
  }
  
  // Create message
  const newMessage = await Message.create({
    order: messageData.order,
    sender: senderId,
    receiver: receiverId,
    content: messageData.content
  });
  
  // Notify receiver about new message
  socketService.notifyUser(receiverId, 'new-message', {
    messageId: newMessage._id,
    orderId: order._id,
    sender: {
      id: senderId
    },
    content: newMessage.content
  });
  
  return newMessage;
};

// Get order messages
exports.getOrderMessages = async (orderId, userId) => {
  // Check if order exists
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  
  // Check if user is involved in the order
  const isUserInvolved =
    order.user.toString() === userId ||
    order.driver?.toString() === userId;
  
  if (!isUserInvolved) {
    throw new AppError('You are not involved in this order', 403);
  }
  
  // Get messages
  const messages = await Message.find({
    order: orderId
  }).sort({ createdAt: 1 });
  
  // Mark unread messages as read
  const unreadMessages = messages.filter(
    message =>
      !message.isRead && message.receiver._id.toString() === userId
  );
  
  if (unreadMessages.length > 0) {
    await Message.updateMany(
      {
        _id: { $in: unreadMessages.map(message => message._id) }
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );
  }
  
  return messages;
};

// Get unread messages count
exports.getUnreadMessagesCount = async (userId) => {
  const unreadCount = await Message.countDocuments({
    receiver: userId,
    isRead: false
  });
  
  return unreadCount;
};

// Mark message as read
exports.markMessageAsRead = async (messageId, userId) => {
  // Find message
  const message = await Message.findById(messageId);
  
  if (!message) {
    throw new AppError('Message not found', 404);
  }
  
  // Check if user is the receiver
  if (message.receiver._id.toString() !== userId) {
    throw new AppError('You are not the receiver of this message', 403);
  }
  
  // Mark as read
  message.isRead = true;
  message.readAt = Date.now();
  await message.save();
  
  return message;
};
