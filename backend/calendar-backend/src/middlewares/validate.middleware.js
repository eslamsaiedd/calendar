const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Runs after express-validator check() chains.
 * Collects validation errors and forwards a single, formatted AppError.
 */
module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((e) => e.msg)
    .join('. ');

  return next(new AppError(message, 400));
};
