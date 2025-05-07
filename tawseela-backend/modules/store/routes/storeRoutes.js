const express = require('express');
const storeController = require('../controllers/storeController');
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../../../middlewares/auth');
const { validate } = require('../../../middlewares/validator');
const {
  createStoreSchema,
  updateStoreSchema
} = require('../validations/storeValidation');
const {
  createProductSchema,
  updateProductSchema
} = require('../validations/productValidation');

const router = express.Router();

// Public routes
router.get('/', storeController.getAllStores);
router.get('/:id', storeController.getStore);
router.get('/:id/products', storeController.getStoreProducts);
router.get(
  '/nearby/:lat/:lng/:distance/:unit',
  storeController.getStoresNearby
);

// Protected routes
router.use(protect);

// Store owner and admin routes
router.post(
  '/',
  restrictTo('store-admin', 'admin'),
  validate(createStoreSchema),
  storeController.createStore
);

router.patch(
  '/:id',
  restrictTo('store-admin', 'admin'),
  validate(updateStoreSchema),
  storeController.updateStore
);

router.delete(
  '/:id',
  restrictTo('store-admin', 'admin'),
  storeController.deleteStore
);

// Product routes
router.post(
  '/products',
  restrictTo('store-admin', 'admin'),
  validate(createProductSchema),
  productController.createProduct
);

router.patch(
  '/products/:id',
  restrictTo('store-admin', 'admin'),
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/products/:id',
  restrictTo('store-admin', 'admin'),
  productController.deleteProduct
);

module.exports = router;
