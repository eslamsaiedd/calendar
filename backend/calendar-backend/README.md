# Calendar Backend

Production-style backend for a Google Calendar clone, built with Node.js, Express, MongoDB/Mongoose, JWT auth, and Socket.IO for real-time sync.

## Architecture

```
src/
├── config/        # env loading, DB connection, Google OAuth client
├── controllers/    # thin HTTP layer — parses req, calls services, shapes res
├── services/       # business logic, isolated from Express
├── models/         # Mongoose schemas (User, Calendar, Event)
├── routes/         # route definitions, wiring validators + controllers
├── middlewares/     # auth guard, validation, centralized error handling
├── validators/      # express-validator rule sets per resource
├── sockets/         # Socket.IO server init + broadcast helpers
├── utils/           # AppError, catchAsync, JWT helpers, date-range math
├── constants/        # shared enums/magic strings
├── app.js            # Express app (middleware + routes), no listen()
└── server.js         # HTTP server bootstrap, DB connect, Socket.IO attach
```

**Why this shape:** controllers stay thin and testable, services hold logic that's reusable outside HTTP (e.g. from a script or a socket handler), and `app.js`/`server.js` are split so the app can be imported in tests without opening a real port.

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev             # nodemon, requires a running MongoDB instance
```

MongoDB: point `MONGO_URI` at a local instance (`mongodb://127.0.0.1:27017/calendar-clone`) or a hosted one (Atlas, etc).

Google OAuth: create an OAuth 2.0 Client ID in Google Cloud Console, and put it in `GOOGLE_CLIENT_ID`. The frontend obtains a Google `idToken` (via Google Identity Services) and POSTs it to `/api/auth/google` — this backend verifies it server-side rather than trusting the client.

## Auth Model

- JWT is issued on signup/login/google and returned both in the JSON body and as an `httpOnly` cookie (`jwt`).
- Protected routes accept either `Authorization: Bearer <token>` or the cookie.
- Password reset and email verification are intentionally out of scope for this project.

## API Reference

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Register, auto-creates default calendar |
| POST | `/api/auth/login` | — | Local login |
| POST | `/api/auth/google` | — | Login/register via Google idToken |
| GET | `/api/auth/me` | ✅ | Current user |
| POST | `/api/auth/logout` | ✅ | Clears auth cookie |

### Calendar
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/calendar` | ✅ | Get the current user's calendar |
| PATCH | `/api/calendar` | ✅ | Update name/color |

### Events
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/events` | ✅ | List events, supports filters below |
| GET | `/api/events/:id` | ✅ | Get one event |
| POST | `/api/events` | ✅ | Create event |
| PATCH | `/api/events/:id` | ✅ | Update event |
| DELETE | `/api/events/:id` | ✅ | Delete event |

**Filtering query params** (combine `search` with at most one date filter):
- `?search=meeting` — text search on title/description
- `?date=2026-07-01` — single day
- `?month=7&year=2026` — whole month
- `?week=27&year=2026` — ISO week number

## Real-Time Updates

Clients connect to Socket.IO with a JWT (`socket.handshake.auth.token`, or the `jwt` cookie). On connect, the server auto-joins the socket to a room named `calendar:<calendarId>` scoped to that user's own calendar. On create/update/delete, the server emits to that room:

- `event:created`
- `event:updated`
- `event:deleted`

## Security Notes

- Passwords hashed with bcrypt (cost factor 12), never returned in responses.
- `helmet`, `cors` (scoped to `CLIENT_URL`), and `express-mongo-sanitize` are applied globally.
- Auth routes are rate-limited (50 req / 15 min / IP) to slow brute-force attempts.
- All event/calendar queries are scoped server-side to `req.user`'s own calendar — there is no way to read or mutate another user's data through the API, even by guessing IDs.

## Not Included (by design)

Password reset, email verification, calendar sharing, drag-and-drop, guests, event location, reminders, recurring events. These were explicitly scoped out to keep the project focused; the architecture (services layer, indexed models) leaves room to add them later without a rewrite.
