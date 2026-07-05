const AUTH_PROVIDERS = Object.freeze({
  LOCAL: 'local',
  GOOGLE: 'google',
});

const SOCKET_EVENTS = Object.freeze({
  EVENT_CREATED: 'event:created',
  EVENT_UPDATED: 'event:updated',
  EVENT_DELETED: 'event:deleted',
  JOIN_CALENDAR: 'calendar:join',
});

const DEFAULT_CALENDAR_NAME = 'My Calendar';
const DEFAULT_CALENDAR_COLOR = '#4285F4';
const DEFAULT_EVENT_COLOR = '#4285F4';

const COOKIE_NAME = 'jwt';

module.exports = {
  AUTH_PROVIDERS,
  SOCKET_EVENTS,
  DEFAULT_CALENDAR_NAME,
  DEFAULT_CALENDAR_COLOR,
  DEFAULT_EVENT_COLOR,
  COOKIE_NAME,
};
