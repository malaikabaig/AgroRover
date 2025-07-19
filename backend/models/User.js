const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: '' }, // New field for profile image URL
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
  // If the password field is not modified, no need to hash it again
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Hash the password before saving
    next();
  } catch (error) {
    next(error); // Pass any error that occurs to the next middleware
  }
});

// Method to compare entered password with stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password); // Compare using bcrypt
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model('User', userSchema, 'users');
