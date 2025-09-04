require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001; // use 5001 as you’re running now

// ---------- Middleware ----------
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------- Ensure /uploads exists & serve it ----------
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI, { autoIndex: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ---------- Routes ----------
const profileRoutes = require('./routes/profile'); // if exists
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/captureRoute'); // your upload routes

app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', imageRoutes); // /api/upload, /api/images (if you add later)

// ---------- Root ----------
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Backend running successfully!' });
});

// ---------- 404 & Error handlers ----------
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Server error' });
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
