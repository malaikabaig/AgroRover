const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Multer setup for uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
const upload = multer({ storage });

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Upload avatar route
router.post(
  '/upload-avatar',
  authenticate,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: 'No file uploaded' });

      const imageUrl = `http://${process.env.SERVER_IP || 'localhost'}:${
        process.env.PORT || 5000
      }/uploads/${req.file.filename}`;

      await User.findByIdAndUpdate(req.userId, { avatarUrl: imageUrl });

      res.json({ success: true, avatarUrl: imageUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user info route (reuse from previous example)
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
