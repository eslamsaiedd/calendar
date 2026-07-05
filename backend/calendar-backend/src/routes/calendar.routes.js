const express = require('express');
const calendarController = require('../controllers/calendar.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', calendarController.getMyCalendar);
router.patch('/', calendarController.updateMyCalendar);

module.exports = router;
