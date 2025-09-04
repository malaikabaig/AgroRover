// models/Counter.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. 'rover'
  seq: { type: Number, default: 0 }, // current sequence value
});

module.exports = mongoose.model('Counter', counterSchema);
