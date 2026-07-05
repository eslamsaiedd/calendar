const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User.model');
const Calendar = require('../models/Calendar.model');
const env = require('../config/env');
const { SOCKET_EVENTS } = require('../constants');

/**
 * Authenticates a socket connection using the JWT sent in the handshake
 * (either `auth.token` or a `jwt` cookie), then auto-joins the client to
 * a room scoped to their own calendar so they receive their own live updates.
 */
function initSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.cookie
          ?.split('; ')
          .find((c) => c.startsWith('jwt='))
          ?.split('=')[1];

      if (!token) return next(new Error('Authentication required'));

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User no longer exists'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid or expired session'));
    }
  });

  io.on('connection', async (socket) => {
    const calendar = await Calendar.findOne({ owner: socket.user._id }).select('_id');
    if (calendar) {
      socket.join(`calendar:${calendar._id}`);
    }

    // Allows the client to explicitly (re)join, e.g. after reconnecting
    socket.on(SOCKET_EVENTS.JOIN_CALENDAR, (calendarId) => {
      if (calendar && calendarId === calendar._id.toString()) {
        socket.join(`calendar:${calendarId}`);
      }
    });

    socket.on('disconnect', () => {
      // no-op placeholder for future presence/cleanup logic
    });
  });

  return io;
}

module.exports = initSockets;
