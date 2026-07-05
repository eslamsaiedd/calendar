const catchAsync = require('../utils/catchAsync');
const eventService = require('../services/event.service');
const { emitEventChange } = require('../sockets/event.socket');
const { SOCKET_EVENTS } = require('../constants');

exports.listEvents = catchAsync(async (req, res) => {
  const events = await eventService.listEvents(req.user._id, req.query);
  res.status(200).json({ status: 'success', results: events.length, data: { events } });
});

exports.getEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEvent(req.user._id, req.params.id);
  res.status(200).json({ status: 'success', data: { event } });
});

exports.createEvent = catchAsync(async (req, res) => {
  const event = await eventService.createEvent(req.user._id, req.body);
  emitEventChange(req.app.get('io'), event.calendar.toString(), SOCKET_EVENTS.EVENT_CREATED, event);
  res.status(201).json({ status: 'success', data: { event } });
});

exports.updateEvent = catchAsync(async (req, res) => {
  const event = await eventService.updateEvent(req.user._id, req.params.id, req.body);
  emitEventChange(req.app.get('io'), event.calendar.toString(), SOCKET_EVENTS.EVENT_UPDATED, event);
  res.status(200).json({ status: 'success', data: { event } });
});

exports.deleteEvent = catchAsync(async (req, res) => {
  const event = await eventService.deleteEvent(req.user._id, req.params.id);
  emitEventChange(req.app.get('io'), event.calendar.toString(), SOCKET_EVENTS.EVENT_DELETED, {
    _id: event._id,
  });
  res.status(204).json({ status: 'success', data: null });
});
