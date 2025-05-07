const storeService = require('../services/storeService');

// Create a new store
exports.createStore = async (req, res, next) => {
  try {
    const newStore = await storeService.createStore(req.body, req.user.id);
    
    res.status(201).json({
      status: 'success',
      data: {
        store: newStore
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all stores
exports.getAllStores = async (req, res, next) => {
  try {
    const stores = await storeService.getAllStores(req.query);
    
    res.status(200).json({
      status: 'success',
      results: stores.length,
      data: {
        stores
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get store by ID
exports.getStore = async (req, res, next) => {
  try {
    const store = await storeService.getStoreById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        store
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update store
exports.updateStore = async (req, res, next) => {
  try {
    const updatedStore = await storeService.updateStore(
      req.params.id,
      req.body,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        store: updatedStore
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete store
exports.deleteStore = async (req, res, next) => {
  try {
    await storeService.deleteStore(req.params.id, req.user.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Get stores nearby
exports.getStoresNearby = async (req, res, next) => {
  try {
    const { lat, lng, distance, unit } = req.params;
    
    const stores = await storeService.getStoresNearby(
      lat * 1,
      lng * 1,
      distance * 1,
      unit
    );
    
    res.status(200).json({
      status: 'success',
      results: stores.length,
      data: {
        stores
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get store products
exports.getStoreProducts = async (req, res, next) => {
  try {
    const products = await storeService.getStoreProducts(
      req.params.id,
      req.query
    );
    
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  } catch (error) {
    next(error);
  }
};
