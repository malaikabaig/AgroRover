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
// backend/routes/captureRoute.js
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
          _id: newImage._id,
          url: newImage.url,
          user: newImage.user,
          public_id: newImage.public_id,
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

/**
 * DELETE /api/images/:id
 */
router.delete('/images/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    console.log('[DELETE] /api/images/:id ->', id);

    const image = await Image.findById(id);
    if (!image) {
      console.warn('[DELETE] not found in DB:', id);
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    if (!image.public_id) {
      console.error('[DELETE] missing public_id for', id);
      return res
        .status(500)
        .json({ success: false, error: 'Missing public_id' });
    }

    console.log('[DELETE] destroying on Cloudinary ->', image.public_id);
    const cloudinaryResponse = await cloudinary.uploader.destroy(
      image.public_id,
      {
        invalidate: true,
        resource_type: 'image',
        type: 'upload',
      }
    );
    console.log('[DELETE] Cloudinary response:', cloudinaryResponse);

    const result = String(cloudinaryResponse?.result || '');
    // Treat both 'ok' and 'not found' as success (idempotent delete)
    if (result === 'ok' || result === 'not found') {
      await Image.deleteOne({ _id: image._id }); // modern Mongoose
      return res.json({
        success: true,
        id: image._id,
        message:
          result === 'ok'
            ? 'Image deleted'
            : 'Image already missing on Cloudinary; removed from DB',
      });
    }

    return res.status(502).json({
      success: false,
      error: `Cloudinary delete failed: ${result}`,
      details: cloudinaryResponse,
    });
  } catch (err) {
    console.error('[DELETE] error:', err);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to delete image' });
  }
});

// GET /api/images/:id/analyze
router.get('/images/:id/analyze', authMiddleware, async (req, res) => {
  try {
    // url + public_id dono le lo (old records ke liye)
    const img = await Image.findById(req.params.id).select('url public_id');
    if (!img) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    // 1) primary: stored secure_url
    let imageUrl = img.url;

    // 2) fallback: build from public_id if url missing/invalid
    const looksPublic = (u) => typeof u === 'string' && /^https?:\/\//i.test(u);
    if (!looksPublic(imageUrl) && img.public_id) {
      // Cloudinary SDK se secure delivery URL; extensionless works
      imageUrl = cloudinary.url(img.public_id, {
        secure: true,
        resource_type: 'image',
        type: 'upload',
      });
    }

    if (!looksPublic(imageUrl)) {
      return res.status(400).json({
        success: false,
        error: 'Image URL is not publicly accessible',
      });
    }

    const endpoint =
      `${process.env.ROBOFLOW_MODEL_URL}` +
      `?api_key=${process.env.ROBOFLOW_API_KEY}` +
      `&image=${encodeURIComponent(imageUrl)}` +
      `&confidence=0.5&overlap=0.5`;

    console.log(
      '[analyze] calling RF:',
      endpoint.replace(/api_key=[^&]+/, 'api_key=***')
    );

    const rfRes = await fetch(endpoint, { method: 'GET' });
    let data;
    try {
      data = await rfRes.json();
    } catch {
      data = null;
    }

    if (!rfRes.ok) {
      console.error('[analyze] RF status:', rfRes.status, 'body:', data);
      return res.status(502).json({
        success: false,
        error: `Inference failed (${rfRes.status})`,
        details: data || null,
      });
    }

    const detections = (data?.predictions || []).map((p) => ({
      label: p.class,
      conf: p.confidence,
      x: p.x,
      y: p.y,
      w: p.width,
      h: p.height,
      id: p.detection_id,
    }));

    return res.json({ success: true, detections });
  } catch (e) {
    console.error('[analyze] error:', e);
    return res
      .status(500)
      .json({ success: false, error: 'Analyze failed', details: e.message });
  }
});

module.exports = router;
