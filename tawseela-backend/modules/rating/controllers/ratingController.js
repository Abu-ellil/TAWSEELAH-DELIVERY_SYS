const ratingService = require('../services/ratingService');

// Create a new rating
exports.createRating = async (req, res, next) => {
  try {
    const newRating = await ratingService.createRating({
      ...req.body,
      fromId: req.user.id
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        rating: newRating
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get ratings for a user or driver
exports.getRatings = async (req, res, next) => {
  try {
    const ratings = await ratingService.getRatings(req.params.userId, req.query);
    
    res.status(200).json({
      status: 'success',
      results: ratings.length,
      data: {
        ratings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get my ratings (ratings I've received)
exports.getMyRatings = async (req, res, next) => {
  try {
    const ratings = await ratingService.getRatings(req.user.id, req.query);
    
    res.status(200).json({
      status: 'success',
      results: ratings.length,
      data: {
        ratings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a rating
exports.updateRating = async (req, res, next) => {
  try {
    const updatedRating = await ratingService.updateRating(
      req.params.id,
      req.body,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        rating: updatedRating
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a rating
exports.deleteRating = async (req, res, next) => {
  try {
    await ratingService.deleteRating(req.params.id, req.user.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
