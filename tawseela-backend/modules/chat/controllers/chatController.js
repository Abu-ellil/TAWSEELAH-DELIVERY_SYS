const chatService = require('../services/chatService');

// Send message
exports.sendMessage = async (req, res, next) => {
  try {
    const newMessage = await chatService.sendMessage(req.body, req.user.id);
    
    res.status(201).json({
      status: 'success',
      data: {
        message: newMessage
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get order messages
exports.getOrderMessages = async (req, res, next) => {
  try {
    const messages = await chatService.getOrderMessages(
      req.params.orderId,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get unread messages count
exports.getUnreadMessagesCount = async (req, res, next) => {
  try {
    const unreadCount = await chatService.getUnreadMessagesCount(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// Mark message as read
exports.markMessageAsRead = async (req, res, next) => {
  try {
    const message = await chatService.markMessageAsRead(
      req.params.messageId,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (error) {
    next(error);
  }
};
