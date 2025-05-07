const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../../auth/models/userModel');
const logger = require('../../../config/logger');

let io;

// Initialize Socket.IO
exports.init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user exists
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user to socket
      socket.user = {
        id: user._id,
        role: user.role
      };
      
      next();
    } catch (error) {
      logger.error(`Socket authentication error: ${error.message}`);
      next(new Error('Authentication error'));
    }
  });
  
  // Connection handler
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.id}`);
    
    // Join user's room
    socket.join(`user:${socket.user.id}`);
    
    // Join role-based room
    socket.join(`role:${socket.user.role}`);
    
    // Handle driver location updates
    if (socket.user.role === 'driver') {
      socket.on('update-location', (data) => {
        // Broadcast to admin room
        io.to('role:admin').emit('driver-location-updated', {
          driverId: socket.user.id,
          location: data.location
        });
        
        // If driver is on a trip, broadcast to customer
        if (data.orderId && data.customerId) {
          io.to(`user:${data.customerId}`).emit('driver-location-updated', {
            orderId: data.orderId,
            location: data.location
          });
        }
      });
    }
    
    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.id}`);
    });
  });
  
  logger.info('Socket.IO initialized');
  
  return io;
};

// Get Socket.IO instance
exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  
  return io;
};

// Notify user
exports.notifyUser = (userId, event, data) => {
  if (!io) {
    logger.error('Socket.IO not initialized');
    return;
  }
  
  io.to(`user:${userId}`).emit(event, data);
};

// Notify driver
exports.notifyDriver = (driverId, event, data) => {
  if (!io) {
    logger.error('Socket.IO not initialized');
    return;
  }
  
  io.to(`user:${driverId}`).emit(event, data);
};

// Notify store
exports.notifyStore = (storeId, event, data) => {
  if (!io) {
    logger.error('Socket.IO not initialized');
    return;
  }
  
  // Emit to all store admins
  io.to(`store:${storeId}`).emit(event, data);
};

// Notify all users with a specific role
exports.notifyRole = (role, event, data) => {
  if (!io) {
    logger.error('Socket.IO not initialized');
    return;
  }
  
  io.to(`role:${role}`).emit(event, data);
};
