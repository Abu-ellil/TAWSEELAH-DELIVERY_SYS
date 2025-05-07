const Rating = require('../models/ratingModel');
const User = require('../../auth/models/userModel');
const Order = require('../../order/models/orderModel');
const AppError = require('../../../utils/appError');

// Create a new rating
exports.createRating = async (ratingData) => {
  // Check if order exists and is delivered
  const order = await Order.findById(ratingData.orderId);
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  
  if (order.status !== 'delivered') {
    throw new AppError('Cannot rate an order that is not delivered', 400);
  }
  
  // Check if user is authorized to rate this order
  if (
    ratingData.fromId.toString() !== order.user.toString() &&
    ratingData.fromId.toString() !== order.driver.toString()
  ) {
    throw new AppError('You are not authorized to rate this order', 403);
  }
  
  // Check if rating already exists
  const existingRating = await Rating.findOne({
    fromId: ratingData.fromId,
    toId: ratingData.toId,
    orderId: ratingData.orderId
  });
  
  if (existingRating) {
    throw new AppError('You have already rated this user for this order', 400);
  }
  
  // Create the rating
  const newRating = await Rating.create(ratingData);
  
  // Update user's average rating
  await updateUserAverageRating(ratingData.toId);
  
  return newRating;
};

// Get ratings for a user
exports.getRatings = async (userId, queryParams = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = queryParams;
  
  const skip = (page - 1) * limit;
  
  const ratings = await Rating.find({ toId: userId })
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));
  
  return ratings;
};

// Update a rating
exports.updateRating = async (ratingId, updateData, userId) => {
  // Find the rating
  const rating = await Rating.findById(ratingId);
  
  if (!rating) {
    throw new AppError('Rating not found', 404);
  }
  
  // Check if user is authorized to update this rating
  if (rating.fromId.toString() !== userId) {
    throw new AppError('You are not authorized to update this rating', 403);
  }
  
  // Update the rating
  const updatedRating = await Rating.findByIdAndUpdate(
    ratingId,
    { score: updateData.score, comment: updateData.comment },
    { new: true, runValidators: true }
  );
  
  // Update user's average rating
  await updateUserAverageRating(rating.toId);
  
  return updatedRating;
};

// Delete a rating
exports.deleteRating = async (ratingId, userId) => {
  // Find the rating
  const rating = await Rating.findById(ratingId);
  
  if (!rating) {
    throw new AppError('Rating not found', 404);
  }
  
  // Check if user is authorized to delete this rating
  if (rating.fromId.toString() !== userId) {
    throw new AppError('You are not authorized to delete this rating', 403);
  }
  
  // Delete the rating
  await Rating.findByIdAndDelete(ratingId);
  
  // Update user's average rating
  await updateUserAverageRating(rating.toId);
};

// Helper function to update user's average rating
async function updateUserAverageRating(userId) {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Calculate average rating
  const ratings = await Rating.find({ toId: userId });
  
  if (ratings.length === 0) {
    // No ratings, set default values
    user.rating = 0;
    user.ratingsQuantity = 0;
  } else {
    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    user.rating = parseFloat((totalScore / ratings.length).toFixed(1));
    user.ratingsQuantity = ratings.length;
  }
  
  await user.save({ validateBeforeSave: false });
}
