const express = require('express');
const authRoutes = require('./auth.routes');
const calendarRoutes = require('./calendar.routes');
const eventRoutes = require('./event.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/calendar', calendarRoutes);
router.use('/events', eventRoutes);

module.exports = router;
