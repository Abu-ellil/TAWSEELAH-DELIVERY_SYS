const orderService = require('../services/orderService');

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const newOrder = await orderService.createOrder(req.body, req.user.id);
    
    res.status(201).json({
      status: 'success',
      data: {
        order: newOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add items to an existing order
exports.addToOrder = async (req, res, next) => {
  try {
    const updatedOrder = await orderService.addToOrder(
      req.params.id,
      req.body.orderItems,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id, req.query);
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for a store
exports.getStoreOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getStoreOrders(
      req.params.storeId,
      req.user.id,
      req.query
    );
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for a driver
exports.getDriverOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getDriverOrders(req.user.id, req.query);
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
exports.getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update store order status
exports.updateStoreOrderStatus = async (req, res, next) => {
  try {
    const updatedOrder = await orderService.updateStoreOrderStatus(
      req.params.id,
      req.params.storeId,
      req.body.status,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

// Assign driver to order
exports.assignDriver = async (req, res, next) => {
  try {
    const updatedOrder = await orderService.assignDriver(
      req.params.id,
      req.body.driverId,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    next(error);
  }
};
