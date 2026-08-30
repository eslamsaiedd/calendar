const mongoose = require('mongoose');
const { DEFAULT_EVENT_COLOR } = require('../constants');

const eventSchema = new mongoose.Schema(
  {
    calendar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Calendar',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    startTime: {
      type: String,
      required: [true, 'Event time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'Event time is required'],
      validate: {
        validator: function (value) {
          // 'this' refers to the document only on save(), not on findOneAndUpdate
          if (this.startTime) return value >= this.startTime;
          return true;
        },
        message: 'endTime must be the same as or after startTime',
      },
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          // 'this' refers to the document only on save(), not on findOneAndUpdate
          if (this.startDate) return value >= this.startDate;
          return true;
        },
        message: 'endDate must be the same as or after startDate',
      },
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: DEFAULT_EVENT_COLOR,
    },
  },
  { timestamps: true }
);

// Speeds up range queries (day/week/month filters) scoped to a calendar
eventSchema.index({ calendar: 1, startDate: 1, endDate: 1 });
// Supports free-text search on title/description
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
