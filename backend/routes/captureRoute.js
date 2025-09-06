// // backend/routes/captureRoute.js
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');

// const Image = require('../models/Image');
// const authMiddleware = require('../middleware/authMiddleware');

// // Robust absolute import so "Cannot find module '../cloudinary'" type issues na aayen
// const cloudinary = require(path.resolve(__dirname, '..', 'cloudinary'));

// // -------- Multer (memory storage; serverless-friendly) --------
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
// });

// // Handy helper – allowed mime types
// const ALLOWED_IMAGE_TYPES = new Set([
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/webp',
//   'image/heic',
// ]);

// /**
//  * POST /api/upload
//  * Form field name: "file"
//  * Requires Bearer JWT (authMiddleware)
//  */
// router.post(
//   '/upload',
//   authMiddleware,
//   upload.single('file'),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res
//           .status(400)
//           .json({ success: false, error: 'No file uploaded' });
//       }
//       if (!ALLOWED_IMAGE_TYPES.has(req.file.mimetype)) {
//         return res
//           .status(415)
//           .json({ success: false, error: 'Unsupported file type' });
//       }

//       // Cloudinary upload via stream
//       const options = {
//         folder: 'agrorover',
//         resource_type: 'image',
//         // overwrite: false, // enable if you want to overwrite by public_id
//       };

//       const uploaded = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           options,
//           (err, result) => {
//             if (err) return reject(err);
//             resolve(result);
//           }
//         );
//         // push buffer into the stream
//         stream.end(req.file.buffer);
//       });

//       // Persist in DB (store secure_url)
//       const newImage = await Image.create({
//         url: uploaded.secure_url,
//         user: req.user.id,
//       });

//       return res.json({
//         success: true,
//         image: {
//           id: newImage._id,
//           url: newImage.url,
//           user: newImage.user,
//           // extra Cloudinary metadata (optional but useful to you on UI)
//           public_id: uploaded.public_id,
//           width: uploaded.width,
//           height: uploaded.height,
//           format: uploaded.format,
//         },
//       });
//     } catch (err) {
//       console.error('Cloudinary upload error:', err);
//       return res.status(500).json({ success: false, error: 'Upload failed' });
//     }
//   }
// );

// /**
//  * GET /api/images
//  * List all images (admin-style)
//  */
// router.get('/images', async (_req, res) => {
//   try {
//     const images = await Image.find().sort({ createdAt: -1 }).select('-__v');
//     res.json({ success: true, images });
//   } catch (e) {
//     console.error('List images error:', e);
//     res.status(500).json({ success: false, error: 'Failed to list images' });
//   }
// });

// /**
//  * GET /api/my-images
//  * List current user's images
//  */
// router.get('/my-images', authMiddleware, async (req, res) => {
//   try {
//     const images = await Image.find({ user: req.user.id })
//       .sort({ createdAt: -1 })
//       .select('-__v');
//     res.json({ success: true, images });
//   } catch (e) {
//     console.error('List my images error:', e);
//     res.status(500).json({ success: false, error: 'Failed to list my images' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Image = require('../models/Image');
const authMiddleware = require('../middleware/authMiddleware');

// Robust absolute import so "Cannot find module '../cloudinary'" type issues na aayen
const cloudinary = require(path.resolve(__dirname, '..', 'cloudinary'));

// -------- Multer (memory storage; serverless-friendly) --------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Handy helper – allowed mime types
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
]);

/**
 * POST /api/upload
 * Form field name: "file"
 * Requires Bearer JWT (authMiddleware)
 */
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

      if (!ALLOWED_IMAGE_TYPES.has(req.file.mimetype)) {
        return res
          .status(415)
          .json({ success: false, error: 'Unsupported file type' });
      }

      // Cloudinary upload via stream
      const options = {
        folder: 'agrorover',
        resource_type: 'image',
      };

      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          options,
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        // push buffer into the stream
        stream.end(req.file.buffer);
      });

      // Persist in DB (store secure_url and public_id)
      const newImage = await Image.create({
        url: uploaded.secure_url,
        user: req.user.id,
        public_id: uploaded.public_id, // Save the public_id to DB
      });

      return res.json({
        success: true,
        image: {
          id: newImage._id,
          url: newImage.url,
          user: newImage.user,
          public_id: newImage.public_id, // Include the public_id in response
          width: uploaded.width,
          height: uploaded.height,
          format: uploaded.format,
        },
      });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({ success: false, error: 'Upload failed' });
    }
  }
);

/**
 * GET /api/images
 * List all images (admin-style)
 */
router.get('/images', async (_req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 }).select('-__v');
    res.json({ success: true, images });
  } catch (e) {
    console.error('List images error:', e);
    res.status(500).json({ success: false, error: 'Failed to list images' });
  }
});

/**
 * GET /api/my-images
 * List current user's images
 */
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

// DELETE /api/images/:id
router.delete('/images/:id', authMiddleware, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    // Delete the image from Cloudinary using the public_id
    const cloudinaryResponse = await cloudinary.uploader.destroy(
      image.public_id
    );

    // If the deletion from Cloudinary was successful, remove the record from DB
    if (cloudinaryResponse.result === 'ok') {
      await image.remove();
      return res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete image from Cloudinary',
      });
    }
  } catch (err) {
    console.error('Error deleting image:', err);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to delete image' });
  }
});

module.exports = router;
