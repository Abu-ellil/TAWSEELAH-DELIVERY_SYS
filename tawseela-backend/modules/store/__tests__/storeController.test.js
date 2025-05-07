const storeController = require('../controllers/storeController');
const storeService = require('../services/storeService');
const AppError = require('../../../middlewares/appError');

// Mock the store service
jest.mock('../services/storeService');

describe('Store Controller', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {},
      user: { id: 'user123' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('createStore', () => {
    it('should create a store and return 201 status', async () => {
      // Arrange
      const storeData = {
        name: 'Test Store',
        description: 'Test Description',
        category: 'restaurant'
      };
      
      req.body = storeData;
      
      const mockStore = {
        _id: 'store123',
        ...storeData
      };
      
      storeService.createStore.mockResolvedValue(mockStore);
      
      // Act
      await storeController.createStore(req, res, next);
      
      // Assert
      expect(storeService.createStore).toHaveBeenCalledWith(storeData, 'user123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          store: mockStore
        }
      });
    });
    
    it('should call next with error if service throws', async () => {
      // Arrange
      const error = new Error('Test error');
      storeService.createStore.mockRejectedValue(error);
      
      // Act
      await storeController.createStore(req, res, next);
      
      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getStore', () => {
    it('should get a store and return 200 status', async () => {
      // Arrange
      req.params.id = 'store123';
      
      const mockStore = {
        _id: 'store123',
        name: 'Test Store'
      };
      
      storeService.getStoreById.mockResolvedValue(mockStore);
      
      // Act
      await storeController.getStore(req, res, next);
      
      // Assert
      expect(storeService.getStoreById).toHaveBeenCalledWith('store123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          store: mockStore
        }
      });
    });
  });

  // Add more tests for other controller methods
});
