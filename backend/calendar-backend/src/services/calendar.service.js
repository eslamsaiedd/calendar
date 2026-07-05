const Calendar = require('../models/Calendar.model');
const AppError = require('../utils/AppError');

exports.getMyCalendar = async (userId) => {
  const calendar = await Calendar.findOne({ owner: userId });
  if (!calendar) {
    throw new AppError('Calendar not found for this user', 404);
  }
  return calendar;
};

exports.updateMyCalendar = async (userId, updates) => {
  const allowedUpdates = (({ name, color }) => ({ name, color }))(updates);

  Object.keys(allowedUpdates).forEach(
    (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
  );

  const calendar = await Calendar.findOneAndUpdate(
    { owner: userId },
    allowedUpdates,
    { new: true, runValidators: true }
  );

  if (!calendar) {
    throw new AppError('Calendar not found for this user', 404);
  }

  return calendar;
};
