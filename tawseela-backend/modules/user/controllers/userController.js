const userService = require('../services/userService');

// Get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.user.id,
      req.body
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add user address
exports.addUserAddress = async (req, res, next) => {
  try {
    const user = await userService.addUserAddress(req.user.id, req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user address
exports.updateUserAddress = async (req, res, next) => {
  try {
    const user = await userService.updateUserAddress(
      req.user.id,
      req.params.addressId,
      req.body
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user address
exports.deleteUserAddress = async (req, res, next) => {
  try {
    const user = await userService.deleteUserAddress(
      req.user.id,
      req.params.addressId
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add store to favorites
exports.addFavoriteStore = async (req, res, next) => {
  try {
    const user = await userService.addFavoriteStore(
      req.user.id,
      req.params.storeId
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        favoriteStores: user.favoriteStores
      }
    });
  } catch (error) {
    next(error);
  }
};

// Remove store from favorites
exports.removeFavoriteStore = async (req, res, next) => {
  try {
    const user = await userService.removeFavoriteStore(
      req.user.id,
      req.params.storeId
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        favoriteStores: user.favoriteStores
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user favorite stores
exports.getFavoriteStores = async (req, res, next) => {
  try {
    const favoriteStores = await userService.getFavoriteStores(req.user.id);
    
    res.status(200).json({
      status: 'success',
      results: favoriteStores.length,
      data: {
        favoriteStores
      }
    });
  } catch (error) {
    next(error);
  }
};
