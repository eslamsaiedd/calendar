const express = require('express');
const eventController = require('../controllers/event.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
  listEventsValidator,
} = require('../validators/event.validator');

const router = express.Router();

router.use(protect);

router.get('/', listEventsValidator, validate, eventController.listEvents);
router.post('/', createEventValidator, validate, eventController.createEvent);
router.get('/:id', eventIdValidator, validate, eventController.getEvent);
router.patch('/:id', updateEventValidator, validate, eventController.updateEvent);
router.delete('/:id', eventIdValidator, validate, eventController.deleteEvent);

module.exports = router;
