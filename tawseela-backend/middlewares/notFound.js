const { AppError } = require('./errorHandler');

// 404 Not Found middleware
exports.notFound = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};
