const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    // Hash the password manually (no middleware used)
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password });

    await newUser.save();
    console.log('User saved:', newUser);

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Cannot find user' });

    console.log('Entered password:', password);
    console.log('Stored hashed password:', user.password);

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password); // <-- this line compares password correctly
    console.log('Hashed password in DB: ', user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ message: 'Email and password does not match' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
