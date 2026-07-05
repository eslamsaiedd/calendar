const http = require('http');
const env = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');
const initSockets = require('./sockets');

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...', err);
  process.exit(1);
});

async function start() {
  await connectDB();

  const httpServer = http.createServer(app);

  const io = initSockets(httpServer);
  app.set('io', io); // makes io available to controllers via req.app.get('io')

  httpServer.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.error('UNHANDLED REJECTION 💥 Shutting down...', err);
    httpServer.close(() => process.exit(1));
  });
}

start();
