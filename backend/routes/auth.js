// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// === SIGNUP ===
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ message: 'Email, password and username are required' });
  }

  try {
    const emailTaken = await User.findOne({ email });
    if (emailTaken)
      return res.status(409).json({ message: 'Email already registered' });

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken)
      return res.status(409).json({ message: 'Username already taken' });

    const newUser = new User({ email, password, username });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        email: newUser.email,
        username: newUser.username,
        roverId: newUser.roverId,
        avatarUrl: newUser.avatarUrl,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// === LOGIN ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Cannot find user' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: 'Email and password do not match' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        email: user.email,
        username: user.username,
        roverId: user.roverId,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
