const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Import routes
const authRoutes = require("./modules/auth/routes/authRoutes");
const userRoutes = require("./modules/user/routes/userRoutes");
const storeRoutes = require("./modules/store/routes/storeRoutes");
const orderRoutes = require("./modules/order/routes/orderRoutes");
const driverRoutes = require("./modules/driver/routes/driverRoutes");
const promotionRoutes = require("./modules/promotion/routes/promotionRoutes");
const paymentRoutes = require("./modules/payment/routes/paymentRoutes");
const chatRoutes = require("./modules/chat/routes/chatRoutes");
const ratingRoutes = require("./modules/rating/routes/ratingRoutes");

// Import middlewares
const errorHandler = require("./middlewares/errorHandler");
const { notFound } = require("./middlewares/notFound");

// Initialize Express app
const app = express();

// Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  max: 100, // 100 requests per IP
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// CORS
app.use(cors());

// Serving static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ratings", ratingRoutes);

// Legacy routes (for backward compatibility)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/stores", storeRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/drivers", driverRoutes);
app.use("/api/v1/promotions", promotionRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/ratings", ratingRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Server is running" });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
