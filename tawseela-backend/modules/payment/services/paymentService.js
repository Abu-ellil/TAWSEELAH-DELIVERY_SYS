const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../../order/models/orderModel');
const { AppError } = require('../../../middlewares/errorHandler');

// Create payment intent
exports.createPaymentIntent = async (orderId, userId) => {
  // Find order
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
    paymentStatus: 'pending'
  });
  
  if (!order) {
    throw new AppError('Order not found or already paid', 404);
  }
  
  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // Convert to cents
    currency: 'sar',
    metadata: {
      orderId: order._id.toString(),
      userId: userId
    }
  });
  
  return {
    clientSecret: paymentIntent.client_secret,
    amount: order.total
  };
};

// Process payment webhook
exports.processPaymentWebhook = async (event) => {
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    
    // Update order payment status
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    
    order.paymentStatus = 'paid';
    order.paymentDetails = {
      transactionId: paymentIntent.id,
      paymentProvider: 'stripe',
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      paidAt: new Date()
    };
    
    await order.save();
    
    return { success: true, orderId };
  }
  
  return { success: false };
};

// Get payment status
exports.getPaymentStatus = async (orderId, userId) => {
  // Find order
  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });
  
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  
  return {
    paymentStatus: order.paymentStatus,
    paymentDetails: order.paymentDetails
  };
};

// Create payment link
exports.createPaymentLink = async (orderId, userId) => {
  // Find order
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
    paymentStatus: 'pending'
  });
  
  if (!order) {
    throw new AppError('Order not found or already paid', 404);
  }
  
  // Create payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price_data: {
          currency: 'sar',
          product_data: {
            name: `Order #${order._id}`,
            description: `Payment for order #${order._id}`
          },
          unit_amount: Math.round(order.total * 100) // Convert to cents
        },
        quantity: 1
      }
    ],
    metadata: {
      orderId: order._id.toString(),
      userId: userId
    },
    after_completion: {
      type: 'redirect',
      redirect: {
        url: `${process.env.FRONTEND_URL}/orders/${order._id}/confirmation`
      }
    }
  });
  
  return {
    paymentUrl: paymentLink.url,
    amount: order.total
  };
};
