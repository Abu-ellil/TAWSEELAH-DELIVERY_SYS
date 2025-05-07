const driverService = require('../services/driverService');

// Update driver status
exports.updateDriverStatus = async (req, res, next) => {
  try {
    const driver = await driverService.updateDriverStatus(
      req.user.id,
      req.body.status
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        driver: {
          id: driver._id,
          name: driver.name,
          status: driver.driverStatus
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update driver location
exports.updateDriverLocation = async (req, res, next) => {
  try {
    const driver = await driverService.updateDriverLocation(
      req.user.id,
      req.body.coordinates
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        driver: {
          id: driver._id,
          location: driver.currentLocation
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get nearby drivers
exports.getNearbyDrivers = async (req, res, next) => {
  try {
    const { latitude, longitude, maxDistance } = req.query;
    
    const drivers = await driverService.getNearbyDrivers(
      {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      maxDistance ? parseFloat(maxDistance) : 5
    );
    
    res.status(200).json({
      status: 'success',
      results: drivers.length,
      data: {
        drivers
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get driver current order
exports.getDriverCurrentOrder = async (req, res, next) => {
  try {
    const order = await driverService.getDriverCurrentOrder(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get driver statistics
exports.getDriverStatistics = async (req, res, next) => {
  try {
    const statistics = await driverService.getDriverStatistics(
      req.user.id,
      req.query.period
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        statistics
      }
    });
  } catch (error) {
    next(error);
  }
};
