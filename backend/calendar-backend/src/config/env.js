require('dotenv').config();

const required = ['MONGO_URI', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Warning: missing required environment variable "${key}"`);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtCookieExpiresDays: parseInt(process.env.JWT_COOKIE_EXPIRES_DAYS, 10) || 7,

  googleClientId: process.env.GOOGLE_CLIENT_ID,

  isProd: (process.env.NODE_ENV || 'development') === 'production',
};
