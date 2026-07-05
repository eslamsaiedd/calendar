const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { AUTH_PROVIDERS } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: 8,
      select: false, // never returned by default queries
      required: function () {
        return this.provider === AUTH_PROVIDERS.LOCAL;
      },
    },
    provider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.LOCAL,
    },
    googleId: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    timeZone: {
      type: String,
      default: 'UTC',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
