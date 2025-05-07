const express = require("express");
const authController = require("../controllers/authController");
const { validate } = require("../../../middlewares/validator");
const { protect } = require("../../../middlewares/auth");
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} = require("../validations/authValidation");

const router = express.Router();

// Public routes - User
router.post("/register", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);

// Public routes - Driver
router.post("/driver/register", validate(signupSchema), authController.signup);
router.post("/driver/login", validate(loginSchema), authController.login);

// Public routes - Store
router.post("/store/register", validate(signupSchema), authController.signup);
router.post("/store/login", validate(loginSchema), authController.login);

// Legacy routes (for backward compatibility)
router.post("/signup", validate(signupSchema), authController.signup);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.patch(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  authController.resetPassword
);

// Protected routes
router.use(protect);
router.patch(
  "/update-password",
  validate(updatePasswordSchema),
  authController.updatePassword
);

module.exports = router;
