const authService = require('../services/authService');
const User = require('../../user/models/userModel');
const AppError = require('../../../middlewares/appError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock dependencies
jest.mock('../../user/models/userModel');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      };
      
      const mockUser = {
        ...userData,
        _id: 'user123',
        password: 'hashedPassword',
        save: jest.fn().mockResolvedValue(true)
      };
      
      User.findOne.mockResolvedValue(null); // No existing user
      User.mockImplementation(() => mockUser);
      
      // Act
      const result = await authService.register(userData);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
    
    it('should throw an error if user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'password123'
      };
      
      User.findOne.mockResolvedValue({ email: userData.email }); // Existing user
      
      // Act & Assert
      await expect(authService.register(userData))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockUser = {
        _id: 'user123',
        email: credentials.email,
        password: 'hashedPassword',
        role: 'customer'
      };
      
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      bcrypt.compare.mockResolvedValue(true); // Password matches
      
      jwt.sign.mockReturnValue('test-token');
      
      // Act
      const result = await authService.login(credentials.email, credentials.password);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: credentials.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        token: 'test-token',
        user: expect.objectContaining({
          _id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role
        })
      });
    });
    
    it('should throw an error if user not found', async () => {
      // Arrange
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });
      
      // Act & Assert
      await expect(authService.login('nonexistent@example.com', 'password123'))
        .rejects
        .toThrow(AppError);
    });
    
    it('should throw an error if password is incorrect', async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      bcrypt.compare.mockResolvedValue(false); // Password doesn't match
      
      // Act & Assert
      await expect(authService.login('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow(AppError);
    });
  });

  // Add more tests for other auth methods
});
