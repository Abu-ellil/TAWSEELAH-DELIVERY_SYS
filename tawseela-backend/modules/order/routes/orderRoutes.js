const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../../../middlewares/auth');
const { validate } = require('../../../middlewares/validator');
const {
  createOrderSchema,
  addToOrderSchema,
  updateOrderStatusSchema,
  updateStoreOrderStatusSchema,
  assignDriverSchema
} = require('../validations/orderValidation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Customer routes
router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.patch(
  '/:id/add-items',
  validate(addToOrderSchema),
  orderController.addToOrder
);
router.get('/:id', orderController.getOrder);
router.patch(
  '/:id/status',
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

// Store admin routes
router.get(
  '/store/:storeId',
  restrictTo('store-admin', 'admin'),
  orderController.getStoreOrders
);
router.patch(
  '/:id/store/:storeId/status',
  restrictTo('store-admin', 'admin'),
  validate(updateStoreOrderStatusSchema),
  orderController.updateStoreOrderStatus
);

// Driver routes
router.get(
  '/driver/my-orders',
  restrictTo('driver'),
  orderController.getDriverOrders
);

// Admin routes
router.patch(
  '/:id/assign-driver',
  restrictTo('admin'),
  validate(assignDriverSchema),
  orderController.assignDriver
);

module.exports = router;
