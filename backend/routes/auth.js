const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Your Android/iOS Client ID

const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

/* =========================
   Signup
   ========================= */
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ message: 'Email, password and username are required' });
  }

  try {
    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // NOTE: Assuming your User model hashes password in pre-save hook.
    const newUser = new User({ email, password, username });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    return res.json({
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
    return res.status(500).json({ message: 'Server error' });
  }
});

/* =========================
   Login (email + password)
   ========================= */
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
    return res.json({
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
    return res.status(500).json({ message: 'Server error' });
  }
});

/* =========================
   Google OAuth (Mobile) - id_token verification
   ========================= */
router.post('/google/mobile', async (req, res) => {
  const { id_token } = req.body;

  try {
    // Verify the Google ID token with Google's API
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID, // Your Android/iOS Client ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username: email.split('@')[0],
        password: bcrypt.hashSync(Math.random().toString(36), 10), // Dummy password
        avatarUrl: payload.picture,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({
      token,
      user: {
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(400).json({ error: 'Google login failed' });
  }
});

module.exports = router;
