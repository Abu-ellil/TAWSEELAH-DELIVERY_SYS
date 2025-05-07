require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/database");
const logger = require("./config/logger");
const socketService = require("./modules/chat/services/socketService");

// Uncaught exception handler
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
socketService.init(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Unhandled rejection handler
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// SIGTERM handler
process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    logger.info("💥 Process terminated!");
  });
});
