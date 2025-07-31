require('dotenv').config(); // Import dotenv to use environment variables
const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); // Import jwt for token verification
const User = require('../models/User'); // Assuming your User model is in models folder

const router = express.Router();

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Naming the file
  },
});

// Initialize multer with the storage engine
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).single('image'); // field name should match

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied, no token provided' });
  }

  try {
    // Decode the token and add user info to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // assuming the token contains user data
    next(); // pass control to the next handler
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

// Profile image upload route
router.post('/image', authenticateToken, upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Fetch the user from the database using the ID from the token
    const user = await User.findById(req.user.id); // The user ID is now coming from req.user
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's avatar URL with the uploaded image URL
    const serverIp = process.env.SERVER_IP || 'localhost'; // Use the SERVER_IP from .env or fallback to localhost
    user.avatarUrl = `http://${serverIp}:${process.env.PORT}/uploads/${req.file.filename}`; // Update URL dynamically with the server IP

    // Save the updated user object
    await user.save();

    res.json({
      message: 'Image uploaded successfully',
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error uploading image', error: error.message });
  }
});

module.exports = router;
