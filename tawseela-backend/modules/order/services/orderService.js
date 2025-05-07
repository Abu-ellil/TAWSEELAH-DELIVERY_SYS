const Order = require('../models/orderModel');
const Product = require('../../store/models/productModel');
const Store = require('../../store/models/storeModel');
const User = require('../../auth/models/userModel');
const { AppError } = require('../../../middlewares/errorHandler');
const socketService = require('../../chat/services/socketService');

// Create a new order
exports.createOrder = async (orderData, userId) => {
  // Validate order items
  const validatedItems = await validateOrderItems(orderData.orderItems);
  
  // Create order with validated items
  const newOrder = await Order.create({
    ...orderData,
    user: userId,
    orderItems: validatedItems
  });
  
  // Notify stores about new order
  newOrder.orderItems.forEach(storeOrder => {
    socketService.notifyStore(storeOrder.store, 'new-order', {
      orderId: newOrder._id,
      storeId: storeOrder.store
    });
  });
  
  return newOrder;
};

// Add items to an existing order
exports.addToOrder = async (orderId, newItems, userId) => {
  // Find order
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
    status: 'pending'
  });
  
  if (!order) {
    throw new AppError('Order not found or cannot be modified', 404);
  }
  
  // Validate new items
  const validatedItems = await validateOrderItems(newItems);
  
  // Add new items to order
  validatedItems.forEach(newStoreOrder => {
    // Check if store already exists in order
    const existingStoreIndex = order.orderItems.findIndex(
      item => item.store.toString() === newStoreOrder.store.toString()
    );
    
    if (existingStoreIndex !== -1) {
      // Add items to existing store order
      newStoreOrder.items.forEach(newItem => {
        // Check if product already exists in order
        const existingItemIndex = order.orderItems[existingStoreIndex].items.findIndex(
          item => item.product.toString() === newItem.product.toString()
        );
        
        if (existingItemIndex !== -1) {
          // Update existing item quantity
          order.orderItems[existingStoreIndex].items[existingItemIndex].quantity += newItem.quantity;
          // Recalculate item total
          order.orderItems[existingStoreIndex].items[existingItemIndex].itemTotal =
            order.orderItems[existingStoreIndex].items[existingItemIndex].price *
            order.orderItems[existingStoreIndex].items[existingItemIndex].quantity;
        } else {
          // Add new item to store order
          order.orderItems[existingStoreIndex].items.push(newItem);
        }
      });
    } else {
      // Add new store order
      order.orderItems.push(newStoreOrder);
    }
  });
  
  // Save updated order
  await order.save();
  
  // Notify stores about updated order
  validatedItems.forEach(storeOrder => {
    socketService.notifyStore(storeOrder.store, 'order-updated', {
      orderId: order._id,
      storeId: storeOrder.store
    });
  });
  
  return order;
};

