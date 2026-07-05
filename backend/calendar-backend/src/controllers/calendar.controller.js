const catchAsync = require('../utils/catchAsync');
const calendarService = require('../services/calendar.service');

exports.getMyCalendar = catchAsync(async (req, res) => {
  const calendar = await calendarService.getMyCalendar(req.user._id);
  res.status(200).json({ status: 'success', data: { calendar } });
});

exports.updateMyCalendar = catchAsync(async (req, res) => {
  const calendar = await calendarService.updateMyCalendar(req.user._id, req.body);
  res.status(200).json({ status: 'success', data: { calendar } });
});
