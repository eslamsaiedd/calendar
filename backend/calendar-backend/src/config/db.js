const mongoose = require('mongoose');
const env = require('./env');

async function connectDB() {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.mongoUri);
    // eslint-disable-next-line no-console
    console.log('[db] MongoDB connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB connection error:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB runtime error:', err.message);
  });
}

module.exports = connectDB;
