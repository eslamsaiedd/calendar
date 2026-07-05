const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { COOKIE_NAME } = require('../constants');

// generate a JWT token for the given user ID
function signToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

/**
 * Signs a JWT for the given user and sets it as an httpOnly cookie on the response.
 * Also strips sensitive fields before returning the user payload to the caller.
 */
function sendTokenResponse(user, statusCode, res) {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + env.jwtCookieExpiresDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
  };

  res.cookie(COOKIE_NAME, token, cookieOptions);

  const safeUser = user.toObject ? user.toObject() : user;
  delete safeUser.password;

  res.status(statusCode).json({ 
    status: 'success',
    token,
    data: { user: safeUser },
  });
}

module.exports = { signToken, verifyToken, sendTokenResponse };
