const productService = require('../services/productService');

// Create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body, req.user.id);
    
    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts(req.query);
    
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

// Get product by ID
exports.getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id, req.user.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Search products
exports.searchProducts = async (req, res, next) => {
  try {
    const { search } = req.query;
    
    if (!search) {
      return next(new AppError('Please provide a search term', 400));
    }
    
    const products = await productService.searchProducts(search, req.query);
    
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