// Get all orders for a user
exports.getUserOrders = async (userId, queryParams) => {
  // Build query
  const queryObj = { ...queryParams, user: userId };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Order.find(JSON.parse(queryStr));

  // Sorting
  if (queryParams.sort) {
    const sortBy = queryParams.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (queryParams.fields) {
    const fields = queryParams.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = queryParams.page * 1 || 1;
  const limit = queryParams.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const orders = await query;
  
  return orders;
};

// Get all orders for a store
exports.getStoreOrders = async (storeId, userId, queryParams) => {
  // Check if user is store owner
  const store = await Store.findOne({ _id: storeId, owner: userId });
  
  if (!store) {
    throw new AppError('Store not found or you are not the owner', 404);
  }
  
  // Build query
  const queryObj = { ...queryParams, 'orderItems.store': storeId };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Order.find(JSON.parse(queryStr));

  // Sorting
  if (queryParams.sort) {
    const sortBy = queryParams.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (queryParams.fields) {
    const fields = queryParams.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = queryParams.page * 1 || 1;
  const limit = queryParams.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const orders = await query;
  
  return orders;
};

// Get all orders for a driver
exports.getDriverOrders = async (driverId, queryParams) => {
  // Build query
  const queryObj = { ...queryParams, driver: driverId };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Order.find(JSON.parse(queryStr));

  // Sorting
  if (queryParams.sort) {
    const sortBy = queryParams.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (queryParams.fields) {
    const fields = queryParams.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = queryParams.page * 1 || 1;
  const limit = queryParams.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const orders = await query;
  
  return orders;
};

// Get order by ID
exports.getOrderById = async (orderId, userId, role) => {
  let order;
  
  // Different queries based on user role
  if (role === 'admin') {
    order = await Order.findById(orderId);
  } else if (role === 'store-admin') {
    // Get stores owned by user
    const stores = await Store.find({ owner: userId }).select('_id');
    const storeIds = stores.map(store => store._id);
    
    // Find order that includes one of user's stores
    order = await Order.findOne({
      _id: orderId,
      'orderItems.store': { $in: storeIds }
    });
  } else if (role === 'driver') {
    order = await Order.findOne({
      _id: orderId,
      driver: userId
    });
  } else {
    // Customer
    order = await Order.findOne({
      _id: orderId,
      user: userId
    });
  }
  
  if (!order) {
    throw new AppError('Order not found or you do not have permission to view it', 404);
  }
  
  return order;
};

// Update order status
exports.updateOrderStatus = async (orderId, status, userId, role) => {
  let order;
  
  // Different queries based on user role
  if (role === 'admin') {
    order = await Order.findById(orderId);
  } else if (role === 'store-admin') {
    // Get stores owned by user
    const stores = await Store.find({ owner: userId }).select('_id');
    const storeIds = stores.map(store => store._id);
    
    // Find order that includes one of user's stores
    order = await Order.findOne({
      _id: orderId,
      'orderItems.store': { $in: storeIds }
    });
  } else if (role === 'driver') {
    order = await Order.findOne({
      _id: orderId,
      driver: userId
    });
  } else {
    // Customer can only cancel their own orders
    if (status !== 'cancelled') {
      throw new AppError('You do not have permission to update this order', 403);
    }
    
    order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: { $in: ['pending', 'accepted'] }
    });
  }
  
  if (!order) {
    throw new AppError('Order not found or you do not have permission to update it', 404);
  }
  
  // Update order status
  order.status = status;
  
  // Update timestamp based on status
  if (status === 'picked') {
    order.pickedAt = Date.now();
  } else if (status === 'delivered') {
    order.deliveredAt = Date.now();
  } else if (status === 'cancelled') {
    order.cancelledAt = Date.now();
  }
  
  // Save updated order
  await order.save();
  
  // Notify user about order status update
  socketService.notifyUser(order.user, 'order-status-updated', {
    orderId: order._id,
    status: order.status
  });
  
  // Notify stores about order status update
  order.orderItems.forEach(storeOrder => {
    socketService.notifyStore(storeOrder.store, 'order-status-updated', {
      orderId: order._id,
      storeId: storeOrder.store,
      status: order.status
    });
  });
  
  // Notify driver about order status update if assigned
  if (order.driver) {
    socketService.notifyDriver(order.driver, 'order-status-updated', {
      orderId: order._id,
      status: order.status
    });
  }
  
  return order;
};

// Update store order status
exports.updateStoreOrderStatus = async (orderId, storeId, status, userId) => {
  // Check if user is store owner
  const store = await Store.findOne({ _id: storeId, owner: userId });
  
  if (!store) {
    throw new AppError('Store not found or you are not the owner', 404);
  }
  
  // Find order
  const order = await Order.findOne({
    _id: orderId,
    'orderItems.store': storeId
  });
  
  if (!order) {
    throw new AppError('Order not found for this store', 404);
  }
  
  // Find store order
  const storeOrderIndex = order.orderItems.findIndex(
    item => item.store.toString() === storeId
  );
  
  if (storeOrderIndex === -1) {
    throw new AppError('Store order not found', 404);
  }
  
  // Update store order status
  order.orderItems[storeOrderIndex].storeStatus = status;
  
  // Update timestamp based on status
  if (status === 'accepted') {
    order.orderItems[storeOrderIndex].storeAcceptedAt = Date.now();
  } else if (status === 'ready') {
    order.orderItems[storeOrderIndex].storeReadyAt = Date.now();
  }
  
  // Check if all store orders have the same status
  const allStoresHaveSameStatus = order.orderItems.every(
    item => item.storeStatus === status
  );
  
  // Update main order status if all stores have the same status
  if (allStoresHaveSameStatus) {
    order.status = status;
  }
  
  // Save updated order
  await order.save();
  
  // Notify user about store order status update
  socketService.notifyUser(order.user, 'store-order-status-updated', {
    orderId: order._id,
    storeId: storeId,
    status: status
  });
  
  // Notify driver about store order status update if assigned
  if (order.driver) {
    socketService.notifyDriver(order.driver, 'store-order-status-updated', {
      orderId: order._id,
      storeId: storeId,
      status: status
    });
  }
  
  return order;
};

// Assign driver to order
exports.assignDriver = async (orderId, driverId, adminId) => {
  // Check if admin
  const admin = await User.findOne({
    _id: adminId,
    role: 'admin'
  });
  
  if (!admin) {
    throw new AppError('Only admins can assign drivers', 403);
  }
  
  // Check if driver exists and is available
  const driver = await User.findOne({
    _id: driverId,
    role: 'driver',
    driverStatus: 'available'
  });
  
  if (!driver) {
    throw new AppError('Driver not found or not available', 404);
  }
  
  // Find order
  const order = await Order.findOne({
    _id: orderId,
    status: { $in: ['accepted', 'preparing', 'ready'] },
    driver: { $exists: false }
  });
  
  if (!order) {
    throw new AppError('Order not found or cannot be assigned', 404);
  }
  
  // Assign driver to order
  order.driver = driverId;
  order.driverAssignedAt = Date.now();
  
  // Update driver status
  driver.driverStatus = 'on-trip';
  await driver.save();
  
  // Save updated order
  await order.save();
  
  // Notify user about driver assignment
  socketService.notifyUser(order.user, 'driver-assigned', {
    orderId: order._id,
    driver: {
      id: driver._id,
      name: driver.name,
      phone: driver.phone
    }
  });
  
  // Notify driver about assignment
  socketService.notifyDriver(driverId, 'order-assigned', {
    orderId: order._id
  });
  
  // Notify stores about driver assignment
  order.orderItems.forEach(storeOrder => {
    socketService.notifyStore(storeOrder.store, 'driver-assigned', {
      orderId: order._id,
      storeId: storeOrder.store,
      driver: {
        id: driver._id,
        name: driver.name,
        phone: driver.phone
      }
    });
  });
  
  return order;
};

// Helper function to validate order items
const validateOrderItems = async (orderItems) => {
  const validatedItems = [];
  
  // Process each store order
  for (const storeOrder of orderItems) {
    // Check if store exists
    const store = await Store.findById(storeOrder.store);
    
    if (!store) {
      throw new AppError(`Store with ID ${storeOrder.store} not found`, 404);
    }
    
    const validatedStoreOrder = {
      store: storeOrder.store,
      items: [],
      storeSubtotal: 0,
      storeTax: 0,
      storeDeliveryFee: 0,
      storeTotal: 0,
      storeStatus: 'pending',
      storePreparationTime: store.preparationTime
    };
    
    // Process each item in store order
    for (const item of storeOrder.items) {
      // Check if product exists and belongs to the store
      const product = await Product.findOne({
        _id: item.product,
        store: storeOrder.store
      });
      
      if (!product) {
        throw new AppError(
          `Product with ID ${item.product} not found or does not belong to store`,
          404
        );
      }
      
      // Check if product is in stock
      if (!product.inStock) {
        throw new AppError(`Product ${product.name} is out of stock`, 400);
      }
      
      // Validate selected options if any
      let optionsTotal = 0;
      
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        for (const selectedOption of item.selectedOptions) {
          // Find matching option in product
          const productOption = product.options.find(
            option => option.name === selectedOption.name
          );
          
          if (!productOption) {
            throw new AppError(
              `Option ${selectedOption.name} not found for product ${product.name}`,
              400
            );
          }
          
          // Find matching choice in option
          const productChoice = productOption.choices.find(
            choice => choice.name === selectedOption.choice.name
          );
          
          if (!productChoice) {
            throw new AppError(
              `Choice ${selectedOption.choice.name} not found for option ${selectedOption.name}`,
              400
            );
          }
          
          // Add choice price to options total
          optionsTotal += productChoice.price;
          
          // Update selected option with correct price
          selectedOption.choice.price = productChoice.price;
        }
      }
      
      // Calculate item total
      const itemTotal = (product.price + optionsTotal) * item.quantity;
      
      // Add validated item to store order
      validatedStoreOrder.items.push({
        product: item.product,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions || [],
        itemTotal
      });
      
      // Add item total to store subtotal
      validatedStoreOrder.storeSubtotal += itemTotal;
    }
    
    // Calculate store tax
    validatedStoreOrder.storeTax = validatedStoreOrder.storeSubtotal * (store.taxPercentage / 100);
    
    // Set store delivery fee
    validatedStoreOrder.storeDeliveryFee = store.deliveryFee;
    
    // Calculate store total
    validatedStoreOrder.storeTotal =
      validatedStoreOrder.storeSubtotal +
      validatedStoreOrder.storeTax +
      validatedStoreOrder.storeDeliveryFee;
    
    // Add validated store order to validated items
    validatedItems.push(validatedStoreOrder);
  }
  
  return validatedItems;
};
