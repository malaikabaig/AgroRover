// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Counter = require('./Counter'); // ⬅️ add this

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true, // ⬅️ fixed (was `require`)
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 10,
    },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    roverId: { type: String, unique: true }, // e.g. RVR-001
  },
  { timestamps: true }
);

// helper to format: 1 -> RVR-001
const formatRoverId = (n) => `RVR-${String(n).padStart(3, '0')}`;

userSchema.pre('save', async function (next) {
  try {
    // 1) Assign sequential roverId if missing
    if (!this.roverId) {
      const doc = await Counter.findOneAndUpdate(
        { key: 'rover' }, // counter key
        { $inc: { seq: 1 } }, // atomic increment
        { new: true, upsert: true } // create if not exists
      );
      this.roverId = formatRoverId(doc.seq);
    }

    // 2) Hash password if modified
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
