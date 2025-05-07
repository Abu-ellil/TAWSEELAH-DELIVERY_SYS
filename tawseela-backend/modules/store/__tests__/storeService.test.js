const mongoose = require('mongoose');
const storeService = require('../services/storeService');
const Store = require('../models/storeModel');
const AppError = require('../../../middlewares/appError');

// Mock the Store model
jest.mock('../models/storeModel');

describe('Store Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStore', () => {
    it('should create a new store', async () => {
      // Arrange
      const storeData = {
        name: 'Test Store',
        description: 'Test Description',
        category: 'restaurant',
        location: {
          coordinates: [35.123, 31.456],
          address: 'Test Address',
          city: 'Test City'
        }
      };
      
      const userId = 'user123';
      
      const mockStore = {
        ...storeData,
        owner: userId,
        _id: 'store123',
        save: jest.fn().mockResolvedValue(true)
      };
      
      Store.mockImplementation(() => mockStore);
      
      // Act
      const result = await storeService.createStore(storeData, userId);
      
      // Assert
      expect(mockStore.save).toHaveBeenCalled();
      expect(result).toEqual(mockStore);
    });
  });

  describe('getStoreById', () => {
    it('should return a store by ID', async () => {
      // Arrange
      const storeId = 'store123';
      const mockStore = {
        _id: storeId,
        name: 'Test Store'
      };
      
      Store.findById.mockResolvedValue(mockStore);
      
      // Act
      const result = await storeService.getStoreById(storeId);
      
      // Assert
      expect(Store.findById).toHaveBeenCalledWith(storeId);
      expect(result).toEqual(mockStore);
    });
    
    it('should throw an error if store not found', async () => {
      // Arrange
      const storeId = 'nonexistent';
      Store.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(storeService.getStoreById(storeId))
        .rejects
        .toThrow(AppError);
    });
  });

  // Add more tests for other methods
});
