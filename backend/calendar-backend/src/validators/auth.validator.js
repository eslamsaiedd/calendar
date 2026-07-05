const { body } = require('express-validator');

exports.signupValidator = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Username must be between 2 and 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.googleAuthValidator = [
  body('idToken').notEmpty().withMessage('Google idToken is required'),
];
