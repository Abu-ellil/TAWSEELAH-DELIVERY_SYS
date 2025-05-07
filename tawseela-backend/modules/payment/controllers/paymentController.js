const paymentService = require('../services/paymentService');

// Create payment intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    const paymentIntent = await paymentService.createPaymentIntent(
      orderId,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: paymentIntent
    });
  } catch (error) {
    next(error);
  }
};

// Process payment webhook
exports.processPaymentWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    const result = await paymentService.processPaymentWebhook(event);
    
    res.status(200).json({
      received: true,
      result
    });
  } catch (error) {
    next(error);
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const paymentStatus = await paymentService.getPaymentStatus(
      orderId,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: paymentStatus
    });
  } catch (error) {
    next(error);
  }
};

// Create payment link
exports.createPaymentLink = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    const paymentLink = await paymentService.createPaymentLink(
      orderId,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: paymentLink
    });
  } catch (error) {
    next(error);
  }
};
