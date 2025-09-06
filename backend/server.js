require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const passport = require('passport');

const app = express();

// ---- Basic hardening / proxies ----
app.set('trust proxy', 1);

// ---- Middleware ----
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(passport.initialize());

// ---- Local uploads (DEV ONLY) ----
// Vercel par filesystem persist nahi hota; isliye sirf local dev me serve karein.
if (process.env.VERCEL !== '1') {
  const uploadDir = path.join(__dirname, 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });
  app.use('/uploads', express.static(uploadDir));
}

// ---- MongoDB Connection Function ----
let isConnected = false;
async function connectDB() {
  // Check if mongoose is already connected
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB');
    return;
  }

  if (isConnected) return;

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true, // Ensure indexes are created
      serverSelectionTimeoutMS: 5000, // Timeout in case connection is not made
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error('MongoDB connection failed');
  }
}

// Connect to MongoDB before starting the app
connectDB().catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit the process if DB connection fails
});

// ---- Routes ----
const profileRoutes = require('./routes/profile'); // if exists
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/captureRoute'); // now uses Cloudinary

app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', imageRoutes);

// ---- Health ----
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Backend running successfully!' });
});

// ---- 404 & Error ----
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Server error' });
});

// ---- Local dev server only (Vercel pe export hoga) ----
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Local server on ${PORT}`));
}

module.exports = app;
