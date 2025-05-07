const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../../../middlewares/auth');
const { validate } = require('../../../middlewares/validator');
const {
  updateUserProfileSchema,
  addUserAddressSchema,
  updateUserAddressSchema
} = require('../validations/userValidation');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes
router.get('/profile', userController.getUserProfile);
router.patch(
  '/profile',
  validate(updateUserProfileSchema),
  userController.updateUserProfile
);

// User address routes
router.post(
  '/addresses',
  validate(addUserAddressSchema),
  userController.addUserAddress
);
router.patch(
  '/addresses/:addressId',
  validate(updateUserAddressSchema),
  userController.updateUserAddress
);
router.delete('/addresses/:addressId', userController.deleteUserAddress);

// Favorite stores routes
router.get('/favorite-stores', userController.getFavoriteStores);
router.post('/favorite-stores/:storeId', userController.addFavoriteStore);
router.delete('/favorite-stores/:storeId', userController.removeFavoriteStore);

module.exports = router;
