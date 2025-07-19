const express = require('express');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const ImageModel = require('../models/Image');

router.post('/capture', async (req, res) => {
  try {
    const videoUrl = 'http://192.168.x.x:5000/video'; // Apka video stream URL, apne IP se replace karein
    const fileName = `snapshot_${Date.now()}.jpg`;
    const uploadDir = path.join(__dirname, '..', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    ffmpeg(videoUrl)
      .screenshots({
        timestamps: ['0'],
        filename: fileName,
        folder: uploadDir,
        size: '640x480',
      })
      .on('end', async () => {
        const imageUrl = `http://${
          process.env.SERVER_IP || 'localhost'
        }:5000/uploads/${fileName}`;

        const newImage = new ImageModel({ url: imageUrl });
        await newImage.save();

        res.json({ success: true, url: imageUrl });
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        res.status(500).json({ success: false, error: err.message });
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
