const mongoose = require('mongoose');
const {
  DEFAULT_CALENDAR_NAME,
  DEFAULT_CALENDAR_COLOR,
} = require('../constants');

const calendarSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // enforces the 1 user -> 1 calendar relationship
    },
    name: {
      type: String,
      trim: true,
      default: DEFAULT_CALENDAR_NAME,
      maxlength: 100,
    },
    color: {
      type: String,
      default: DEFAULT_CALENDAR_COLOR,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Calendar', calendarSchema);
