const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const { AppError } = require('../../../middlewares/errorHandler');

// Create a new product
exports.createProduct = async (productData, userId) => {
  // Check if store exists and user is the owner
  const store = await Store.findOne({ _id: productData.store, owner: userId });
  
  if (!store) {
    throw new AppError('No store found with that ID or you are not the owner', 404);
  }
  
  // Create product
  const newProduct = await Product.create({
    ...productData,
    createdBy: userId
  });
  
  return newProduct;
};

// Get all products with filtering, sorting, and pagination
exports.getAllProducts = async (queryParams) => {
  // Build query
  const queryObj = { ...queryParams };
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

// Get product by ID
exports.getProductById = async (productId) => {
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }
  
  return product;
};

// Update product
exports.updateProduct = async (productId, updateData, userId) => {
  // Get product
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }
  
  // Check if user is the store owner
  const store = await Store.findOne({ _id: product.store, owner: userId });
  
  if (!store) {
    throw new AppError('You are not authorized to update this product', 403);
  }
  
  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true
  });
  
  return updatedProduct;
};

// Delete product
exports.deleteProduct = async (productId, userId) => {
  // Get product
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new AppError('No product found with that ID', 404);
  }
  
  // Check if user is the store owner
  const store = await Store.findOne({ _id: product.store, owner: userId });
  
  if (!store) {
    throw new AppError('You are not authorized to delete this product', 403);
  }
  
  // Delete product (soft delete)
  await Product.findByIdAndUpdate(productId, { active: false });
};

// Search products
exports.searchProducts = async (searchTerm, queryParams) => {
  // Build query
  const query = {
    $text: { $search: searchTerm }
  };
  
  // Add additional filters
  const queryObj = { ...queryParams };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);
  
  // Combine search with filters
  const finalQuery = { ...query, ...queryObj };
  
  let dbQuery = Product.find(finalQuery);
  
  // Sorting
  if (queryParams.sort) {
    const sortBy = queryParams.sort.split(',').join(' ');
    dbQuery = dbQuery.sort(sortBy);
  } else {
    // Default sort by text score for relevance
    dbQuery = dbQuery.sort({ score: { $meta: 'textScore' } });
  }
  
  // Field limiting
  if (queryParams.fields) {
    const fields = queryParams.fields.split(',').join(' ');
    dbQuery = dbQuery.select(fields);
  } else {
    dbQuery = dbQuery.select('-__v');
  }
  
  // Pagination
  const page = queryParams.page * 1 || 1;
  const limit = queryParams.limit * 1 || 100;
  const skip = (page - 1) * limit;
  
  dbQuery = dbQuery.skip(skip).limit(limit);
  
  // Execute query
  const products = await dbQuery;
  
  return products;
};
