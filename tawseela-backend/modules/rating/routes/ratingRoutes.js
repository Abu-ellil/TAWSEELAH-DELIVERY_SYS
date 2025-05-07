const express = require('express');
const ratingController = require('../controllers/ratingController');
const { protect } = require('../../../middlewares/auth');
const { validate } = require('../../../middlewares/validator');
const {
  createRatingSchema,
  updateRatingSchema
} = require('../validations/ratingValidation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Create a new rating
router.post('/', validate(createRatingSchema), ratingController.createRating);

// Get my ratings
router.get('/my-ratings', ratingController.getMyRatings);

// Get ratings for a specific user
router.get('/:userId', ratingController.getRatings);

// Update a rating
router.patch('/:id', validate(updateRatingSchema), ratingController.updateRating);

// Delete a rating
router.delete('/:id', ratingController.deleteRating);

module.exports = router;
