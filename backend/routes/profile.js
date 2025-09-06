// routes/profile.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Multer: memory storage (serverless-friendly, no disk writes)
 * Also limit to images only and 10MB max.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpe?g|png|gif|webp|bmp|tiff?)$/i.test(file.mimetype);
    if (!ok) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

/**
 * Cloudinary config
 * Use either CLOUDINARY_URL or the 3 separate vars you already added on Vercel.
 */
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // omit if using CLOUDINARY_URL
  api_key: process.env.CLOUDINARY_API_KEY, // omit if using CLOUDINARY_URL
  api_secret: process.env.CLOUDINARY_API_SECRET, // omit if using CLOUDINARY_URL
});

// ---------------- @route   GET /api/profile/me ----------------
//         @desc    Get current logged-in user info
//         @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { email, username, roverId, avatarUrl } = req.user;
    res.json({ email, username, roverId, avatarUrl });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------- @route   POST /api/profile/image ----------------
//         @desc    Upload avatar image to Cloudinary (field name: image)
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
      // Upload the in-memory buffer to Cloudinary via upload_stream
      const uploadFromBuffer = (fileBuffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'agrover/avatars',
              // Optional normalization for avatars:
              transformation: [
                { width: 512, height: 512, crop: 'fill', gravity: 'face' },
              ],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(fileBuffer);
        });

      const result = await uploadFromBuffer(req.file.buffer); // { secure_url, public_id, ... }

      // Update user record (req.user._id OR req.user.id depending on your authMiddleware)
      const userId = req.user?._id || req.user?.id;
      const user = await User.findByIdAndUpdate(
        userId,
        { avatarUrl: result.secure_url },
        { new: true }
      );

      return res.json({
        message: 'Avatar updated successfully',
        avatarUrl: user?.avatarUrl || result.secure_url,
        user,
      });
    } catch (err) {
      console.error('Avatar upload error:', err);
      // Surface a clearer error if Cloudinary creds are missing
      if (
        String(err?.message || '')
          .toLowerCase()
          .includes('api_key')
      ) {
        return res.status(500).json({
          message: 'Cloudinary is not configured (missing API key/secret)',
        });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
