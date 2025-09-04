const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Image = require('../models/Image');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ---------- Ensure uploads dir (route-level too, for safety) ----------
const uploadDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// ---------- Multer config ----------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.jpg';
    cb(null, `captured_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ---------- POST /api/upload ----------
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, error: 'No file uploaded' });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      // link image to the logged-in user
      const newImage = await Image.create({
        url: imageUrl,
        user: req.user.id,
      });

      return res.json({
        success: true,
        image: { id: newImage._id, url: newImage.url, user: newImage.user },
      });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }
);

// GET /api/images  -> all images (admin-style)
router.get('/images', async (_req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 }).select('-__v');
    res.json({ success: true, images });
  } catch (e) {
    console.error('List images error:', e);
    res.status(500).json({ success: false, error: 'Failed to list images' });
  }
});

// GET /api/my-images -> only current user's images
router.get('/my-images', authMiddleware, async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json({ success: true, images });
  } catch (e) {
    console.error('List my images error:', e);
    res.status(500).json({ success: false, error: 'Failed to list my images' });
  }
});

module.exports = router;
