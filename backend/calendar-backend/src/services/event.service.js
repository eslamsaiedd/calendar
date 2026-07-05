const Event = require('../models/Event.model');
const Calendar = require('../models/Calendar.model');
const AppError = require('../utils/AppError');
const { dayRange, monthRange, weekRange } = require('../utils/dateRange');

/**
 * Resolves the calendar owned by a user and asserts it exists.
 * Every event operation is scoped to the requesting user's own calendar.
 */
async function getOwnedCalendarId(userId) {
  const calendar = await Calendar.findOne({ owner: userId }).select('_id');
  if (!calendar) throw new AppError('Calendar not found for this user', 404);
  return calendar._id;
}

/**
 * Builds a Mongo filter from query params: search text and/or a date range
 * (day, month, or week — first match wins if multiple are supplied).
 */
function buildFilter(calendarId, query) {
  const filter = { calendar: calendarId };

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.date) {
    const { start, end } = dayRange(query.date);
    filter.startDate = { $lt: end };
    filter.endDate = { $gte: start };
  } else if (query.month && query.year) {
    const { start, end } = monthRange(Number(query.month), Number(query.year));
    filter.startDate = { $lt: end };
    filter.endDate = { $gte: start };
  } else if (query.week && query.year) {
    const { start, end } = weekRange(Number(query.week), Number(query.year));
    filter.startDate = { $lt: end };
    filter.endDate = { $gte: start };
  }

  return filter;
}

exports.listEvents = async (userId, query) => {
  const calendarId = await getOwnedCalendarId(userId);
  const filter = buildFilter(calendarId, query);
  return Event.find(filter).sort({ startDate: 1 });
};

exports.getEvent = async (userId, eventId) => {
  const calendarId = await getOwnedCalendarId(userId);
  const event = await Event.findOne({ _id: eventId, calendar: calendarId });
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

exports.createEvent = async (userId, payload) => {
  const calendarId = await getOwnedCalendarId(userId);
  return Event.create({ ...payload, calendar: calendarId });
};

exports.updateEvent = async (userId, eventId, updates) => {
  const calendarId = await getOwnedCalendarId(userId);

  const event = await Event.findOne({ _id: eventId, calendar: calendarId });
  if (!event) throw new AppError('Event not found', 404);

  Object.assign(event, updates);
  await event.save(); // ensures schema validators (e.g. endDate >= startDate) run

  return event;
};

exports.deleteEvent = async (userId, eventId) => {
  const calendarId = await getOwnedCalendarId(userId);
  const event = await Event.findOneAndDelete({ _id: eventId, calendar: calendarId });
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

exports.getOwnedCalendarId = getOwnedCalendarId;
