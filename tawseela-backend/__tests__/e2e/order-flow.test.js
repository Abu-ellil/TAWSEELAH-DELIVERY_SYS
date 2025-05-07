const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../modules/user/models/userModel');
const Store = require('../../modules/store/models/storeModel');
const Product = require('../../modules/store/models/productModel');
const Order = require('../../modules/order/models/orderModel');
const jwt = require('jsonwebtoken');

describe('End-to-End Order Flow', () => {
  let customerToken, driverToken, storeOwnerToken;
  let customer, driver, storeOwner;
  let store, product, order;
  
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Create test users
    customer = await User.create({
      name: 'Test Customer',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer'
    });
    
    driver = await User.create({
      name: 'Test Driver',
      email: 'driver@example.com',
      password: 'password123',
      role: 'driver',
      driverStatus: 'available',
      currentLocation: {
        type: 'Point',
        coordinates: [35.123, 31.456]
      }
    });
    
    storeOwner = await User.create({
      name: 'Test Store Owner',
      email: 'storeowner@example.com',
      password: 'password123',
      role: 'store-owner'
    });
    
    // Generate JWT tokens
    customerToken = jwt.sign(
      { id: customer._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    driverToken = jwt.sign(
      { id: driver._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    storeOwnerToken = jwt.sign(
      { id: storeOwner._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Create a test store
    store = await Store.create({
      name: 'E2E Test Store',
      description: 'Test Description',
      category: 'restaurant',
      owner: storeOwner._id,
      location: {
        type: 'Point',
        coordinates: [35.123, 31.456],
        address: 'Test Address',
        city: 'Test City'
      }
    });
    
    // Create a test product
    product = await Product.create({
      name: 'E2E Test Product',
      description: 'Test Description',
      price: 10.99,
      category: 'food',
      store: store._id,
      createdBy: storeOwner._id
    });
  });
  
  afterAll(async () => {
    // Clean up database
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Store.deleteMany({});
    await User.deleteMany({});
    
    // Disconnect from database
    await mongoose.connection.close();
  });
  
  it('should complete a full order flow', async () => {
    // Step 1: Customer creates an order
    const orderData = {
      store: store._id,
      items: [
        {
          product: product._id,
          quantity: 2,
          price: product.price
        }
      ],
      deliveryAddress: {
        address: 'Customer Address',
        city: 'Customer City',
        coordinates: [35.1, 31.4]
      },
      paymentMethod: 'cash'
    };
    
    let response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(orderData);
    
    expect(response.status).toBe(201);
    order = response.body.data.order;
    
    // Step 2: Store owner accepts the order
    response = await request(app)
      .patch(`/api/v1/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${storeOwnerToken}`)
      .send({ status: 'accepted' });
    
    expect(response.status).toBe(200);
    
    // Step 3: Store owner marks order as ready
    response = await request(app)
      .patch(`/api/v1/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${storeOwnerToken}`)
      .send({ status: 'ready' });
    
    expect(response.status).toBe(200);
    
    // Step 4: Driver accepts the order
    response = await request(app)
      .patch(`/api/v1/orders/${order._id}/assign-driver`)
      .set('Authorization', `Bearer ${driverToken}`)
      .send();
    
    expect(response.status).toBe(200);
    
    // Step 5: Driver picks up the order
    response = await request(app)
      .patch(`/api/v1/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ status: 'picked-up' });
    
    expect(response.status).toBe(200);
    
    // Step 6: Driver delivers the order
    response = await request(app)
      .patch(`/api/v1/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ status: 'delivered' });
    
    expect(response.status).toBe(200);
    
    // Step 7: Customer verifies the order is delivered
    response = await request(app)
      .get(`/api/v1/orders/${order._id}`)
      .set('Authorization', `Bearer ${customerToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.order.status).toBe('delivered');
  });
});
