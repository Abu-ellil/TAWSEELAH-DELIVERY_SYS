const express = require('express');
const promotionController = require('../controllers/promotionController');
const { protect, restrictTo } = require('../../../middlewares/auth');
const { validate } = require('../../../middlewares/validator');
const {
  createPromotionSchema,
  updatePromotionSchema,
  validatePromoCodeSchema
} = require('../validations/promotionValidation');

const router = express.Router();

// Public routes
router.get('/', promotionController.getAllPromotions);
router.get('/:id', promotionController.getPromotion);

// Protected routes
router.use(protect);

// Validate promo code
router.post(
  '/validate',
  validate(validatePromoCodeSchema),
  promotionController.validatePromoCode
);

// Admin routes
router.use(restrictTo('admin'));

router.post(
  '/',
  validate(createPromotionSchema),
  promotionController.createPromotion
);

router.patch(
  '/:id',
  validate(updatePromotionSchema),
  promotionController.updatePromotion
);

router.delete('/:id', promotionController.deletePromotion);

module.exports = router;
