/**
 * Broadcasts an event change to every client subscribed to the given calendar's room.
 * Rooms are named `calendar:<calendarId>` so updates only reach that calendar's owner
 * (and any devices they're logged in on).
 */
function emitEventChange(io, calendarId, eventName, payload) {
  if (!io) return;
  io.to(`calendar:${calendarId}`).emit(eventName, payload);
}

module.exports = { emitEventChange };
