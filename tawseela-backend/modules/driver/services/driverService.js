const User = require("../../auth/models/userModel");
const Order = require("../../order/models/orderModel");
const { AppError } = require("../../../middlewares/errorHandler");
const socketService = require("../../chat/services/socketService");

// Update driver status
exports.updateDriverStatus = async (driverId, status) => {
  // Check if driver exists
  const driver = await User.findOne({
    _id: driverId,
    role: "driver",
  });

  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  // Update driver status using findByIdAndUpdate instead of save()
  // This avoids triggering the passwordConfirm validation
  const updatedDriver = await User.findByIdAndUpdate(
    driverId,
    { driverStatus: status },
    { new: true, runValidators: false }
  );

  return updatedDriver;
};

// Update driver location
exports.updateDriverLocation = async (driverId, coordinates) => {
  // Check if driver exists
  const driver = await User.findOne({
    _id: driverId,
    role: "driver",
  });

  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  // Update driver location using findByIdAndUpdate instead of save()
  // This avoids triggering the passwordConfirm validation
  const updatedDriver = await User.findByIdAndUpdate(
    driverId,
    {
      currentLocation: {
        type: "Point",
        coordinates: [coordinates.longitude, coordinates.latitude],
      },
    },
    { new: true, runValidators: false }
  );

  // If driver is on a trip, notify user about location update
  const currentOrder = await Order.findOne({
    driver: driverId,
    status: { $in: ["accepted", "preparing", "ready", "picked"] },
  });

  if (currentOrder) {
    socketService.notifyUser(currentOrder.user, "driver-location-updated", {
      orderId: currentOrder._id,
      location: updatedDriver.currentLocation,
    });
  }

  return updatedDriver;
};

// Get nearby drivers
exports.getNearbyDrivers = async (coordinates, maxDistance = 5) => {
  // Convert distance to radians (for MongoDB geospatial query)
  const radiusInRadians = maxDistance / 6378.1;

  // Find available drivers near the location
  const drivers = await User.find({
    role: "driver",
    driverStatus: "available",
    currentLocation: {
      $geoWithin: {
        $centerSphere: [
          [coordinates.longitude, coordinates.latitude],
          radiusInRadians,
        ],
      },
    },
  }).select("name phone currentLocation driverStatus");

  return drivers;
};

// Get driver current order
exports.getDriverCurrentOrder = async (driverId) => {
  // Check if driver exists
  const driver = await User.findOne({
    _id: driverId,
    role: "driver",
  });

  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  // Find current order
  const currentOrder = await Order.findOne({
    driver: driverId,
    status: { $in: ["accepted", "preparing", "ready", "picked"] },
  });

  if (!currentOrder) {
    return null;
  }

  return currentOrder;
};

// Get driver statistics
exports.getDriverStatistics = async (driverId, period = "day") => {
  // Check if driver exists
  const driver = await User.findOne({
    _id: driverId,
    role: "driver",
  });

  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  // Set date range based on period
  let startDate;
  const endDate = new Date();

  if (period === "day") {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "month") {
    startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
  } else {
    throw new AppError("Invalid period. Use day, week, or month", 400);
  }

  // Get completed orders
  const completedOrders = await Order.find({
    driver: driverId,
    status: "delivered",
    deliveredAt: { $gte: startDate, $lte: endDate },
  });

  // Calculate statistics
  const totalOrders = completedOrders.length;
  const totalEarnings = completedOrders.reduce(
    (total, order) => total + order.deliveryFee,
    0
  );

  // Calculate average delivery time
  let totalDeliveryTime = 0;
  let ordersWithDeliveryTime = 0;

  completedOrders.forEach((order) => {
    if (order.pickedAt && order.deliveredAt) {
      const deliveryTime = (order.deliveredAt - order.pickedAt) / (1000 * 60); // in minutes
      totalDeliveryTime += deliveryTime;
      ordersWithDeliveryTime++;
    }
  });

  const averageDeliveryTime =
    ordersWithDeliveryTime > 0 ? totalDeliveryTime / ordersWithDeliveryTime : 0;

  return {
    totalOrders,
    totalEarnings,
    averageDeliveryTime,
    period,
  };
};
