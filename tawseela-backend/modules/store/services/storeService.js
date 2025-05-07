const Store = require('../models/storeModel');
const Product = require('../models/productModel');
const { AppError } = require('../../../middlewares/errorHandler');

// Create a new store
exports.createStore = async (storeData, userId) => {
  const newStore = await Store.create({
    ...storeData,
    owner: userId
  });

  return newStore;
};

// Get all stores with filtering, sorting, and pagination
exports.getAllStores = async (queryParams) => {
  // Build query
  const queryObj = { ...queryParams };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Store.find(JSON.parse(queryStr));

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
  const limit = queryParams.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const stores = await query;
  
  return stores;
};

// Get store by ID
exports.getStoreById = async (storeId) => {
  const store = await Store.findById(storeId);
  
  if (!store) {
    throw new AppError('No store found with that ID', 404);
  }
  
  return store;
};

// Update store
exports.updateStore = async (storeId, updateData, userId) => {
  // Check if store exists and user is the owner
  const store = await Store.findOne({ _id: storeId, owner: userId });
  
  if (!store) {
    throw new AppError('No store found with that ID or you are not the owner', 404);
  }
  
  // Update store
  const updatedStore = await Store.findByIdAndUpdate(storeId, updateData, {
    new: true,
    runValidators: true
  });
  
  return updatedStore;
};

// Delete store
exports.deleteStore = async (storeId, userId) => {
  // Check if store exists and user is the owner
  const store = await Store.findOne({ _id: storeId, owner: userId });
  
  if (!store) {
    throw new AppError('No store found with that ID or you are not the owner', 404);
  }
  
  // Delete store (soft delete)
  await Store.findByIdAndUpdate(storeId, { active: false });
};

// Get stores near a location
exports.getStoresNearby = async (lat, lng, distance = 10, unit = 'km') => {
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  
  const stores = await Store.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });
  
  return stores;
};

// Get store products
exports.getStoreProducts = async (storeId, queryParams) => {
  // Check if store exists
  const store = await Store.findById(storeId);
  
  if (!store) {
    throw new AppError('No store found with that ID', 404);
  }
  
  // Build query
  const queryObj = { ...queryParams, store: storeId };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

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
  const limit = queryParams.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const products = await query;
  
  return products;
};
