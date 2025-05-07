const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Store = require('../../modules/store/models/storeModel');
const User = require('../../modules/user/models/userModel');
const jwt = require('jsonwebtoken');

describe('Store API Integration Tests', () => {
  let token;
  let testUser;
  let testStore;
  
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'store-owner'
    });
    
    // Generate JWT token
    token = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  });
  
  afterAll(async () => {
    // Clean up database
    await Store.deleteMany({});
    await User.deleteMany({});
    
    // Disconnect from database
    await mongoose.connection.close();
  });
  
  describe('POST /api/v1/stores', () => {
    it('should create a new store', async () => {
      const storeData = {
        name: 'Integration Test Store',
        description: 'Test Description',
        category: 'restaurant',
        location: {
          coordinates: [35.123, 31.456],
          address: 'Test Address',
          city: 'Test City'
        }
      };
      
      const response = await request(app)
        .post('/api/v1/stores')
        .set('Authorization', `Bearer ${token}`)
        .send(storeData);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.store.name).toBe(storeData.name);
      
      // Save the created store for later tests
      testStore = response.body.data.store;
    });
  });
  
  describe('GET /api/v1/stores', () => {
    it('should get all stores', async () => {
      const response = await request(app)
        .get('/api/v1/stores')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.stores)).toBe(true);
    });
  });
  
  describe('GET /api/v1/stores/:id', () => {
    it('should get a store by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/stores/${testStore._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.store._id).toBe(testStore._id);
    });
    
    it('should return 404 for non-existent store', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/v1/stores/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  // Add more integration tests for other endpoints
});
