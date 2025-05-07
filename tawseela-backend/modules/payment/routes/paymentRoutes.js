const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../../../middlewares/auth');
const { validate } = require('../../../middlewares/validator');
const {
  createPaymentIntentSchema,
  createPaymentLinkSchema
} = require('../validations/paymentValidation');

const router = express.Router();

// Webhook route (unprotected)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.processPaymentWebhook);

// Protected routes
router.use(protect);

// Create payment intent
router.post(
  '/create-payment-intent',
  validate(createPaymentIntentSchema),
  paymentController.createPaymentIntent
);

// Create payment link
router.post(
  '/create-payment-link',
  validate(createPaymentLinkSchema),
  paymentController.createPaymentLink
);

// Get payment status
router.get('/status/:orderId', paymentController.getPaymentStatus);

module.exports = router;
