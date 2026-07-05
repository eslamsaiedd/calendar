const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middlewares/notFound.middleware');
const globalErrorHandler = require('./middlewares/error.middleware');

const app = express();

// --- Security & parsing middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

if (!env.isProd) {
  app.use(morgan('dev'));
}

// Rate limit auth routes specifically to slow down brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/auth', authLimiter);

// --- Health check ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- API routes ---
app.use('/api', routes);

// --- 404 + centralized error handling ---
app.use(notFound);
app.use(globalErrorHandler);

module.exports = app;
