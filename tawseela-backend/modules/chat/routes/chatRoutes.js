const express = require('express');
const chatController = require('../controllers/chatController');
const { protect } = require('../../../middlewares/auth');
const { validate } = require('../../../middlewares/validator');
const { sendMessageSchema } = require('../validations/chatValidation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Send message
router.post(
  '/messages',
  validate(sendMessageSchema),
  chatController.sendMessage
);

// Get order messages
router.get('/messages/order/:orderId', chatController.getOrderMessages);

// Get unread messages count
router.get('/messages/unread', chatController.getUnreadMessagesCount);

// Mark message as read
router.patch('/messages/:messageId/read', chatController.markMessageAsRead);

module.exports = router;
