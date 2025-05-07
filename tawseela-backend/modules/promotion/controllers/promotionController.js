const promotionService = require('../services/promotionService');

// Create a new promotion
exports.createPromotion = async (req, res, next) => {
  try {
    const newPromotion = await promotionService.createPromotion(
      req.body,
      req.user.id
    );
    
    res.status(201).json({
      status: 'success',
      data: {
        promotion: newPromotion
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all promotions
exports.getAllPromotions = async (req, res, next) => {
  try {
    const promotions = await promotionService.getAllPromotions(req.query);
    
    res.status(200).json({
      status: 'success',
      results: promotions.length,
      data: {
        promotions
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get promotion by ID
exports.getPromotion = async (req, res, next) => {
  try {
    const promotion = await promotionService.getPromotionById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        promotion
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update promotion
exports.updatePromotion = async (req, res, next) => {
  try {
    const updatedPromotion = await promotionService.updatePromotion(
      req.params.id,
      req.body,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        promotion: updatedPromotion
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete promotion
exports.deletePromotion = async (req, res, next) => {
  try {
    await promotionService.deletePromotion(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Validate promotion code
exports.validatePromoCode = async (req, res, next) => {
  try {
    const { code, orderValue } = req.body;
    
    const result = await promotionService.validatePromoCode(
      code,
      req.user.id,
      orderValue
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        promotion: result.promotion,
        discount: result.discount,
        discountType: result.discountType
      }
    });
  } catch (error) {
    next(error);
  }
};
