const env = require('../config/env');
const AppError = require('../utils/AppError');

function handleCastErrorDB(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

function handleDuplicateFieldsDB(err) {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue ? err.keyValue[field] : '';
  return new AppError(`${field} "${value}" is already in use`, 409);
}

function handleValidationErrorDB(err) {
  const messages = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input: ${messages.join('. ')}`, 400);
}

function handleJWTError() {
  return new AppError('Invalid token. Please log in again.', 401);
}

function handleJWTExpiredError() {
  return new AppError('Your session has expired. Please log in again.', 401);
}

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('UNEXPECTED ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end.',
    });
  }
}

// eslint-disable-next-line no-unused-vars
module.exports = function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.isProd) {
    let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  } else {
    sendErrorDev(err, res);
  }
};
