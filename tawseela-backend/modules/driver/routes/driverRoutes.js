const express = require('express');
const driverController = require('../controllers/driverController');
const { protect, restrictTo } = require('../../../middlewares/auth');
const { validate } = require('../../../middlewares/validator');
const {
  updateDriverStatusSchema,
  updateDriverLocationSchema
} = require('../validations/driverValidation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Driver routes
router.patch(
  '/status',
  restrictTo('driver'),
  validate(updateDriverStatusSchema),
  driverController.updateDriverStatus
);

router.patch(
  '/location',
  restrictTo('driver'),
  validate(updateDriverLocationSchema),
  driverController.updateDriverLocation
);

router.get(
  '/current-order',
  restrictTo('driver'),
  driverController.getDriverCurrentOrder
);

router.get(
  '/statistics',
  restrictTo('driver'),
  driverController.getDriverStatistics
);

// Admin routes
router.get(
  '/nearby',
  restrictTo('admin'),
  driverController.getNearbyDrivers
);

module.exports = router;
