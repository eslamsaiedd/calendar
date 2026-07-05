const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User.model');
const { COOKIE_NAME } = require('../constants');

/**
 * Protects a route: requires a valid JWT from the Authorization header or cookie.
 * Attaches the authenticated user to req.user.
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to continue.', 401));
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return next(new AppError('Invalid or expired session. Please log in again.', 401));
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  req.user = currentUser;
  next();
});
