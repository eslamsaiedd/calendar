const User = require('../models/User.model');
const Calendar = require('../models/Calendar.model');
const AppError = require('../utils/AppError');
const { verifyGoogleToken } = require('../config/googleAuth');
const { AUTH_PROVIDERS } = require('../constants');

/**
 * Creates a user's default calendar. Called right after a new user is created,
 * for both local signup and first-time Google login.
 */
async function createDefaultCalendar(userId) {
  return Calendar.create({ owner: userId });
}

exports.signup = async ({ username, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create({
    username,
    email,
    password,
    provider: AUTH_PROVIDERS.LOCAL,
  });

  await createDefaultCalendar(user._id);

  return user;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || user.provider !== AUTH_PROVIDERS.LOCAL) {
    throw new AppError('Incorrect email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Incorrect email or password', 401);
  }

  return user;
};

exports.googleLogin = async (idToken) => {
  const payload = await verifyGoogleToken(idToken);

  if (!payload?.email) {
    throw new AppError('Unable to verify Google account', 401);
  }

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      username: payload.name || payload.email.split('@')[0],
      email: payload.email,
      provider: AUTH_PROVIDERS.GOOGLE,
      googleId: payload.sub,
      avatar: payload.picture || '',
    });

    await createDefaultCalendar(user._id);
  }

  return user;
};
