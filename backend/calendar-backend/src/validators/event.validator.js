const { body, param, query } = require('express-validator');

exports.createEventValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be 200 characters or fewer'),
  body('description').optional().isLength({ max: 2000 }),
  body('startDate').isISO8601().withMessage('startDate must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('endDate must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('endDate must be the same as or after startDate');
      }
      return true;
    }),
  body('allDay').optional().isBoolean(),
  body('color').optional().isString(),
];

exports.updateEventValidator = [
  param('id').isMongoId().withMessage('Invalid event id'),
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('description').optional().isLength({ max: 2000 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('allDay').optional().isBoolean(),
  body('color').optional().isString(),
];

exports.eventIdValidator = [param('id').isMongoId().withMessage('Invalid event id')];

exports.listEventsValidator = [
  query('search').optional().isString(),
  query('date').optional().isISO8601(),
  query('month').optional().isInt({ min: 1, max: 12 }),
  query('year').optional().isInt({ min: 1970, max: 2200 }),
  query('week').optional().isInt({ min: 1, max: 53 }),
];
