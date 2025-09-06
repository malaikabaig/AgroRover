// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5001';

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

//Google OAuth (Passport)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Web client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Web client secret
      callbackURL: `${BASE_URL}/api/auth/google/callback`, // absolute (local / prod)
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'), null);

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            username:
              profile.displayName?.replace(/\s+/g, '').toLowerCase() ||
              email.split('@')[0],
            // dummy password — your model should hash on save
            password: bcrypt.hashSync(Math.random().toString(36), 10),
            avatarUrl: profile.photos?.[0]?.value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Start Google login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback → issue JWT and return JSON (you can redirect if you want)
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    return res.json({
      token,
      user: {
        email: req.user.email,
        username: req.user.username,
        roverId: req.user.roverId,
        avatarUrl: req.user.avatarUrl,
      },
    });
  }
);

module.exports = router;
