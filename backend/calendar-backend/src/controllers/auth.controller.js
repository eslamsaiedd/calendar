const catchAsync = require('../utils/catchAsync');
const { sendTokenResponse } = require('../utils/jwt');
const authService = require('../services/auth.service');
const { COOKIE_NAME } = require('../constants');

exports.signup = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await authService.signup({ username, email, password });
  sendTokenResponse(user, 201, res);
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login({ email, password });
  sendTokenResponse(user, 200, res);
});

exports.googleAuth = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const user = await authService.googleLogin(idToken);
  sendTokenResponse(user, 200, res);
});

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});

exports.logout = catchAsync(async (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.status(200).json({ status: 'success', data: null });
});
