const mongoose = require('mongoose');
const productService = require('../services/productService');
const Product = require('../models/productModel');
const AppError = require('../../../middlewares/appError');

// Mock the Product model
jest.mock('../models/productModel');

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      // Arrange
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        category: 'food',
        store: 'store123'
      };
      
      const userId = 'user123';
      
      const mockProduct = {
        ...productData,
        createdBy: userId,
        _id: 'product123',
        save: jest.fn().mockResolvedValue(true)
      };
      
      Product.mockImplementation(() => mockProduct);
      
      // Act
      const result = await productService.createProduct(productData, userId);
      
      // Assert
      expect(mockProduct.save).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      // Arrange
      const productId = 'product123';
      const mockProduct = {
        _id: productId,
        name: 'Test Product'
      };
      
      Product.findById.mockResolvedValue(mockProduct);
      
      // Act
      const result = await productService.getProductById(productId);
      
      // Assert
      expect(Product.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });
    
    it('should throw an error if product not found', async () => {
      // Arrange
      const productId = 'nonexistent';
      Product.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(productService.getProductById(productId))
        .rejects
        .toThrow(AppError);
    });
  });

  // Add more tests for other methods
});
