// backend/cloudinary.js
const { v2: cloudinary } = require('cloudinary');

// Use CLOUDINARY_URL from env (already set on Vercel)
cloudinary.config({ secure: true });

module.exports = cloudinary;
