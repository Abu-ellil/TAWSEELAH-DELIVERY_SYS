const Promotion = require('../models/promotionModel');
const UserPromotion = require('../models/userPromotionModel');
const { AppError } = require('../../../middlewares/errorHandler');

// Create a new promotion
exports.createPromotion = async (promotionData, userId) => {
  const newPromotion = await Promotion.create({
    ...promotionData,
    createdBy: userId
  });
  
  return newPromotion;
};

// Get all promotions
exports.getAllPromotions = async (queryParams) => {
  // Build query
  const queryObj = { ...queryParams };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Promotion.find(JSON.parse(queryStr));

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
  const promotions = await query;
  
  return promotions;
};

// Get promotion by ID
exports.getPromotionById = async (promotionId) => {
  const promotion = await Promotion.findById(promotionId);
  
  if (!promotion) {
    throw new AppError('No promotion found with that ID', 404);
  }
  
  return promotion;
};

// Update promotion
exports.updatePromotion = async (promotionId, updateData, userId) => {
  // Check if promotion exists
  const promotion = await Promotion.findById(promotionId);
  
  if (!promotion) {
    throw new AppError('No promotion found with that ID', 404);
  }
  
  // Update promotion
  const updatedPromotion = await Promotion.findByIdAndUpdate(
    promotionId,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
  
  return updatedPromotion;
};

// Delete promotion
exports.deletePromotion = async (promotionId) => {
  const promotion = await Promotion.findById(promotionId);
  
  if (!promotion) {
    throw new AppError('No promotion found with that ID', 404);
  }
  
  await Promotion.findByIdAndDelete(promotionId);
};

// Validate promotion code
exports.validatePromoCode = async (code, userId, orderValue) => {
  // Find promotion by code
  const promotion = await Promotion.findOne({
    code: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });
  
  if (!promotion) {
    throw new AppError('Invalid or expired promotion code', 400);
  }
  
  // Check if promotion has reached usage limit
  if (
    promotion.usageLimit !== null &&
    promotion.usageCount >= promotion.usageLimit
  ) {
    throw new AppError('Promotion code has reached its usage limit', 400);
  }
  
  // Check if order value meets minimum requirement
  if (orderValue < promotion.minOrderValue) {
    throw new AppError(
      `Order value must be at least ${promotion.minOrderValue} to use this promotion`,
      400
    );
  }
  
  // Check if user has reached usage limit
  let userPromotion = await UserPromotion.findOne({
    user: userId,
    promotion: promotion._id
  });
  
  if (!userPromotion) {
    userPromotion = await UserPromotion.create({
      user: userId,
      promotion: promotion._id,
      usageCount: 0
    });
  }
  
  if (userPromotion.usageCount >= promotion.userUsageLimit) {
    throw new AppError(
      'You have reached the usage limit for this promotion code',
      400
    );
  }
  
  // Calculate discount
  let discount = 0;
  
  if (promotion.type === 'percentage') {
    discount = (orderValue * promotion.value) / 100;
    
    // Apply max discount if set
    if (promotion.maxDiscount !== null && discount > promotion.maxDiscount) {
      discount = promotion.maxDiscount;
    }
  } else {
    // Fixed discount
    discount = promotion.value;
  }
  
  return {
    promotion,
    discount,
    discountType: promotion.type
  };
};

// Apply promotion code
exports.applyPromoCode = async (code, userId, orderId) => {
  // Find promotion by code
  const promotion = await Promotion.findOne({
    code: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });
  
  if (!promotion) {
    throw new AppError('Invalid or expired promotion code', 400);
  }
  
  // Update promotion usage count
  promotion.usageCount += 1;
  await promotion.save();
  
  // Update user promotion usage
  let userPromotion = await UserPromotion.findOne({
    user: userId,
    promotion: promotion._id
  });
  
  if (!userPromotion) {
    userPromotion = await UserPromotion.create({
      user: userId,
      promotion: promotion._id,
      usageCount: 1,
      lastUsedAt: Date.now()
    });
  } else {
    userPromotion.usageCount += 1;
    userPromotion.lastUsedAt = Date.now();
    await userPromotion.save();
  }
  
  return promotion;
};
