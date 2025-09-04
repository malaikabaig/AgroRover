require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ---------------- Multer Config ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// ---------------- @route   GET /api/profile/me ----------------
//         @desc    Get current logged-in user info
//         @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  const { email, username, roverId, avatarUrl } = req.user;
  res.json({ email, username, roverId, avatarUrl });
});

// ---------------- @route   POST /api/profile/image ----------------
//         @desc    Upload avatar image
//         @access  Private
router.post(
  '/image',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    try {
      const filename = req.file.filename;
      const serverIp = process.env.SERVER_IP || 'localhost';
      const port = process.env.PORT || '5001';

      const avatarUrl = `http://${serverIp}:${port}/uploads/${filename}`;

      // Update user
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatarUrl },
        { new: true }
      );

      res.json({
        message: 'Avatar updated successfully',
        avatarUrl: user.avatarUrl,
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
